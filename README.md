# KASHISH'S AI — Portfolio

An interactive, AI-operating-system themed personal portfolio for **Kashish Chopra** —
AI/ML Developer • Generative AI Explorer • Intelligent Systems Builder.

Built with **React + Vite + TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Lucide** icons.
Multi-page, fully responsive, accessible, and SEO-ready.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

Other scripts:

```bash
npm run build      # type-check + production build into /dist
npm run preview    # preview the production build locally
npm run typecheck  # TypeScript check only
```

> Requires Node 18+ (Node 20/22 recommended).

---

## What's inside

- **Recruiter Mode / Developer Mode** — a real content switch, not a theme. Recruiter mode
  leads with an at-a-glance brief (availability, experience, education, copy-email) and keeps
  the deep technical panels collapsed. Developer mode opens with the file explorer and live
  GitHub activity, and expands architecture diagrams and decision records by default. The
  choice persists in `localStorage`. Toggle in the header, or via the palette.
- **Command palette (⌘K / Ctrl+K)** — fuzzy search over every page, case study, and action
  (copy email, switch mode, open the explorer, replay boot…). Full combobox
  keyboard support: ↑↓ to move, ⏎ to run, Esc to close, `aria-activedescendant` for screen
  readers. Every entry comes from one registry in [`src/lib/commands.ts`](src/lib/commands.ts),
  shared with the assistant.
- **Interactive architecture diagrams** — every project has one. Deterministic SVG layout
  from a small node/edge graph in the data file; hover, tab to or tap any component to see
  what it does and highlight its connections. Feedback edges (the RL reward loop, the
  Telegram override path) are drawn as return curves. Node roles are encoded by colour *and*
  a stripe, so the diagram never depends on colour alone.
- **Case studies with engineering decisions** — each project has its own page at
  `/projects/:id` documenting the problem, the approach, the architecture, decision records
  (**chose / considered / why / trade-off**), what went wrong and how it was fixed, and what
  it taught. Every decision states its cost — that's the point.
- **Portfolio Assistant that answers in depth** — backed by Claude (Opus 5) through a
  server-side function, with the full portfolio dossier as its context: every project's
  architecture down to each component and the data flow between them, every decision record
  with what was rejected and what it cost, the challenges and the learnings. So it can answer
  "why reinforcement learning for TRAFFICIQ, and what did that cost?" rather than reciting a
  summary. It also *acts*: buttons on each reply copy the email, open a case study or jump
  straight to an architecture diagram. Answers come **only** from Kashish's own data — the
  prompt forbids inventing employers, dates, metrics or links. Without an API key it falls
  back to a deterministic local responder that still answers architecture, trade-off,
  challenge and technology questions from the same data. See below.
- **AI file explorer** — the whole portfolio projected as a filesystem, with previews.
  Implements the ARIA tree pattern: one tab stop, ↑↓ to move, → / ← to expand and collapse,
  ⏎ to open. Derived from the data file, so a new project mounts a new directory.
- **System log timeline** — education, internships, leadership and project deployments merged
  into one chronological stream with `BOOT` / `RUN` / `DEPLOY` / `TASK` levels, filterable by
  source and expandable per entry.
- **Live GitHub integration** — real data via the public API on `/status` and in the
  developer-mode activity strip, with explicit loading / empty / rate-limit / error states.
  Skeletons match the shape of the loaded content, so arriving data never shifts the layout.
- **Boot sequence** — cinematic startup; shows on first visit (remembered via `localStorage`),
  skippable, replayable from the footer, instant under `prefers-reduced-motion`.
- **Command center hero** — greeting, roles, an interactive command console (`/projects`,
  `/skills`, `/help`, …) and primary module cards.
- **Skills matrix** — grouped skills with honest labels (Experienced / Working Knowledge /
  Familiar). No invented percentages.
- **Contact terminal** — direct channels, copy-email, validated form with mailto fallback.
- **Voice commands** — optional Web Speech API navigation ("open projects", "open contact").
  Auto-hides where unsupported.
- **Custom 404** — "SYSTEM MODULE NOT FOUND".

---

## Design system

The visual language lives in [`tailwind.config.js`](tailwind.config.js) and the
`@layer components` block of [`src/index.css`](src/index.css) — components compose these
rather than inventing one-off styling.

### Palette

| Token | Value | Role |
| --- | --- | --- |
| `void` | `#09090B` | Background |
| `panel` / `surface` | `#18181B` | Surface |
| `white` | `#FFFFFF` | Primary — headings |
| `ink` | `#FAFAFA` | Body text (the `<body>` default) |
| `accent` | `#2563EB` | Accent |
| `accent-soft` | `#60A5FA` | Accent for small text — see note |
| `secondary` | `#38BDF8` | Secondary |
| `secondary-soft` | `#7DD3FC` | Secondary, lifted |

Neutrals come from Tailwind's **zinc** scale, which is truly grey and matches the zinc base;
the blue-tinted `slate` scale would fight it. `zinc-300` / `zinc-400` are the supporting-text
tiers below `ink`.

> `accent` (#2563EB) sits at roughly **4:1** on the background — fine for borders, fills,
> icons and large type, but under AA for small text. Use `accent-soft` there. This is why
> the log timeline's `BOOT` badge and similar small labels read `text-accent-soft`.

- **Surface** — `.glass-panel` is three layers: a translucent fill, a sheen that catches light
  on the top edge only, and a hairline that is brighter at the top than the bottom. Add
  `.panel-interactive` for the hover lift; panels that aren't clickable don't get it.
- **Elevation** — `shadow-lift` pairs a tight contact shadow with a wide ambient one. A single
  blur reads as a smudge; two read as depth.
- **Type** — `.text-display` for headings (a bright core falling off to cool grey) and
  `.text-accent-gradient` for the secondary→accent ramp. Tracking tightens as size increases.
- **Accent** — one sky→blue ramp, used for the top hairline, the `.rule-accent` under section
  headers, hover edges and focus states. Nothing else introduces a new hue — with two
  exceptions that carry meaning rather than brand: green for success/live states, amber for
  warnings and anything outside the system's control. The architecture diagram's six node
  kinds also need to stay tellable apart, so `store` borrows indigo; see
  [`ArchitectureDiagram.tsx`](src/components/ArchitectureDiagram.tsx).
- **Ambience** — [`GridBackground`](src/components/GridBackground.tsx) layers drifting aurora
  fields, a masked technical grid, a horizon beam, a vignette and film grain. The grain is an
  inline SVG turbulence (no request) and stops the large dark gradients from banding.
- **Motion** — transform and opacity only, so animation stays on the compositor. Everything
  drops under `prefers-reduced-motion`; colour stays, movement stops.

---

## Editing content

**All site content lives in one file:** [`src/data/portfolio.ts`](src/data/portfolio.ts).

Edit that file to change the summary, skills, projects, experience, contact links, etc.
Nothing is hard-coded in the components. Types are enforced by `src/types.ts`.

- **Add project links:** set `github` and/or `demo` on any project in `portfolio.ts`.
  For a project split across repos, use `repos: [{ label, url }]` instead of `github` —
  each entry gets its own labelled button. Link buttons only render when a URL is
  present — no dead links.
- **Replace the photo:** swap `public/assets/kashish.png` (keep the name or update `photo`).

Adding a project gives you its case-study page, its palette entry, its explorer directory
and its sitemap URL for free. The case-study fields are all optional:

```ts
{
  id: "my-project",
  name: "My Project",
  tagline: "One line a recruiter can repeat.",     // cards, palette, hero
  // …problem, solution, technologies, features, status…

  architecture: {
    summary: "How the pieces fit, in one or two sentences.",
    nodes: [{ id: "in", label: "Input", kind: "input", detail: "Shown on hover/focus." }],
    edges: [{ from: "in", to: "out", label: "what flows" }],   // right-to-left = feedback loop
    columns: [["in"], ["out"]],                                // fixes the left-to-right layout
  },

  decisions: [{
    id: "some-choice",
    title: "What the decision was about",
    choice: "What you did.",
    alternatives: ["What you didn't"],
    rationale: "Why the choice won.",
    tradeoff: "What it cost. Never leave this out.",
  }],

  challenges: [{ problem: "What broke.", approach: "What fixed it." }],
  learnings: ["What you'd carry to the next project."],
}
```

`kind` is one of `input · process · model · store · output · external`, which sets the node's
colour and legend entry in the diagram.

---

## Optional integrations (environment variables)

Copy `.env.example` to `.env`. Only non-secret, public config belongs in `VITE_*` vars —
they are bundled into the browser. **Never put a private API key in a `VITE_` variable.**

| Variable | Purpose | Default behavior if empty |
| --- | --- | --- |
| `VITE_GITHUB_USERNAME` | Username for the System Status dashboard | Falls back to `kashishhchopra` |
| `VITE_ASSISTANT_API_URL` | Override the assistant endpoint with an externally hosted proxy | Uses the bundled `/api/assistant` |
| `VITE_CONTACT_FORM_ENDPOINT` | Form service endpoint (Formspree/Getform/Web3Forms) | Form posts to the bundled `/api/contact` |
| `VITE_SITE_URL` | Canonical host for `<link rel="canonical">` and `og:url` | Derived from the live origin at runtime |

Server-side only — set these in your host's dashboard, **never** with a `VITE_` prefix:

| Variable | Purpose | Default behavior if empty |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Claude API key for `/api/assistant` | Endpoint reports itself unconfigured; assistant uses its local responder |
| `RESEND_API_KEY` | Mail provider key for `/api/contact` | Endpoint reports itself unconfigured; form uses `mailto:` |
| `CONTACT_TO` | Where messages are delivered | The email in `portfolio.ts` |
| `CONTACT_FROM` | The `From:` line (needs a verified domain) | Resend's shared sender |

### The assistant

[`api/assistant.ts`](api/assistant.ts) is a Vercel Function on the **Node.js runtime** (the
Anthropic SDK imports `node:fs`/`node:path`, which the Edge runtime can't provide) that holds
the Claude API key server-side — it never enters the browser bundle. Set `ANTHROPIC_API_KEY` in the Vercel
project's environment variables and the assistant is live; there is nothing else to wire.

How it works:

- The browser sends `POST { system, context, question, history }`. `context` is the full
  dossier built by `buildContext()` in [`src/lib/assistant.ts`](src/lib/assistant.ts) from
  `portfolio.ts` — it is public portfolio data, which is why it can live in the bundle.
- The function adds the key and calls **Claude Opus 5** at `low` effort. The dossier is
  byte-identical between requests and sits behind one cache breakpoint, so every question
  after the first is a prompt-cache read.
- **The answer streams back** as newline-delimited JSON (`{"type":"text"}` per chunk, then
  `{"type":"actions"}`), rendered token by token. NDJSON rather than SSE because the browser
  reads it with a plain `ReadableStream` — `EventSource` can't POST a body this size.
- **Claude picks the buttons.** It has one tool, `suggest_actions`, and calls it alongside its
  written answer — so the model that understood the question chooses whether to link the case
  study, the architecture diagram or the contact page. No tool result is ever returned: the
  call *is* the output, so one request yields prose and buttons together. Every target is then
  validated in the browser against the real route table, and the email address is filled in
  from `portfolio.ts` — a path Claude invents never becomes a link, and it cannot put a wrong
  address on a button.
- The last few turns ride along as `history`, so follow-ups ("what did that cost?") keep
  their thread. Clearing the chat clears that thread too.
- `GET /api/assistant` returns `{ configured }`, which the chat uses to describe itself
  accurately rather than claiming intelligence it doesn't currently have.

Guardrails: the system prompt is grounded strictly in the dossier and forbids inventing
facts about Kashish; the endpoint bounds question, context and history size and rate-limits
per IP. If the key is unset or the call fails, the frontend falls back to the local
responder — a visitor always gets an answer.

To host the proxy elsewhere instead, point `VITE_ASSISTANT_API_URL` at it; it needs to
accept the same payload and return `{ answer }`.

### The contact form

**Current behaviour: mailto.** The form validates input, then opens the visitor's own email
client with the message pre-filled. This is deliberate — it needs no third-party account,
works on any host, and leaves the sender holding a copy of what they sent.

To switch to direct sending later, pick either option below. Both are wired up already;
neither needs a code change.

A backend ships with the site: [`api/contact.ts`](api/contact.ts), a Vercel Edge Function
that validates input, screens spam (honeypot + per-IP rate limit) and sends via
[Resend](https://resend.com). It needs **one** environment variable to go live.

**Option A — use the bundled function (recommended on Vercel):**

1. Create a free Resend account and copy an API key.
2. In the Vercel project → Settings → Environment Variables, add
   `RESEND_API_KEY`. Optionally `CONTACT_TO` (defaults to the contact email) and
   `CONTACT_FROM` (needs a domain verified with Resend; defaults to Resend's shared sender).
3. Redeploy. Nothing in the frontend changes.

**Option B — use a form service, no server code:**

Set `VITE_CONTACT_FORM_ENDPOINT` to a Formspree / Getform / Web3Forms endpoint. This
bypasses `api/contact.ts` entirely and works on any static host.

**How the form knows which state it's in.** On mount it sends `GET /api/contact`, which
replies `{ configured: boolean }` — so the notice the visitor sees reflects reality
instead of a build-time guess. Three consequences worth keeping:

- Sending is only reported as successful on a JSON `{ ok: true }`. A host with SPA
  fallback answers `/api/contact` with `200` + `index.html`, and trusting the status code
  alone would claim "sent" for a message that went nowhere.
- If the key disappears after the probe, a `501` flips the form back to mailto mid-submit
  rather than showing a failure the visitor can't act on.
- Every error state offers a "Send by email instead" link, so there is always a route that
  works.

The secret key is only ever read server-side. It must **not** be given a `VITE_` prefix —
that would bundle it into the browser.

---

## Accessibility & performance

Measured with Lighthouse 12 (mobile preset) against `npm run build && npm run preview`,
across all ten routes:

| Category | Score |
| --- | --- |
| Performance | **97–98** |
| Accessibility | **100** |
| Best practices | **100** |
| SEO | **100** |

Core Web Vitals: LCP ~2.0 s, CLS ≤ 0.03, TBT ≤ 10 ms. Performance is given as a range
because Lighthouse varies by a few points run to run — single runs on the same build
landed anywhere from 93 to 98 on a given route, and only the repeated figure is meaningful.

Re-run it yourself:

```bash
npm run build && npm run preview
npx lighthouse http://localhost:4173/ --view
```

What gets it there:

- **Route-level code splitting** — every page except the landing page is lazy-loaded, and the
  developer-mode panels load only when that mode is active. Vendor code is split into its own
  chunk so a content edit doesn't invalidate the framework in visitors' caches.
- **Static paint shell** — the hero is present as HTML in `index.html`, so first contentful
  paint doesn't wait for the JS bundle. React clears it on mount; the markup mirrors the real
  hero so the handover produces no layout shift. A tiny inline script drops the shell on deep
  links, where it would be the wrong content.
- **Inlined stylesheet** — the built CSS (~7 kB gzipped) is inlined at build time by a small
  Vite plugin, removing the render-blocking request. Fonts load non-blocking with
  `display=swap` and a `<noscript>` fallback.
- **No layout shift** — CLS ≤ 0.03 on every route. Lazy-route fallbacks reserve a viewport of
  height, and every async data panel has a skeleton shaped like its loaded state.
- Semantic HTML with a correct `h1 → h2 → h3` outline, labelled controls, visible focus rings,
  skip-to-content link.
- Keyboard navigable throughout — including the palette (combobox), the file explorer (tree)
  and the architecture diagrams (focusable nodes).
- Honors `prefers-reduced-motion` globally and per-component.
- `<noscript>` fallback with contact details if JavaScript is disabled.
- SEO: per-route title, description and **canonical**, Open Graph + Twitter tags, JSON-LD
  `Person` schema, web manifest, generated `sitemap.xml` and `robots.txt`.

---

## Project structure

```
scripts/
  generate-sitemap.mjs   # runs before every build, from the real route list
public/
  assets/                # photo
  favicon.svg  og-image.svg  robots.txt  site.webmanifest
src/
  data/portfolio.ts      # ← single source of truth for all content
  types.ts               # incl. Architecture / EngineeringDecision
  ui-context.ts          # audience mode, palette + assistant control
  lib/        nav.ts  github.ts  assistant.ts   # dossier builder + prompt + local fallback
              commands.ts   # one registry behind the palette and the assistant
              fs-tree.ts    # the portfolio projected as a filesystem
              log.ts        # experience + projects + education as one stream
  hooks/      useGitHub  useVoiceCommands  useReducedMotion  useAudienceMode
  components/ BootSequence NavigationConsole ModeToggle CommandPalette
              HeroCommandCenter AIProfileCard RecruiterBrief GitHubActivity
              FileExplorer ArchitectureDiagram DecisionLog SystemLogTimeline
              PortfolioAssistant CommandTerminal ProjectDatabase ProjectCard
              SkillsMatrix SystemStatus VoiceController
              ContactTerminal FooterStatusBar Layout Seo ...
  pages/      Home About Projects ProjectCaseStudy Skills Experience
              Contact Status Explorer NotFound
  App.tsx  main.tsx  index.css
```

---

## Deploying

Any static host works (Vercel, Netlify, GitHub Pages, Cloudflare Pages):

```bash
SITE_URL=https://your-domain.com npm run build   # outputs /dist
```

`SITE_URL` is what the sitemap generator writes into `sitemap.xml` and `robots.txt`. Without
it the build still succeeds, but emits a robots file with no sitemap line rather than baking
in a wrong domain — set it once on your host and both files stay correct as projects are
added. Set `VITE_SITE_URL` to the same value to pin canonical URLs.

Because it's a client-side router, configure your host to rewrite all routes to
`index.html` (SPA fallback). `vercel.json` and `public/_redirects` already do this for Vercel
and Netlify.

> **Before going live:** replace `public/og-image.svg` with a 1200×630 **PNG** and point the
> `og:image` / `twitter:image` tags at it. Twitter/X, LinkedIn, WhatsApp, Slack and iMessage
> all refuse SVG, so link previews are blank until this is a raster image.

---

_© Kashish Chopra. Content generated from the provided resume — no invented facts,
statistics, or links._
