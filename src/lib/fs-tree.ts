import { portfolio } from "@/data/portfolio";

/**
 * The portfolio, projected as a filesystem.
 *
 * Every leaf resolves to a real route, so the explorer is genuine navigation
 * rather than decoration. The tree is derived from `portfolio.ts`, which means
 * adding a project adds its directory automatically.
 */

export type FsKind = "dir" | "md" | "json" | "pdf" | "diagram" | "ts";

export interface FsNode {
  /** Slash path, unique — also used as the expand/collapse key. */
  path: string;
  name: string;
  kind: FsKind;
  /** Route this leaf opens. Directories may omit it. */
  to?: string;
  /** Shown in the preview pane next to the tree. */
  preview?: string;
  children?: FsNode[];
}

function projectDir(p: (typeof portfolio.projects)[number]): FsNode {
  const base = `/projects/${p.id}`;
  const children: FsNode[] = [
    {
      path: `${base}/README.md`,
      name: "README.md",
      kind: "md",
      to: base,
      preview: `# ${p.name}\n\n${p.tagline}\n\n**Problem** — ${p.problem}\n\n**Solution** — ${p.solution}`,
    },
  ];

  if (p.architecture) {
    children.push({
      path: `${base}/architecture.svg`,
      name: "architecture.svg",
      kind: "diagram",
      to: `${base}#architecture`,
      preview: p.architecture.summary,
    });
  }
  if (p.decisions?.length) {
    children.push({
      path: `${base}/decisions.md`,
      name: "decisions.md",
      kind: "md",
      to: `${base}#decisions`,
      preview: p.decisions.map((d) => `- ${d.title}`).join("\n"),
    });
  }
  children.push({
    path: `${base}/stack.json`,
    name: "stack.json",
    kind: "json",
    to: base,
    preview: JSON.stringify({ year: p.year, status: p.status, technologies: p.technologies }, null, 2),
  });

  return { path: base, name: p.id, kind: "dir", to: base, children };
}

export const fsTree: FsNode[] = [
  {
    path: "/about",
    name: "about",
    kind: "dir",
    to: "/about",
    children: [
      {
        path: "/about/summary.md",
        name: "summary.md",
        kind: "md",
        to: "/about",
        preview: portfolio.identity.summary,
      },
      {
        path: "/about/education.json",
        name: "education.json",
        kind: "json",
        to: "/about",
        preview: JSON.stringify(portfolio.education, null, 2),
      },
      {
        path: "/about/interests.json",
        name: "interests.json",
        kind: "json",
        to: "/about",
        preview: JSON.stringify(portfolio.identity.interests, null, 2),
      },
      {
        path: "/about/certifications.json",
        name: "certifications.json",
        kind: "json",
        to: "/about",
        preview: JSON.stringify(portfolio.certifications, null, 2),
      },
      {
        path: "/about/volunteering.json",
        name: "volunteering.json",
        kind: "json",
        to: "/about",
        preview: JSON.stringify(portfolio.volunteering, null, 2),
      },
    ],
  },
  {
    path: "/projects",
    name: "projects",
    kind: "dir",
    to: "/projects",
    children: portfolio.projects.map(projectDir),
  },
  {
    path: "/skills",
    name: "skills",
    kind: "dir",
    to: "/skills",
    children: portfolio.skills.map((c) => ({
      path: `/skills/${c.id}.json`,
      name: `${c.id}.json`,
      kind: "json" as const,
      to: "/skills",
      preview: JSON.stringify(c.items, null, 2),
    })),
  },
  {
    path: "/experience",
    name: "experience",
    kind: "dir",
    to: "/experience",
    children: portfolio.experience.map((e) => ({
      path: `/experience/${e.id}.log`,
      name: `${e.id}.log`,
      kind: "md" as const,
      to: "/experience",
      preview: `${e.role} — ${e.organization}\n${e.start} → ${e.end}\n\n${e.responsibilities.map((r) => `· ${r}`).join("\n")}`,
    })),
  },
  {
    path: "/status",
    name: "system",
    kind: "dir",
    to: "/status",
    children: [
      {
        path: "/status/github.live",
        name: "github.live",
        kind: "ts",
        to: "/status",
        preview: `Live read of github.com/${portfolio.github.username} via the public API.`,
      },
      {
        path: "/status/meta.json",
        name: "meta.json",
        kind: "json",
        to: "/status",
        preview: JSON.stringify(portfolio.meta, null, 2),
      },
    ],
  },
  {
    path: "/contact",
    name: "contact.json",
    kind: "json",
    to: "/contact",
    preview: JSON.stringify(
      portfolio.contact.map((c) => ({ [c.label]: c.value })),
      null,
      2,
    ),
  },
];

/** Depth-first flatten, respecting which directories are currently open. */
export function visibleNodes(nodes: FsNode[], open: Set<string>, depth = 0): { node: FsNode; depth: number }[] {
  const out: { node: FsNode; depth: number }[] = [];
  for (const node of nodes) {
    out.push({ node, depth });
    if (node.children && open.has(node.path)) {
      out.push(...visibleNodes(node.children, open, depth + 1));
    }
  }
  return out;
}
