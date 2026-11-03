import { build } from "esbuild";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const target = process.argv[2] === "firefox" ? "firefox" : "chrome";
const out = `dist/${target}`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

await build({
  entryPoints: { popup: "src/popup.ts", content: "src/content.ts" },
  outdir: out,
  bundle: true,
  format: "iife",
  target: "es2022",
  minify: true,
  sourcemap: false,
});

const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
if (target === "firefox") {
  manifest.browser_specific_settings = {
    gecko: {
      id: "follback-checker@berkatsiallagan.github.io",
      data_collection_permissions: { required: ["none"] },
    },
  };
}
writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest, null, 2));

cpSync("popup.html", `${out}/popup.html`);
cpSync("icons", `${out}/icons`, { recursive: true });
cpSync("../../packages/ui/src/style.css", `${out}/style.css`);
console.log(`Built ${target} extension in ${out}`);
