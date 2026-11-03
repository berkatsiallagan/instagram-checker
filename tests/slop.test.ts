import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const IGNORED_DIRS = new Set(["node_modules", ".git", "dist", ".next", "out"]);
const TEXT_EXT = /\.(ts|tsx|css|html|md|json|yml|mjs)$/;

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (TEXT_EXT.test(name) && name !== "package-lock.json") acc.push(full);
  }
  return acc;
}

const files = walk(ROOT).map((f) => ({
  path: relative(ROOT, f).split(sep).join("/"),
  text: readFileSync(f, "utf8"),
}));

const only = (prefixes: string[], pattern?: RegExp) =>
  files.filter(
    (f) =>
      prefixes.some((p) => f.path.startsWith(p)) && (!pattern || pattern.test(f.path))
  );

/** Kumpulkan "path:baris" untuk setiap kecocokan regex. */
function hits(list: typeof files, re: RegExp): string[] {
  const out: string[] = [];
  for (const f of list) {
    f.text.split(/\r?\n/).forEach((line, i) => {
      if (re.test(line)) out.push(`${f.path}:${i + 1}`);
    });
  }
  return out;
}

describe("anti-slop: teks", () => {
  it("tidak ada em dash", () => {
    expect(hits(files, /\u2014/)).toEqual([]);
  });

  it("tidak ada emoji", () => {
    expect(hits(files, /\p{Extended_Pictographic}/u)).toEqual([]);
  });

  it("tidak ada ikon atau font yang dilarang", () => {
    const re = /lucide|fonts\.googleapis|fonts\.gstatic|next\/font|\bGeist\b|Space Grotesk|font-family:[^;]*\bInter\b/i;
    expect(hits(files.filter((f) => !f.path.startsWith("tests/")), re)).toEqual([]);
  });
});

describe("anti-slop: CSS", () => {
  const css = only(["packages/ui/src", "apps"], /\.css$/);

  it("ada berkas CSS yang diperiksa", () => {
    expect(css.length).toBeGreaterThan(0);
  });

  it("semua border-radius bernilai 0", () => {
    const bad: string[] = [];
    for (const f of css) {
      for (const m of f.text.matchAll(/border-radius:\s*([^;}]+)/g)) {
        if (m[1].trim() !== "0") bad.push(`${f.path}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("tanpa gradien, bayangan, blur, hover, dan keyframes", () => {
    expect(hits(css, /gradient|box-shadow|text-shadow|backdrop-filter|filter:\s*blur|:hover|@keyframes/)).toEqual([]);
  });

  it("transition dan animation hanya bernilai none", () => {
    const bad: string[] = [];
    for (const f of css) {
      for (const m of f.text.matchAll(/(?:^|[;{\s])(transition|animation)(?:-[a-z-]+)?:\s*([^;}]+)/g)) {
        if (m[2].trim() !== "none") bad.push(`${f.path}: ${m[0].trim()}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe("privasi", () => {
  const clientCode = [
    ...only(["packages/ui/src"], /\.ts$/),
    ...only(["apps/web/app"], /\.tsx?$/),
    ...only(["apps/extension/src/popup.ts"]),
    ...only(["packages/core/src"], /\.ts$/),
  ];

  it("ada kode klien yang diperiksa", () => {
    expect(clientCode.length).toBeGreaterThan(0);
  });

  it("UI, website, popup, dan core tidak melakukan request jaringan", () => {
    expect(
      hits(clientCode, /(?<![\w-])fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource/)
    ).toEqual([]);
  });

  it("tidak ada URL absolut selain host yang diizinkan di kode klien", () => {
    const allowed =
      /^https?:\/\/(www\.(instagram|youtube)\.com|berkatsiallagan\.com|instagram-checker\.pages\.dev|schema\.org)(\/|$|["'`])|^http:\/\/www\.w3\.org\/2000\/svg$/;
    const bad: string[] = [];
    for (const f of clientCode) {
      for (const m of f.text.matchAll(/https?:\/\/[^\s"'`)]+/g)) {
        if (!allowed.test(m[0])) bad.push(`${f.path}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("CSP website melarang koneksi keluar", () => {
    const headers = readFileSync(join(ROOT, "apps/web/public/_headers"), "utf8");
    expect(headers).toContain("connect-src 'none'");
    expect(headers).toContain("frame-ancestors 'none'");
  });

  it("manifest extension hanya meminta host instagram.com dan tanpa permissions lain", () => {
    const manifest = JSON.parse(
      files.find((f) => f.path === "apps/extension/manifest.json")!.text
    );
    expect(manifest.host_permissions).toEqual(["https://www.instagram.com/*"]);
    expect(manifest.permissions).toBeUndefined();
    expect(manifest.content_security_policy.extension_pages).toContain("connect-src 'none'");
  });

  it("content script hanya fetch ke path relatif instagram.com", () => {
    const content = files.find((f) => f.path === "apps/extension/src/content.ts")!;
    expect(content.text).not.toMatch(/fetch\(\s*["'`]https?:/);
  });
});
