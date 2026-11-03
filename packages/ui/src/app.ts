import { ParseError, diff, parseFiles, toCsv, type Result } from "@follback/core";
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  DEMO_VIDEO_URL,
  SHOW_DEMO_VIDEO,
  VERSION,
  YEAR,
} from "./config";
import { icon } from "./icons";
import { LANGS, initialLang, saveLang, strings, type Lang, type Strings } from "./i18n";

export interface MountOptions {
  /** Jika ada, tampilkan tombol Cek yang memanggil fungsi ini (dipakai extension). */
  onCheck?: (
    progress: (text: string) => void
  ) => Promise<{ followers: Set<string>; following: Set<string> }>;
  /** Teks peringatan tambahan di bawah tombol Cek. */
  showWarning?: boolean;
}

export type SortMode = "default" | "az" | "za";

export interface AppState {
  result?: Result | null;
  tab?: TabKey;
  query?: string;
  error?: unknown;
  sortMode?: SortMode;
  rawFollowers?: string[];
  rawFollowing?: string[];
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

const SNAPSHOT_KEY = "instagram-checker-snapshot";

interface Snapshot {
  time: number;
  followers: string[];
  following: string[];
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
  let sortMode: SortMode = state.sortMode ?? "default";
  let rawFollowers: string[] | null = state.rawFollowers ?? null;
  let rawFollowing: string[] | null = state.rawFollowing ?? null;

  const UNFOLLOWED_KEY = "instagram-checker-unfollowed";
  const unfollowedSet = new Set<string>();
  try {
    const raw = localStorage.getItem(UNFOLLOWED_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        for (const item of arr) {
          if (typeof item === "string") unfollowedSet.add(item);
        }
      }
    }
  } catch {
    // ignore
  }

  function saveUnfollowed(): void {
    try {
      localStorage.setItem(UNFOLLOWED_KEY, JSON.stringify(Array.from(unfollowedSet)));
    } catch {
      // ignore
    }
  }

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
    mountApp(root, opts, {
      result,
      tab,
      query,
      error: lastError,
      sortMode,
      rawFollowers: rawFollowers ?? undefined,
      rawFollowing: rawFollowing ?? undefined,
    });
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

  const folderInput = el("input", {
    type: "file",
  });
  folderInput.setAttribute("webkitdirectory", "");
  folderInput.setAttribute("directory", "");
  folderInput.hidden = true;

  const chooseFileBtn = el("span", { className: "btn-fake" }, t.choose);
  const chooseFolderBtn = el(
    "span",
    { className: "btn-fake btn-folder" },
    t.chooseFolder
  );

  chooseFileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  chooseFolderBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    folderInput.click();
  });

  const btnRow = el("div", { className: "drop-btn-row" }, chooseFileBtn, chooseFolderBtn);

  // Zona unggah hybrid: bisa klik pilih file, pilih folder, atau drag folder/file langsung.
  const drop = el(
    "div",
    { className: "drop" },
    icon("upload_file", "icon icon-xl"),
    btnRow,
    el("span", { className: "drop-hint" }, t.dropHint)
  );
  drop.setAttribute("role", "region");
  drop.setAttribute("aria-label", `${t.choose}. ${t.chooseFolder}. ${t.dropHint}`);

  const guide = el(
    "details",
    { className: "guide" },
    el("summary", { className: "guide-summary" }, icon("help"), t.guideTitle),
    el(
      "ol",
      { className: "guide-steps" },
      el("li", {}, t.guideStep1),
      el("li", {}, t.guideStep2),
      el("li", {}, t.guideStep3)
    ),
    el("p", { className: "guide-note" }, t.guideNote)
  );

  const error = el("p", { className: "error" });
  error.setAttribute("role", "alert");

  let actions: HTMLElement | null = null;
  if (SHOW_DEMO_VIDEO) {
    const demoLink = externalLink(DEMO_VIDEO_URL, icon("play_circle"), t.demo);
    demoLink.className = "link-inline";
    actions = el("p", { className: "hint" }, demoLink);
  }

  let checkBtn: HTMLButtonElement | null = null;
  let checkLabel: HTMLSpanElement | null = null;
  if (opts.onCheck) {
    checkLabel = el("span", {}, t.check);
    checkBtn = el("button", { className: "primary", type: "button" }, icon("refresh"), checkLabel);
  }

  const historyBox = el("div", { className: "history-box" });
  const statsBox = el("div", { className: "stats-box" });

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

  const sortSelect = el(
    "select",
    { className: "sort-select" },
    el("option", { value: "default" }, t.sortDefault),
    el("option", { value: "az" }, t.sortAz),
    el("option", { value: "za" }, t.sortZa)
  );
  sortSelect.setAttribute("aria-label", t.sortDefault);
  sortSelect.value = sortMode;
  sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value as SortMode;
    renderList();
  });

  const filterRow = el("div", { className: "filter-row" }, searchBox, sortSelect);

  const exportBtn = el(
    "button",
    { className: "link", type: "button" },
    icon("download"),
    t.exportCsv
  );
  const list = el("ul", { className: "list" });
  const section = el(
    "section",
    { className: "results" },
    historyBox,
    statsBox,
    tabs,
    filterRow,
    list,
    exportBtn
  );
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
        externalLink(AUTHOR_URL, AUTHOR_NAME),
        { title: `Website Architect & Full-Stack Developer: ${AUTHOR_NAME}` }
      )
    )
  );

  const children: (Node | string)[] = [topBar, title, subtitle, drop, fileInput, folderInput, guide];
  if (checkBtn) children.push(el("p", { className: "check-row" }, checkBtn));
  if (actions) children.push(actions);
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

  function getHistoryDiff(currentFollowers: string[]): { hasPrev: boolean; lost: string[] } {
    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      if (!raw) return { hasPrev: false, lost: [] };
      const snap: Snapshot = JSON.parse(raw);
      if (!Array.isArray(snap?.followers)) return { hasPrev: false, lost: [] };
      const currSet = new Set(currentFollowers);
      const lost = snap.followers.filter((u) => !currSet.has(u));
      return { hasPrev: true, lost };
    } catch {
      return { hasPrev: false, lost: [] };
    }
  }

  function saveSnapshot(followers: string[], following: string[]): void {
    try {
      const snap: Snapshot = {
        time: Date.now(),
        followers,
        following,
      };
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snap));
    } catch {
      // ignore
    }
  }

  function renderHistory(): void {
    if (!rawFollowers) {
      historyBox.replaceChildren();
      return;
    }
    const { hasPrev, lost } = getHistoryDiff(rawFollowers);
    if (!hasPrev) {
      historyBox.replaceChildren();
      return;
    }
    if (lost.length > 0) {
      historyBox.replaceChildren(
        el(
          "div",
          { className: "history-card alert" },
          icon("history"),
          el(
            "div",
            { className: "history-info" },
            el("strong", {}, `${t.historyNewUnfollowers} (${lost.length}): `),
            el("span", { className: "history-list" }, lost.join(", "))
          )
        )
      );
    } else {
      historyBox.replaceChildren(
        el(
          "div",
          { className: "history-card ok" },
          icon("history"),
          el("span", {}, t.historyNone)
        )
      );
    }
  }

  function renderStats(): void {
    if (!result || !rawFollowers || !rawFollowing) {
      statsBox.replaceChildren();
      return;
    }
    const followingCount = rawFollowing.length;
    const followersCount = rawFollowers.length;
    const rate = followingCount > 0 ? Math.round((result.mutual.length / followingCount) * 100) : 0;

    statsBox.replaceChildren(
      el(
        "div",
        { className: "stat-card" },
        el("span", { className: "stat-val" }, String(followingCount)),
        el("span", { className: "stat-lbl" }, t.statsFollowing)
      ),
      el(
        "div",
        { className: "stat-card" },
        el("span", { className: "stat-val" }, String(followersCount)),
        el("span", { className: "stat-lbl" }, t.statsFollowers)
      ),
      el(
        "div",
        { className: "stat-card" },
        el("span", { className: "stat-val" }, String(result.notFollowingBack.length)),
        el("span", { className: "stat-lbl" }, t.statsNotFollback)
      ),
      el(
        "div",
        { className: "stat-card" },
        el("span", { className: "stat-val" }, String(result.mutual.length)),
        el("span", { className: "stat-lbl" }, t.statsMutual)
      ),
      el(
        "div",
        { className: "stat-card highlight" },
        el("span", { className: "stat-val" }, `${rate}%`),
        el("span", { className: "stat-lbl" }, t.statsRate)
      )
    );
  }

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
    let names = result[tab].filter((n) => !q || n.includes(q));
    if (sortMode === "az") {
      names = [...names].sort((a, b) => a.localeCompare(b));
    } else if (sortMode === "za") {
      names = [...names].sort((a, b) => b.localeCompare(a));
    }
    if (names.length === 0) {
      list.replaceChildren(el("li", { className: "empty" }, t.empty));
      return;
    }
    list.replaceChildren(
      ...names.map((name) => {
        const isUnfollowed = unfollowedSet.has(name);
        const link = externalLink(
          `https://www.instagram.com/${encodeURIComponent(name)}/`,
          t.profile
        );
        link.className = "link-inline";
        link.addEventListener("click", () => {
          setTimeout(() => {
            if (window.confirm(t.confirmUnfollow)) {
              unfollowedSet.add(name);
              saveUnfollowed();
              renderList();
            }
          }, 250);
        });

        const nameSpan = el("span", { className: "username" }, name);
        const userBoxChildren: (Node | string)[] = [nameSpan];
        if (isUnfollowed) {
          userBoxChildren.push(
            el("span", { className: "badge-unfollowed" }, `(${t.unfollowedBadge})`)
          );
        }
        const userBox = el("div", { className: "user-box" }, ...userBoxChildren);
        userBox.title = isUnfollowed ? t.unfollowedBadge : "";
        userBox.addEventListener("click", () => {
          if (unfollowedSet.has(name)) {
            unfollowedSet.delete(name);
          } else {
            unfollowedSet.add(name);
          }
          saveUnfollowed();
          renderList();
        });

        return el(
          "li",
          { className: isUnfollowed ? "unfollowed" : "" },
          userBox,
          link
        );
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
    renderHistory();
    renderStats();
    renderTabs();
    renderList();
    renderError();
  }

  function show(followers: Set<string>, following: Set<string>): void {
    lastError = null;
    const fList = Array.from(followers);
    const gList = Array.from(following);
    rawFollowers = fList;
    rawFollowing = gList;
    result = diff(followers, following);
    tab = "notFollowingBack";
    query = "";
    searchInput.value = "";
    render();
    saveSnapshot(fList, gList);
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

  interface FileEntryLike {
    isFile: boolean;
    isDirectory: boolean;
    file(success: (file: File) => void, error?: (err: unknown) => void): void;
    createReader(): {
      readEntries(
        success: (entries: FileEntryLike[]) => void,
        error?: (err: unknown) => void
      ): void;
    };
  }

  async function extractFilesFromDataTransfer(dataTransfer: DataTransfer): Promise<File[]> {
    const items = dataTransfer.items;
    if (items && items.length > 0) {
      const entries: FileEntryLike[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (
          typeof (item as unknown as { webkitGetAsEntry?: () => unknown }).webkitGetAsEntry ===
          "function"
        ) {
          const entry = (
            item as unknown as { webkitGetAsEntry: () => FileEntryLike | null }
          ).webkitGetAsEntry();
          if (entry) entries.push(entry);
        }
      }
      if (entries.length > 0) {
        const collected: File[] = [];
        async function scan(entry: FileEntryLike): Promise<void> {
          if (entry.isFile) {
            await new Promise<void>((resolve) => {
              entry.file(
                (f) => {
                  collected.push(f);
                  resolve();
                },
                () => resolve()
              );
            });
          } else if (entry.isDirectory) {
            const reader = entry.createReader();
            const subEntries = await new Promise<FileEntryLike[]>((resolve) => {
              reader.readEntries(
                (res) => resolve(res),
                () => resolve([])
              );
            });
            for (const sub of subEntries) {
              await scan(sub);
            }
          }
        }
        for (const entry of entries) {
          await scan(entry);
        }
        if (collected.length > 0) return collected;
      }
    }
    return Array.from(dataTransfer.files || []);
  }

  async function handleFiles(files: FileList | File[]): Promise<void> {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    const jsonFiles = arr.filter(
      (f) => f.name.toLowerCase().endsWith(".json") || f.type.includes("json")
    );
    const targetFiles = jsonFiles.length > 0 ? jsonFiles : arr;
    try {
      handleTexts(await Promise.all(targetFiles.map((f) => f.text())));
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
  drop.addEventListener("drop", async (e) => {
    e.preventDefault();
    drop.classList.remove("active");
    if (e.dataTransfer) {
      const files = await extractFilesFromDataTransfer(e.dataTransfer);
      void handleFiles(files);
    }
  });
  fileInput.addEventListener("change", () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (fileInput.files) void handleFiles(fileInput.files);
    fileInput.value = "";
  });
  folderInput.addEventListener("change", () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (folderInput.files) void handleFiles(folderInput.files);
    folderInput.value = "";
  });

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
