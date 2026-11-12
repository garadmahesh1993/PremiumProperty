const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => console.log(e.message));
  await p.goto("http://localhost:3000");
  await p.locator(".sp-post").first().waitFor();
  await p.screenshot({ path: "artifacts/social/feed-desktop-first.png" });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.screenshot({ path: "artifacts/social/feed-mobile-first.png" });
  await b.close();
})();
