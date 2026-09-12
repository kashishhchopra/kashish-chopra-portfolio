import { useEffect, useState } from "react";
import { Mail, Github, Linkedin, Code, Copy, Check, Send, AlertCircle } from "lucide-react";
import { portfolio } from "@/data/portfolio";

/**
 * Where the form posts.
 * - A third-party service (Formspree/Web3Forms/Getform) if VITE_CONTACT_FORM_ENDPOINT is set.
 * - Otherwise the bundled serverless function at /api/contact.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || "/api/contact";
const USES_OWN_API = !import.meta.env.VITE_CONTACT_FORM_ENDPOINT;

const iconFor: Record<string, typeof Mail> = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
  leetcode: Code,
};

type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Whether direct sending actually works right now.
 * `checking` until the backend answers — the form asks rather than assuming,
 * so the notice it shows is always true.
 */
type Delivery = "checking" | "live" | "mailto";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactTerminal() {
  const email = portfolio.contact.find((c) => c.id === "email")!.value;

  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  // Honeypot. Hidden from people, irresistible to bots.
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<Delivery>(USES_OWN_API ? "checking" : "live");

  // Ask our own endpoint whether a mail provider key is configured. A
  // third-party endpoint is assumed live — there's nothing to probe.
  useEffect(() => {
    if (!USES_OWN_API) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(ENDPOINT, { method: "GET", headers: { Accept: "application/json" } });
        if (cancelled) return;
        if (!res.ok) {
          setDelivery("mailto");
          return;
        }
        // A host with SPA fallback returns index.html here, not JSON — which
        // parses as null and correctly reads as "not configured".
        const data = (await res.json().catch(() => null)) as { configured?: boolean } | null;
        setDelivery(data?.configured === true ? "live" : "mailto");
      } catch {
        // No function deployed (e.g. static host, or `vite dev`) → be honest.
        if (!cancelled) setDelivery("mailto");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function copyEmail() {
    navigator.clipboard?.writeText(email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => setCopied(false),
    );
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.message.trim()) e.message = "Please enter a message.";
    else if (form.message.trim().length < 10) e.message = "Message is a little short.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    `Portfolio contact from ${form.name || "a visitor"}`,
  )}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)}`;

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    // Sending isn't configured → honest mailto fallback (never fake a "sent").
    if (delivery !== "live") {
      window.location.href = mailtoHref;
      return;
    }

    setState("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, company }),
      });

      // The backend lost its key since the probe — switch to mailto rather
      // than reporting a failure the visitor can do nothing about.
      if (res.status === 501) {
        setDelivery("mailto");
        setState("idle");
        window.location.href = mailtoHref;
        return;
      }

      // Only a real JSON acknowledgement counts as sent. A host with SPA
      // fallback answers /api/contact with 200 + index.html, and trusting
      // res.ok alone would report success for a message that went nowhere.
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!res.ok || !data) {
        throw new Error(data?.error || "Could not send the message.");
      }
      if (data.ok !== true) {
        throw new Error(data.error || "Could not send the message.");
      }

      setState("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not send the message.");
      setState("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Direct links */}
      <div className="glass-panel p-5">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-secondary/70">Direct Channels</h2>
        <ul className="space-y-2.5">
          {portfolio.contact.map((c) => {
            const Icon = iconFor[c.id] ?? Mail;
            return (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <a href={c.href} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-secondary/30 bg-secondary/10 text-secondary-soft">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-zinc-200">{c.label}</span>
                    <span className="block truncate font-mono text-xs text-zinc-400">{c.value}</span>
                  </span>
                </a>
                {c.id === "email" && (
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="btn-ghost shrink-0 text-xs"
                    aria-label="Copy email address"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Form */}
      <div className="glass-panel p-5">
        <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-secondary/70">Message Terminal</h2>
        {/* Not a warning — mailto is the intended path here. Neutral styling,
            phrased as what the visitor gets rather than what the site lacks. */}
        {delivery === "mailto" && (
          <p className="mb-4 flex items-start gap-2 rounded-lg border border-white/[0.09] bg-white/[0.03] p-2.5 text-xs text-zinc-400">
            <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary/70" aria-hidden />
            This opens in your own email app with everything filled in, so you keep a copy of what
            you sent.
          </p>
        )}

        {state === "success" ? (
          <div role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            Message sent successfully. Thanks for reaching out — Kashish will reply soon.
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-3">
            <div>
              <label htmlFor="c-name" className="mb-1 block text-xs text-zinc-400">
                Name
              </label>
              <input
                id="c-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "err-name" : undefined}
                className="w-full rounded-lg border border-white/12 bg-void/60 px-3 py-2 text-sm text-zinc-100 focus:border-secondary/50 focus:outline-none"
              />
              {errors.name && <p id="err-name" className="mt-1 text-xs text-rose-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="c-email" className="mb-1 block text-xs text-zinc-400">
                Email
              </label>
              <input
                id="c-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : undefined}
                className="w-full rounded-lg border border-white/12 bg-void/60 px-3 py-2 text-sm text-zinc-100 focus:border-secondary/50 focus:outline-none"
              />
              {errors.email && <p id="err-email" className="mt-1 text-xs text-rose-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="c-message" className="mb-1 block text-xs text-zinc-400">
                Message
              </label>
              <textarea
                id="c-message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "err-message" : undefined}
                className="w-full resize-y rounded-lg border border-white/12 bg-void/60 px-3 py-2 text-sm text-zinc-100 focus:border-secondary/50 focus:outline-none"
              />
              {errors.message && <p id="err-message" className="mt-1 text-xs text-rose-400">{errors.message}</p>}
            </div>

            {/* Honeypot: off-screen and hidden from assistive tech, so only a
                bot filling every field will trip it. */}
            <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor="c-company">Company (leave blank)</label>
              <input
                id="c-company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {state === "error" && (
              <div role="alert" className="space-y-2 rounded-lg border border-rose-400/25 bg-rose-400/[0.06] p-2.5">
                <p className="flex items-start gap-2 text-xs text-rose-300">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  {errorMessage ?? "Something went wrong sending your message."}
                </p>
                {/* Always leave a route that works. */}
                <a href={mailtoHref} className="btn-ghost !py-1.5 text-xs">
                  <Mail className="h-3.5 w-3.5" aria-hidden /> Send by email instead
                </a>
              </div>
            )}

            {/* The probe only ever upgrades this to "Send message", so the
                button stays live and labelled from the first paint — no
                disabled flash while a request that will usually fail resolves. */}
            <button
              type="submit"
              disabled={state === "submitting"}
              className="btn-hud w-full justify-center disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden />
              {state === "submitting" ? "Sending…" : delivery === "live" ? "Send message" : "Compose email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
