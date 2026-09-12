/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /**
         * Palette. Neutral zinc base, blue accent ramp.
         *
         * `void` and `panel` keep their names because dozens of components and
         * the `.glass-panel` component class already read them; only the
         * values changed.
         */
        void: "#09090B", // Background
        panel: "#18181B", // Surface
        surface: "#18181B", // Alias — same value, clearer at call sites
        ink: "#FAFAFA", // Text

        /**
         * Accent (#2563EB) is a mid-weight blue: right for borders, fills and
         * large type, but only ~4:1 on the background, so `accent-soft` is the
         * one to use for small text.
         */
        accent: {
          DEFAULT: "#2563EB",
          soft: "#60A5FA",
        },
        secondary: {
          DEFAULT: "#38BDF8",
          soft: "#7DD3FC",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        // rgb(56,189,248) = secondary, rgb(37,99,235) = accent.
        glow: "0 0 0 1px rgba(56,189,248,0.16), 0 0 24px -6px rgba(56,189,248,0.38)",
        "glow-accent": "0 0 0 1px rgba(37,99,235,0.20), 0 0 26px -6px rgba(37,99,235,0.45)",
        panel: "0 8px 40px -12px rgba(0,0,0,0.7)",
        // Layered elevation: a tight contact shadow plus a wide ambient one,
        // which reads as real depth where a single blur reads as a smudge.
        lift: "0 1px 1px rgba(0,0,0,0.35), 0 8px 20px -8px rgba(0,0,0,0.6), 0 24px 60px -24px rgba(0,0,0,0.85)",
        "lift-glow":
          "0 1px 1px rgba(0,0,0,0.35), 0 10px 24px -10px rgba(0,0,0,0.6), 0 0 32px -10px rgba(56,189,248,0.35)",
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
          "linear-gradient(to right, rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.06) 1px, transparent 1px)",
        // Top-lit panel surface: light catches the upper edge and falls away,
        // the way a physical pane of glass would.
        "panel-sheen":
          "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 22%, rgba(255,255,255,0) 60%)",
        "accent-line":
          "linear-gradient(90deg, transparent, rgba(56,189,248,0.55), rgba(37,99,235,0.55), transparent)",
      },
    },
  },
  plugins: [],
};
