import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { navItems, findNavByCommand } from "@/lib/nav";
import { portfolio } from "@/data/portfolio";

interface Line {
  id: number;
  text: string;
  tone?: "in" | "out" | "err";
}

let lid = 0;

/**
 * An interactive terminal. Visitors can type commands (/projects, /help, …)
 * or click the command chips. Unknown commands get a helpful response.
 */
export default function CommandTerminal() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { id: lid++, text: `${portfolio.identity.displayName} interactive shell — type /help for commands.`, tone: "out" },
  ]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [lines]);

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    setLines((l) => [...l, { id: lid++, text: `> ${cmd}`, tone: "in" }]);
    setValue("");

    const normalized = cmd.toLowerCase().replace(/\s+/g, "");

    if (normalized === "/help") {
      setLines((l) => [
        ...l,
        {
          id: lid++,
          text: "Available: " + navItems.map((n) => n.command).join("  ") + "  /help  /status",
          tone: "out",
        },
      ]);
      return;
    }
    if (normalized === "/clear") {
      setLines([]);
      return;
    }

    const nav = findNavByCommand(normalized);
    if (nav) {
      setLines((l) => [...l, { id: lid++, text: `Opening ${nav.label}…`, tone: "out" }]);
      setTimeout(() => navigate(nav.path), 250);
      return;
    }

    setLines((l) => [
      ...l,
      {
        id: lid++,
        text: `command not found: ${cmd}. Try /help, or click a command below.`,
        tone: "err",
      },
    ]);
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 font-mono text-xs text-zinc-500">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2">command-console</span>
      </div>

      <div ref={boxRef} className="max-h-52 space-y-1 overflow-y-auto px-4 py-3 font-mono text-sm">
        {lines.map((l) => (
          <p
            key={l.id}
            className={
              l.tone === "in"
                ? "text-zinc-200"
                : l.tone === "err"
                  ? "text-rose-400"
                  : "text-secondary-soft"
            }
          >
            {l.text}
          </p>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2 font-mono text-sm">
        <span className="text-secondary/70">$</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(value)}
          placeholder="/help"
          aria-label="Type a command"
          className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      {/* Clickable commands for non-CLI visitors */}
      <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-4 py-3">
        {navItems.map((n) => (
          <button
            key={n.command}
            type="button"
            onClick={() => run(n.command)}
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-300 hover:border-secondary/40 hover:text-secondary-soft"
          >
            {n.command}
          </button>
        ))}
      </div>
    </div>
  );
}
