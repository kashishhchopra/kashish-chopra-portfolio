import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

/**
 * Page header. The eyebrow sits in a bracketed console tag, the title takes the
 * display gradient, and an accent rule closes the block — one consistent
 * opening gesture across every route.
 */
export default function SectionHeader({ eyebrow, title, children }: SectionHeaderProps) {
  return (
    <header className="mb-9">
      <p className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/[0.06] px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(56,189,248,0.9)]" aria-hidden />
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-secondary-soft">{eyebrow}</span>
      </p>

      <h1 className="text-display mt-4 text-3xl font-extrabold leading-[1.1] sm:text-[2.75rem]">{title}</h1>

      {children && <div className="mt-3 max-w-2xl leading-relaxed text-zinc-400">{children}</div>}

      <div className="rule-accent mt-6 w-full max-w-md" aria-hidden />
    </header>
  );
}
