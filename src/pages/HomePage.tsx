import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FolderTree, Command } from "lucide-react";
import Seo from "@/components/Seo";
import HeroCommandCenter from "@/components/HeroCommandCenter";
import AIProfileCard from "@/components/AIProfileCard";
import ProjectCard from "@/components/ProjectCard";
import RecruiterBrief from "@/components/RecruiterBrief";
import { portfolio } from "@/data/portfolio";
import { useUI } from "@/ui-context";

// Developer-mode panels: most visitors land in recruiter mode and never need
// this code, so it stays out of the initial bundle.
const GitHubActivity = lazy(() => import("@/components/GitHubActivity"));
const FileExplorer = lazy(() => import("@/components/FileExplorer"));

/**
 * The landing page reorders itself by audience: recruiters get the at-a-glance
 * brief above everything else, developers get the file explorer and live
 * GitHub activity in its place.
 */
export default function HomePage() {
  const { mode, openPalette } = useUI();
  const isDev = mode === "developer";
  const featured = portfolio.projects.slice(0, 2);

  return (
    <>
      <Seo
        title="Home"
        description="KASHISH'S AI — the interactive AI-operating-system portfolio of Kashish Chopra, AI/ML developer and Generative AI explorer."
      />
      <HeroCommandCenter />

      <div className="mt-12">
        {isDev ? (
          <section aria-labelledby="explorer-heading" className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 id="explorer-heading" className="flex items-center gap-2 text-lg font-bold text-white">
                  <FolderTree className="h-5 w-5 text-secondary/80" aria-hidden /> Browse the system
                </h2>
                <Link to="/explorer" className="font-mono text-xs text-secondary-soft hover:underline">
                  full explorer
                </Link>
              </div>
              <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/[0.03]" />}>
                <FileExplorer compact />
              </Suspense>
            </div>
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/[0.03]" />}>
              <GitHubActivity />
            </Suspense>
          </section>
        ) : (
          <RecruiterBrief />
        )}
      </div>

      {/* Identity + featured projects */}
      <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <AIProfileCard />

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Featured Missions</h2>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 font-mono text-xs text-secondary-soft hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-5">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Palette discovery — a shortcut nobody knows about isn't a feature. */}
      <button
        type="button"
        onClick={() => openPalette()}
        className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-400 transition-colors hover:border-secondary/30 hover:text-secondary-soft"
      >
        <Command className="h-4 w-4" aria-hidden />
        Press <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd> to search
        every page, case study and action
      </button>
    </>
  );
}
