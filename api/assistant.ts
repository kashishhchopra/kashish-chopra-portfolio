/**
 * Portfolio Assistant backend — Vercel Function (Node.js runtime).
 *
 * Node, not Edge: the Anthropic SDK imports node:fs and node:path, which the
 * Edge runtime cannot provide — an Edge build fails outright with
 * "referencing unsupported modules". Streaming works the same on either.
 *
 * Runs server-side so the Anthropic API key never reaches the browser. The
 * frontend sends the question, the recent turns, and the portfolio dossier it
 * already has in its bundle; this function adds the key and calls Claude.
 *
 *   GET  /api/assistant  → { configured: boolean }
 *        Lets the chat UI say whether it is running in full AI mode or on its
 *        offline fallback, instead of guessing.
 *   POST /api/assistant  → a stream of newline-delimited JSON events:
 *        {"type":"text","text":"..."}      one per token chunk, as it is generated
 *        {"type":"actions","actions":[…]}  buttons Claude chose for this answer
 *        {"type":"error","error":"..."}    something went wrong mid-stream
 *        NDJSON rather than SSE because the browser reads it with a plain
 *        ReadableStream — EventSource can't POST a body this size.
 *
 * Set ANTHROPIC_API_KEY in the Vercel project's environment variables. Without
 * it the endpoint reports `configured: false` and returns 501, and the frontend
 * falls back to its local responder rather than showing an error.
 */

import Anthropic from "@anthropic-ai/sdk";

/**
 * Claude Opus 5 at low effort: the dossier reasoning this needs is well within
 * what low effort handles, and a chat widget should answer fast.
 */
const MODEL = "claude-opus-5";
const MAX_TOKENS = 1600;

/** Bounds on client-supplied input, so one caller can't send a novel. */
const LIMITS = {
  question: 2000,
  context: 120_000,
  historyTurns: 8,
  historyChars: 4000,
};

interface HistoryTurn {
  role?: unknown;
  content?: unknown;
}

interface AssistantPayload {
  question?: unknown;
  context?: unknown;
  system?: unknown;
  history?: unknown;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * The one tool Claude gets. Actions used to be guessed by keyword-matching the
 * visitor's question client-side, which meant an answer about TRAFFICIQ's reward
 * function could surface a button to the skills matrix. Now the model that
 * understood the question picks the buttons.
 *
 * We never return a tool_result: the call *is* the output. Claude writes its
 * answer and calls this in the same turn, so one request yields prose + buttons.
 * Targets are validated against the real route table in the browser, where the
 * portfolio data lives — a hallucinated path never becomes a link.
 */
const ACTION_TOOL: Anthropic.Tool = {
  name: "suggest_actions",
  description:
    "Attach up to three action buttons to your answer so the visitor can act on it immediately. " +
    "Call this once, alongside your written answer, whenever a page would help: the case study for " +
    "a project you just described, its architecture diagram or decision records, the skills matrix, " +
    "the contact terminal, or a natural follow-up question. Prefer the most specific target — link " +
    "the case study of the project you discussed, not the projects index. Skip the call entirely if " +
    "no page is relevant; buttons that don't match the answer are worse than none.",
  input_schema: {
    type: "object",
    properties: {
      actions: {
        type: "array",
        description: "Between one and three buttons, most useful first.",
        items: {
          type: "object",
          properties: {
            kind: {
              type: "string",
              enum: ["navigate", "ask", "email"],
              description:
                "'navigate' opens a page on this site. 'ask' offers a follow-up question the visitor can " +
                "send back to you. 'email' copies her email address to the clipboard.",
            },
            label: {
              type: "string",
              description: "Button text. Two to four words, e.g. 'Read the case study'.",
            },
            target: {
              type: "string",
              description:
                "For 'navigate', a site path from the site map in the context — e.g. '/projects/traffic-iq', " +
                "optionally with '#architecture' or '#decisions'. For 'ask', the follow-up question itself. " +
                "For 'email', use an empty string: the real address is filled in by the site, never by you.",
            },
          },
          required: ["kind", "label", "target"],
        },
      },
    },
    required: ["actions"],
  },
};

/** Writes one NDJSON event to the response stream. */
function writeEvent(controller: ReadableStreamDefaultController, event: unknown): void {
  controller.enqueue(new TextEncoder().encode(`${JSON.stringify(event)}\n`));
}

/**
 * Best-effort rate limit, matching the contact endpoint's approach: edge
 * instances are per-region and short-lived, so this blunts casual abuse of a
 * paid API without adding a KV store to a portfolio site.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear(); // Bound memory on a long-lived instance.
  return recent.length > MAX_PER_WINDOW;
}

/** Keeps only well-formed, alternating-ish turns; the API rejects malformed history. */
function sanitizeHistory(value: unknown): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(value)) return [];
  const turns: { role: "user" | "assistant"; content: string }[] = [];
  for (const raw of value.slice(-LIMITS.historyTurns)) {
    const turn = raw as HistoryTurn;
    const role = turn.role === "assistant" ? "assistant" : turn.role === "user" ? "user" : null;
    const content = clean(turn.content, LIMITS.historyChars);
    if (role && content) turns.push({ role, content });
  }
  // A conversation must open on a user turn.
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns;
}

async function handler(req: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (req.method === "GET") {
    // `reason` distinguishes "never set" from "set but blank" — the two look
    // identical from the dashboard once a Secret value is hidden, and they have
    // different fixes. No part of the value is exposed.
    const reason =
      apiKey === undefined
        ? "ANTHROPIC_API_KEY is not present in this environment"
        : apiKey.trim() === ""
          ? "ANTHROPIC_API_KEY is present but empty"
          : undefined;
    return json(reason ? { configured: false, reason } : { configured: true });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  if (!apiKey) {
    // 501: the route exists but was never configured. The frontend reads this
    // and falls back to its local responder.
    return json({ error: "Assistant API is not configured." }, 501);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return json({ error: "Too many questions at once. Please wait a moment." }, 429);
  }

  let payload: AssistantPayload;
  try {
    payload = (await req.json()) as AssistantPayload;
  } catch {
    return json({ error: "Malformed request." }, 400);
  }

  const question = clean(payload.question, LIMITS.question);
  const context = clean(payload.context, LIMITS.context);
  const system = clean(payload.system, 8000);

  if (!question) return json({ error: "Ask a question first." }, 400);
  if (!context) return json({ error: "Missing profile context." }, 400);

  const history = sanitizeHistory(payload.history);

  const client = new Anthropic({ apiKey });

  // Stream the answer out as it is generated. A visitor watching words appear
  // reads the assistant as thinking; the same answer delivered after a silent
  // four-second pause reads as broken.
  const body = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          // The dossier is byte-identical across requests, so one breakpoint at
          // the end of the system block makes every question after the first a
          // cache read.
          system: [
            {
              type: "text",
              text: `${system}\n${context}`,
              cache_control: { type: "ephemeral" },
            },
          ],
          output_config: { effort: "low" },
          tools: [ACTION_TOOL],
          // One set of buttons per answer, never two competing calls.
          tool_choice: { type: "auto", disable_parallel_tool_use: true },
          messages: [...history, { role: "user", content: question }],
        });

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            writeEvent(controller, { type: "text", text: event.delta.text });
          }
        }

        const message = await stream.finalMessage();

        if (message.stop_reason === "refusal") {
          writeEvent(controller, { type: "error", error: "I can't answer that one." });
          controller.close();
          return;
        }

        // The tool call carries the buttons. Its arguments arrive as a partial
        // JSON stream, so read them from the final message where they're parsed.
        const call = message.content.find(
          (block): block is Anthropic.ToolUseBlock =>
            block.type === "tool_use" && block.name === ACTION_TOOL.name,
        );
        const actions = (call?.input as { actions?: unknown } | undefined)?.actions;
        if (Array.isArray(actions) && actions.length) {
          writeEvent(controller, { type: "actions", actions: actions.slice(0, 3) });
        }

        controller.close();
      } catch (err) {
        // Log the provider's reason server-side; don't leak it to the browser.
        console.error("Assistant handler failed", err);
        writeEvent(controller, {
          type: "error",
          error: "Could not reach the assistant right now.",
        });
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
      // Proxies that buffer would defeat the point of streaming.
      "x-accel-buffering": "no",
    },
  });
}

// Vercel's Node.js runtime dispatches /api files through a `fetch` Web Standard
// export — the bare `export default function handler(Request)` shape is the Edge
// signature and isn't picked up here.
export default { fetch: handler };
