import { launch } from "puppeteer-core";
const b = await launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
p.on("console", async m => {
  if (m.type() !== "error") return;
  const args = await Promise.all(m.args().map(a => a.jsonValue().catch(() => "?")));
  console.log("»", args.join(" | ").slice(0, 300));
});
await p.evaluateOnNewDocument(() => localStorage.setItem("kashish-ai:boot-seen", "1"));
for (const u of ["/", "/about", "/projects", "/projects/trafficiq", "/experience", "/explorer", "/contact", "/status", "/resume", "/skills"]) {
  await p.goto("http://localhost:5173" + u, { waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 500));
}
await b.close();
