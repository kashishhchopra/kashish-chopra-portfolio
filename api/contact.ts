/**
 * Contact form backend — Vercel Edge Function.
 *
 * Runs server-side, so the mail provider's API key never reaches the browser.
 * Deployed automatically by Vercel from this file; no build wiring needed.
 *
 *   GET  /api/contact  → { configured: boolean }
 *        Lets the form know whether direct sending is live, so it can show an
 *        accurate notice instead of guessing.
 *   POST /api/contact  → { ok: true } | { ok: false, error }
 *        Validates, screens for spam, and sends the message.
 *
 * Set RESEND_API_KEY (and optionally CONTACT_TO / CONTACT_FROM) in the Vercel
 * project's environment variables. Without the key the endpoint reports
 * `configured: false` and the form falls back to a mailto: link rather than
 * pretending a message was delivered.
 */

export const config = { runtime: "edge" };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const DEFAULT_TO = "kashishchopra2k05@gmail.com";
/** Resend's shared sender, usable before a custom domain is verified. */
const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot: a real person never fills a field they cannot see. */
  company?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

/**
 * Best-effort rate limit. Edge instances are per-region and short-lived, so
 * this throttles bursts from one address rather than enforcing a global quota —
 * enough to blunt casual abuse without adding a KV store to a portfolio site.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear(); // Bound memory on a long-lived instance.
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Strips characters that could forge extra email headers. */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req: Request): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;

  if (req.method === "GET") {
    return json({ configured: !!apiKey });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  if (!apiKey) {
    // 501: the route exists but sending was never configured. The form reads
    // this and switches to its mailto fallback.
    return json({ ok: false, error: "Email sending is not configured." }, 501);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return json({ ok: false, error: "Too many messages. Please try again in a minute." }, 429);
  }

  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return json({ ok: false, error: "Malformed request." }, 400);
  }

  // Honeypot tripped — accept silently so bots learn nothing from the response.
  if (clean(payload.company, 100)) return json({ ok: true });

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 200);
  const message = clean(payload.message, 5000);

  if (!name) return json({ ok: false, error: "Please enter your name." }, 400);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "Enter a valid email address." }, 400);
  if (message.length < 10) return json({ ok: false, error: "Message is a little short." }, 400);

  const to = process.env.CONTACT_TO || DEFAULT_TO;
  const from = process.env.CONTACT_FROM || DEFAULT_FROM;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // Replying in the mail client goes straight back to the visitor.
        reply_to: headerSafe(email),
        subject: headerSafe(`Portfolio contact from ${name}`),
        text: `${message}\n\n— ${name} <${email}>`,
        html:
          `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>` +
          `<hr><p>— ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
      }),
    });

    if (!res.ok) {
      // Log the provider's reason server-side; don't leak it to the browser.
      console.error("Resend error", res.status, await res.text());
      return json({ ok: false, error: "Could not send the message right now." }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("Contact handler failed", err);
    return json({ ok: false, error: "Could not send the message right now." }, 502);
  }
}
