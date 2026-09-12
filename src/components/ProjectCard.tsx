import { Link } from "react-router-dom";
import {
  Github,
  ExternalLink,
  Target,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Network,
  Scale,
} from "lucide-react";
import type { Project } from "@/types";
import { useUI } from "@/ui-context";
import { projectRepos } from "@/lib/project-links";

const statusStyle: Record<Project["status"], string> = {
  Completed: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  "In Progress": "border-amber-400/40 text-amber-300 bg-amber-400/10",
  Prototype: "border-accent/40 text-accent-soft bg-accent/10",
};

/**
 * Project summary card. In recruiter mode it leads with the problem, the
 * approach and the outcome; in developer mode it surfaces the architecture and
 * decision counts, and links straight into those sections of the case study.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const { mode } = useUI();
  const isDev = mode === "developer";
  const caseStudy = `/projects/${project.id}`;

  return (
    <article className="glass-panel panel-interactive group/card flex h-full flex-col overflow-hidden p-5">
      {/* Accent header rule — reveals on hover, tying the card to the palette. */}
      <span
        className="absolute inset-x-0 top-0 h-px bg-accent-line opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        aria-hidden
      />

      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-white">
            <Link to={caseStudy} className="transition-colors hover:text-secondary-soft">
              {project.name}
            </Link>
          </h3>
          <p className="mt-1 font-mono text-xs text-zinc-500">{project.year}</p>
        </div>
        <span className={`chip shrink-0 border ${statusStyle[project.status]}`}>{project.status}</span>
      </div>

      <p className="mb-4 text-[0.95rem] leading-relaxed text-zinc-300">{project.tagline}</p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {project.categories.map((c) => (
          <span key={c} className="chip border-secondary/25 text-secondary-soft">
            {c}
          </span>
        ))}
      </div>

      {/* Problem and solution read as a paired block, divided by a rule that
          makes the cause-and-effect relationship visible at a glance. */}
      <div className="space-y-3 rounded-xl border border-white/[0.07] bg-void/30 p-3.5 text-sm">
        <p className="flex gap-2.5 text-zinc-300">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/80" aria-hidden />
          <span>
            <span className="label-hud mr-1.5 text-rose-300/80">Problem</span>
            {project.problem}
          </span>
        </p>
        <div className="h-px bg-white/[0.06]" aria-hidden />
        <p className="flex gap-2.5 text-zinc-300">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/80" aria-hidden />
          <span>
            <span className="label-hud mr-1.5 text-amber-300/80">Solution</span>
            {project.solution}
          </span>
        </p>
      </div>

      {/* Recruiter mode keeps the feature list; developer mode trades it for
          the engineering surface of the case study. */}
      {isDev ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.architecture && (
            <Link
              to={`${caseStudy}#architecture`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 transition-colors hover:border-secondary/40 hover:text-secondary-soft"
            >
              <Network className="h-3.5 w-3.5" aria-hidden />
              {project.architecture.nodes.length} components
            </Link>
          )}
          {project.decisions && project.decisions.length > 0 && (
            <Link
              to={`${caseStudy}#decisions`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 transition-colors hover:border-accent/40 hover:text-accent-soft"
            >
              <Scale className="h-3.5 w-3.5" aria-hidden />
              {project.decisions.length} decisions
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <p className="label-hud mb-1.5 text-secondary/70">Key features</p>
          <ul className="space-y-1.5">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary/70" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.impact && (
        <p className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] p-2.5 text-sm text-zinc-300">
          <span className="label-hud mr-1.5 text-emerald-300/90">Impact</span>
          {project.impact}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.map((t) => (
          <span key={t} className="chip group-hover/card:border-white/20">
            {t}
          </span>
        ))}
      </div>

      {/* mt-auto pins the action row to the bottom so cards in a row align. */}
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-4">
        <Link to={caseStudy} className="btn-hud text-sm">
          Read case study <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        {/* Link buttons only render when a URL is present — no dead links. */}
        {projectRepos(project, "Code").map((repo) => (
          <a
            key={repo.url}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-sm"
          >
            <Github className="h-4 w-4" aria-hidden /> {repo.label}
          </a>
        ))}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer" className="btn-ghost text-sm">
            <ExternalLink className="h-4 w-4" aria-hidden /> Live Demo
          </a>
        )}
      </div>
    </article>
  );
}
