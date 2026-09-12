import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpRight, Wrench } from "lucide-react";
import { buildLog, streamLabels, type LogEntry, type LogLevel, type LogStream } from "@/lib/log";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Career history as a system log: one chronological stream of education,
 * internships, leadership roles and project deployments, filterable by source
 * and expandable per entry.
 */

/**
 * Four streams, four distinguishable markers. Education and projects sit on
 * the two ends of the blue ramp (accent vs secondary) rather than sharing one
 * colour — the filter legend is only useful if the dots differ.
 */
const levelStyle: Record<LogLevel, string> = {
  BOOT: "border-accent/40 bg-accent/10 text-accent-soft",
  RUN: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  DEPLOY: "border-secondary/40 bg-secondary/10 text-secondary-soft",
  TASK: "border-amber-400/40 bg-amber-400/10 text-amber-300",
};

const railColor: Record<LogStream, string> = {
  education: "bg-accent",
  internship: "bg-emerald-400",
  project: "bg-secondary",
  leadership: "bg-amber-400",
};

const ALL = "all" as const;

export default function SystemLogTimeline() {
  const reduced = useReducedMotion();
  const entries = useMemo(() => buildLog(), []);
  const [filter, setFilter] = useState<LogStream | typeof ALL>(ALL);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const streams = useMemo(() => {
    const present = new Set(entries.map((e) => e.stream));
    return (Object.keys(streamLabels) as LogStream[]).filter((s) => present.has(s));
  }, [entries]);

  const visible = filter === ALL ? entries : entries.filter((e) => e.stream === filter);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter(ALL)}
          aria-pressed={filter === ALL}
          className={[
            "rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
            filter === ALL
              ? "border-secondary/50 bg-secondary/15 text-secondary-soft"
              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/25 hover:text-zinc-200",
          ].join(" ")}
        >
          all streams <span className="ml-1 text-zinc-500">{entries.length}</span>
        </button>
        {streams.map((s) => {
          const count = entries.filter((e) => e.stream === s).length;
          const active = filter === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              aria-pressed={active}
              className={[
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                active
                  ? "border-secondary/50 bg-secondary/15 text-secondary-soft"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/25 hover:text-zinc-200",
              ].join(" ")}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${railColor[s]}`} aria-hidden />
              {streamLabels[s].toLowerCase()}
              <span className="text-zinc-500">{count}</span>
            </button>
          );
        })}
      </div>

      <ol className="relative space-y-2 border-l border-white/10 pl-0">
        {visible.map((entry, i) => (
          <LogRow
            key={entry.id}
            entry={entry}
            index={i}
            reduced={reduced}
            open={expanded.has(entry.id)}
            onToggle={() => toggle(entry.id)}
          />
        ))}
      </ol>

      {visible.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-zinc-400">
          No entries in this stream.
        </p>
      )}
    </div>
  );
}

function LogRow({
  entry,
  index,
  reduced,
  open,
  onToggle,
}: {
  entry: LogEntry;
  index: number;
  reduced: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `log-detail-${entry.id}`;

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: reduced ? 0 : Math.min(index * 0.035, 0.4) }}
      className="relative"
    >
      {/* Stream marker on the rail. */}
      <span
        className={`absolute -left-[5px] top-4 h-2 w-2 rounded-full ring-4 ring-void ${railColor[entry.stream]}`}
        aria-hidden
      />

      <div className="ml-5 rounded-xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-start gap-3 px-3 py-2.5 text-left sm:px-4"
        >
          <ChevronRight
            className={`mt-1 h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-90" : ""}`}
            aria-hidden
          />

          <span className="w-[8.5rem] shrink-0 pt-0.5 font-mono text-[11px] text-zinc-500 max-sm:hidden">
            {entry.time}
          </span>

          <span
            className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-wider ${levelStyle[entry.level]}`}
          >
            {entry.level}
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-zinc-100">{entry.title}</span>
              {entry.live && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden />
                  active
                </span>
              )}
            </span>
            <span className="mt-0.5 block truncate text-xs text-zinc-400">{entry.subtitle}</span>
            <span className="mt-0.5 block font-mono text-[10px] text-zinc-500 sm:hidden">{entry.time}</span>
          </span>
        </button>

        {open && (
          <div id={panelId} className="border-t border-white/10 px-3 py-3 sm:px-4 sm:pl-[11.5rem]">
            <ul className="space-y-1.5">
              {entry.detail.map((d) => (
                <li key={d} className="flex gap-2 text-sm text-zinc-300">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary/70" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>

            {entry.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
                {entry.tags.map((t) => (
                  <span key={t} className="chip !py-0.5 !text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {entry.to && (
              <Link
                to={entry.to}
                className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-secondary-soft hover:underline"
              >
                open module <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.li>
  );
}
