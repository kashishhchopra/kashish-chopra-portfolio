import { portfolio } from "@/data/portfolio";
import type { Proficiency } from "@/types";

// Honest, label-based proficiency — no invented percentages.
const levelMeta: Record<Proficiency, { dots: number; className: string }> = {
  Experienced: { dots: 3, className: "text-secondary-soft border-secondary/40 bg-secondary/10" },
  "Working Knowledge": { dots: 2, className: "text-accent border-accent/40 bg-accent/10" },
  Familiar: { dots: 1, className: "text-accent-soft border-accent/40 bg-accent/10" },
};

function LevelBadge({ level }: { level: Proficiency }) {
  const meta = levelMeta[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${meta.className}`}>
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full bg-current ${i < meta.dots ? "" : "opacity-25"}`}
          />
        ))}
      </span>
      {level}
    </span>
  );
}

export default function SkillsMatrix() {
  return (
    <div>
      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
        <span className="font-mono uppercase tracking-widest text-secondary/70">Proficiency:</span>
        <LevelBadge level="Experienced" />
        <LevelBadge level="Working Knowledge" />
        <LevelBadge level="Familiar" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {portfolio.skills.map((cat) => (
          <section key={cat.id} className="glass-panel p-5" aria-labelledby={`skill-${cat.id}`}>
            <h2 id={`skill-${cat.id}`} className="mb-3 flex items-center gap-2 text-base font-bold text-white">
              <span className="h-4 w-1 rounded-full bg-gradient-to-b from-secondary to-accent" aria-hidden />
              {cat.label}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5"
                >
                  <span className="text-sm text-zinc-200">{item.name}</span>
                  <LevelBadge level={item.level} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Professional skills */}
      <section className="glass-panel mt-5 p-5">
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
          <span className="h-4 w-1 rounded-full bg-gradient-to-b from-secondary to-accent" aria-hidden />
          Professional Skills
        </h2>
        <ul className="flex flex-wrap gap-2">
          {portfolio.professionalSkills.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
