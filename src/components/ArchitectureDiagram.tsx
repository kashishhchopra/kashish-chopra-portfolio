import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import type { Architecture, ArchNode, ArchNodeKind } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Interactive architecture diagram.
 *
 * Layout is deterministic: `architecture.columns` fixes the left-to-right
 * order, so the SVG needs no layout engine and every diagram in the site reads
 * the same way. Nodes are real buttons — hover, focus and click all highlight
 * the node with its incoming and outgoing edges, and the detail panel below
 * carries the same information for anyone not using a pointer.
 */

const NODE_W = 148;
const NODE_H = 62;
/** Wide enough that an edge label sits in clear space, not on a node edge. */
const COL_GAP = 96;
const ROW_GAP = 30;
const PAD = 16;

/**
 * Node kinds are categorical data, so these six must stay tellable apart —
 * the brand's two blues alone can't carry six categories. The pipeline kinds
 * use the palette (sky → blue → indigo), and the three that carry meaning
 * beyond the pipeline keep functional hues: neutral for plumbing, green for
 * results, amber for anything outside the system's control.
 *
 * Every `text` value clears 4.5:1 on the #09090B background.
 */
const kindStyle: Record<ArchNodeKind, { fill: string; stroke: string; text: string; label: string }> = {
  input: { fill: "rgba(56,189,248,0.12)", stroke: "rgba(56,189,248,0.55)", text: "#7DD3FC", label: "Input" },
  process: { fill: "rgba(161,161,170,0.10)", stroke: "rgba(161,161,170,0.45)", text: "#E4E4E7", label: "Process" },
  model: { fill: "rgba(37,99,235,0.18)", stroke: "rgba(37,99,235,0.70)", text: "#93C5FD", label: "Model" },
  store: { fill: "rgba(99,102,241,0.14)", stroke: "rgba(99,102,241,0.55)", text: "#A5B4FC", label: "Store" },
  output: { fill: "rgba(16,185,129,0.12)", stroke: "rgba(16,185,129,0.55)", text: "#6EE7B7", label: "Output" },
  external: { fill: "rgba(245,158,11,0.12)", stroke: "rgba(245,158,11,0.55)", text: "#FCD34D", label: "External" },
};

interface Placed {
  node: ArchNode;
  x: number;
  y: number;
  col: number;
}

/** Wraps a label onto at most three lines that fit the node box. */
function wrap(label: string, max = 18): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (!line) line = w;
    else if ((line + " " + w).length <= max) line += " " + w;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

export default function ArchitectureDiagram({
  architecture,
  title,
}: {
  architecture: Architecture;
  title: string;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const current = pinned ?? active;

  const { placed, width, height, byId } = useMemo(() => {
    const map = new Map<string, ArchNode>(architecture.nodes.map((n) => [n.id, n]));
    const tallest = Math.max(...architecture.columns.map((c) => c.length));
    const h = PAD * 2 + tallest * NODE_H + (tallest - 1) * ROW_GAP;
    const items: Placed[] = [];

    architecture.columns.forEach((col, ci) => {
      const colHeight = col.length * NODE_H + (col.length - 1) * ROW_GAP;
      const startY = (h - colHeight) / 2;
      col.forEach((id, ri) => {
        const node = map.get(id);
        if (!node) return;
        items.push({
          node,
          x: PAD + ci * (NODE_W + COL_GAP),
          y: startY + ri * (NODE_H + ROW_GAP),
          col: ci,
        });
      });
    });

    return {
      placed: items,
      width: PAD * 2 + architecture.columns.length * NODE_W + (architecture.columns.length - 1) * COL_GAP,
      height: h,
      byId: new Map(items.map((p) => [p.node.id, p])),
    };
  }, [architecture]);

  const edges = useMemo(
    () =>
      architecture.edges
        .map((e) => {
          const from = byId.get(e.from);
          const to = byId.get(e.to);
          if (!from || !to) return null;
          const backward = to.col <= from.col;

          // Forward edges leave the right face and enter the left face.
          // Backward edges (feedback loops, responses) dip below the row so
          // they never sit on top of the forward path.
          const x1 = backward ? from.x + NODE_W / 2 : from.x + NODE_W;
          const y1 = backward ? from.y + NODE_H : from.y + NODE_H / 2;
          const x2 = backward ? to.x + NODE_W / 2 : to.x;
          const y2 = backward ? to.y + NODE_H : to.y + NODE_H / 2;

          const dip = height - Math.max(y1, y2) + 4;
          const d = backward
            ? `M ${x1} ${y1} C ${x1} ${y1 + dip}, ${x2} ${y2 + dip}, ${x2} ${y2}`
            : `M ${x1} ${y1} C ${x1 + COL_GAP * 0.6} ${y1}, ${x2 - COL_GAP * 0.6} ${y2}, ${x2} ${y2}`;

          const mid = backward
            ? { x: (x1 + x2) / 2, y: Math.max(y1, y2) + dip * 0.72 }
            : { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 6 };

          return { ...e, d, mid, backward };
        })
        .filter((e): e is NonNullable<typeof e> => e !== null),
    [architecture.edges, byId, height],
  );

  const connected = useMemo(() => {
    if (!current) return null;
    const ids = new Set<string>([current]);
    architecture.edges.forEach((e) => {
      if (e.from === current) ids.add(e.to);
      if (e.to === current) ids.add(e.from);
    });
    return ids;
  }, [current, architecture.edges]);

  const selected = current ? architecture.nodes.find((n) => n.id === current) : null;
  const usedKinds = [...new Set(architecture.nodes.map((n) => n.kind))];

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-secondary/80">System architecture</h3>
          <p className="mt-1 max-w-2xl text-sm text-zinc-300">{architecture.summary}</p>
        </div>
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
          {usedKinds.map((k) => (
            <li key={k} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: kindStyle[k].fill, border: `1px solid ${kindStyle[k].stroke}` }}
                aria-hidden
              />
              {kindStyle[k].label}
            </li>
          ))}
        </ul>
      </div>

      {/* The SVG scrolls horizontally on small screens rather than shrinking
          text below a readable size. */}
      <div className="overflow-x-auto px-4 py-5 sm:px-5">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={`Architecture diagram for ${title}. ${architecture.summary}`}
          className="max-w-full"
          style={{ minWidth: Math.min(width, 560) }}
        >
          <defs>
            <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 7 4 L 0 7 z" fill="rgba(161,161,170,0.85)" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 7 4 L 0 7 z" fill="#38BDF8" />
            </marker>
          </defs>

          {/* Edges first so nodes always sit above them. */}
          <g>
            {edges.map((e, i) => {
              const isActive = !!current && (e.from === current || e.to === current);
              const dim = !!current && !isActive;
              return (
                <g key={`${e.from}-${e.to}-${i}`} opacity={dim ? 0.2 : 1} className={reduced ? "" : "transition-opacity duration-200"}>
                  <path
                    d={e.d}
                    fill="none"
                    stroke={isActive ? "#38BDF8" : "rgba(161,161,170,0.5)"}
                    strokeWidth={isActive ? 2 : 1.25}
                    strokeDasharray={e.backward ? "5 4" : undefined}
                    markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"}
                  />
                  {e.label && (
                    <text
                      x={e.mid.x}
                      y={e.mid.y}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="9"
                      fill={isActive ? "#7DD3FC" : "rgba(161,161,170,0.9)"}
                    >
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {placed.map(({ node, x, y }) => {
            const style = kindStyle[node.kind];
            const isCurrent = current === node.id;
            const dim = !!connected && !connected.has(node.id);
            const lines = wrap(node.label);
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-pressed={pinned === node.id}
                aria-label={`${node.label} — ${style.label}. ${node.detail}`}
                className="cursor-pointer focus:outline-none"
                opacity={dim ? 0.3 : 1}
                onMouseEnter={() => setActive(node.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(node.id)}
                onBlur={() => setActive(null)}
                onClick={() => setPinned((p) => (p === node.id ? null : node.id))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPinned((p) => (p === node.id ? null : node.id));
                  }
                }}
              >
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  fill={style.fill}
                  stroke={isCurrent ? "#38BDF8" : style.stroke}
                  strokeWidth={isCurrent ? 2 : 1}
                />
                {/* Kind is encoded by colour and by this stripe, so the diagram
                    does not rely on colour alone. */}
                <rect x={x} y={y} width={4} height={NODE_H} rx={2} fill={style.stroke} />
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={x + NODE_W / 2 + 2}
                    y={y + NODE_H / 2 - (lines.length - 1) * 7 + li * 14 + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill={style.text}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel — the same content the SVG exposes via aria-label, in a
          form that survives on touch devices where hover doesn't exist. */}
      <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3 sm:px-5">
        {selected ? (
          <div>
            <p className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white">{selected.label}</span>
              <span
                className="chip !px-2 !py-0.5 !text-[10px] uppercase tracking-wider"
                style={{ color: kindStyle[selected.kind].text, borderColor: kindStyle[selected.kind].stroke }}
              >
                {kindStyle[selected.kind].label}
              </span>
              {pinned && <span className="font-mono text-[10px] text-zinc-500">pinned — click again to release</span>}
            </p>
            <p className="mt-1 text-sm text-zinc-300">{selected.detail}</p>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <Info className="h-4 w-4 shrink-0 text-secondary/70" aria-hidden />
            Hover, tab to or tap any component to see what it does and how it connects.
          </p>
        )}
      </div>
    </div>
  );
}
