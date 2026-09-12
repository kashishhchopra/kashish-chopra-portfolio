import { UserCheck, Code2 } from "lucide-react";
import { useUI } from "@/ui-context";
import type { AudienceMode } from "@/ui-context";

const options: { value: AudienceMode; label: string; short: string; icon: typeof UserCheck; hint: string }[] = [
  {
    value: "recruiter",
    label: "Recruiter",
    short: "REC",
    icon: UserCheck,
    hint: "Outcomes, impact and hiring signals first",
  },
  {
    value: "developer",
    label: "Developer",
    short: "DEV",
    icon: Code2,
    hint: "Architecture diagrams and engineering decisions expanded",
  },
];

/**
 * Audience switch, presented as a radio group rather than a checkbox — the two
 * modes are peers, and the labels say what each one does.
 */
export default function ModeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useUI();

  return (
    <div
      role="radiogroup"
      aria-label="Audience mode"
      className="inline-flex items-center rounded-lg border border-white/12 bg-white/[0.03] p-0.5"
    >
      {options.map((o) => {
        const Icon = o.icon;
        const active = mode === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.hint}
            onClick={() => setMode(o.value)}
            className={[
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors",
              active ? "bg-secondary/15 text-secondary-soft" : "text-zinc-400 hover:text-zinc-100",
            ].join(" ")}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span className={compact ? "sr-only sm:not-sr-only" : ""}>{compact ? o.short : o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
