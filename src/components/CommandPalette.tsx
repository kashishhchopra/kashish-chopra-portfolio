import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { commands, searchCommands, type Command, type CommandGroup } from "@/lib/commands";
import { useUI } from "@/ui-context";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Command palette (⌘K / Ctrl+K).
 *
 * Implements the combobox pattern: the input keeps focus and owns the
 * keyboard, the list is a listbox, and `aria-activedescendant` points at the
 * highlighted option so screen readers follow arrow keys without focus moving.
 */

const GROUP_ORDER: CommandGroup[] = ["Actions", "Navigate", "Case studies", "Mode", "External"];

export default function CommandPalette() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { paletteOpen, closePalette, openPalette, paletteQuery, setMode, replayBoot, openAssistant } = useUI();

  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  /** Element focused before opening, so focus can be handed back on close. */
  const restoreRef = useRef<HTMLElement | null>(null);

  // Global shortcut. ⌘K on macOS, Ctrl+K elsewhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (paletteOpen) closePalette();
        else openPalette();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, openPalette, closePalette]);

  useEffect(() => {
    if (paletteOpen) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      setQuery(paletteQuery);
      setIndex(0);
      // Focus after the panel mounts.
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      restoreRef.current?.focus?.();
      setToast(null);
    }
  }, [paletteOpen, paletteQuery]);

  const results = useMemo(() => searchCommands(query, commands), [query]);

  // Grouped for display, but the flat `results` order drives keyboard selection.
  const grouped = useMemo(() => {
    const map = new Map<CommandGroup, { command: Command; flatIndex: number }[]>();
    results.forEach((command, flatIndex) => {
      const list = map.get(command.group) ?? [];
      list.push({ command, flatIndex });
      map.set(command.group, list);
    });
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({ group: g, items: map.get(g)! }));
  }, [results]);

  useEffect(() => {
    if (index >= results.length) setIndex(0);
  }, [results.length, index]);

  // Keep the highlighted row inside the scroll viewport.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  function runCommand(command: Command) {
    command.run({
      navigate: (to) => {
        navigate(to);
        closePalette();
      },
      setMode,
      replayBoot,
      openAssistant: (q) => {
        openAssistant(q);
        closePalette();
      },
      notify: (message) => setToast(message),
    });

    // Commands that only report a result keep the palette open long enough to
    // read the confirmation; navigation closes it via the callback above.
    if (command.group === "Actions" || command.group === "Mode" || command.group === "External") {
      window.setTimeout(() => closePalette(), 900);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setIndex(Math.max(0, results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results[index];
      if (cmd) runCommand(cmd);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    } else if (e.key === "Tab") {
      // The palette is modal: keep focus on the input rather than letting Tab
      // wander into the page behind the overlay.
      e.preventDefault();
    }
  }

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <div
            className="absolute inset-0 bg-void/85 backdrop-blur-md"
            onClick={closePalette}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.14] bg-panel/95 shadow-lift backdrop-blur-2xl"
            initial={reduced ? false : { opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.14 }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-secondary/80" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search commands, pages, case studies…"
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-listbox"
                aria-activedescendant={results[index] ? `palette-opt-${results[index].id}` : undefined}
                aria-autocomplete="list"
                aria-label="Search commands"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:block">
                ESC
              </kbd>
            </div>

            <ul
              id="palette-listbox"
              ref={listRef}
              role="listbox"
              aria-label="Commands"
              className="max-h-[52vh] overflow-y-auto py-2"
            >
              {results.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-zinc-400">
                  No command matches “{query}”.
                </li>
              )}

              {grouped.map(({ group, items }) => (
                <li key={group}>
                  <p className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    {group}
                  </p>
                  <ul role="group" aria-label={group}>
                    {items.map(({ command, flatIndex }) => {
                      const Icon = command.icon;
                      const activeRow = flatIndex === index;
                      return (
                        <li key={command.id}>
                          <button
                            type="button"
                            id={`palette-opt-${command.id}`}
                            data-idx={flatIndex}
                            role="option"
                            aria-selected={activeRow}
                            tabIndex={-1}
                            onMouseMove={() => setIndex(flatIndex)}
                            onClick={() => runCommand(command)}
                            className={[
                              "relative flex w-full items-center gap-3 px-4 py-2 text-left transition-colors",
                              activeRow ? "bg-secondary/[0.09]" : "hover:bg-white/[0.04]",
                            ].join(" ")}
                          >
                            {/* Selection marker on the leading edge. */}
                            {activeRow && (
                              <span className="absolute inset-y-1 left-0 w-0.5 rounded-r bg-secondary" aria-hidden />
                            )}
                            <Icon
                              className={`h-4 w-4 shrink-0 ${activeRow ? "text-secondary" : "text-zinc-500"}`}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1">
                              <span className={`block truncate text-sm ${activeRow ? "text-white" : "text-zinc-200"}`}>
                                {command.label}
                              </span>
                              {command.hint && (
                                <span className="block truncate text-xs text-zinc-500">{command.hint}</span>
                              )}
                            </span>
                            {activeRow && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-secondary/70" aria-hidden />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2 font-mono text-[10px] text-zinc-500">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" aria-hidden />
                  <ArrowDown className="h-3 w-3" aria-hidden /> navigate
                </span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" aria-hidden /> run
                </span>
              </span>
              <span>{results.length} result{results.length === 1 ? "" : "s"}</span>
            </div>

            {/* Command results are announced rather than only shown. */}
            <div aria-live="polite" className="sr-only">
              {toast}
            </div>
            {toast && (
              <p className="border-t border-secondary/20 bg-secondary/10 px-4 py-2 text-xs text-secondary-soft">{toast}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
