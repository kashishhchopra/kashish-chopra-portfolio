import { useState } from "react";
import { GitBranch, Check, X, Scale, ChevronDown } from "lucide-react";
import type { EngineeringDecision } from "@/types";

/**
 * Engineering decision records.
 *
 * Each card states what was chosen, what was rejected, why, and — the part
 * most portfolios omit — what the choice cost. The trade-off is always
 * visible, since a decision presented without one isn't a decision.
 */
export default function DecisionLog({
  decisions,
  defaultOpen = false,
}: {
  decisions: EngineeringDecision[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(defaultOpen ? decisions.map((d) => d.id) : [decisions[0]?.id].filter(Boolean) as string[]),
  );

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {decisions.map((d, i) => {
        const isOpen = open.has(d.id);
        const panelId = `decision-${d.id}`;
        return (
          <article key={d.id} className="glass-panel overflow-hidden">
            <h3>
              <button
                type="button"
                onClick={() => toggle(d.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03] sm:px-5"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-[11px] text-accent-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-white">{d.title}</span>
                  {!isOpen && <span className="mt-0.5 block truncate text-sm text-zinc-400">{d.choice}</span>}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </h3>

            {isOpen && (
              <div id={panelId} className="space-y-4 border-t border-white/10 px-4 py-4 sm:px-5">
                <div className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  <p className="text-sm text-zinc-200">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90">Chose </span>
                    {d.choice}
                  </p>
                </div>

                <div className="flex gap-2.5">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/80" aria-hidden />
                  <div className="text-sm text-zinc-300">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-rose-400/80">Considered </span>
                    <ul className="mt-1 space-y-1">
                      {d.alternatives.map((a) => (
                        <li key={a} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" aria-hidden />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-secondary/80" aria-hidden />
                  <p className="text-sm text-zinc-300">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-secondary/80">Why </span>
                    {d.rationale}
                  </p>
                </div>

                <div className="flex gap-2.5 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] p-3">
                  <Scale className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
                  <p className="text-sm text-zinc-300">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-amber-300">Trade-off </span>
                    {d.tradeoff}
                  </p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
