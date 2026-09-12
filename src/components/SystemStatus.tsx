import { useEffect, useState } from "react";
import {
  Activity,
  Github,
  Code2,
  BookOpen,
  BadgeCheck,
  Clock,
  Tag,
  RefreshCw,
  AlertTriangle,
  Star,
  GitFork,
} from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { useGitHub } from "@/hooks/useGitHub";

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Activity;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel p-5">
      {/* h2: these panels sit directly under the page h1. */}
      <h2 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary/70">
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SystemStatus() {
  const username = import.meta.env.VITE_GITHUB_USERNAME || portfolio.github.username;
  const gh = useGitHub(username);
  const [now, setNow] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone: portfolio.meta.timezone,
        dateStyle: "medium",
        timeStyle: "medium",
        hour12: false,
      }).format(new Date());
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* GitHub repositories */}
      <Panel title="GitHub Repositories" icon={Github}>
        {/* Skeletons mirror the shape of the resolved content. A one-line
            "Loading…" would be replaced by a three-stat grid, shifting
            everything below it once the API answers. */}
        {gh.status === "loading" && (
          <div className="grid grid-cols-3 gap-3" aria-label="Loading live GitHub data">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[4.75rem] animate-pulse rounded-lg border border-white/10 bg-white/[0.03]" />
            ))}
          </div>
        )}

        {gh.status === "error" && (
          <div className="flex items-start gap-2 text-sm text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              <p>
                {gh.errorKind === "rate-limit"
                  ? "GitHub rate limit reached. Live stats will return shortly."
                  : gh.errorMessage}
              </p>
              <button onClick={gh.reload} className="mt-2 btn-ghost text-xs">
                <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Retry
              </button>
            </div>
          </div>
        )}

        {(gh.status === "success" || gh.status === "empty") && gh.profile && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <p className="text-2xl font-bold text-secondary-soft">{gh.profile.public_repos}</p>
              <p className="text-[11px] text-zinc-400">Public repos</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <p className="text-2xl font-bold text-secondary-soft">{gh.profile.followers}</p>
              <p className="text-[11px] text-zinc-400">Followers</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <p className="text-2xl font-bold text-secondary-soft">{gh.profile.following}</p>
              <p className="text-[11px] text-zinc-400">Following</p>
            </div>
          </div>
        )}
        <a
          href={portfolio.github.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-secondary-soft"
        >
          <Github className="h-3.5 w-3.5" aria-hidden /> @{username}
        </a>
      </Panel>

      {/* Languages */}
      <Panel title="Primary Languages" icon={Code2}>
        {gh.status === "loading" && (
          <ul className="space-y-2" aria-label="Analyzing repositories">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="space-y-1">
                <div className="h-4 w-full animate-pulse rounded bg-white/[0.04]" />
                <div className="h-1.5 w-full rounded-full bg-white/10" />
              </li>
            ))}
          </ul>
        )}
        {gh.status === "error" && <p className="text-sm text-zinc-500">Unavailable while GitHub is unreachable.</p>}
        {(gh.status === "success" || gh.status === "empty") && (
          gh.languages.length === 0 ? (
            <p className="text-sm text-zinc-500">No public repository languages detected yet.</p>
          ) : (
            <ul className="space-y-2">
              {gh.languages.slice(0, 6).map((l) => {
                const max = gh.languages[0].count || 1;
                return (
                  <li key={l.language}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-zinc-300">{l.language}</span>
                      <span className="text-zinc-500">{l.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
                        style={{ width: `${Math.max(8, (l.count / max) * 100)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </Panel>

      {/* Recent activity */}
      <Panel title="Recent Repository Activity" icon={Activity}>
        {gh.status === "loading" && (
          <ul className="space-y-2" aria-label="Fetching recent updates">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="h-[4.6rem] animate-pulse rounded-lg border border-white/10 bg-white/[0.02]" />
            ))}
          </ul>
        )}
        {gh.status === "error" && <p className="text-sm text-zinc-500">Activity feed unavailable.</p>}
        {(gh.status === "success" || gh.status === "empty") && (
          gh.repos.length === 0 ? (
            <p className="text-sm text-zinc-500">No public repositories to show yet.</p>
          ) : (
            <ul className="space-y-2">
              {gh.repos.slice(0, 4).map((r) => (
                <li key={r.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                  <a href={r.html_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-200 hover:text-secondary-soft">
                    {r.name}
                  </a>
                  {r.description && <p className="line-clamp-1 text-xs text-zinc-500">{r.description}</p>}
                  <p className="mt-1 flex items-center gap-3 font-mono text-[11px] text-zinc-500">
                    {r.language && <span>{r.language}</span>}
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" aria-hidden /> {r.stargazers_count}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3 w-3" aria-hidden /> {r.forks_count}
                    </span>
                    <span>updated {new Date(r.updated_at).toLocaleDateString()}</span>
                  </p>
                </li>
              ))}
            </ul>
          )
        )}
      </Panel>

      {/* System metadata (verified/local, not from GitHub) */}
      <Panel title="System Metadata" icon={Tag}>
        <dl className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-1.5 text-zinc-400">
              <BadgeCheck className="h-4 w-4 text-emerald-400" aria-hidden /> Availability
            </dt>
            <dd className="text-right text-emerald-300">{portfolio.identity.availability}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-1.5 text-zinc-400">
              <BookOpen className="h-4 w-4 text-secondary/80" aria-hidden /> Currently learning
            </dt>
            <dd className="text-right text-zinc-300">{portfolio.learning[0]}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="h-4 w-4 text-secondary/80" aria-hidden /> Local time (IST)
            </dt>
            <dd className="text-right font-mono text-xs text-zinc-300">{now}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-1.5 text-zinc-400">
              <Tag className="h-4 w-4 text-secondary/80" aria-hidden /> Portfolio version
            </dt>
            <dd className="text-right font-mono text-xs text-zinc-300">{portfolio.meta.version}</dd>
          </div>
        </dl>
      </Panel>
    </div>
  );
}
