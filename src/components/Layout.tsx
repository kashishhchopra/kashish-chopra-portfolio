import { Outlet } from "react-router-dom";
import GridBackground from "./GridBackground";
import NavigationConsole from "./NavigationConsole";
import FooterStatusBar from "./FooterStatusBar";
import PortfolioAssistant from "./PortfolioAssistant";
import VoiceController from "./VoiceController";
import CommandPalette from "./CommandPalette";

/**
 * App shell: ambient background, top console, page outlet, footer HUD, plus
 * the floating assistant, the command palette and the optional voice
 * controller.
 */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <GridBackground />
      <NavigationConsole />
      {/* Extra bottom padding keeps the last of the content clear of the
          floating assistant and voice controls, which overlap it on mobile. */}
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-10 sm:pb-10">
        <Outlet />
      </main>
      <FooterStatusBar />
      <PortfolioAssistant />
      <CommandPalette />
      <VoiceController />
    </div>
  );
}
