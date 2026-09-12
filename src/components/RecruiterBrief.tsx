import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, MapPin, CircleDot, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";

/**
 * The recruiter's first screen: availability, location, headline experience and
 * the action they actually came for — email — without a scroll.
 */
export default function RecruiterBrief() {
  const [copied, setCopied] = useState(false);
  const email = portfolio.contact.find((c) => c.id === "email");
  const internships = portfolio.experience.filter((e) => e.type === "Internship");
  const degree = portfolio.education[0];

  async function copyEmail() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = email.href;
    }
  }

  return (
    <section aria-labelledby="brief-heading" className="glass-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="brief-heading" className="text-lg font-bold text-white">
          At a glance
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
          <CircleDot className="h-3 w-3" aria-hidden />
          {portfolio.identity.availability}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            <Briefcase className="h-3.5 w-3.5" aria-hidden /> Experience
          </dt>
          <dd className="mt-1 text-sm text-zinc-200">
            {internships.map((e) => e.organization).join(" · ")}
          </dd>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden /> Education
          </dt>
          <dd className="mt-1 text-sm text-zinc-200">
            {degree ? `${degree.qualification.split(",")[0]} · ${degree.year}` : "—"}
          </dd>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> Location
          </dt>
          <dd className="mt-1 text-sm text-zinc-200">{portfolio.identity.location}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {email && (
          <button type="button" onClick={() => void copyEmail()} className="btn-hud text-sm">
            {copied ? <Check className="h-4 w-4 text-emerald-400" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Email copied" : "Copy email"}
          </button>
        )}
        <Link to="/experience" className="btn-ghost text-sm">
          Career log <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </p>
    </section>
  );
}
