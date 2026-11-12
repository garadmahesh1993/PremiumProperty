const { chromium } = require("playwright");
const { default: AxeBuilder } = require("@axe-core/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const base = process.env.QA_URL || "http://localhost:3000";
const artifacts = path.resolve("docs/screenshots");
fs.mkdirSync(artifacts, { recursive: true });
let activePage;
const report = {
  base,
  started: new Date().toISOString(),
  checks: [],
  accessibility: [],
  responsive: [],
  errors: [],
  performance: [],
};
async function check(name, fn) {
  try {
    await fn();
    report.checks.push({ name, status: "passed" });
    console.log("PASS", name);
  } catch (e) {
    report.checks.push({ name, status: "failed", error: e.message });
    console.log("FAIL", name, e.message);
    if (activePage) await activePage.keyboard.press("Escape").catch(() => {});
  }
}
(async () => {
  const browser = await chromium.launch({
    executablePath:
      process.env.QA_BROWSER_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  activePage = page;
  page.setDefaultTimeout(8000);
  page.on("pageerror", (e) => report.errors.push(e.message));
  const goto = async (route) => {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
    await page.locator("h1").first().waitFor();
    await page.waitForFunction(
      () => document.querySelector("main") && document.readyState === "complete",
    );
    await page.waitForTimeout(150);
  };
  await check("Feed carousel, fullscreen keyboard, Escape and focus restoration", async () => {
    await goto("/");
    assert.equal(await page.locator(".sp-post").count(), 4);
    const post = page.locator(".sp-post").first();
    await post.getByRole("button", { name: /Next photo/ }).click();
    assert.equal(await post.locator(".sp-media-counter").textContent(), "2/4");
    const trigger = post.getByRole("button", { name: /Open photos/ });
    await trigger.click();
    await page.getByRole("dialog").waitFor({ state: "visible" });
    await page.keyboard.press("ArrowRight");
    await page
      .getByRole("dialog")
      .getByRole("status")
      .filter({ hasText: "Photo 3 of 4" })
      .waitFor();
    assert.match(await page.getByRole("dialog").innerText(), /Photo 3 of 4/);
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").isVisible(), false);
    assert.equal(await trigger.evaluate((el) => el === document.activeElement), true);
  });
  await check(
    "Save persists through navigation and refresh; collections organize and remove",
    async () => {
      await goto("/");
      const post = page.locator(".sp-post").first();
      await post.getByRole("button", { name: /^Save Sunlit/ }).click();
      await page.reload();
      await page.getByRole("button", { name: /^Unsave Sunlit/ }).waitFor();
      await post.getByRole("button", { name: /^Add Sunlit/ }).click();
      await page.getByLabel("New collection name").fill("Dream Homes");
      await page.getByRole("button", { name: "Create", exact: true }).click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: /Dream Homes/ })
        .click();
      await goto("/saved");
      assert.equal(await page.locator(".sp-tile").count(), 1);
      await page.getByRole("button", { name: /Dream Homes/ }).click();
      await page.getByRole("button", { name: "Remove from this collection" }).click();
      assert.equal(await page.locator(".sp-tile").count(), 0);
      await page.getByRole("button", { name: /All saved spaces/ }).click();
      assert.equal(await page.locator(".sp-tile").count(), 1);
      await page.getByRole("button", { name: /^Unsave Sunlit/ }).click();
      await page.reload();
      assert.equal(await page.locator(".sp-tile").count(), 0);
    },
  );
  await check("Feed tabs and bounded URL pagination; invalid page recovery", async () => {
    await goto("/");
    await page.getByRole("button", { name: "Rent", exact: true }).click();
    await page.waitForURL(/feed=rent/);
    assert.equal(await page.locator(".sp-post").count(), 4);
    for (const el of await page.locator(".sp-media-purpose").allTextContents())
      assert.equal(el, "FOR RENT");
    await page.getByRole("button", { name: "Next spaces" }).click();
    await page.waitForURL(/page=2/);
    assert.equal(await page.locator(".sp-post").count(), 2);
    await goto("/?page=NaN");
    assert.equal(await page.locator(".sp-post").count(), 4);
  });
  await check(
    "Explore search, project discovery, URL sync, Back, sorting and empty recovery",
    async () => {
      await goto("/explore");
      assert.equal(await page.locator(".sp-tile").count(), 6);
      await page.getByRole("button", { name: "Villas", exact: true }).click();
      await page.waitForURL(/kind=Villa/);
      assert.equal(await page.locator(".sp-tile").count(), 2);
      await page.goBack();
      assert.equal(await page.locator(".sp-tile").count(), 6);
      await page.getByLabel("Search properties or projects").fill("The Canopy");
      await page.getByRole("button", { name: "Search", exact: true }).click();
      await page.waitForURL(/q=The/);
      assert.equal(await page.locator(".sp-project-edit a").count(), 1);
      assert.equal(await page.locator(".sp-tile").count(), 0);
      await page.getByRole("button", { name: "Reset search" }).click();
      await page.waitForURL("**/explore");
      await page.getByLabel("Sort properties").selectOption("price-low");
      await page.waitForURL(/sort=price-low/);
      assert.match(await page.locator(".sp-tile").first().innerText(), /65 L/);
      await page.getByRole("button", { name: "Save search", exact: true }).click();
      assert.match(await page.getByRole("status").last().innerText(), /Search saved/);
      await goto(
        "/explore?purpose=buy&city=Pune&bhk=3&minArea=1400&max=19000000&furn=Semi-furnished",
      );
      assert.equal(await page.locator(".sp-tile").count(), 1);
    },
  );
  await check("Mobile filters modal, keyboard trap and applied filter chips", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goto("/explore");
    const opener = page.getByRole("button", { name: /^Filters/ });
    await opener.click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Exact BHK").selectOption("4");
    await page.waitForURL(/bhk=4/);
    await dialog.getByRole("button", { name: "Show 2 spaces" }).click();
    assert.equal(await page.locator(".sp-tile").count(), 2);
    assert.equal(await opener.evaluate((el) => el === document.activeElement), true);
    await page.getByRole("button", { name: "Remove BHK filter" }).click();
    await page.waitForURL((url) => !url.searchParams.has("bhk"));
    assert.equal(await page.locator(".sp-tile").count(), 6);
  });
  await check("Detail facts, local seen history and explicit business inquiry links", async () => {
    await goto("/property/pp-101");
    assert.match(await page.locator(".sp-detail-facts").innerText(), /1,460/);
    assert.equal(await page.locator('#inquiry a[href^="tel:"]').count(), 1);
    assert.match(
      await page.locator('#inquiry a[target="_blank"]').getAttribute("href"),
      /^https:\/\/mail.google.com/,
    );
    assert.ok(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem("premiumproperty-seen")).includes("pp-101"),
      ),
    );
    await page.getByRole("button", { name: /Open photos/ }).click();
    await page.keyboard.press("Escape");
  });
  await check("Posting preserves gate and simulated sign-in returns to draft", async () => {
    await goto("/post-property");
    await page.waitForURL(/login\?next=/);
    await page.getByLabel("Mobile number").fill("9999999999");
    await page.getByRole("button", { name: "Continue with phone" }).click();
    await page.getByLabel("6-digit verification code").fill("123456");
    await page.getByRole("button", { name: /Verify & continue/ }).click();
    await page.waitForURL("**/post-property");
    await page.getByRole("heading", { name: "Property type", exact: true }).waitFor();
  });
  await check(
    "Composer validation, image validation, cover, recovery and complete local draft",
    async () => {
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      assert.equal(await page.getByRole("heading", { name: "Location", exact: true }).count(), 1);
      await page.getByLabel("Locality", { exact: true }).fill("Draft neighbourhood");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page.getByLabel("Property title").fill("My private property draft");
      await page.getByLabel("Area (sq.ft.)", { exact: true }).fill("1400");
      await page
        .getByLabel("Description", { exact: true })
        .fill("A private test draft with a bright living space.");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page.getByLabel("Asking price (₹)", { exact: true }).fill("12000000");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      assert.match(await page.locator(".sp-form-error").innerText(), /at least one/);
      const file = page.locator("input[type=file]");
      await file.setInputFiles({
        name: "bad.jpg",
        mimeType: "image/jpeg",
        buffer: Buffer.from("not a photo"),
      });
      await page
        .getByRole("alert")
        .filter({ hasText: /could not be opened/ })
        .waitFor();
      await file.setInputFiles([
        "public/social/photo-1600607687939-ce8a6c25118c.jpg",
        "public/social/photo-1600210492486-724fe5c67fb0.jpg",
      ]);
      await page.locator(".sp-upload-previews>div").nth(1).getByRole("radio").check();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page.getByRole("button", { name: "Save complete draft" }).click();
      await page.getByRole("heading", { name: "A complete draft, safely kept" }).waitFor();
      await page.reload();
      await page.getByRole("heading", { name: "Property type", exact: true }).waitFor();
      for (let i = 0; i < 4; i++)
        await page.getByRole("button", { name: "Continue", exact: true }).click();
      assert.equal(await page.locator(".sp-upload-previews>div").count(), 2);
      assert.equal(
        await page.locator(".sp-upload-previews>div").nth(1).getByRole("radio").isChecked(),
        true,
      );
      await page.screenshot({ path: path.join(artifacts, "composer-mobile.png"), fullPage: true });
      await page.getByRole("button", { name: "Continue", exact: true }).click();
    },
  );
  await check(
    "Share clipboard fallback and native payload; reduced motion is respected",
    async () => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await goto("/");
      await page.evaluate(() =>
        Object.defineProperty(navigator, "share", { configurable: true, value: undefined }),
      );
      await page
        .locator(".sp-post")
        .first()
        .getByRole("button", { name: /^Share Sunlit/ })
        .click();
      await page.getByRole("status").filter({ hasText: "Property link copied." }).waitFor();
      await page.getByRole("status").filter({ hasText: "Property link copied." }).waitFor();
      assert.match(
        await page.evaluate(() => navigator.clipboard.readText()),
        /\/property\/pp-101$/,
      );
      await page.evaluate(() =>
        Object.defineProperty(navigator, "share", {
          configurable: true,
          value: async (data) => {
            window.__sharePayload = data;
          },
        }),
      );
      await page
        .locator(".sp-post")
        .first()
        .getByRole("button", { name: /^Share Sunlit/ })
        .click();
      await page.waitForFunction(() => window.__sharePayload);
      assert.match(await page.evaluate(() => window.__sharePayload.url), /\/property\/pp-101$/);
      assert.equal(
        await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
        "auto",
      );
    },
  );
  await check("Blocked browser storage reports save failure without a false success", async () => {
    const blocked = await browser.newContext();
    await blocked.addInitScript(() => {
      Storage.prototype.setItem = function () {
        throw new DOMException("Storage blocked", "QuotaExceededError");
      };
    });
    const other = await blocked.newPage();
    await other.goto(base);
    await other
      .locator(".sp-post")
      .first()
      .getByRole("button", { name: /^Save Sunlit/ })
      .click();
    await other.getByRole("status").filter({ hasText: "Could not save changes" }).waitFor();
    assert.equal(
      await other
        .locator(".sp-post")
        .first()
        .getByRole("button", { name: /^Save Sunlit/ })
        .getAttribute("aria-pressed"),
      "false",
    );
    await blocked.close();
  });
  const routes = [
    "/",
    "/explore",
    "/saved",
    "/profiles/premium-property",
    "/profiles/aj-nova-reality",
    "/property/pp-101",
    "/post-property",
    "/account",
    "/reels",
    "/messages",
  ];
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await check(`responsive ${width}px ${route}`, async () => {
        await goto(route);
        const size = await page.evaluate(() => ({
          viewport: innerWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
        }));
        report.responsive.push({ width, route, ...size });
        assert.ok(size.document <= width && size.body <= width, JSON.stringify(size));
      });
    }
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const route of routes) {
      await goto(route);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      report.accessibility.push({
        width,
        route,
        violations: axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
      });
      console.log("AXE", width, route, axe.violations.map((v) => v.id).join(",") || "PASS");
      if (
        [
          "/",
          "/explore",
          "/saved",
          "/profiles/aj-nova-reality",
          "/post-property",
          "/account",
          "/reels",
        ].includes(route)
      ) {
        const name = route === "/" ? "feed" : route.split("/")[1];
        await page.screenshot({
          path: path.join(artifacts, `${name}-${width}.png`),
          fullPage: false,
        });
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await goto("/explore");
  await page.getByRole("button", { name: /^Filters/ }).click();
  const modalAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  report.accessibility.push({
    route: "filter-dialog",
    width: 390,
    violations: modalAxe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
  });
  await page.keyboard.press("Escape");
  for (const route of [
    "/buy",
    "/rent",
    "/commercial",
    "/pg",
    "/plots",
    "/projects",
    "/project/the-canopy",
    "/about",
    "/contact",
    "/services",
    "/guides",
    "/privacy",
    "/terms",
    "/login",
    "/signup",
    "/dashboard",
  ]) {
    await check(`legacy route ${route}`, async () => {
      await goto(route);
      const size = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(size <= 390, `overflow ${size}px`);
    });
  }
  await browser.close();
  report.completed = new Date().toISOString();
  fs.writeFileSync("docs/social-qa-results.json", JSON.stringify(report, null, 2));
  const failures = report.checks.filter((x) => x.status === "failed");
  const violations = report.accessibility.reduce((n, x) => n + x.violations.length, 0);
  console.log(
    JSON.stringify({
      passed: report.checks.length - failures.length,
      failed: failures.length,
      axeViolations: violations,
      pageErrors: report.errors,
    }),
  );
  if (failures.length || violations || report.errors.length) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  fs.writeFileSync(
    "docs/social-qa-results.json",
    JSON.stringify({ ...report, fatal: e.message }, null, 2),
  );
  process.exitCode = 1;
});
