import { diff, parseFiles, toCsv, type Result } from "@follback/core";
import { detectLang, strings, type Strings } from "./i18n";
import { sampleFiles } from "./sample";

export interface MountOptions {
  /** Jika ada, tampilkan tombol Cek yang memanggil fungsi ini (dipakai extension). */
  onCheck?: () => Promise<{ followers: Set<string>; following: Set<string> }>;
  /** Teks peringatan tambahan di bawah tombol Cek. */
  showWarning?: boolean;
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

export function mountApp(root: HTMLElement, opts: MountOptions = {}): void {
  const lang = detectLang();
  const t: Strings = strings(lang);
  document.documentElement.lang = lang;
  document.title = t.title;

  let result: Result | null = null;
  let tab: TabKey = "notFollowingBack";
  let query = "";

  const fileInput = el("input", {
    type: "file",
    multiple: true,
    accept: ".json,application/json",
  });
  fileInput.hidden = true;

  const drop = el("div", { className: "drop", tabIndex: 0 }, t.drop);
  drop.setAttribute("role", "button");

  const error = el("p", { className: "error" });
  error.setAttribute("role", "alert");

  const sampleBtn = el("button", { className: "link", type: "button" }, t.sample);

  const actions = el("p", { className: "hint" }, sampleBtn);
  let checkBtn: HTMLButtonElement | null = null;
  if (opts.onCheck) {
    checkBtn = el("button", { className: "primary", type: "button" }, t.check);
    actions.prepend(checkBtn, " ");
  }
  if (opts.onCheck && opts.showWarning !== false) {
    actions.after(el("p", { className: "hint" }, t.warning));
  }

  const tabs = el("div", { className: "tabs" });
  tabs.setAttribute("role", "tablist");
  const searchInput = el("input", {
    type: "search",
    placeholder: t.search,
    className: "search",
  });
  searchInput.setAttribute("aria-label", t.search);
  const exportBtn = el("button", { className: "link", type: "button" }, t.exportCsv);
  const list = el("ul", { className: "list" });
  const section = el("section", { className: "results" }, tabs, searchInput, list, exportBtn);
  section.hidden = true;

  const footer = el("p", { className: "footer" }, t.privacy);

  const main = el(
    "main",
    {},
    el("h1", {}, t.title),
    drop,
    fileInput,
    actions,
    error,
    section,
    footer
  );
  root.replaceChildren(main);

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
      ...names.map((name) =>
        el(
          "li",
          {},
          el("span", {}, name),
          el(
            "a",
            {
              href: `https://www.instagram.com/${encodeURIComponent(name)}/`,
              target: "_blank",
              rel: "noopener noreferrer",
            },
            t.profile
          )
        )
      )
    );
  }

  function render(): void {
    section.hidden = result === null;
    renderTabs();
    renderList();
  }

  function show(followers: Set<string>, following: Set<string>): void {
    error.textContent = "";
    result = diff(followers, following);
    tab = "notFollowingBack";
    query = "";
    searchInput.value = "";
    render();
  }

  function fail(e: unknown): void {
    result = null;
    render();
    error.textContent = e instanceof Error ? e.message : String(e);
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
    const a = el("a", { href: url, download: "follback.csv" });
    a.click();
    URL.revokeObjectURL(url);
  });

  if (checkBtn && opts.onCheck) {
    const run = opts.onCheck;
    const btn = checkBtn;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.textContent = t.checking;
      try {
        const { followers, following } = await run();
        show(followers, following);
      } catch (e) {
        fail(e);
      } finally {
        btn.disabled = false;
        btn.textContent = t.check;
      }
    });
  }
}
