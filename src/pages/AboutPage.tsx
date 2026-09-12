import {
  Award,
  Compass,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Languages,
  Sparkles,
} from "lucide-react";
import Seo from "@/components/Seo";
import SectionHeader from "@/components/SectionHeader";
import AIProfileCard from "@/components/AIProfileCard";
import { portfolio } from "@/data/portfolio";

export default function AboutPage() {
  const p = portfolio.identity;
  return (
    <>
      <Seo title="About" description={`About ${portfolio.identity.realName} — ${p.summary}`} />
      <SectionHeader eyebrow="/about" title="AI Identity">
        Core profile of {portfolio.identity.realName}, drawn directly from her resume.
      </SectionHeader>

      {/* items-start stops the profile card stretching to match the much
          taller detail column; sticky keeps it in view while that column
          scrolls. */}
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="lg:sticky lg:top-24">
          <AIProfileCard compact />
        </div>

        <div className="space-y-6">
          <section className="glass-panel p-5">
            <h2 className="mb-2 text-lg font-bold text-white">Professional Summary</h2>
            <p className="leading-relaxed text-zinc-300">{p.summary}</p>
          </section>

          <section className="glass-panel p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
              <GraduationCap className="h-5 w-5 text-secondary/80" aria-hidden /> Education
            </h2>
            <ul className="space-y-3">
              {portfolio.education.map((e) => (
                <li key={e.institution} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="font-semibold text-zinc-100">{e.institution}</p>
                    <span className="font-mono text-xs text-secondary-soft">{e.year}</span>
                  </div>
                  <p className="text-sm text-zinc-300">{e.qualification}</p>
                  <p className="font-mono text-xs text-zinc-400">
                    {e.score}
                    {e.location ? ` · ${e.location}` : ""}
                  </p>

                  {e.coursework && e.coursework.length > 0 && (
                    <details className="group mt-3">
                      <summary className="cursor-pointer list-none font-mono text-[11px] text-zinc-400 transition-colors hover:text-secondary-soft">
                        <span className="group-open:hidden">▸ {e.coursework.length} subjects &amp; electives</span>
                        <span className="hidden group-open:inline">▾ subjects &amp; electives</span>
                      </summary>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {e.coursework.map((c) => (
                          <li key={c} className="chip !py-0.5 !text-[11px]">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {portfolio.certifications.length > 0 && (
            <section className="glass-panel p-5">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                <Award className="h-5 w-5 text-secondary/80" aria-hidden /> Certifications
              </h2>
              <ul className="space-y-2">
                {portfolio.certifications.map((c) => (
                  <li
                    key={c.name}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-white/[0.02] p-3"
                  >
                    <span className="text-sm font-medium text-zinc-100">{c.name}</span>
                    <span className="flex items-center gap-3">
                      {/* Only renders when a verification URL is present — no dead links. */}
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-secondary-soft hover:text-secondary"
                        >
                          Verify
                          <ExternalLink className="h-3 w-3" aria-hidden />
                          <span className="sr-only"> {c.name} credential (opens in a new tab)</span>
                        </a>
                      )}
                      <span className="font-mono text-xs text-zinc-400">{c.authority}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="glass-panel p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
              <Compass className="h-5 w-5 text-secondary/80" aria-hidden /> Career Interests
            </h2>
            <ul className="flex flex-wrap gap-2">
              {p.interests.map((i) => (
                <li key={i} className="chip border-secondary/25 text-secondary-soft">
                  {i}
                </li>
              ))}
            </ul>
          </section>

          {portfolio.volunteering.length > 0 && (
            <section className="glass-panel p-5">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                <HeartHandshake className="h-5 w-5 text-secondary/80" aria-hidden /> Volunteering
              </h2>
              <ul className="space-y-2">
                {portfolio.volunteering.map((v) => (
                  <li key={v.organization} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="font-semibold text-zinc-100">
                        {v.organization}
                        {v.current && (
                          <span className="ml-2 font-mono text-[10px] font-normal text-emerald-400">● active</span>
                        )}
                      </p>
                      <span className="font-mono text-xs text-zinc-400">{v.period}</span>
                    </div>
                    <p className="text-sm text-zinc-300">
                      {v.role} · <span className="text-zinc-400">{v.cause}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {portfolio.activities.length > 0 && (
            <section className="glass-panel p-5">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                <Sparkles className="h-5 w-5 text-secondary/80" aria-hidden /> Beyond the Code
              </h2>
              <ul className="space-y-3">
                {portfolio.activities.map((a) => (
                  <li key={a.title}>
                    <p className="text-sm font-semibold text-zinc-100">{a.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-300">{a.detail}</p>
                  </li>
                ))}
              </ul>

              {portfolio.languages.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-4">
                  <Languages className="h-4 w-4 text-zinc-500" aria-hidden />
                  <span className="label-hud">Languages</span>
                  {portfolio.languages.map((l) => (
                    <span key={l} className="chip !py-0.5 !text-[11px]">
                      {l}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
