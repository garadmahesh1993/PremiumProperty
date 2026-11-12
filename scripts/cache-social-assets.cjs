const fs = require("fs");
(async () => {
  const ids = [
    ...new Set(
      [...fs.readFileSync("lib/demo-data.ts", "utf8").matchAll(/photo-\d+-[a-z0-9]+/g)].map(
        (m) => m[0],
      ),
    ),
  ];
  const manifest = {};
  await Promise.all(
    ids.map(async (id) => {
      try {
        const r = await fetch(
          "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1400&q=80",
          { signal: AbortSignal.timeout(20000) },
        );
        if (!r.ok) throw Error(r.status);
        fs.writeFileSync("public/social/" + id + ".jpg", Buffer.from(await r.arrayBuffer()));
        manifest[id] = "/social/" + id + ".jpg";
      } catch {
        console.log("Unavailable", id);
      }
    }),
  );
  fs.writeFileSync("lib/social/images.json", JSON.stringify(manifest, null, 2));
  console.log("Cached", Object.keys(manifest).length, "existing property photos");
})();
