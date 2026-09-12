import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { UIContext, type UIContextValue } from "./ui-context";
import { useAudienceMode } from "@/hooks/useAudienceMode";

import BootSequence from "@/components/BootSequence";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";

/**
 * Every route except the landing page is code-split. A first-time visitor
 * downloads the shell and the home page, not the PDF viewer, the GitHub
 * dashboard and six case studies.
 */
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const ProjectCaseStudyPage = lazy(() => import("@/pages/ProjectCaseStudyPage"));
const SkillsPage = lazy(() => import("@/pages/SkillsPage"));
const ExperiencePage = lazy(() => import("@/pages/ExperiencePage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const StatusPage = lazy(() => import("@/pages/StatusPage"));
const ExplorerPage = lazy(() => import("@/pages/ExplorerPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

/**
 * Scrolls to top on route change, unless the URL carries a hash — a link to
 * `#architecture` should land on that section, not the top of the page.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

/**
 * Holds a full viewport of height while a lazy route loads.
 *
 * A short fallback would let the footer sit high on the screen and then be
 * pushed down when the real content arrives — a visible layout shift on every
 * deep link. Reserving the viewport keeps that movement below the fold.
 */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-start justify-center pt-24" role="status" aria-live="polite">
      <p className="font-mono text-xs text-secondary/70">
        loading module<span className="animate-blink">_</span>
      </p>
    </div>
  );
}

export default function App() {
  const { mode, setMode, toggleMode } = useAudienceMode();
  // The boot screen is the site's front door: it plays on every load, so opening
  // the link always starts with the system coming up. Client-side navigation
  // doesn't remount App, so it never interrupts someone already browsing.
  const [showBoot, setShowBoot] = useState(true);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantSeed, setAssistantSeed] = useState<{ question: string; nonce: number } | null>(null);

  const finishBoot = useCallback(() => setShowBoot(false), []);

  const replayBoot = useCallback(() => setShowBoot(true), []);

  const openPalette = useCallback((initialQuery = "") => {
    setPaletteQuery(initialQuery);
    setPaletteOpen(true);
  }, []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  const openAssistant = useCallback((question?: string) => {
    setAssistantOpen(true);
    if (question) setAssistantSeed({ question, nonce: Date.now() });
  }, []);
  const closeAssistant = useCallback(() => setAssistantOpen(false), []);

  const ui = useMemo<UIContextValue>(
    () => ({
      replayBoot,
      mode,
      setMode,
      toggleMode,
      paletteOpen,
      openPalette,
      closePalette,
      paletteQuery,
      assistantOpen,
      openAssistant,
      closeAssistant,
      assistantSeed,
    }),
    [
      replayBoot,
      mode,
      setMode,
      toggleMode,
      paletteOpen,
      openPalette,
      closePalette,
      paletteQuery,
      assistantOpen,
      openAssistant,
      closeAssistant,
      assistantSeed,
    ],
  );

  return (
    <UIContext.Provider value={ui}>
      <ScrollToTop />

      <AnimatePresence>
        {showBoot && <BootSequence key="boot" onComplete={finishBoot} onSkip={finishBoot} />}
      </AnimatePresence>

      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/*"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="about" element={<AboutPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="projects/:projectId" element={<ProjectCaseStudyPage />} />
                  <Route path="skills" element={<SkillsPage />} />
                  <Route path="experience" element={<ExperiencePage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="status" element={<StatusPage />} />
                  <Route path="explorer" element={<ExplorerPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </UIContext.Provider>
  );
}
