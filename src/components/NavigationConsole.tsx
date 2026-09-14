import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Terminal, Search, FolderTree } from "lucide-react";
import { navItems } from "@/lib/nav";
import { portfolio } from "@/data/portfolio";
import { useUI } from "@/ui-context";
import ModeToggle from "./ModeToggle";
import ThemeToggle from "./ThemeToggle";

/**
 * Top navigation "console". Shows the display name as a logo, the module
 * commands as links, the audience-mode switch and the command-palette trigger.
 * Collapses into an accessible mobile menu on small screens.
 */
export default function NavigationConsole() {
  const [open, setOpen] = useState(false);
  const { openPalette } = useUI();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Show the shortcut the visitor's own keyboard actually uses.
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-void/70 backdrop-blur-xl">
      {/* Hairline of accent colour along the very top of the page. */}
      <div className="absolute inset-x-0 top-0 h-px bg-accent-line opacity-50" aria-hidden />

      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3" aria-label="Primary">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="KASHISH'S AI — home">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-secondary/30 bg-gradient-to-br from-secondary/20 to-accent/10 transition-transform duration-200 group-hover:scale-105">
            <Terminal className="h-[1.15rem] w-[1.15rem] text-secondary" aria-hidden />
            <span className="absolute inset-0 rounded-lg opacity-0 shadow-glow transition-opacity duration-200 group-hover:opacity-100" aria-hidden />
          </span>
          <span className="font-mono text-sm font-bold tracking-[0.18em] text-white">
            {portfolio.identity.displayName}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {navItems
            .filter((n) => n.path !== "/")
            .map((n) => (
              <li key={n.command}>
                <NavLink
                  to={n.path}
                  className={({ isActive }) =>
                    [
                      "relative rounded-md px-2.5 py-2 font-mono text-xs transition-colors",
                      isActive
                        ? "text-secondary-soft"
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {n.command}
                      {/* Active state is a lit underline rather than a filled
                          pill — lighter, and it reads as a console tab. */}
                      {isActive && (
                        <span
                          className="absolute inset-x-2 -bottom-[13px] h-px bg-secondary shadow-[0_0_10px_rgb(var(--c-secondary)/0.9)]"
                          aria-hidden
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <ModeToggle compact />
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => openPalette()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.03] px-2.5 py-1.5 text-zinc-400 transition-colors hover:border-secondary/40 hover:text-secondary-soft"
            aria-label="Open command palette"
          >
            <Search className="h-4 w-4" aria-hidden />
            <kbd className="hidden font-mono text-[10px] md:block">{isMac ? "⌘" : "Ctrl"}K</kbd>
          </button>

          {/* Mobile toggle */}
          <button
            type="button"
            className="btn-ghost !px-2.5 !py-1.5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-void lg:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="mb-3 flex items-center gap-2 sm:hidden">
              <ModeToggle />
              <ThemeToggle />
            </div>
            <ul className="grid grid-cols-2 gap-1">
              {navItems.map((n) => {
                const Icon = n.icon;
                return (
                  <li key={n.command}>
                    <NavLink
                      to={n.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive ? "bg-secondary/10 text-secondary-soft" : "text-zinc-300 hover:bg-white/5",
                        ].join(" ")
                      }
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {n.label}
                    </NavLink>
                  </li>
                );
              })}
              <li>
                <NavLink
                  to="/explorer"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive ? "bg-secondary/10 text-secondary-soft" : "text-zinc-300 hover:bg-white/5",
                    ].join(" ")
                  }
                >
                  <FolderTree className="h-4 w-4" aria-hidden />
                  File Explorer
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
