import { useCallback, useEffect, useRef, useState } from "react";

export interface VoiceResult {
  supported: boolean;
  listening: boolean;
  transcript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

/**
 * Thin wrapper over the Web Speech API (SpeechRecognition).
 * - Feature-detects support and degrades gracefully.
 * - Calls `onCommand` with the recognized phrase; caller maps it to navigation.
 * - Fully optional and easy to disable by simply not rendering the controller.
 */
export function useVoiceCommands(onCommand: (phrase: string) => void): VoiceResult {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onCommandRef = useRef(onCommand);
  onCommandRef.current = onCommand;

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const last = event.results.length - 1;
      const phrase = event.results[last][0].transcript.trim();
      setTranscript(phrase);
      onCommandRef.current(phrase);
    };
    recognition.onerror = (e: Event) => {
      const err = e as unknown as { error?: string };
      setError(err.error === "not-allowed" ? "Microphone permission denied." : "Voice recognition error.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      /* already started */
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { supported, listening, transcript, error, start, stop, toggle };
}

/** Maps a spoken phrase to a route path, or null if unrecognized. */
export function matchVoicePhrase(phrase: string): string | null {
  const q = phrase.toLowerCase();
  const table: { keys: string[]; path: string }[] = [
    { keys: ["project"], path: "/projects" },
    { keys: ["skill"], path: "/skills" },
    { keys: ["experience", "work", "career"], path: "/experience" },
    { keys: ["contact", "reach"], path: "/contact" },
    { keys: ["status", "system"], path: "/status" },
    { keys: ["about", "profile"], path: "/about" },
    { keys: ["home", "go home", "start"], path: "/" },
  ];
  for (const row of table) {
    if (row.keys.some((k) => q.includes(k))) return row.path;
  }
  return null;
}
