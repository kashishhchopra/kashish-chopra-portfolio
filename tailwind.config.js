/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      /**
       * Every colour is a CSS variable holding space-separated RGB channels,
       * so `<alpha-value>` keeps working (`bg-white/10`, `border-secondary/40`)
       * and one attribute on <html> repaints the site.
       *
       * The trick that makes this cheap: Tailwind's own `white`, `black` and
       * `zinc` scales are overridden here too. ~350 existing class names —
       * `text-zinc-400`, `border-white/10`, `bg-white/[0.02]` — become
       * theme-aware without a single component being edited. In the light
       * theme the neutral ramp is inverted, so `zinc-100` (the brightest step
       * on black) resolves to the darkest step on beige and the hierarchy each
       * component already expresses survives the flip.
       *
       * Values live in src/index.css: `:root` is beige/black, `[data-theme="dark"]`
       * is black/white.
       */
      colors: {
        void: "rgb(var(--c-void) / <alpha-value>)",
        panel: "rgb(var(--c-panel) / <alpha-value>)",
        surface: "rgb(var(--c-panel) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",

        white: "rgb(var(--c-white) / <alpha-value>)",
        black: "rgb(var(--c-black) / <alpha-value>)",

        // Only the steps this codebase actually uses; the rest of Tailwind's
        // scale stays untouched underneath.
        zinc: {
          100: "rgb(var(--c-zinc-100) / <alpha-value>)",
          200: "rgb(var(--c-zinc-200) / <alpha-value>)",
          300: "rgb(var(--c-zinc-300) / <alpha-value>)",
          400: "rgb(var(--c-zinc-400) / <alpha-value>)",
          500: "rgb(var(--c-zinc-500) / <alpha-value>)",
          600: "rgb(var(--c-zinc-600) / <alpha-value>)",
        },

        /**
         * One accent, two steps. `accent`/`secondary` were separate blues; they
         * are now the same hue so the palette reads as monochrome-plus-one.
         * `-soft` means "safe for small text in this theme" — which is the
         * lighter step on black and the darker step on beige.
         */
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          soft: "rgb(var(--c-accent-soft) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--c-secondary) / <alpha-value>)",
          soft: "rgb(var(--c-secondary-soft) / <alpha-value>)",
        },

        // Status colours stay semantic — online, warning, error. They darken in
        // the light theme so they keep their contrast on beige.
        emerald: {
          200: "rgb(var(--c-emerald-200) / <alpha-value>)",
          300: "rgb(var(--c-emerald-300) / <alpha-value>)",
          400: "rgb(var(--c-emerald-400) / <alpha-value>)",
        },
        amber: {
          300: "rgb(var(--c-amber-300) / <alpha-value>)",
          400: "rgb(var(--c-amber-400) / <alpha-value>)",
        },
        rose: {
          300: "rgb(var(--c-rose-300) / <alpha-value>)",
          400: "rgb(var(--c-rose-400) / <alpha-value>)",
        },
        red: {
          500: "rgb(var(--c-red-500) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--c-secondary) / 0.16), 0 0 24px -6px rgb(var(--c-secondary) / 0.38)",
        "glow-accent": "0 0 0 1px rgb(var(--c-accent) / 0.20), 0 0 26px -6px rgb(var(--c-accent) / 0.45)",
        panel: "0 8px 40px -12px rgba(0,0,0,0.7)",
        // Layered elevation: a tight contact shadow plus a wide ambient one,
        // which reads as real depth where a single blur reads as a smudge.
        lift: "0 1px 1px rgb(var(--c-shadow) / 0.35), 0 8px 20px -8px rgb(var(--c-shadow) / 0.6), 0 24px 60px -24px rgb(var(--c-shadow) / 0.85)",
        "lift-glow":
          "0 1px 1px rgb(var(--c-shadow) / 0.35), 0 10px 24px -10px rgb(var(--c-shadow) / 0.6), 0 0 32px -10px rgb(var(--c-secondary) / 0.35)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.3)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        // Slow, wide drifts for the ambient aurora. Transform-only, so they
        // stay on the compositor and cost no layout work.
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(6%,-4%,0) scale(1.12)" },
          "66%": { transform: "translate3d(-5%,5%,0) scale(0.94)" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1.05)" },
          "50%": { transform: "translate3d(-7%,6%,0) scale(0.92)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
        "sweep-x": {
          "0%, 100%": { transform: "translateX(-40%)", opacity: "0" },
          "50%": { transform: "translateX(40%)", opacity: "1" },
        },
      },
      animation: {
        scan: "scan 4s linear infinite",
        blink: "blink 1.1s step-end infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.2,0.6,0.3,1) infinite",
        float: "float 6s ease-in-out infinite",
        drift: "drift 26s ease-in-out infinite",
        "drift-slow": "drift-slow 34s ease-in-out infinite",
        shimmer: "shimmer 1.1s ease-out",
        "sweep-x": "sweep-x 7s ease-in-out infinite",
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(to right, var(--hud-line) 1px, transparent 1px), linear-gradient(to bottom, var(--hud-line) 1px, transparent 1px)",
        // Top-lit panel surface: light catches the upper edge and falls away,
        // the way a physical pane of glass would.
        "panel-sheen":
          "linear-gradient(180deg, rgb(var(--c-white) / 0.07) 0%, rgb(var(--c-white) / 0.02) 22%, rgb(var(--c-white) / 0) 60%)",
        "accent-line":
          "linear-gradient(90deg, transparent, rgb(var(--c-secondary) / 0.55), rgb(var(--c-accent) / 0.55), transparent)",
      },
    },
  },
  plugins: [],
};
