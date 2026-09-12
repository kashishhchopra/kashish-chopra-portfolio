import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import Seo from "@/components/Seo";
import { navItems } from "@/lib/nav";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Module Not Found" description="The requested module could not be located." />
      <div className="mx-auto max-w-xl py-10 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl border border-rose-400/40 bg-rose-400/10 shadow-glow">
          <AlertTriangle className="h-9 w-9 text-rose-300" aria-hidden />
        </div>
        <p className="section-eyebrow text-rose-300/80">Error 404</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          SYSTEM MODULE NOT FOUND
        </h1>
        <p className="mx-auto mt-3 max-w-md font-mono text-sm text-zinc-400">
          &gt; The requested module could not be located in KASHISH'S AI. It may have been
          moved, renamed, or never initialized.
        </p>

        <div className="mt-6 flex justify-center">
          <Link to="/" className="btn-hud">
            <Home className="h-4 w-4" aria-hidden /> Return to Command Center
          </Link>
        </div>

        <div className="mt-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-secondary/70">Available modules</p>
          <div className="flex flex-wrap justify-center gap-2">
            {navItems
              .filter((n) => n.path !== "/")
              .map((n) => (
                <Link
                  key={n.command}
                  to={n.path}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-zinc-300 hover:border-secondary/40 hover:text-secondary-soft"
                >
                  {n.command}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
