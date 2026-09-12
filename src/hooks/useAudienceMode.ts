import { useCallback, useEffect, useState } from "react";
import type { AudienceMode } from "@/ui-context";

const KEY = "kashish-ai.mode";

function readStored(): AudienceMode {
  try {
    const v = localStorage.getItem(KEY);
    return v === "developer" || v === "recruiter" ? v : "recruiter";
  } catch {
    // Private browsing / storage disabled — fall back to the default.
    return "recruiter";
  }
}

/**
 * Audience mode, persisted across visits. Defaults to `recruiter` because a
 * first-time visitor is more often evaluating than reading architecture.
 */
export function useAudienceMode() {
  const [mode, setModeState] = useState<AudienceMode>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* ignore */
    }
    // Lets CSS and tests key off the active mode.
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  const setMode = useCallback((m: AudienceMode) => setModeState(m), []);
  const toggleMode = useCallback(
    () => setModeState((m) => (m === "recruiter" ? "developer" : "recruiter")),
    [],
  );

  return { mode, setMode, toggleMode };
}
