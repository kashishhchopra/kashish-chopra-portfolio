import { portfolio } from "@/data/portfolio";
import { findNavByCommand, navItems } from "@/lib/nav";
import type { AudienceMode } from "@/ui-context";

/**
 * Portfolio Assistant engine.
 * ---------------------------
 * Answers strictly from local portfolio data (no invented facts). It is
 * "LLM-ready": if VITE_ASSISTANT_API_URL points at a SERVER-SIDE proxy, we send
 * the question + a compact context there. The proxy holds the secret key — no
 * API key ever lives in this frontend. If the API is absent or fails, we fall
 * back to the deterministic local responder below.
 *
 * Replies carry *actions*, not just prose: any answer implying a next step
 * ("open the case study", "copy her email") returns it as a button the
 * chat can execute, so the assistant does things rather than describing them.
 */

export type AssistantAction =
  | { kind: "navigate"; label: string; to: string }
  | { kind: "copy"; label: string; value: string }
  | { kind: "external"; label: string; href: string }
  | { kind: "ask"; label: string; question: string };

/** One prior turn, sent to the proxy so follow-up questions keep their thread. */
export interface AssistantTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantReply {
  text: string;
  actions?: AssistantAction[];
  source: "local" | "api";
}

/**
 * Same-origin serverless proxy by default (api/assistant.ts). The env var only
 * exists to point at a proxy hosted elsewhere; the secret key never ships here.
 */
const ASSISTANT_ENDPOINT = import.meta.env.VITE_ASSISTANT_API_URL || "/api/assistant";

/** Whether we're talking to our own function (probeable) or someone else's proxy. */
const USES_OWN_API = !import.meta.env.VITE_ASSISTANT_API_URL;

const p = portfolio;
const her = p.identity.pronounObject; // "her"
const she = p.identity.pronounSubject; // "she"

const email = p.contact.find((c) => c.id === "email");
const linkedin = p.contact.find((c) => c.id === "linkedin");
const githubLink = p.contact.find((c) => c.id === "github");

/**
 * Suggested prompts differ by audience — a recruiter and a developer open the
 * chat with different questions.
 */
export function suggestedQuestions(mode: AudienceMode = "recruiter"): string[] {
  return mode === "developer"
    ? [
        "How does the RAG assistant handle retrieval?",
        "Why reinforcement learning for TRAFFICIQ?",
        "What did she trade away on the proctoring system?",
        "Which projects use Python, and how?",
        "What went wrong on TRAFFICIQ, and how did she fix it?",
      ]
    : [
        "Tell me about Kashish.",
        "Is she available for opportunities?",
        "What are her strongest AI skills?",
        "Which project best shows her AI work?",
        "How can I contact her?",
      ];
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Data fields are written as complete sentences; drop the stop when inlining one mid-clause. */
function clause(s: string): string {
  return s.replace(/\.$/, "");
}

const CONTACT_ACTIONS: AssistantAction[] = [
  ...(email ? [{ kind: "copy" as const, label: "Copy email", value: email.value }] : []),
  { kind: "navigate", label: "Open contact terminal", to: "/contact" },
  ...(linkedin ? [{ kind: "external" as const, label: "LinkedIn", href: linkedin.href }] : []),
];

/**
 * Serialise the whole portfolio as a factual dossier for the LLM proxy.
 *
 * Depth is the point: the assistant can only answer an in-depth question if the
 * in-depth material is in front of it. Every project ships its problem, solution,
 * features, impact, full architecture (nodes, their detail text, and the edges
 * between them), every decision record with its rejected alternatives and stated
 * cost, the challenges and how they were approached, and the learnings. The
 * result is stable across requests, so it caches cleanly on the API side.
 */
export function buildContext(): string {
  const skills = p.skills
    .map((c) => `${c.label}: ${c.items.map((i) => `${i.name} (${i.level})`).join(", ")}`)
    .join("\n");

  const projects = p.projects
    .map((pr) => {
      const lines: string[] = [
        `### ${pr.name} (${pr.year}) — id: ${pr.id}`,
        `Tagline: ${pr.tagline}`,
        `Status: ${pr.status}${pr.role ? ` | Role: ${pr.role}` : ""}`,
        `Categories: ${pr.categories.join(", ")}`,
        `Problem: ${pr.problem}`,
        `Solution: ${pr.solution}`,
        `Technologies: ${pr.technologies.join(", ")}`,
        `Features: ${pr.features.join("; ")}`,
      ];
      if (pr.impact) lines.push(`Impact: ${pr.impact}`);

      if (pr.architecture) {
        const a = pr.architecture;
        lines.push(`Architecture summary: ${a.summary}`);
        lines.push(
          `Architecture components:\n${a.nodes
            .map((n) => `  - ${n.label} [${n.kind}]: ${n.detail}`)
            .join("\n")}`,
        );
        // Edges carry the actual data flow — without them the components are a list, not a system.
        const label = (id: string) => a.nodes.find((n) => n.id === id)?.label ?? id;
        lines.push(
          `Architecture data flow:\n${a.edges
            .map((e) => `  - ${label(e.from)} -> ${label(e.to)}${e.label ? ` (${e.label})` : ""}`)
            .join("\n")}`,
        );
      }

      if (pr.decisions?.length) {
        lines.push(
          `Engineering decisions:\n${pr.decisions
            .map(
              (d) =>
                `  - ${d.title}\n    Chose: ${d.choice}\n    Rejected: ${d.alternatives.join("; ")}\n    Why: ${d.rationale}\n    Trade-off: ${d.tradeoff}`,
            )
            .join("\n")}`,
        );
      }

      if (pr.challenges?.length) {
        lines.push(
          `Challenges:\n${pr.challenges.map((c) => `  - ${c.problem} -> ${c.approach}`).join("\n")}`,
        );
      }

      if (pr.learnings?.length) {
        lines.push(`Learnings:\n${pr.learnings.map((l) => `  - ${l}`).join("\n")}`);
      }

      const repos = pr.repos?.length
        ? pr.repos.map((r) => `${r.label}: ${r.url}`).join(", ")
        : pr.github ?? "";
      if (repos) lines.push(`Source: ${repos}`);
      if (pr.demo) lines.push(`Demo: ${pr.demo}`);
      lines.push(`Case study page: /projects/${pr.id}`);

      return lines.join("\n");
    })
    .join("\n\n");

  const experience = p.experience
    .map(
      (e) =>
        `- ${e.role}, ${e.organization} (${e.type}, ${e.start}–${e.end}${e.current ? ", current" : ""})\n` +
        `  Responsibilities: ${e.responsibilities.join("; ")}` +
        (e.tools?.length ? `\n  Tools: ${e.tools.join(", ")}` : ""),
    )
    .join("\n");

  const education = p.education
    .map(
      (e) =>
        `- ${e.qualification} — ${e.institution} (${e.year}, ${e.score}${e.location ? `, ${e.location}` : ""})` +
        (e.coursework?.length ? `\n  Coursework: ${e.coursework.join(", ")}` : ""),
    )
    .join("\n");

  return [
    `# ${p.identity.realName} — professional profile (site persona: ${p.identity.displayName})`,
    `Tagline: ${p.identity.tagline}`,
    `Roles: ${p.identity.roles.join(", ")}`,
    `Summary: ${p.identity.summary}`,
    `Interests: ${p.identity.interests.join(", ")}`,
    `Location: ${p.identity.location} (timezone ${p.meta.timezoneLabel})`,
    `Status: ${p.identity.currentStatus}`,
    `Availability: ${p.identity.availability}`,
    `Pronouns: ${p.identity.pronounSubject}/${p.identity.pronounObject}/${p.identity.pronounPossessive}`,
    ``,
    `## Education\n${education}`,
    ``,
    `## Technical skills (honest levels — Experienced / Working Knowledge / Familiar)\n${skills}`,
    ``,
    `## Professional skills\n${p.professionalSkills.join(", ")}`,
    ``,
    `## Projects (${p.projects.length})\n\n${projects}`,
    ``,
    `## Experience\n${experience}`,
    ``,
    `## Certifications\n${p.certifications
      .map((c) => `- ${c.name} (${c.authority})${c.url ? ` — verify: ${c.url}` : ""}`)
      .join("\n")}`,
    ``,
    `## Volunteering\n${p.volunteering
      .map((v) => `- ${v.role} at ${v.organization} — ${v.cause} (${v.period}${v.current ? ", current" : ""})`)
      .join("\n")}`,
    ``,
    `## Activities\n${p.activities.map((a) => `- ${a.title}: ${a.detail}`).join("\n")}`,
    ``,
    `## Currently learning\n${p.learning.join(", ")}`,
    `## Languages\n${p.languages.join(", ")}`,
    ``,
    `## Contact\n${p.contact.map((c) => `- ${c.label}: ${c.value} (${c.href})`).join("\n")}`,
    ``,
    `## Site map (pages you can point visitors to)`,
    ...navItems.map((n) => `- ${n.path} — ${n.label}: ${n.description}`),
    `- /projects/:id — a full case study per project, with an interactive architecture diagram and decision records`,
    `- /explorer — the portfolio browsable as a filesystem`,
  ].join("\n");
}

/**
 * The assistant answers on Kashish's behalf, so the prompt has to do two jobs at
 * once: authorise it to reason over the dossier (an in-depth question deserves a
 * synthesised answer, not a quote), and hold the line at the edge of the data
 * (speaking for someone means never inventing what they did).
 */
export const SYSTEM_PROMPT = `You are the portfolio assistant for ${p.identity.realName}, speaking on ${p.identity.pronounPossessive} behalf to recruiters, engineers and collaborators visiting ${p.identity.pronounPossessive} portfolio site.

The context below is ${p.identity.pronounPossessive} complete professional dossier: every project's problem and solution, its architecture down to each component and the data flow between them, the engineering decisions with what was rejected and what each choice cost, the challenges, the learnings, plus skills, experience, education and contact details.

How to answer:
- Reason over the dossier, don't recite it. Synthesise across projects, compare approaches, trace how a system actually works, explain why a decision was made and what it gave up. Depth is what visitors come for.
- Match the question. A quick factual question gets a couple of sentences; "how does the RAG assistant handle retrieval failures?" gets a real technical answer.
- Answer in third person about ${p.identity.pronounObject} ("${p.identity.pronounSubject} built...", "${p.identity.pronounPossessive} approach was..."), in ${p.identity.pronounPossessive} voice as ${p.identity.pronounPossessive} representative — never claim to be ${p.identity.realName}.
- Be concrete. Name the technologies, components and trade-offs from the dossier instead of speaking in generalities.
- You may draw reasonable technical inferences from what is in the dossier (why a vector store suits a grounding problem, what a trade-off implies) as long as you make clear it is your reading rather than something ${p.identity.pronounSubject} stated.
- Never invent facts about ${p.identity.pronounObject}: no employers, dates, metrics, titles, links or projects that aren't in the dossier. If something isn't there, say so plainly and point to the contact page.
- Point visitors at the right page when it helps — the case study, the architecture diagram, the skills matrix.
- Plain prose, no markdown headings or bullet lists. Keep it under ~180 words unless the question genuinely needs more.

CONTEXT
=======
`;

/** Finds a project the question is plainly about, by name or id. */
function matchProject(q: string) {
  return p.projects.find((pr) => {
    const words = [pr.name, pr.id, ...pr.name.split(/[\s—-]+/)]
      .map((w) => w.toLowerCase())
      .filter((w) => w.length > 4);
    return words.some((w) => q.includes(w));
  });
}

/** Finds a technology the question names, so "which projects use X" can answer. */
function matchTechnology(q: string): string | undefined {
  const all = [...new Set(p.projects.flatMap((pr) => pr.technologies))];
  // Longest first, so "Entity Framework Core" wins over a bare "C#".
  return all
    .slice()
    .sort((a, b) => b.length - a.length)
    .find((t) => q.includes(t.toLowerCase()));
}

/** Local, deterministic responder used as the default and as fallback. */
export function localReply(question: string): AssistantReply {
  const q = question.toLowerCase().trim();

  // Direct slash-commands or "open X" style routing.
  const nav = findNavByCommand(q.replace(/^open\s+|^show\s+|^go to\s+/, ""));
  if (q.startsWith("/") && nav) {
    return {
      text: `Opening ${nav.label} — ${nav.description}.`,
      actions: [{ kind: "navigate", label: `Open ${nav.label}`, to: nav.path }],
      source: "local",
    };
  }

  const has = (...terms: string[]) => terms.some((t) => q.includes(t));

  // Greetings
  if (has("hello", "hi ", "hey", "hi!", "hii") && q.length < 12) {
    return {
      text: `Hi! I'm the ${p.identity.displayName} assistant. Ask about ${her} skills, projects, experience or availability — I can also open any page for you directly.`,
      actions: [
        { kind: "ask", label: "Best projects", question: "Show me her best projects." },
        { kind: "ask", label: "Availability", question: "Is she available for opportunities?" },
      ],
      source: "local",
    };
  }

  // "Which projects use Python?" — a technology lookup across the portfolio.
  const tech = matchTechnology(q);
  if (tech && has("which project", "what project", "where", "used", "use ", "using", "built with")) {
    const users = p.projects.filter((pr) =>
      pr.technologies.some((t) => t.toLowerCase() === tech.toLowerCase()),
    );
    return {
      text: `${tech} appears in ${users.length} of ${her} ${p.projects.length} projects: ${users
        .map((pr) => `${pr.name.split(" — ")[0]} (${pr.year}, ${clause(pr.solution.split(". ")[0])})`)
        .join("; ")}.`,
      actions: users.slice(0, 3).map((pr) => ({
        kind: "navigate" as const,
        label: pr.name.split(" — ")[0],
        to: `/projects/${pr.id}`,
      })),
      source: "local",
    };
  }

  // A specific project. Which facet of it the question is about decides the
  // answer — "how does TRAFFICIQ work" and "why did she pick RL for TRAFFICIQ"
  // are different questions about the same project.
  const project = matchProject(q);
  if (project && !has("all project", "list project", "how many")) {
    const caseStudy = `/projects/${project.id}`;
    const shortName = project.name.split(" — ")[0];

    // How does it work / architecture.
    if (project.architecture && has("architecture", "how does", "how it work", "how does it work", "pipeline", "design", "flow", "component")) {
      const a = project.architecture;
      const label = (id: string) => a.nodes.find((n) => n.id === id)?.label ?? id;
      const path = a.edges
        .slice(0, 4)
        .map((e) => `${label(e.from)} → ${label(e.to)}${e.label ? ` (${e.label})` : ""}`)
        .join(", ");
      return {
        text: `${a.summary} The main path runs ${path}. Every component on the diagram is clickable and explains what it does and how it connects.`,
        actions: [
          { kind: "navigate", label: "Open the diagram", to: `${caseStudy}#architecture` },
          { kind: "navigate", label: `${shortName} case study`, to: caseStudy },
        ],
        source: "local",
      };
    }

    // Why / trade-offs — the decision records, stated with their cost.
    if (project.decisions?.length && has("why", "trade-off", "tradeoff", "trade off", "decision", "instead of", "chose", "choose", "rationale", "alternative")) {
      const d = project.decisions[0];
      return {
        text: `On ${shortName}, “${d.title}”: ${cap(she)} chose ${clause(d.choice)}, over ${d.alternatives.map(clause).join(" and ")}. ${d.rationale} The cost: ${d.tradeoff}${project.decisions.length > 1 ? ` The case study documents ${project.decisions.length} decisions in this form.` : ""}`,
        actions: [{ kind: "navigate", label: "Read the decision records", to: `${caseStudy}#decisions` }],
        source: "local",
      };
    }

    // What went wrong and how it was handled.
    if (project.challenges?.length && has("challenge", "problem", "went wrong", "difficult", "hard", "issue", "bug", "fail")) {
      const c = project.challenges[0];
      return {
        text: `On ${shortName}: ${c.problem} The fix: ${c.approach}${project.challenges.length > 1 ? ` The case study covers ${project.challenges.length} such problems.` : ""}`,
        actions: [{ kind: "navigate", label: `${shortName} case study`, to: caseStudy }],
        source: "local",
      };
    }

    // What it taught her.
    if (project.learnings?.length && has("learn", "teach", "taught", "takeaway", "lesson")) {
      return {
        text: `From ${shortName}: ${project.learnings.join(" ")}`,
        actions: [{ kind: "navigate", label: `${shortName} case study`, to: caseStudy }],
        source: "local",
      };
    }

    // Otherwise: the overview, with the problem it set out to solve.
    const decisionLine = project.decisions?.length
      ? ` Key engineering decisions include ${project.decisions
          .slice(0, 2)
          .map((d) => d.title.toLowerCase())
          .join(", and ")}.`
      : "";
    return {
      text: `${project.name} (${project.year}) — the problem: ${project.problem} ${project.solution}${decisionLine} Built with ${project.technologies.join(", ")}.`,
      actions: [
        { kind: "navigate", label: "Read the case study", to: caseStudy },
        ...(project.architecture
          ? [{ kind: "navigate" as const, label: "See the architecture", to: `${caseStudy}#architecture` }]
          : []),
        ...(project.decisions?.length
          ? [{ kind: "ask" as const, label: "Why those choices?", question: `Why did she make those decisions on ${shortName}?` }]
          : []),
      ],
      source: "local",
    };
  }

  // Architecture / how-it-works questions across the portfolio.
  if (has("architecture", "how does it work", "how it works", "diagram", "system design", "pipeline")) {
    const withDiagrams = p.projects.filter((pr) => pr.architecture);
    return {
      text: `${withDiagrams.length} projects have interactive architecture diagrams — every component is clickable and explains what it does and how it connects.`,
      actions: [
        { kind: "navigate", label: "Browse case studies", to: "/projects" },
        ...withDiagrams.slice(0, 2).map((pr) => ({
          kind: "navigate" as const,
          label: pr.name.split(" — ")[0],
          to: `/projects/${pr.id}#architecture`,
        })),
      ],
      source: "local",
    };
  }

  // Trade-offs / engineering judgement.
  if (has("trade-off", "tradeoff", "trade off", "decision", "why did she", "engineering choice", "rationale")) {
    const total = p.projects.reduce((n, pr) => n + (pr.decisions?.length ?? 0), 0);
    const first = p.projects[0];
    return {
      text: `Every case study documents its engineering decisions — ${total} in total — as what was chosen, what was rejected, why, and what the choice cost. For example, “${first.decisions?.[0]?.title}” on ${first.name}.`,
      actions: [
        { kind: "navigate", label: "Read the decision records", to: `/projects/${first.id}#decisions` },
        { kind: "navigate", label: "All projects", to: "/projects" },
      ],
      source: "local",
    };
  }

  // About / who
  if (has("about", "who is", "who's", "tell me about", "yourself", "background", "summary")) {
    return {
      text: p.identity.summary,
      actions: [{ kind: "navigate", label: "Open profile", to: "/about" }],
      source: "local",
    };
  }

  // Contact
  if (has("contact", "email", "reach", "get in touch", "hire", "connect", "linkedin", "message")) {
    return {
      text: `You can reach ${her} by email at ${email?.value ?? "the address on the contact page"}, or connect on LinkedIn. The contact terminal has every channel plus a message form.`,
      actions: CONTACT_ACTIONS,
      source: "local",
    };
  }

  // Skills / tech
  if (has("skill", "strongest", "good at", "technolog", "tech stack", "stack", "languages", "tools", "framework")) {
    const experienced = p.skills
      .flatMap((c) => c.items)
      .filter((i) => i.level === "Experienced")
      .map((i) => i.name);
    return {
      text: `${cap(she)} works across AI/ML, generative AI and full-stack development. Areas marked Experienced: ${experienced.join(", ")}. The matrix uses honest labels — Experienced, Working Knowledge, Familiar — rather than invented percentages.`,
      actions: [
        { kind: "navigate", label: "Open skills matrix", to: "/skills" },
        { kind: "ask", label: "Where has she used them?", question: "Show me her best projects." },
      ],
      source: "local",
    };
  }

  // Projects
  if (has("project", "best work", "built", "portfolio piece", "rag", "computer vision", "traffic", "proctoring", "ecommerce", "e-commerce")) {
    const list = p.projects.slice(0, 3).map((pr) => `${pr.name} (${pr.year})`).join("; ");
    return {
      text: `${cap(she)} has built ${p.projects.length} projects spanning RAG/GenAI, computer vision and web. Highlights: ${list}. Each has a full case study with an architecture diagram and the decisions behind it.`,
      actions: [
        { kind: "navigate", label: "Open project database", to: "/projects" },
        ...p.projects.slice(0, 2).map((pr) => ({
          kind: "navigate" as const,
          label: pr.name.split(" — ")[0],
          to: `/projects/${pr.id}`,
        })),
      ],
      source: "local",
    };
  }

  // Experience / internships
  if (has("experience", "intern", "work", "job", "hcl", "indian oil", "iocl", "career", "company")) {
    const intern = p.experience.filter((e) => e.type === "Internship");
    return {
      text: `${cap(she)} has interned as ${intern.map((e) => `${e.role} at ${e.organization} (${e.start}–${e.end})`).join(" and ")}, plus leadership roles at university clubs. The timeline shows every role as a filterable system log.`,
      actions: [{ kind: "navigate", label: "Open career log", to: "/experience" }],
      source: "local",
    };
  }

  // Certifications
  if (has("certification", "certificate", "certified", "azure", "hackathon", "sih", "ibm")) {
    return {
      text: `${cap(she)} holds: ${p.certifications.map((c) => `${c.name} (${c.authority})`).join("; ")}.`,
      actions: [{ kind: "navigate", label: "Open profile", to: "/about" }],
      source: "local",
    };
  }

  // Volunteering / community work
  if (has("volunteer", "ngo", "community", "social", "nss", "give back")) {
    return {
      text: `${cap(she)} volunteers with ${p.volunteering
        .map((v) => `${v.organization} (${v.cause}, ${v.period})`)
        .join("; ")}.`,
      actions: [{ kind: "navigate", label: "Open profile", to: "/about" }],
      source: "local",
    };
  }

  // Education
  if (has("education", "study", "college", "university", "degree", "cgpa", "subject", "elective", "coursework")) {
    return {
      text:
        p.education.map((e) => `${e.qualification} — ${e.institution} (${e.year}, ${e.score})`).join(". ") + ".",
      actions: [{ kind: "navigate", label: "Open profile", to: "/about" }],
      source: "local",
    };
  }

  // Availability — the question recruiters actually open with.
  if (has("available", "open to", "hiring", "opportunit", "looking for", "freelance", "notice", "join")) {
    return {
      text: `Status: ${p.identity.availability}. ${cap(she)} is ${p.identity.currentStatus}, based in ${p.identity.location}.`,
      actions: CONTACT_ACTIONS,
      source: "local",
    };
  }

  // Help
  if (has("help", "what can you", "commands", "how do i")) {
    return {
      text: `I answer from Kashish's profile data and can act on it: open any page, jump to a case study or architecture diagram, or copy ${her} email. Try “/projects”, “is she available?”, or “how does the RAG assistant work?”. Press ⌘K anywhere for the full command palette.`,
      actions: [
        { kind: "ask", label: "Availability", question: "Is she available for opportunities?" },
        { kind: "ask", label: "Best projects", question: "Show me her best projects." },
      ],
      source: "local",
    };
  }

  // Fallback
  return {
    text: `I don't have that in Kashish's profile data. I can help with ${her} skills, projects and their architectures, experience, education or contact details — or you can reach ${her} directly.`,
    actions: [
      { kind: "ask", label: "What can you do?", question: "What can you help with?" },
      ...(githubLink ? [{ kind: "external" as const, label: "GitHub", href: githubLink.href }] : []),
      { kind: "navigate", label: "Contact", to: "/contact" },
    ],
    source: "local",
  };
}

/**
 * Turn Claude's `suggest_actions` call into real buttons — and drop anything it
 * invented. The model proposes; the route table decides. A path that isn't a
 * real page never becomes a link, and the email address comes from the data
 * file rather than the model, so a button can't send a visitor to a wrong
 * address that looks plausible.
 */
const HASHES = new Set(["", "#architecture", "#decisions"]);

function knownPath(target: string): boolean {
  const hashAt = target.indexOf("#");
  const path = hashAt === -1 ? target : target.slice(0, hashAt);
  const hash = hashAt === -1 ? "" : target.slice(hashAt);
  if (!HASHES.has(hash)) return false;
  if (navItems.some((n) => n.path === path)) return true;
  if (path === "/explorer") return true;
  return p.projects.some((pr) => path === `/projects/${pr.id}`);
}

interface RawAction {
  kind?: unknown;
  label?: unknown;
  target?: unknown;
}

export function toAssistantActions(raw: unknown): AssistantAction[] {
  if (!Array.isArray(raw)) return [];
  const out: AssistantAction[] = [];

  // Validate everything first, then cap: a target the model got wrong should
  // not cost a slot that a good one could have used.
  for (const item of raw.slice(0, 8)) {
    const { kind, label, target } = item as RawAction;
    if (typeof label !== "string" || !label.trim()) continue;
    const text = label.trim().slice(0, 40);

    if (kind === "navigate" && typeof target === "string" && knownPath(target)) {
      out.push({ kind: "navigate", label: text, to: target });
    } else if (kind === "ask" && typeof target === "string" && target.trim()) {
      out.push({ kind: "ask", label: text, question: target.trim().slice(0, 200) });
    } else if (kind === "email" && email) {
      // The address is ours, not the model's.
      out.push({ kind: "copy", label: text, value: email.value });
    }
  }

  // Two buttons pointing at the same place is noise.
  const seen = new Set<string>();
  return out
    .filter((a) => {
      const target =
        a.kind === "navigate" ? a.to : a.kind === "copy" ? a.value : a.kind === "ask" ? a.question : a.href;
      const key = `${a.kind}:${target}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);
}

/**
 * Public entry point. Asks the server-side LLM proxy first; if the proxy is
 * absent, unconfigured or failing, falls back to the deterministic local
 * responder. The visitor always gets an answer.
 */
export async function askAssistant(
  question: string,
  history: AssistantTurn[] = [],
  options: { onDelta?: (chunk: string) => void } = {},
): Promise<AssistantReply> {
  // Slash commands always route locally & instantly.
  if (question.trim().startsWith("/")) return localReply(question);

  // Don't upload the dossier just to be told the key isn't set, and don't
  // re-attempt an endpoint that already failed this session.
  if (apiFailed) return localReply(question);
  if (!(await assistantConfigured())) return localReply(question);

  let text = "";
  let actions: AssistantAction[] | undefined;

  try {
    const res = await fetch(ASSISTANT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: SYSTEM_PROMPT,
        context: buildContext(),
        question,
        // Recent turns only — enough for follow-ups ("what about the other one?")
        // without resending an unbounded transcript.
        history: history.slice(-8),
      }),
    });
    if (!res.ok || !res.body) throw new Error(`Assistant responded ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // NDJSON: one JSON event per line. A chunk can split a line in half, so
    // hold the remainder back until its newline arrives.
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;
        let event: { type?: string; text?: string; actions?: unknown; error?: string };
        try {
          event = JSON.parse(line);
        } catch {
          continue; // A malformed line shouldn't kill a good answer.
        }

        if (event.type === "text" && event.text) {
          text += event.text;
          options.onDelta?.(event.text);
        } else if (event.type === "actions") {
          actions = toAssistantActions(event.actions);
        } else if (event.type === "error") {
          throw new Error(event.error ?? "Assistant error");
        }
      }
    }

    if (text.trim()) {
      return { text: text.trim(), actions: actions?.length ? actions : undefined, source: "api" };
    }
    apiFailed = true; // Reached the endpoint but got no answer out of it.
  } catch {
    apiFailed = true;
    // If the stream died after the visitor already saw part of an answer,
    // keep it — swapping it for a different local answer mid-read is worse
    // than an answer that stops short.
    if (text.trim()) {
      return { text: text.trim(), actions: actions?.length ? actions : undefined, source: "api" };
    }
  }

  return localReply(question);
}

/**
 * Is the LLM proxy live? The chat uses this to describe itself accurately
 * ("answers reasoned from her profile" vs the offline fallback) rather than
 * claiming intelligence it doesn't currently have. Cached for the session.
 */
let statusPromise: Promise<boolean> | null = null;

/**
 * Set once the proxy has actually failed a question — a missing key, an unpaid
 * account, an outage. `configured: true` only means a key is present, not that
 * a call will succeed, and without this every later question would spend a
 * multi-second round trip discovering the same failure before falling back.
 * Cleared by a page reload, so a transient blip costs one session, not forever.
 */
let apiFailed = false;

/** Has a live answer actually been served this session? */
export function assistantLive(): boolean {
  return !apiFailed;
}

export function assistantConfigured(): Promise<boolean> {
  // A third-party proxy is assumed live — it owes us no GET handler, and
  // probing one would wrongly rule out a working endpoint.
  if (!USES_OWN_API) return Promise.resolve(true);

  statusPromise ??= fetch(ASSISTANT_ENDPOINT, { method: "GET" })
    .then((res) => (res.ok ? (res.json() as Promise<{ configured?: boolean }>) : { configured: false }))
    .then((data) => !!data.configured)
    .catch(() => false);
  return statusPromise;
}
