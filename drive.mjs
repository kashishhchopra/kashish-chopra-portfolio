import { launch } from "puppeteer-core";
const B = "http://localhost:5173";
const b = await launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });

const errors = [];
p.on("pageerror", e => errors.push("pageerror: " + e.message));
p.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 120)); });

const ok = (label, cond, extra = "") => console.log(`${cond ? "PASS" : "FAIL"}  ${label}${extra ? "  — " + extra : ""}`);

// The boot screen plays on every page load and covers the viewport, so any
// navigation that isn't testing the boot itself has to dismiss it first —
// otherwise clicks land on the overlay.
const goto = async (path, opts) => {
  await p.goto(B + path, opts);
  await p.keyboard.press("Escape");
  await new Promise(r => setTimeout(r, 500));
};

// ---- 1. Boot sequence plays and hands off (fresh visitor) ----
await p.goto(B + "/", { waitUntil: "domcontentloaded" });
await new Promise(r => setTimeout(r, 600));
const bootUp = await p.evaluate(() => /INITIALIZING KASHISH'S AI/.test(document.body.innerText));
await new Promise(r => setTimeout(r, 4400)); // lines + the hold on SYSTEM ONLINE + fade
const bootGone = await p.evaluate(() => !/INITIALIZING KASHISH'S AI/.test(document.body.innerText));
ok("boot sequence plays then dismisses", bootUp && bootGone);

// ---- 2. Command palette (Cmd+K) ----
await p.keyboard.down("Meta"); await p.keyboard.press("k"); await p.keyboard.up("Meta");
await new Promise(r => setTimeout(r, 400));
const paletteOpen = await p.$('[role="dialog"][aria-label="Command palette"]');
await p.type('input[role="combobox"]', "traffic");
await new Promise(r => setTimeout(r, 300));
const hits = await p.evaluate(() => document.querySelectorAll('[role="option"]').length);
await p.keyboard.press("Enter");
await new Promise(r => setTimeout(r, 700));
const wentTo = p.url();
ok("⌘K palette opens, fuzzy-finds, navigates", !!paletteOpen && hits > 0 && wentTo.includes("trafficiq"), `${hits} hits → ${wentTo.replace(B,"")}`);

// ---- 3. Architecture diagram interaction ----
await p.evaluate(() => document.querySelector("#architecture details")?.setAttribute("open", ""));
await new Promise(r => setTimeout(r, 400));
const nodes = await p.$$('#architecture svg g[role="button"]');
if (nodes.length) { await nodes[3].click(); await new Promise(r => setTimeout(r, 350)); }
const detail = await p.evaluate(() => document.querySelector("#architecture")?.innerText.includes("pinned"));
ok("diagram nodes clickable + pin detail", nodes.length > 0 && detail, `${nodes.length} nodes`);

// ---- 4. Recruiter / Developer mode is a real content switch ----
const recruiterHasDecisions = await p.evaluate(() => !!document.querySelector("#decisions details[open]"));
await p.evaluate(() => [...document.querySelectorAll('[role="radio"]')].find(b => b.getAttribute("aria-checked") === "false")?.click());
await new Promise(r => setTimeout(r, 500));
const devHasDecisions = await p.evaluate(() => !!document.querySelector("#decisions details[open]"));
ok("REC/DEV toggle changes content", !recruiterHasDecisions && devHasDecisions, `rec=${recruiterHasDecisions} dev=${devHasDecisions}`);

// ---- 5. Assistant answers + returns actions ----
await goto("/", { waitUntil: "networkidle0" });
await p.evaluate(() => [...document.querySelectorAll("button")].find(b => /open portfolio assistant/i.test(b.getAttribute("aria-label")||""))?.click());
await new Promise(r => setTimeout(r, 500));
await p.type('input[aria-label="Ask the portfolio assistant a question"]', "what certifications does she have?");
await p.keyboard.press("Enter");
await new Promise(r => setTimeout(r, 1400));
const reply = await p.evaluate(() => document.querySelector('[role="dialog"][aria-label="Portfolio assistant"]')?.innerText || "");
ok("assistant answers from new resume data", /Azure AI Fundamentals/i.test(reply) && /IBM/i.test(reply));

// ---- 6. File explorer keyboard nav ----
await goto("/explorer", { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 400));
await p.focus('[role="tree"]');
for (let i = 0; i < 3; i++) { await p.keyboard.press("ArrowDown"); await new Promise(r => setTimeout(r, 90)); }
await p.keyboard.press("ArrowRight");
await new Promise(r => setTimeout(r, 300));
const treeRows = await p.evaluate(() => document.querySelectorAll('[role="treeitem"]').length);
ok("file explorer keyboard nav", treeRows > 8, `${treeRows} rows visible`);

// ---- 7. Contact form validates + honest mailto state ----
await goto("/contact", { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 900));
await p.evaluate(() => [...document.querySelectorAll("button")].find(b => /compose email|send message/i.test(b.textContent))?.click());
await new Promise(r => setTimeout(r, 300));
const validation = await p.evaluate(() => document.body.innerText.includes("Please enter your name"));
const btn = await p.evaluate(() => [...document.querySelectorAll("button")].find(b => /compose email|send message/i.test(b.textContent))?.textContent.trim());
ok("contact form validates before submitting", validation, `button reads "${btn}"`);

// ---- 8. 404 ----
await goto("/definitely-not-a-page", { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 500));
ok("custom 404", await p.evaluate(() => /SYSTEM MODULE NOT FOUND/i.test(document.body.innerText)));

console.log("\nconsole/page errors:", errors.length ? errors : "none");
await b.close();
