import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const KEY = "kashish-ai.theme";

function readStored(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "light";
  } catch {
    // Private browsing / storage disabled — fall back to the default.
    return "light";
  }
}

/**
 * Colour theme, persisted across visits. Defaults to `light` (beige/black) —
 * the site's primary look; `dark` (black/white) is the opt-in alternative.
 *
 * The inline script in index.html already set `data-theme` on <html> before
 * this ever runs, so there's no flash on load; this hook exists to keep
 * later toggles and localStorage in sync with that same attribute.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState((t) => (t === "light" ? "dark" : "light")), []);

  return { theme, setTheme, toggleTheme };
}
