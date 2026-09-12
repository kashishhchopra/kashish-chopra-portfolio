import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useVoiceCommands, matchVoicePhrase } from "@/hooks/useVoiceCommands";

/**
 * Optional voice navigation. Renders a floating mic button only where the
 * Web Speech API is supported. Fully keyboard-accessible; provides visible
 * feedback and can be toggled off. Text commands remain available via the
 * assistant/terminal for unsupported browsers.
 */
export default function VoiceController() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const voice = useVoiceCommands((phrase) => {
    const path = matchVoicePhrase(phrase);
    if (path) {
      setFeedback(`Navigating: "${phrase}"`);
      navigate(path);
    } else {
      setFeedback(`Unrecognized: "${phrase}". Try "open projects" or "open contact".`);
    }
  });

  useEffect(() => {
    if (!feedback) return;
    const id = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(id);
  }, [feedback]);

  // Don't render anything if the browser can't do speech recognition.
  if (!voice.supported) return null;

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={() => setEnabled(true)}
        className="fixed bottom-24 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-panel/90 text-zinc-300 shadow-panel backdrop-blur transition-colors hover:border-secondary/50 hover:text-secondary-soft"
        aria-label="Enable voice commands"
        title="Enable voice commands"
      >
        <MicOff className="h-5 w-5" aria-hidden />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-2">
      {feedback && (
        <div
          role="status"
          className="max-w-[15rem] rounded-lg border border-secondary/30 bg-panel/95 px-3 py-2 text-xs text-zinc-200 shadow-panel"
        >
          {feedback}
        </div>
      )}
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-panel/95 p-1.5 shadow-panel backdrop-blur">
        <button
          type="button"
          onClick={voice.toggle}
          className={[
            "grid h-11 w-11 place-items-center rounded-full transition-colors",
            voice.listening ? "bg-secondary text-void" : "bg-secondary/10 text-secondary-soft hover:bg-secondary/20",
          ].join(" ")}
          aria-pressed={voice.listening}
          aria-label={voice.listening ? "Stop listening" : "Start voice command"}
        >
          {voice.listening ? <Volume2 className="h-5 w-5 animate-pulse" aria-hidden /> : <Mic className="h-5 w-5" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={() => {
            voice.stop();
            setEnabled(false);
          }}
          className="px-2 font-mono text-[11px] text-zinc-400 hover:text-zinc-200"
          aria-label="Disable voice commands"
        >
          off
        </button>
      </div>
    </div>
  );
}
