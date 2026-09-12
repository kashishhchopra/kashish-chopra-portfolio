import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  ExternalLink,
  Target,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Network,
  Scale,
  ChevronDown,
} from "lucide-react";
import Seo from "@/components/Seo";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import DecisionLog from "@/components/DecisionLog";
import { portfolio } from "@/data/portfolio";
import { useUI } from "@/ui-context";
import type { Project } from "@/types";
import { projectRepos } from "@/lib/project-links";

const statusStyle: Record<Project["status"], string> = {
  Completed: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  "In Progress": "border-amber-400/40 text-amber-300 bg-amber-400/10",
  Prototype: "border-accent/40 text-accent-soft bg-accent/10",
};

/**
 * Long-form case study for a single project.
 *
 * In recruiter mode the page leads with problem, solution and outcome, and the
 * architecture and decision sections stay collapsed behind a disclosure. In
 * developer mode they are expanded on arrival.
 */
export default function ProjectCaseStudyPage() {
  const { projectId } = useParams();
  const { mode } = useUI();
  const index = portfolio.projects.findIndex((p) => p.id === projectId);
  const project = portfolio.projects[index];

  if (!project) {
    return (
      <>
        <Seo title="Case study not found" description="The requested project case study does not exist." />
        <div className="glass-panel p-8 text-center">
          <p className="font-mono text-sm text-rose-300">ERR: PROJECT_NOT_FOUND</p>
          <h1 className="mt-2 text-2xl font-bold text-white">No case study at that address</h1>
          <p className="mt-2 text-zinc-400">The project id “{projectId}” isn’t in the database.</p>
          <Link to="/projects" className="btn-hud mt-5">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to all projects
          </Link>
        </div>
      </>
    );
  }

  const prev = portfolio.projects[index - 1];
  const next = portfolio.projects[index + 1];
  const isDev = mode === "developer";
  const repos = projectRepos(project, "Source");

  return (
    <>
      <Seo title={project.name} description={project.tagline} />

      <nav aria-label="Breadcrumb" className="mb-5">
        <Link to="/projects" className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-secondary-soft">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> /projects
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip border ${statusStyle[project.status]}`}>{project.status}</span>
          <span className="chip">{project.year}</span>
          {project.categories.map((c) => (
            <span key={c} className="chip border-secondary/25 text-secondary-soft">
              {c}
            </span>
          ))}
        </div>
        <h1 className="text-display mt-4 text-3xl font-extrabold leading-[1.1] sm:text-[2.75rem]">{project.name}</h1>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-zinc-300">{project.tagline}</p>
        {project.role && <p className="mt-2 font-mono text-xs text-zinc-500">{project.role}</p>}

        {(repos.length > 0 || project.demo) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {repos.map((repo) => (
              <a
                key={repo.url}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost text-sm"
              >
                <Github className="h-4 w-4" aria-hidden />{" "}
                {repos.length > 1 ? `Source — ${repo.label}` : repo.label}
              </a>
            ))}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="btn-hud text-sm">
                <ExternalLink className="h-4 w-4" aria-hidden /> Live demo
              </a>
            )}
          </div>
        )}
      </header>

      {/* Problem / solution — the part every reader needs, in both modes. */}
      <section aria-labelledby="overview" className="mb-8 grid gap-4 md:grid-cols-2">
        <h2 id="overview" className="sr-only">
          Overview
        </h2>
        <div className="glass-panel p-5">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-rose-300/90">
            <Target className="h-4 w-4" aria-hidden /> The problem
          </p>
          <p className="text-zinc-300">{project.problem}</p>
        </div>
        <div className="glass-panel p-5">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-amber-300/90">
            <Lightbulb className="h-4 w-4" aria-hidden /> The approach
          </p>
          <p className="text-zinc-300">{project.solution}</p>
        </div>
      </section>

      <section aria-labelledby="features" className="mb-8">
        <h2 id="features" className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
          <CheckCircle2 className="h-5 w-5 text-secondary/80" aria-hidden /> What it does
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {project.features.map((f) => (
            <li key={f} className="flex gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-zinc-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary/70" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        {project.impact && (
          <p className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] p-3 text-sm text-zinc-300">
            <span className="font-semibold text-emerald-300">Impact: </span>
            {project.impact}
          </p>
        )}
      </section>

      {project.architecture && (
        <section aria-labelledby="architecture" id="architecture" className="mb-8 scroll-mt-24">
          <h2 id="architecture-heading" className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
            <Layers className="h-5 w-5 text-secondary/80" aria-hidden /> How it's built
          </h2>
          <details open={isDev} className="group">
            <summary className="mb-3 flex cursor-pointer list-none items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary/35 hover:bg-secondary/[0.05] group-open:border-secondary/25 group-open:bg-secondary/[0.04]">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-secondary/25 bg-gradient-to-br from-secondary/[0.18] to-accent/[0.10] text-secondary-soft">
                <Network className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">Interactive architecture diagram</span>
                <span className="block font-mono text-[11px] text-zinc-400">
                  {project.architecture.nodes.length} components · click any one to see what it does
                </span>
              </span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <ArchitectureDiagram architecture={project.architecture} title={project.name} />
          </details>
        </section>
      )}

      {project.decisions && project.decisions.length > 0 && (
        <section aria-labelledby="decisions-heading" id="decisions" className="mb-8 scroll-mt-24">
          <h2 id="decisions-heading" className="mb-1 text-xl font-bold text-white">
            Engineering decisions
          </h2>
          <p className="mb-4 text-sm text-zinc-400">
            What was chosen, what was rejected, and what each choice cost.
          </p>
          <details open={isDev} className="group">
            <summary className="mb-3 flex cursor-pointer list-none items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-accent/[0.05] group-open:border-accent/25 group-open:bg-accent/[0.04]">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-accent/30 bg-gradient-to-br from-accent/[0.20] to-accent/[0.10] text-accent-soft">
                <Scale className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">
                  {project.decisions.length} decision records
                </span>
                <span className="block font-mono text-[11px] text-zinc-400">
                  what was chosen, what was rejected, and what it cost
                </span>
              </span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <DecisionLog decisions={project.decisions} defaultOpen={isDev} />
          </details>
        </section>
      )}

      {project.challenges && project.challenges.length > 0 && (
        <section aria-labelledby="challenges" className="mb-8">
          <h2 id="challenges" className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
            <AlertTriangle className="h-5 w-5 text-amber-400/80" aria-hidden /> What went wrong, and the fix
          </h2>
          <div className="space-y-3">
            {project.challenges.map((c) => (
              <div key={c.problem} className="glass-panel p-4 sm:p-5">
                <p className="text-sm text-zinc-200">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-rose-300/90">Problem </span>
                  {c.problem}
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/90">Fix </span>
                  {c.approach}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {project.learnings && project.learnings.length > 0 && (
        <section aria-labelledby="learnings" className="mb-8">
          <h2 id="learnings" className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
            <Sparkles className="h-5 w-5 text-accent-soft" aria-hidden /> What it taught
          </h2>
          <ul className="space-y-2">
            {project.learnings.map((l) => (
              <li key={l} className="flex gap-2.5 rounded-lg border border-accent/20 bg-accent/[0.05] p-3 text-sm text-zinc-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {l}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="stack" className="mb-10">
        <h2 id="stack" className="mb-3 text-xl font-bold text-white">
          Stack
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </section>

      <nav aria-label="Other case studies" className="grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
        {prev ? (
          <Link to={`/projects/${prev.id}`} className="glass-panel group p-4 transition-colors hover:border-secondary/30">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> previous
            </span>
            <span className="mt-1 block font-semibold text-zinc-200 group-hover:text-secondary-soft">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/projects/${next.id}`} className="glass-panel group p-4 text-right transition-colors hover:border-secondary/30 sm:col-start-2">
            <span className="flex items-center justify-end gap-1.5 font-mono text-[11px] text-zinc-500">
              next <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="mt-1 block font-semibold text-zinc-200 group-hover:text-secondary-soft">{next.name}</span>
          </Link>
        )}
      </nav>
    </>
  );
}
