import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { navItems, primaryModules } from "@/lib/nav";
import { portfolio } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import CommandTerminal from "./CommandTerminal";

export default function HeroCommandCenter() {
  const reduced = useReducedMotion();
  const modules = primaryModules
    .map((cmd) => navItems.find((n) => n.command === cmd))
    .filter(Boolean) as typeof navItems;

  // Derived from the data, so these never drift out of date.
  const stats = [
    { label: "Projects", value: String(portfolio.projects.length) },
    {
      label: "Internships",
      value: String(portfolio.experience.filter((e) => e.type === "Internship").length),
    },
    { label: "Focus", value: "GenAI · RAG" },
  ];

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
        };

  return (
    <section aria-labelledby="hero-heading">
      <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: greeting + modules.
            The greeting block is deliberately un-animated: it is painted by
            the static shell in index.html before React loads, and fading it
            back in from zero opacity would undo that paint. */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-emerald-300">System Online</span>
          </p>

          <h1
            id="hero-heading"
            className="mt-5 text-[2.5rem] font-extrabold leading-[1.05] sm:text-6xl"
          >
            <span className="text-display block">Hello, I'm</span>
            <span className="text-accent-gradient mt-1 block pb-1 drop-shadow-[0_0_28px_rgb(var(--c-secondary)/0.22)]">
              {portfolio.identity.displayName}
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {portfolio.identity.tagline}
          </p>

          {/* Signal strip — the three facts worth knowing before scrolling. */}
          <motion.dl {...fade(0.12)} className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="label-hud">{s.label}</dt>
                <dd className="mt-0.5 text-lg font-bold text-white">{s.value}</dd>
              </div>
            ))}
          </motion.dl>

        </div>

        {/* Right: live terminal */}
        <motion.div {...fade(0.25)}>
          <CommandTerminal />
        </motion.div>
      </div>

      {/* Module launcher — full width beneath the split, so the modules read as
          one rail instead of orphaning a card in a two-column grid. */}
      <motion.p {...fade(0.15)} className="mt-10 font-mono text-base text-zinc-300">
        <span className="text-secondary/70">&gt;</span> What would you like to explore?
      </motion.p>

      <motion.ul {...fade(0.2)} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <li key={m.command}>
              {/* Compact row on small screens, stacked tile once the rail goes
                  five-across — a stacked tile on mobile is mostly empty space. */}
              <Link
                to={m.path}
                className="group relative flex h-full items-center gap-3 overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.025] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-secondary/40 hover:bg-secondary/[0.06] hover:shadow-lift-glow lg:flex-col lg:items-start lg:gap-6"
              >
                {/* Accent bar lights the top edge on hover. */}
                <span
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-secondary to-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden
                />
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-secondary/25 bg-gradient-to-br from-secondary/[0.18] to-accent/[0.10] text-secondary-soft transition-transform duration-200 group-hover:scale-110">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="lg:mt-auto">
                  <span className="block font-semibold text-white">{m.label}</span>
                  <span className="mt-0.5 flex items-center gap-1 font-mono text-xs text-zinc-400">
                    {m.command}
                    <ArrowRight
                      className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-secondary-soft group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </motion.ul>
    </section>
  );
}
