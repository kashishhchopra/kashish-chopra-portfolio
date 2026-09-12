import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

/**
 * Inlines the built stylesheet into index.html.
 *
 * The whole sheet is ~7 kB gzipped — smaller than the round trip it costs. A
 * separate <link> is render-blocking, so the browser cannot paint the static
 * shell until it arrives; inlined, first paint needs nothing but the HTML.
 */
function inlineStylesheet(): Plugin {
  return {
    name: "inline-stylesheet",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const html = bundle["index.html"];
      if (!html || html.type !== "asset") return;

      let source = String(html.source);
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "asset" || !chunk.fileName.endsWith(".css")) continue;
        const tag = new RegExp(`<link[^>]+href="/${chunk.fileName}"[^>]*>`);
        if (!tag.test(source)) continue;
        source = source.replace(tag, `<style>${String(chunk.source)}</style>`);
        delete bundle[chunk.fileName];
      }
      html.source = source;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), inlineStylesheet()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split the dependencies that never change away from app code, so a
        // content edit doesn't invalidate the framework bundle in visitors'
        // caches.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
