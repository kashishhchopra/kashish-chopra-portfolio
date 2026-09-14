import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BootSequenceProps {
  onComplete: () => void;
  onSkip: () => void;
}

const LINES = [
  `INITIALIZING ${portfolio.identity.displayName}...`,
  "LOADING INTELLIGENCE MODULES...",
  "CONNECTING PROJECT DATABASE...",
  "CALIBRATING NEURAL INTERFACE...",
  "SYSTEM ONLINE.",
];

/**
 * Pacing. Five lines at LINE_MS plus the hold comes to roughly three and a half
 * seconds — long enough to feel like a boot, short enough that a returning
 * visitor isn't waiting on it (they don't see it at all: it plays once per
 * browser, and "Skip intro" / Enter / Esc ends it immediately).
 */
const FIRST_LINE_MS = 220;
const LINE_MS = 430;
const HOLD_MS = 1500;

/**
 * Cinematic startup screen. Types each line, then transitions out.
 * - Skippable at any time (button + Enter/Esc).
 * - Under prefers-reduced-motion, shows all lines instantly with no typing.
 */
export default function BootSequence({ onComplete, onSkip }: BootSequenceProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState<number>(reduced ? LINES.length : 0);
  const doneRef = useRef(false);

  const finish = useMemo(
    () => () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete();
    },
    [onComplete],
  );

  // Reveal lines sequentially (unless reduced motion).
  useEffect(() => {
    if (reduced) {
      // No typing to watch, so hold only long enough to read the panel.
      const t = setTimeout(finish, 1200);
      return () => clearTimeout(t);
    }
    if (shown >= LINES.length) {
      // Rest on "SYSTEM ONLINE." with the bar full before handing over to the
      // site — the beat that makes it read as a machine finishing its startup
      // rather than a loader that flickered past.
      const t = setTimeout(finish, HOLD_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? FIRST_LINE_MS : LINE_MS);
    return () => clearTimeout(t);
  }, [shown, reduced, finish]);

  // Keyboard skip.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") onSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSkip]);

  const progress = Math.round((shown / LINES.length) * 100);

  return (
    <motion.div
      // Boots as a dark terminal in both site themes — a real machine's boot
      // screen doesn't follow your desktop wallpaper. `data-theme="dark"`
      // re-scopes every theme-reactive colour used below back to the dark
      // palette for this subtree, regardless of what <html> is set to.
      data-theme="dark"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-label="System boot sequence"
    >
      {/* faint grid */}
      <div aria-hidden className="absolute inset-0 bg-grid-lines opacity-40" style={{ backgroundSize: "40px 40px" }} />

      <div className="relative w-[min(90vw,640px)] rounded-2xl border border-secondary/20 bg-panel/50 p-6 font-mono shadow-glow sm:p-8">
        <div className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-amber-400/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          <span className="ml-2">kashish-ai://boot</span>
        </div>

        <ul className="space-y-2 text-sm sm:text-base" aria-live="polite">
          {LINES.map((line, i) => {
            const visible = i < shown;
            const isLast = i === LINES.length - 1;
            return (
              <li
                key={line}
                className={[
                  "flex items-center gap-2 transition-opacity duration-200",
                  visible ? "opacity-100" : "opacity-0",
                  isLast ? "text-emerald-400" : "text-secondary-soft",
                ].join(" ")}
              >
                <span className="text-zinc-600">&gt;</span>
                <span>{line}</span>
                {visible && !isLast && <span className="text-emerald-400">[OK]</span>}
              </li>
            );
          })}
        </ul>

        {/* progress bar */}
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-secondary to-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
          <span>{portfolio.identity.displayName} · {portfolio.meta.version}</span>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-md border border-white/15 px-3 py-1 text-zinc-300 hover:border-secondary/50 hover:text-secondary-soft"
          >
            Skip intro →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
