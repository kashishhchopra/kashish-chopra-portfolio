import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Send,
  Trash2,
  X,
  CornerDownLeft,
  Info,
  Copy,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import {
  askAssistant,
  assistantConfigured,
  suggestedQuestions,
  type AssistantAction,
  type AssistantReply,
  type AssistantTurn,
} from "@/lib/assistant";
import { portfolio } from "@/data/portfolio";
import { useUI } from "@/ui-context";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  actions?: AssistantAction[];
}

let msgId = 0;

const greeting: Message = {
  id: msgId++,
  role: "assistant",
  text: `Hi, I'm the ${portfolio.identity.displayName} assistant. I answer questions about ${portfolio.identity.realName}'s professional profile — and I can act on them: open a case study, jump to an architecture diagram, or copy her email.`,
};

const actionIcon: Record<AssistantAction["kind"], typeof Bot> = {
  navigate: CornerDownLeft,
  copy: Copy,
  external: ExternalLink,
  ask: MessageSquare,
};

export default function PortfolioAssistant() {
  const navigate = useNavigate();
  const { mode, assistantOpen, openAssistant, closeAssistant, assistantSeed } = useUI();

  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [toast, setToast] = useState<string | null>(null);
  const [aiLive, setAiLive] = useState(false);
  // The transcript the proxy sees, so follow-up questions keep their thread.
  const turnsRef = useRef<AssistantTurn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (assistantOpen) inputRef.current?.focus();
  }, [assistantOpen]);

  useEffect(() => {
    if (assistantOpen) void assistantConfigured().then(setAiLive);
  }, [assistantOpen]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setMessages((m) => [...m, { id: msgId++, role: "user", text: trimmed }]);
      setHistory((h) => [...h, trimmed]);
      setHistoryIdx(-1);
      setInput("");
      setTyping(true);

      // The reply's own bubble, created empty and filled as tokens arrive.
      const replyId = msgId++;
      let opened = false;

      const appendDelta = (chunk: string) => {
        setTyping(false);
        setMessages((m) => {
          if (!opened) {
            opened = true;
            return [...m, { id: replyId, role: "assistant", text: chunk }];
          }
          return m.map((msg) => (msg.id === replyId ? { ...msg, text: msg.text + chunk } : msg));
        });
      };

      let reply: AssistantReply;
      try {
        reply = await askAssistant(trimmed, turnsRef.current, { onDelta: appendDelta });
      } catch {
        reply = {
          text: "Something went wrong reaching the assistant. Please try again, or use the navigation to explore directly.",
          source: "local",
        };
      }

      if (opened) {
        // Streamed: the text is already on screen. Settle it to the final value
        // and attach the buttons Claude chose.
        setTyping(false);
        setMessages((m) =>
          m.map((msg) => (msg.id === replyId ? { ...msg, text: reply.text, actions: reply.actions } : msg)),
        );
      } else {
        // Local fallback — no stream, so keep the short typing beat that reads
        // as deliberate rather than instant.
        await new Promise((r) => setTimeout(r, 420));
        setTyping(false);
        setMessages((m) => [...m, { id: replyId, role: "assistant", text: reply.text, actions: reply.actions }]);
      }
      const nextTurns: AssistantTurn[] = [
        ...turnsRef.current,
        { role: "user", content: trimmed },
        { role: "assistant", content: reply.text },
      ];
      turnsRef.current = nextTurns.slice(-8);
    },
    [],
  );

  // Questions pushed in from the palette or elsewhere on the page.
  useEffect(() => {
    if (assistantSeed?.question) void send(assistantSeed.question);
  }, [assistantSeed, send]);

  async function runAction(action: AssistantAction) {
    switch (action.kind) {
      case "navigate":
        navigate(action.to);
        closeAssistant();
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(action.value);
          setToast("Copied to clipboard");
        } catch {
          setToast(action.value);
        }
        break;
      case "external":
        window.open(action.href, "_blank", "noopener,noreferrer");
        break;
      case "ask":
        void send(action.question);
        break;
    }
    if (action.kind !== "navigate") window.setTimeout(() => setToast(null), 2600);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!typing) void send(input);
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown" && history.length) {
      e.preventDefault();
      const idx = historyIdx === -1 ? -1 : Math.min(history.length - 1, historyIdx + 1);
      setHistoryIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    } else if (e.key === "Escape") {
      closeAssistant();
    }
  }

  function clearChat() {
    setMessages([greeting]);
    setHistory([]);
    setHistoryIdx(-1);
    // Clear the model's thread too — otherwise a "cleared" chat still answers
    // follow-ups against the conversation the visitor just wiped.
    turnsRef.current = [];
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => (assistantOpen ? closeAssistant() : openAssistant())}
        className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full border border-secondary/40 bg-gradient-to-br from-secondary/25 to-accent/20 text-secondary-soft shadow-lift-glow backdrop-blur transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-expanded={assistantOpen}
        aria-label={assistantOpen ? "Close portfolio assistant" : "Open portfolio assistant"}
      >
        {/* Idle halo, so the launcher reads as live without demanding attention. */}
        {!assistantOpen && (
          <span
            className="absolute inset-0 rounded-full border border-secondary/40 motion-safe:animate-pulse-ring"
            aria-hidden
          />
        )}
        {assistantOpen ? (
          <X className="h-6 w-6" aria-hidden />
        ) : (
          <Bot className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" aria-hidden />
        )}
      </button>

      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-24 right-5 z-40 flex h-[34rem] max-h-[80vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-panel/95 shadow-lift backdrop-blur-2xl"
            role="dialog"
            aria-label="Portfolio assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-secondary/40 bg-secondary/10">
                  <Bot className="h-4 w-4 text-secondary" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Portfolio Assistant</p>
                  <p className="font-mono text-[10px] text-emerald-400">● online · {mode} mode</p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearChat}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] text-zinc-400 hover:text-zinc-100"
                aria-label="Clear chat"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden /> clear
              </button>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-2 border-b border-white/5 bg-secondary/[0.04] px-4 py-2 text-[11px] text-zinc-400">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary/70" aria-hidden />
              <span>
                {aiLive
                  ? `Answers are reasoned from ${portfolio.identity.realName}'s profile data only — no invented facts.`
                  : `Answers use ${portfolio.identity.realName}'s site data only — no invented facts.`}
              </span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={[
                      "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-sm border border-secondary/25 bg-gradient-to-br from-secondary/[0.18] to-secondary/[0.10] text-secondary-soft"
                        : "rounded-bl-sm border border-white/[0.07] bg-white/[0.045] text-zinc-200",
                    ].join(" ")}
                  >
                    <p>{m.text}</p>

                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.actions.map((a) => {
                          const Icon = actionIcon[a.kind];
                          return (
                            <button
                              key={`${a.kind}-${a.label}`}
                              type="button"
                              onClick={() => void runAction(a)}
                              className="inline-flex items-center gap-1 rounded-md border border-secondary/40 bg-secondary/10 px-2 py-1 font-mono text-[11px] text-secondary-soft transition-colors hover:bg-secondary/20"
                            >
                              <Icon className="h-3 w-3" aria-hidden /> {a.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-white/[0.04] px-3 py-2">
                    <span className="flex gap-1" aria-label="Assistant is typing">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-secondary/70 [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-secondary/70 [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-secondary/70" />
                    </span>
                  </div>
                </div>
              )}

              <div aria-live="polite" className="sr-only">
                {typing ? "Assistant is typing" : messages[messages.length - 1]?.text}
              </div>
            </div>

            {toast && (
              <p className="border-t border-secondary/20 bg-secondary/10 px-4 py-1.5 text-center font-mono text-[11px] text-secondary-soft">
                {toast}
              </p>
            )}

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {suggestedQuestions(mode).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-secondary/40 hover:text-secondary-soft"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-void/60 px-3 py-2 focus-within:border-secondary/50">
                <span className="font-mono text-xs text-secondary/70" aria-hidden>
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask about skills, projects, architecture…"
                  className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                  aria-label="Ask the portfolio assistant a question"
                />
                <button
                  type="button"
                  onClick={() => void send(input)}
                  disabled={!input.trim() || typing}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/15 text-secondary-soft transition-colors hover:bg-secondary/25 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
