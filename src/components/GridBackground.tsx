import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Ambient background, built in layers so the page has atmosphere instead of a
 * flat fill:
 *
 *   1. aurora   — three slow-drifting colour fields, transform-animated only
 *   2. grid     — technical texture, masked so it fades out down the page
 *   3. beam     — a single horizon glow anchoring the top of the viewport
 *   4. vignette — darkens the corners so content sits in the light
 *   5. grain    — fine noise that stops the big gradients from banding
 *
 * Purely decorative (aria-hidden). All motion drops under
 * prefers-reduced-motion; the colour stays, only the drift stops.
 */
export default function GridBackground() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1 — Aurora fields */}
      <div
        className={`absolute -left-[18rem] -top-[22rem] h-[46rem] w-[46rem] rounded-full bg-accent/[0.09] blur-[120px] ${
          reduced ? "" : "animate-drift"
        }`}
      />
      <div
        className={`absolute -right-[16rem] top-[-10rem] h-[40rem] w-[40rem] rounded-full bg-accent/[0.08] blur-[120px] ${
          reduced ? "" : "animate-drift-slow"
        }`}
      />
      <div
        className={`absolute bottom-[-20rem] left-1/3 h-[38rem] w-[38rem] rounded-full bg-secondary/[0.05] blur-[130px] ${
          reduced ? "" : "animate-drift-slow"
        }`}
        style={{ animationDelay: "-12s" }}
      />

      {/* 2 — Technical grid, fading out as the eye travels down */}
      <div
        className="absolute inset-0 bg-grid-lines opacity-[0.55]"
        style={{
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 100% 70% at 50% -5%, black 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 100% 70% at 50% -5%, black 30%, transparent 78%)",
        }}
      />

      {/* 3 — Horizon beam */}
      <div className="absolute inset-x-0 top-0 h-px bg-accent-line opacity-70" />
      <div className="absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgb(var(--c-secondary)/0.07),transparent_70%)]" />

      {/* 4 — Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(var(--c-black)/0.55)_100%)]" />

      {/* 5 — Grain */}
      <div className="grain-overlay absolute inset-0 opacity-[0.16] mix-blend-overlay" />

      {/* Slow scan line, kept from the original console idiom */}
      {!reduced && (
        <div className="absolute inset-x-0 top-0 h-40 animate-scan bg-gradient-to-b from-secondary/[0.04] to-transparent" />
      )}
    </div>
  );
}
