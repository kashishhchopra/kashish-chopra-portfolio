import { createContext, useContext } from "react";

/**
 * Audience mode.
 * - `recruiter` — outcomes, impact and hiring signals first; deep technical
 *   panels stay collapsed.
 * - `developer` — architecture, engineering decisions and the file explorer
 *   are surfaced by default.
 *
 * This is a real content switch, not a theme: components read it to decide what
 * to render, in what order, and how much depth to open with.
 */
export type AudienceMode = "recruiter" | "developer";

/**
 * Colour theme. `light` is beige/black (the site's primary look); `dark` is
 * black/white. Purely visual — unlike AudienceMode, nothing reads this to
 * decide what content to show.
 */
export type Theme = "light" | "dark";

export interface UIContextValue {
  replayBoot: () => void;
  mode: AudienceMode;
  setMode: (mode: AudienceMode) => void;
  toggleMode: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  paletteOpen: boolean;
  openPalette: (initialQuery?: string) => void;
  closePalette: () => void;
  /** Seeds the palette input when it is opened programmatically. */
  paletteQuery: string;
  assistantOpen: boolean;
  /** Opens the assistant, optionally sending a question straight away. */
  openAssistant: (question?: string) => void;
  closeAssistant: () => void;
  /** Question pushed in from outside the chat; `nonce` re-fires repeats. */
  assistantSeed: { question: string; nonce: number } | null;
}

export const UIContext = createContext<UIContextValue>({
  replayBoot: () => {},
  mode: "recruiter",
  setMode: () => {},
  toggleMode: () => {},
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  paletteOpen: false,
  openPalette: () => {},
  closePalette: () => {},
  paletteQuery: "",
  assistantOpen: false,
  openAssistant: () => {},
  closeAssistant: () => {},
  assistantSeed: null,
});

export const useUI = () => useContext(UIContext);
