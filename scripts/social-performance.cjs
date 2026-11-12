const { chromium } = require("playwright");
const fs = require("node:fs");
const base = process.env.QA_URL || "http://127.0.0.1:3100";
(async () => {
  const browser = await chromium.launch({ channel: "chromium" });
  const results = [];
  for (const width of [390, 1440])
    for (let run = 1; run <= 3; run++) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.__localMetrics = { lcp: 0, cls: 0 };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__localMetrics.lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries())
            if (!entry.hadRecentInput) window.__localMetrics.cls += entry.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(base, { waitUntil: "networkidle" });
      await page.locator(".sp-post").first().waitFor();
      await page.waitForTimeout(1200);
      const metrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0],
          resources = performance.getEntriesByType("resource");
        return {
          lcpMs: Math.round(window.__localMetrics.lcp),
          cls: Number(window.__localMetrics.cls.toFixed(4)),
          ttfbMs: Math.round(nav.responseStart - nav.requestStart),
          domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
          loadMs: Math.round(nav.loadEventEnd),
          transferBytes: resources.reduce((n, r) => n + r.transferSize, 0),
          resourceCount: resources.length,
          imageRequests: resources.filter(
            (r) => r.initiatorType === "img" || r.name.includes("/_next/image?"),
          ).length,
          domElements: document.querySelectorAll("*").length,
          postCount: document.querySelectorAll(".sp-post").length,
        };
      });
      results.push({ width, run, ...metrics });
      await context.close();
    }
  await browser.close();
  const report = {
    base,
    measuredAt: new Date().toISOString(),
    environment:
      "Local production Next.js server; headless Chromium; no CPU/network throttling; fresh browser context each run; server image cache may be warm. Not production field data. No INP or Lighthouse score measured.",
    results,
  };
  fs.writeFileSync("docs/social-performance-results.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
