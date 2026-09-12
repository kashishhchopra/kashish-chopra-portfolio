import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  FileJson,
  FileCode2,
  Network,
  FileType2,
  CornerDownLeft,
} from "lucide-react";
import { fsTree, visibleNodes, type FsNode } from "@/lib/fs-tree";
import { portfolio } from "@/data/portfolio";

/**
 * Filesystem-style navigation over the portfolio.
 *
 * Follows the ARIA tree pattern: one tab stop for the whole tree, with
 * Up/Down moving between visible rows, Right/Left opening and closing
 * directories, and Enter opening the route a node maps to.
 */

const icons: Record<FsNode["kind"], typeof Folder> = {
  dir: Folder,
  md: FileText,
  json: FileJson,
  ts: FileCode2,
  diagram: Network,
  pdf: FileType2,
};

export default function FileExplorer({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState<Set<string>>(() => new Set(["/projects"]));
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<FsNode | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => visibleNodes(fsTree, open), [open]);
  const activeRow = rows[Math.min(cursor, rows.length - 1)];

  function toggle(node: FsNode) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(node.path)) next.delete(node.path);
      else next.add(node.path);
      return next;
    });
  }

  function activate(node: FsNode) {
    setSelected(node);
    if (node.children) toggle(node);
    else if (node.to) navigate(node.to);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const node = activeRow?.node;
    if (!node) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setCursor((c) => Math.min(rows.length - 1, c + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setCursor((c) => Math.max(0, c - 1));
        break;
      case "ArrowRight":
        e.preventDefault();
        if (node.children && !open.has(node.path)) toggle(node);
        else if (node.children) setCursor((c) => Math.min(rows.length - 1, c + 1));
        break;
      case "ArrowLeft": {
        e.preventDefault();
        if (node.children && open.has(node.path)) {
          toggle(node);
          break;
        }
        // Jump to the parent row.
        const parentDepth = activeRow.depth - 1;
        for (let i = cursor - 1; i >= 0; i--) {
          if (rows[i].depth === parentDepth) {
            setCursor(i);
            break;
          }
        }
        break;
      }
      case "Home":
        e.preventDefault();
        setCursor(0);
        break;
      case "End":
        e.preventDefault();
        setCursor(rows.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        activate(node);
        break;
    }
  }

  const preview = selected ?? activeRow?.node ?? null;

  return (
    <div className={`grid gap-4 ${compact ? "" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"}`}>
      <div className="glass-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <p className="font-mono text-xs text-secondary/80">~/{portfolio.identity.displayName.toLowerCase().replace(/\s+/g, "-")}</p>
          <p className="hidden font-mono text-[10px] text-zinc-500 sm:block">↑↓ move · → open · ⏎ go</p>
        </div>

        <div
          ref={treeRef}
          role="tree"
          aria-label="Portfolio file explorer"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="max-h-[26rem] overflow-y-auto py-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-secondary/60"
        >
          {rows.map(({ node, depth }, i) => {
            const isDir = !!node.children;
            const isOpen = open.has(node.path);
            const Icon = isDir ? (isOpen ? FolderOpen : Folder) : icons[node.kind];
            const isCursor = i === cursor;
            return (
              <div
                key={node.path}
                role="treeitem"
                aria-level={depth + 1}
                aria-expanded={isDir ? isOpen : undefined}
                aria-selected={isCursor}
                onClick={() => {
                  setCursor(i);
                  activate(node);
                }}
                onMouseEnter={() => setCursor(i)}
                style={{ paddingLeft: `${0.75 + depth * 1.1}rem` }}
                className={[
                  "flex cursor-pointer items-center gap-2 py-1.5 pr-3 font-mono text-xs transition-colors",
                  isCursor ? "bg-secondary/10 text-secondary-soft" : "text-zinc-300 hover:bg-white/5",
                ].join(" ")}
              >
                {isDir ? (
                  <ChevronRight
                    className={`h-3 w-3 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    aria-hidden
                  />
                ) : (
                  <span className="w-3 shrink-0" aria-hidden />
                )}
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isDir ? "text-accent" : "text-zinc-500"}`} aria-hidden />
                <span className="truncate">{node.name}</span>
                {isDir && <span className="ml-auto text-[10px] text-zinc-500">{node.children!.length}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel flex flex-col overflow-hidden">
        <div className="border-b border-white/10 px-4 py-2.5">
          <p className="truncate font-mono text-xs text-zinc-400">{preview ? preview.path : "no selection"}</p>
        </div>
        <div className="flex-1 overflow-auto px-4 py-3">
          {preview?.preview ? (
            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-zinc-300">
              {preview.preview}
            </pre>
          ) : (
            <p className="font-mono text-xs text-zinc-500">
              {preview?.children ? `${preview.children.length} entries — press → to expand.` : "Select a file to preview it."}
            </p>
          )}
        </div>
        {preview?.to && !preview.children && (
          <div className="border-t border-white/10 px-4 py-2.5">
            <button type="button" onClick={() => navigate(preview.to!)} className="btn-hud !py-1.5 text-xs">
              <CornerDownLeft className="h-3.5 w-3.5" aria-hidden /> Open {preview.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
