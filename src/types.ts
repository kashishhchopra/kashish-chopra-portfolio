// Shared types for the KASHISH'S AI portfolio's data model.

export type Proficiency = "Experienced" | "Working Knowledge" | "Familiar";

export interface SkillItem {
  name: string;
  level: Proficiency;
}

export interface SkillCategory {
  id: string;
  label: string;
  items: SkillItem[];
}

export type ProjectCategory =
  | "AI/ML"
  | "Generative AI"
  | "RAG"
  | "Computer Vision"
  | "Web Development"
  | "IoT";

/** Node roles in a project architecture diagram — drives shape and colour. */
export type ArchNodeKind =
  | "input"
  | "process"
  | "model"
  | "store"
  | "output"
  | "external";

export interface ArchNode {
  id: string;
  label: string;
  kind: ArchNodeKind;
  /** Shown when the node is hovered, focused or selected. */
  detail: string;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

/**
 * A project's architecture, expressed as a small directed graph.
 * `columns` fixes the left-to-right layout so diagrams stay readable
 * without a layout engine.
 */
export interface Architecture {
  summary: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  /** Node ids grouped into left-to-right columns. */
  columns: string[][];
}

/** An architecture decision record: what was chosen, and what it cost. */
export interface EngineeringDecision {
  id: string;
  title: string;
  /** The option that was taken. */
  choice: string;
  /** Options considered and set aside. */
  alternatives: string[];
  /** Why the choice won. */
  rationale: string;
  /** What the choice gives up — every decision has a cost. */
  tradeoff: string;
}

/** One source repository. Projects split across repos list several. */
export interface ProjectRepo {
  /** Short name shown on the button, e.g. "Full-scale" or "Lite". */
  label: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  /** One-line summary used in cards, palette results and case-study heros. */
  tagline: string;
  year: string;
  categories: ProjectCategory[];
  problem: string;
  solution: string;
  technologies: string[];
  features: string[];
  impact?: string;
  /** Single-repo projects. For projects split across repos, use `repos`. */
  github?: string;
  /** Several source repos, rendered as one labelled button each. */
  repos?: ProjectRepo[];
  demo?: string;
  status: "Completed" | "In Progress" | "Prototype";
  /** Case-study material. */
  role?: string;
  architecture?: Architecture;
  decisions?: EngineeringDecision[];
  challenges?: { problem: string; approach: string }[];
  learnings?: string[];
}

export interface ExperienceItem {
  id: string;
  type: "Internship" | "Leadership";
  role: string;
  organization: string;
  start: string;
  end: string;
  current?: boolean;
  responsibilities: string[];
  tools?: string[];
}

export interface EducationItem {
  institution: string;
  qualification: string;
  score: string;
  year: string;
  location?: string;
  /** Subjects and electives taken, as listed on the resume. */
  coursework?: string[];
}

export interface Certification {
  name: string;
  authority: string;
  /** Public verification page for the credential. Renders a "Verify" link when set. */
  url?: string;
}

export interface VolunteerRole {
  organization: string;
  role: string;
  cause: string;
  period: string;
  current?: boolean;
}

export interface Activity {
  title: string;
  detail: string;
}

export interface ContactLink {
  id: string;
  label: string;
  value: string;
  href: string;
}

export interface PortfolioData {
  identity: {
    displayName: string;
    realName: string;
    tagline: string;
    roles: string[];
    summary: string;
    interests: string[];
    location: string;
    currentStatus: string;
    availability: string;
    pronounSubject: string;
    pronounObject: string;
    pronounPossessive: string;
  };
  photo: string;
  resume: {
    file: string;
    lastUpdated: string;
  };
  github: {
    username: string;
    profileUrl: string;
  };
  contact: ContactLink[];
  education: EducationItem[];
  skills: SkillCategory[];
  professionalSkills: string[];
  projects: Project[];
  experience: ExperienceItem[];
  certifications: Certification[];
  volunteering: VolunteerRole[];
  activities: Activity[];
  languages: string[];
  learning: string[];
  meta: {
    version: string;
    timezone: string;
    timezoneLabel: string;
  };
}
