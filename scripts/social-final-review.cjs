const { chromium } = require("playwright");
const { default: AxeBuilder } = require("@axe-core/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.QA_URL || "http://127.0.0.1:3100";
(async () => {
  const browser = await chromium.launch({ channel: "chromium" });
  const context = await browser.newContext({ reducedMotion: "reduce" });
  await context.addInitScript(() => {
    localStorage.setItem(
      "pp-account-profile",
      JSON.stringify({ name: "QA Preview", verified: true }),
    );
    localStorage.setItem(
      "pp-property-draft",
      JSON.stringify({
        type: "Apartment",
        purpose: "Sell",
        city: "Pune",
        area: "Draft neighbourhood",
        beds: "2",
        price: "12000000",
        title: "Private photo draft",
        size: "1400",
        baths: "2",
        description: "A private draft for browser validation.",
        furnishing: "Unfurnished",
      }),
    );
  });
  const page = await context.newPage();
  const report = { base, responsive: [], accessibility: [], keyboard: [], screenshots: [] };
  async function axe(name) {
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    report.accessibility.push({
      name,
      violations: result.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    });
  }
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/explore", "/profiles/aj-nova-reality", "/account"]) {
      await page.goto(base + route);
      await page.locator("h1").first().waitFor();
      await page.waitForTimeout(200);
      const size = await page.evaluate(() => document.documentElement.scrollWidth);
      report.responsive.push({ width, route, scrollWidth: size });
      assert.ok(size <= width);
    }
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto(base + "/post-property");
    await page.getByRole("heading", { name: "Property type", exact: true }).waitFor();
    for (let step = 0; step < 6; step++) {
      await axe(`composer-${width}-step-${step + 1}`);
      if (step === 4) {
        await page
          .locator("input[type=file]")
          .setInputFiles(["public/social/photo-1600607687939-ce8a6c25118c.jpg"]);
        await page.locator(".sp-upload-previews img").waitFor();
        await page.screenshot({
          path: `docs/screenshots/composer-photos-${width}.png`,
          fullPage: width === 390,
        });
      }
      if (step < 5) await page.getByRole("button", { name: "Continue", exact: true }).click();
    }
    await page.screenshot({
      path: `docs/screenshots/composer-review-${width}.png`,
      fullPage: width === 390,
    });
  }
  await page.goto(base);
  await page
    .locator(".sp-post")
    .first()
    .getByRole("button", { name: /Open photos/ })
    .click();
  await axe("gallery-dialog");
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    assert.ok(
      await page.getByRole("dialog").evaluate((dialog) => dialog.contains(document.activeElement)),
    );
  }
  report.keyboard.push("Native gallery dialog keeps Tab focus inside");
  await page.keyboard.press("Escape");
  await page
    .locator(".sp-post")
    .first()
    .getByRole("button", { name: /^Add Sunlit/ })
    .click();
  await axe("collection-dialog");
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/explore");
  await page.getByRole("button", { name: /^Filters/ }).click();
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    assert.ok(
      await page.getByRole("dialog").evaluate((dialog) => dialog.contains(document.activeElement)),
    );
  }
  report.keyboard.push("Native filter dialog keeps Tab focus inside");
  await axe("filter-dialog-final");
  await page.keyboard.press("Escape");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const route of ["/explore", "/profiles/aj-nova-reality", "/account", "/property/pp-101"]) {
      await page.goto(base + route);
      await page.locator("h1").first().waitFor();
      await page.waitForTimeout(250);
      await axe(`${route}-${width}-final`);
      const name = route.split("/")[1];
      const file = `docs/screenshots/${name}-${width}.png`;
      await page.screenshot({ path: file });
      report.screenshots.push(file);
    }
    await page.goto(base + "/explore");
    await page.locator(".sp-visual-grid").first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: `docs/screenshots/explore-grid-${width}.png` });
  }
  report.completed = new Date().toISOString();
  fs.writeFileSync("docs/social-final-review-results.json", JSON.stringify(report, null, 2));
  await browser.close();
  const violations = report.accessibility.reduce((n, x) => n + x.violations.length, 0);
  console.log(
    JSON.stringify({
      responsive: report.responsive.length,
      accessibilityScans: report.accessibility.length,
      violations,
      keyboard: report.keyboard,
    }),
  );
  if (violations) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
