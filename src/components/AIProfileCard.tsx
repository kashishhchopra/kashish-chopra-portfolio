import { MapPin, GraduationCap, BadgeCheck, Sparkles } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Holographic AI identity card featuring the professional photo inside a
 * futuristic frame, plus core identity details.
 */
export default function AIProfileCard({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion();
  const p = portfolio.identity;

  return (
    <div className="glass-panel relative overflow-hidden p-5 sm:p-6">
      {/* Ambient glow behind the portrait, giving the card a light source. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-secondary/[0.13] blur-3xl"
      />

      {/* corner ticks */}
      <span aria-hidden className="absolute left-3 top-3 h-4 w-4 rounded-tl border-l-2 border-t-2 border-secondary/40" />
      <span aria-hidden className="absolute right-3 top-3 h-4 w-4 rounded-tr border-r-2 border-t-2 border-secondary/40" />
      <span aria-hidden className="absolute bottom-3 left-3 h-4 w-4 rounded-bl border-b-2 border-l-2 border-secondary/40" />
      <span aria-hidden className="absolute bottom-3 right-3 h-4 w-4 rounded-br border-b-2 border-r-2 border-secondary/40" />

      <div className="flex flex-col items-center text-center">
        {/* Holographic photo frame */}
        <div className="relative mb-4">
          <div
            className={[
              "absolute inset-0 rounded-2xl bg-gradient-to-tr from-secondary/40 via-accent/30 to-accent/40 blur-md",
              reduced ? "" : "animate-pulse",
            ].join(" ")}
            aria-hidden
          />
          <div className="relative rounded-2xl border border-secondary/40 bg-void/60 p-1.5 shadow-glow">
            <img
              src={portfolio.photo}
              alt={`Portrait of ${portfolio.identity.realName}`}
              width={compact ? 128 : 176}
              height={compact ? 128 : 176}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className={[
                "rounded-xl object-cover",
                compact ? "h-32 w-32" : "h-44 w-44",
              ].join(" ")}
            />
            {/* scan overlay */}
            {!reduced && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-1.5 overflow-hidden rounded-xl"
              >
                <div className="h-10 w-full animate-scan bg-gradient-to-b from-secondary/25 to-transparent" />
              </div>
            )}
          </div>
        </div>

        <p className="section-eyebrow">AI Identity</p>
        <h2 className="mt-1 text-2xl font-extrabold text-white">{portfolio.identity.realName}</h2>
        <p className="mt-1 font-mono text-xs text-secondary-soft">{portfolio.identity.displayName}</p>

        <p className="mt-3 text-sm text-zinc-300">{p.roles.join(" • ")}</p>

        <dl className="mt-5 w-full space-y-2 text-left text-sm">
          <div className="flex items-start gap-2">
            <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-secondary/80" aria-hidden />
            <dd className="text-zinc-300">{p.currentStatus}</dd>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary/80" aria-hidden />
            <dd className="text-zinc-300">{p.location}</dd>
          </div>
          <div className="flex items-start gap-2">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            <dd className="text-emerald-300">{p.availability}</dd>
          </div>
        </dl>

        {!compact && (
          <div className="mt-5 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left">
            <p className="mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-secondary/70">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> System Identity
            </p>
            <p className="text-sm leading-relaxed text-zinc-300">{p.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
