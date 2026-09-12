import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SeoProps {
  title: string;
  description?: string;
}

/** Upserts a meta tag by attribute, creating it if the document lacks one. */
function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Lightweight per-route document head manager (no extra dependency).
 *
 * Canonical and og:url are derived from the live origin, so they stay correct
 * on whatever domain the site is deployed to. Set VITE_SITE_URL to pin them to
 * one canonical host when the site answers on more than one address.
 */
export default function Seo({ title, description }: SeoProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = `${title} — KASHISH'S AI`;
    document.title = fullTitle;

    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;
    const url = new URL(pathname, origin).toString();

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", fullTitle);

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
  }, [title, description, pathname]);

  return null;
}
