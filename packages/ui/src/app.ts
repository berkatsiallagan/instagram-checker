import { ParseError, diff, parseFiles, toCsv, type Result } from "@follback/core";
import {
  AUTHOR_NAME,
  AUTHOR_SITE,
  AUTHOR_URL,
  DEMO_VIDEO_URL,
  VERSION,
  YEAR,
} from "./config";
import { icon } from "./icons";
import { LANGS, initialLang, saveLang, strings, type Lang, type Strings } from "./i18n";
import { sampleFiles } from "./sample";

export interface MountOptions {
  /** Jika ada, tampilkan tombol Cek yang memanggil fungsi ini (dipakai extension). */
  onCheck?: (
    progress: (text: string) => void
  ) => Promise<{ followers: Set<string>; following: Set<string> }>;
  /** Teks peringatan tambahan di bawah tombol Cek. */
  showWarning?: boolean;
}

export interface AppState {
  result?: Result | null;
  tab?: TabKey;
  query?: string;
  error?: unknown;
}

type TabKey = keyof Result;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> & { className?: string } = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  Object.assign(node, props);
  for (const c of children) node.append(c);
  return node;
}

function externalLink(href: string, ...children: (Node | string)[]): HTMLAnchorElement {
  return el(
    "a",
    { href, target: "_blank", rel: "noopener noreferrer" },
    ...children
  );
}

export function mountApp(
  root: HTMLElement,
  opts: MountOptions = {},
  state: AppState = {}
): void {
  const lang: Lang = initialLang();
  const t: Strings = strings(lang);
  document.documentElement.lang = lang;
  document.title = t.title;

  let result: Result | null = state.result ?? null;
  let tab: TabKey = state.tab ?? "notFollowingBack";
  let query = state.query ?? "";
  let lastError: unknown = state.error ?? null;

  // Language selector
  const langSelect = el(
    "select",
    { className: "lang-select" },
    ...LANGS.map((code) => {
      const opt = el("option", { value: code }, code === "id" ? "Bahasa Indonesia" : "English");
      if (code === lang) opt.selected = true;
      return opt;
    })
  );
  langSelect.setAttribute("aria-label", t.language);
  langSelect.addEventListener("change", () => {
    const nextLang = langSelect.value as Lang;
    saveLang(nextLang);
    mountApp(root, opts, { result, tab, query, error: lastError });
  });

  const topBar = el(
    "div",
    { className: "top-bar" },
    el("div", { className: "lang-picker" }, icon("language"), langSelect)
  );

  const title = el("h1", {}, t.title);
  const subtitle = el("p", { className: "subtitle" }, t.subtitle);

  const fileInput = el("input", {
    type: "file",
    multiple: true,
    accept: ".json,application/json",
  });
  fileInput.hidden = true;

  // Zona unggah: ikon, tombol "Pilih file" yang jelas, dan petunjuk drag-drop.
  const drop = el(
    "div",
    { className: "drop", tabIndex: 0 },
    icon("upload_file", "icon icon-xl"),
    el("span", { className: "btn-fake" }, t.choose),
    el("span", { className: "drop-hint" }, t.dropHint)
  );
  drop.setAttribute("role", "button");
  drop.setAttribute("aria-label", `${t.choose}. ${t.dropHint}`);

  const error = el("p", { className: "error" });
  error.setAttribute("role", "alert");

  const sampleBtn = el(
    "button",
    { className: "link", type: "button" },
    icon("description"),
    t.sample
  );
  const demoLink = externalLink(DEMO_VIDEO_URL, icon("play_circle"), t.demo);
  demoLink.className = "link-inline";

  const actions = el("p", { className: "hint" }, sampleBtn, demoLink);

  let checkBtn: HTMLButtonElement | null = null;
  let checkLabel: HTMLSpanElement | null = null;
  if (opts.onCheck) {
    checkLabel = el("span", {}, t.check);
    checkBtn = el("button", { className: "primary", type: "button" }, icon("refresh"), checkLabel);
  }

  const tabs = el("div", { className: "tabs" });
  tabs.setAttribute("role", "tablist");

  const searchInput = el("input", {
    type: "search",
    placeholder: t.search,
    className: "search",
    value: query,
  });
  searchInput.setAttribute("aria-label", t.search);
  const searchBox = el("div", { className: "searchbox" }, icon("search"), searchInput);

  const exportBtn = el(
    "button",
    { className: "link", type: "button" },
    icon("download"),
    t.exportCsv
  );
  const list = el("ul", { className: "list" });
  const section = el("section", { className: "results" }, tabs, searchBox, list, exportBtn);
  section.hidden = result === null;

  const footer = el(
    "footer",
    { className: "footer" },
    el("p", { className: "privacy" }, icon("lock"), t.privacy),
    el("p", {}, `\u00a9 ${YEAR} Instagram Checker. v${VERSION}`),
    el(
      "p",
      {},
      `${t.developedBy} `,
      Object.assign(
        externalLink(AUTHOR_URL, `${AUTHOR_NAME} (${AUTHOR_SITE})`),
        { title: `Website Architect & Full-Stack Developer: ${AUTHOR_NAME}` }
      )
    )
  );

  const children: (Node | string)[] = [topBar, title, subtitle, drop, fileInput];
  if (checkBtn) children.push(el("p", { className: "check-row" }, checkBtn));
  children.push(actions);
  if (opts.onCheck && opts.showWarning !== false) {
    children.push(el("p", { className: "hint" }, t.warning));
  }
  children.push(error, section, footer);

  root.replaceChildren(el("main", {}, ...children));

  const labels: Record<TabKey, string> = {
    notFollowingBack: t.tabNot,
    fans: t.tabFans,
    mutual: t.tabMutual,
  };

  function renderTabs(): void {
    if (!result) return;
    const current = result;
    tabs.replaceChildren(
      ...(Object.keys(labels) as TabKey[]).map((key) => {
        const b = el(
          "button",
          { type: "button", className: "tab" },
          `${labels[key]} (${current[key].length})`
        );
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", String(key === tab));
        b.addEventListener("click", () => {
          tab = key;
          render();
        });
        return b;
      })
    );
  }

  function renderList(): void {
    if (!result) return;
    const q = query.trim().toLowerCase();
    const names = result[tab].filter((n) => !q || n.includes(q));
    if (names.length === 0) {
      list.replaceChildren(el("li", { className: "empty" }, t.empty));
      return;
    }
    list.replaceChildren(
      ...names.map((name) => {
        const link = externalLink(
          `https://www.instagram.com/${encodeURIComponent(name)}/`,
          icon("open_in_new"),
          t.profile
        );
        link.className = "link-inline";
        return el("li", {}, el("span", {}, name), link);
      })
    );
  }

  function renderError(): void {
    if (!lastError) {
      error.textContent = "";
      return;
    }
    if (lastError instanceof ParseError) {
      error.textContent = t.errors[lastError.code] ?? lastError.message;
    } else if (lastError instanceof Error) {
      error.textContent = lastError.message;
    } else {
      error.textContent = String(lastError);
    }
  }

  function render(): void {
    section.hidden = result === null;
    renderTabs();
    renderList();
    renderError();
  }

  function show(followers: Set<string>, following: Set<string>): void {
    lastError = null;
    result = diff(followers, following);
    tab = "notFollowingBack";
    query = "";
    searchInput.value = "";
    render();
  }

  function fail(e: unknown): void {
    lastError = e;
    result = null;
    render();
  }

  function handleTexts(texts: string[]): void {
    try {
      const { followers, following } = parseFiles(texts);
      show(followers, following);
    } catch (e) {
      fail(e);
    }
  }

  async function handleFiles(files: FileList | File[]): Promise<void> {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    try {
      handleTexts(await Promise.all(arr.map((f) => f.text())));
    } catch (e) {
      fail(e);
    }
  }

  drop.addEventListener("click", () => fileInput.click());
  drop.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  drop.addEventListener("dragover", (e) => {
    e.preventDefault();
    drop.classList.add("active");
  });
  drop.addEventListener("dragleave", () => drop.classList.remove("active"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("active");
    if (e.dataTransfer) void handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files) void handleFiles(fileInput.files);
    fileInput.value = "";
  });

  sampleBtn.addEventListener("click", () => handleTexts(sampleFiles()));

  searchInput.addEventListener("input", () => {
    query = searchInput.value;
    renderList();
  });

  exportBtn.addEventListener("click", () => {
    if (!result) return;
    const blob = new Blob([toCsv(result)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = el("a", { href: url, download: "instagram-checker.csv" });
    a.click();
    URL.revokeObjectURL(url);
  });

  if (checkBtn && checkLabel && opts.onCheck) {
    const run = opts.onCheck;
    const btn = checkBtn;
    const label = checkLabel;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      label.textContent = t.checking;
      try {
        const { followers, following } = await run((text) => {
          label.textContent = `${t.checking} ${text}`;
        });
        show(followers, following);
      } catch (e) {
        fail(e);
      } finally {
        btn.disabled = false;
        label.textContent = t.check;
      }
    });
  }

  // initial render if restoring state
  if (result !== null || lastError !== null) {
    render();
  }
}
