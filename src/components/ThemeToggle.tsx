import { Moon, Sun } from "lucide-react";
import { useUI } from "@/ui-context";

/**
 * Colour theme switch. A single icon button rather than ModeToggle's
 * radiogroup — light/dark is a binary flip, not two peer labelled options,
 * so a toggle is the more standard control for it.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useUI();
  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Switch to ${next} theme`}
      aria-label={`Switch to ${next} theme`}
      className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/[0.03] p-1.5 text-zinc-400 transition-colors hover:border-secondary/40 hover:text-secondary-soft"
    >
      {theme === "light" ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
    </button>
  );
}
