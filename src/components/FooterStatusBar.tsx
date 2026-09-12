import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleDot, Clock, RotateCcw, Github, Linkedin } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { useUI } from "@/ui-context";

/** Persistent HUD-style status bar at the foot of every page. */
export default function FooterStatusBar() {
  const { replayBoot } = useUI();
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone: portfolio.meta.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  const gh = portfolio.contact.find((c) => c.id === "github")?.href;
  const li = portfolio.contact.find((c) => c.id === "linkedin")?.href;

  return (
    <footer className="relative mt-16 border-t border-white/[0.07] bg-void/70">
      {/* Accent hairline closing the page, mirroring the one that opens it. */}
      <div className="absolute inset-x-0 top-0 h-px bg-accent-line opacity-40" aria-hidden />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 font-mono text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <CircleDot className="h-3.5 w-3.5" aria-hidden /> SYSTEM ONLINE
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {time} {portfolio.meta.timezoneLabel}
          </span>
          <span>{portfolio.meta.version}</span>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={replayBoot} className="inline-flex items-center gap-1.5 hover:text-secondary-soft">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Replay boot
          </button>
          {gh && (
            <a href={gh} target="_blank" rel="noreferrer" className="hover:text-secondary-soft" aria-label="GitHub">
              <Github className="h-4 w-4" aria-hidden />
            </a>
          )}
          {li && (
            <a href={li} target="_blank" rel="noreferrer" className="hover:text-secondary-soft" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" aria-hidden />
            </a>
          )}
          <Link to="/status" className="hover:text-secondary-soft">
            /status
          </Link>
        </div>
      </div>
    </footer>
  );
}
