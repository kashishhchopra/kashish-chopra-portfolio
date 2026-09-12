import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import type { ProjectCategory } from "@/types";
import ProjectCard from "./ProjectCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ALL = "All";

export default function ProjectDatabase() {
  const reduced = useReducedMotion();
  const projects = portfolio.projects;

  // Derive filter options from actual project categories.
  const categories = useMemo(() => {
    const set = new Set<ProjectCategory>();
    projects.forEach((p) => p.categories.forEach((c) => set.add(c)));
    return [ALL, ...Array.from(set)];
  }, [projects]);

  const [active, setActive] = useState<string>(ALL);

  const filtered = active === ALL ? projects : projects.filter((p) => p.categories.includes(active as ProjectCategory));

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
        {categories.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActive(c)}
              className={[
                "rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                isActive
                  ? "border-secondary/50 bg-secondary/15 text-secondary-soft"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/25 hover:text-zinc-200",
              ].join(" ")}
            >
              {c}
              {c !== ALL && (
                <span className="ml-1.5 text-zinc-500">
                  {projects.filter((p) => p.categories.includes(c as ProjectCategory)).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-zinc-400">
          No projects in this category.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {/* Names the group the card headings belong to, keeping the document
              outline h1 → h2 → h3 without a visible duplicate heading. */}
          <h2 className="sr-only">
            {active === ALL ? "All projects" : `${active} projects`}
          </h2>
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: reduced ? 0 : i * 0.05 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
