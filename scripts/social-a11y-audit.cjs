const { chromium } = require("playwright");
const { default: AxeBuilder } = require("@axe-core/playwright");
(async () => {
  const b = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await c.newPage();
  for (const route of [
    "/",
    "/explore",
    "/saved",
    "/profiles/aj-nova-reality",
    "/property/pp-101",
    "/reels",
    "/messages",
    "/login",
    "/account",
  ]) {
    await p.goto("http://localhost:3000" + route);
    await p.locator("h1").first().waitFor();
    const a = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    console.log(
      route,
      JSON.stringify(
        a.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.slice(0, 5).map((n) => ({ target: n.target, msg: n.failureSummary })),
        })),
      ),
    );
  }
  await b.close();
})();
