import { ParseError, diff, parseFiles, toCsv, type Result, type ExtraCategoryKey } from "@follback/core";
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  DEMO_VIDEO_URL,
  SHOW_DEMO_VIDEO,
  VERSION,
  YEAR,
} from "./config";
import { icon, spinner } from "./icons";
import { LANGS, initialLang, saveLang, strings, type Lang, type Strings } from "./i18n";

export interface MountOptions {
  /** Jika ada, tampilkan tombol Cek yang memanggil fungsi ini (dipakai extension). */
  onCheck?: (
    progress: (text: string) => void
  ) => Promise<{ followers: Set<string>; following: Set<string> }>;
  /** Teks peringatan tambahan di bawah tombol Cek. */
  showWarning?: boolean;
  /** Buka antarmuka di tab browser penuh (khusus extension). */
  onOpenFullTab?: () => void;
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
  hideUnfollowed?: boolean;
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
  extras?: Partial<Record<ExtraCategoryKey, string[]>>;
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
  let hideUnfollowed: boolean = state.hideUnfollowed ?? false;

  // Restore riwayat analisis yang tersimpan jika ada
  if (!result) {
    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      if (raw) {
        const snap: Snapshot = JSON.parse(raw);
        if (Array.isArray(snap?.followers) && Array.isArray(snap?.following)) {
          const fSet = new Set<string>(snap.followers);
          const gSet = new Set<string>(snap.following);
          const extSets: Partial<Record<ExtraCategoryKey, Set<string>>> = {};
          if (snap.extras && typeof snap.extras === "object") {
            for (const [k, v] of Object.entries(snap.extras)) {
              if (Array.isArray(v)) {
                extSets[k as ExtraCategoryKey] = new Set(v as string[]);
              }
            }
          }
          rawFollowers = snap.followers;
          rawFollowing = snap.following;
          result = diff(fSet, gSet, extSets);
        }
      }
    } catch {
      // ignore
    }
  }

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

  const FOLLOWED_KEY = "instagram-checker-followed";
  const followedSet = new Set<string>();
  try {
    const raw = localStorage.getItem(FOLLOWED_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        for (const item of arr) {
          if (typeof item === "string") followedSet.add(item);
        }
      }
    }
  } catch {
    // ignore
  }

  function saveFollowed(): void {
    try {
      localStorage.setItem(FOLLOWED_KEY, JSON.stringify(Array.from(followedSet)));
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
      hideUnfollowed,
    });
  });

  const topBar = el(
    "div",
    { className: "top-bar" },
    el("div", { className: "lang-picker" }, icon("language"), langSelect)
  );

  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }

  // Tombol Pasang PWA di kiri atas (sejajar dengan pilihan bahasa di kanan atas)
  let pwaBtn: HTMLButtonElement | null = null;
  if (!opts.onCheck) {
    const isPwa =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://") ||
        localStorage.getItem("pwa_installed") === "true");

    pwaBtn = el(
      "button",
      {
        type: "button",
        className: "pwa-install-btn",
        title: t.pwaInstallTitle,
      },
      icon("download"),
      el("span", {}, t.pwaInstall)
    );

    if (isPwa) {
      pwaBtn.hidden = true;
    }

    const triggerPwaInstall = async () => {
      const win = window as unknown as { __deferredPwaPrompt?: BeforeInstallPromptEvent };
      if (win.__deferredPwaPrompt) {
        try {
          await win.__deferredPwaPrompt.prompt();
          const choice = await win.__deferredPwaPrompt.userChoice;
          if (choice.outcome === "accepted") {
            if (pwaBtn) pwaBtn.hidden = true;
            try {
              localStorage.setItem("pwa_installed", "true");
            } catch {
              // ignore
            }
          }
        } catch (err) {
          console.warn("PWA install error:", err);
        }
        win.__deferredPwaPrompt = undefined;
      } else {
        const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
        alert(isIos ? t.pwaInstallGuideIos : t.pwaInstallGuideAndroid);
      }
    };

    pwaBtn.addEventListener("click", () => {
      void triggerPwaInstall();
    });

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      (window as unknown as { __deferredPwaPrompt?: BeforeInstallPromptEvent }).__deferredPwaPrompt =
        e as BeforeInstallPromptEvent;
      if (pwaBtn && !isPwa) pwaBtn.hidden = false;
    });

    window.addEventListener("appinstalled", () => {
      if (pwaBtn) pwaBtn.hidden = true;
      try {
        localStorage.setItem("pwa_installed", "true");
      } catch {
        // ignore
      }
    });

    topBar.prepend(pwaBtn);
  }

  if (opts.onOpenFullTab) {
    const fullTabBtn = el(
      "button",
      {
        type: "button",
        className: "link-inline open-full-tab-btn",
        title: "Buka tampilan di tab browser penuh / Open in full browser tab",
      },
      icon("open_in_new"),
      el("span", {}, "Tab Baru")
    );
    fullTabBtn.addEventListener("click", () => {
      opts.onOpenFullTab!();
    });
    topBar.prepend(fullTabBtn);
  }

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
      ...t.guideSteps.map((step) =>
        el(
          "li",
          {},
          el("strong", {}, step.title),
          el("p", { className: "guide-desc" }, step.desc)
        )
      )
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

  const hideCheckbox = el("input", {
    type: "checkbox",
    id: "hide-unfollowed-chk",
  });
  hideCheckbox.checked = hideUnfollowed;
  hideCheckbox.addEventListener("change", () => {
    hideUnfollowed = hideCheckbox.checked;
    renderList();
  });
  const hideLabel = el(
    "label",
    { htmlFor: "hide-unfollowed-chk", className: "hide-toggle" },
    hideCheckbox,
    t.hideUnfollowed
  );

  const filterRow = el(
    "div",
    { className: "filter-row" },
    searchBox,
    sortSelect,
    hideLabel
  );

  const exportBtn = el(
    "button",
    { className: "link", type: "button" },
    icon("download"),
    t.exportCsv
  );

  const copyBtn = el(
    "button",
    { className: "link", type: "button" },
    icon("copy"),
    t.copyUsernames
  );
  copyBtn.addEventListener("click", async () => {
    if (!result) return;
    const currentList = result[tab] ?? [];
    const q = query.trim().toLowerCase();
    let names = currentList.filter((n) => !q || n.includes(q));
    if (tab === "notFollowingBack" && hideUnfollowed) {
      names = names.filter((n) => !unfollowedSet.has(n));
    }
    if (tab === "notFollowingBack" && hideUnfollowed) {
      names = names.filter((n) => !unfollowedSet.has(n));
    }
    if (sortMode === "az") {
      names = [...names].sort((a, b) => a.localeCompare(b));
    } else if (sortMode === "za") {
      names = [...names].sort((a, b) => b.localeCompare(a));
    }
    const textToCopy = names.join("\n");
    try {
      await navigator.clipboard.writeText(textToCopy);
      copyBtn.replaceChildren(icon("copy"), t.copiedUsernames);
      setTimeout(() => {
        copyBtn.replaceChildren(icon("copy"), t.copyUsernames);
      }, 2000);
    } catch {
      // ignore
    }
  });

  const resetBtn = el(
    "button",
    { className: "link", type: "button" },
    icon("refresh"),
    t.resetData
  );
  resetBtn.addEventListener("click", () => {
    if (window.confirm(t.confirmReset)) {
      try {
        localStorage.removeItem(SNAPSHOT_KEY);
        localStorage.removeItem(UNFOLLOWED_KEY);
        localStorage.removeItem(FOLLOWED_KEY);
      } catch {
        // ignore
      }
      result = null;
      rawFollowers = null;
      rawFollowing = null;
      unfollowedSet.clear();
      followedSet.clear();
      render();
    }
  });

  const actionsRow = el("div", { className: "actions-row" }, exportBtn, copyBtn, resetBtn);

  const list = el("ul", { className: "list" });
  const section = el(
    "section",
    { className: "results" },
    historyBox,
    statsBox,
    tabs,
    filterRow,
    list,
    actionsRow
  );
  section.hidden = result === null;

  const footer = el(
    "footer",
    { className: "footer" },
    el("p", { className: "privacy" }, icon("lock"), t.privacy),
    el(
      "p",
      { className: "footer-legal-links" },
      externalLink("https://ig.berkatsiallagan.com/privacy", t.legalPrivacy),
      externalLink("https://ig.berkatsiallagan.com/terms", t.legalTerms),
      externalLink("https://github.com/berkatsiallagan/instagram-checker", "GitHub")
    ),
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

  let extensionBanner: HTMLElement | null = null;
  if (!opts.onCheck) {
    const extLink = externalLink(
      "https://github.com/berkatsiallagan/instagram-checker/releases/latest/download/instagram-checker-chrome.zip",
      t.extensionDownloadText
    );
    extensionBanner = el(
      "div",
      { className: "banner-extension" },
      icon("download"),
      el("span", {}, `${t.extensionBannerPrefix} `),
      extLink,
      el("span", {}, ` ${t.extensionBannerSuffix}`)
    );
  }

  const children: (Node | string)[] = [topBar, title, subtitle, drop];
  if (extensionBanner) children.push(extensionBanner);
  children.push(fileInput, folderInput, guide);
  if (checkBtn) children.push(el("p", { className: "check-row" }, checkBtn));
  if (actions) children.push(actions);
  if (opts.onCheck && opts.showWarning !== false) {
    children.push(el("p", { className: "hint" }, t.warning));
  }
  if (opts.onOpenFullTab && t.tabTip) {
    children.push(el("p", { className: "hint" }, icon("help"), t.tabTip));
  }
  children.push(error, section, footer);

  root.replaceChildren(el("main", {}, ...children));

  const labels: Record<TabKey, string> = {
    notFollowingBack: t.tabNot,
    fans: t.tabFans,
    mutual: t.tabMutual,
    pendingRequests: t.tabPendingRequests,
    recentlyUnfollowed: t.tabRecentlyUnfollowed,
    closeFriends: t.tabCloseFriends,
    blockedProfiles: t.tabBlockedProfiles,
    restrictedProfiles: t.tabRestrictedProfiles,
    hideStoryFrom: t.tabHideStoryFrom,
    recentRequests: t.tabRecentRequests,
    removedSuggestions: t.tabRemovedSuggestions,
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

  function saveSnapshot(
    followers: string[],
    following: string[],
    extras: Partial<Record<ExtraCategoryKey, Set<string>>> = {}
  ): void {
    try {
      const serialExtras: Partial<Record<ExtraCategoryKey, string[]>> = {};
      for (const [k, v] of Object.entries(extras)) {
        if (v && v instanceof Set) {
          serialExtras[k as ExtraCategoryKey] = Array.from(v);
        }
      }
      const snap: Snapshot = {
        time: Date.now(),
        followers,
        following,
        extras: serialExtras,
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

    const cards: HTMLElement[] = [
      el(
        "div",
        { className: "stat-card clickable", tabIndex: 0 },
        el("span", { className: "stat-val" }, String(followingCount)),
        el("span", { className: "stat-lbl" }, t.statsFollowing)
      ),
      el(
        "div",
        { className: "stat-card clickable", tabIndex: 0 },
        el("span", { className: "stat-val" }, String(followersCount)),
        el("span", { className: "stat-lbl" }, t.statsFollowers)
      ),
      el(
        "div",
        { className: "stat-card clickable", tabIndex: 0 },
        el("span", { className: "stat-val" }, String(result.notFollowingBack.length)),
        el("span", { className: "stat-lbl" }, t.statsNotFollback)
      ),
      el(
        "div",
        { className: "stat-card clickable", tabIndex: 0 },
        el("span", { className: "stat-val" }, String(result.fans.length)),
        el("span", { className: "stat-lbl" }, t.statsFans)
      ),
      el(
        "div",
        { className: "stat-card clickable", tabIndex: 0 },
        el("span", { className: "stat-val" }, String(result.mutual.length)),
        el("span", { className: "stat-lbl" }, t.statsMutual)
      ),
      el(
        "div",
        { className: "stat-card highlight" },
        el("span", { className: "stat-val" }, `${rate}%`),
        el("span", { className: "stat-lbl" }, t.statsRate)
      ),
    ];

    cards[2].addEventListener("click", () => {
      tab = "notFollowingBack";
      render();
    });
    cards[3].addEventListener("click", () => {
      tab = "fans";
      render();
    });
    cards[4].addEventListener("click", () => {
      tab = "mutual";
      render();
    });

    const extraKeys: ExtraCategoryKey[] = [
      "pendingRequests",
      "recentlyUnfollowed",
      "closeFriends",
      "blockedProfiles",
      "restrictedProfiles",
      "hideStoryFrom",
      "recentRequests",
      "removedSuggestions",
    ];

    for (const key of extraKeys) {
      const list = result[key];
      if (Array.isArray(list)) {
        const card = el(
          "div",
          { className: "stat-card clickable", tabIndex: 0 },
          el("span", { className: "stat-val" }, String(list.length)),
          el("span", { className: "stat-lbl" }, labels[key])
        );
        card.addEventListener("click", () => {
          tab = key;
          render();
        });
        cards.push(card);
      }
    }

    statsBox.replaceChildren(...cards);
  }

  function renderTabs(): void {
    if (!result) return;
    const current = result;
    const allKeys = Object.keys(labels) as TabKey[];
    const activeKeys = allKeys.filter((key) => {
      if (key === "notFollowingBack" || key === "fans" || key === "mutual") return true;
      const list = current[key];
      return Array.isArray(list);
    });

    tabs.replaceChildren(
      ...activeKeys.map((key) => {
        const count = current[key]?.length ?? 0;
        const b = el(
          "button",
          { type: "button", className: "tab" },
          `${labels[key]} (${count})`
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
    const currentList = result[tab] ?? [];
    let names = currentList.filter((n) => !q || n.includes(q));
    if (tab === "notFollowingBack" && hideUnfollowed) {
      names = names.filter((n) => !unfollowedSet.has(n));
    }
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
        const isFollowed = followedSet.has(name);
        const actionLabel = tab === "notFollowingBack" ? t.actionUnfollow : t.profile;
        const link = externalLink(
          `https://www.instagram.com/${encodeURIComponent(name)}/`,
          actionLabel
        );
        link.className = "link-inline";

        // Tab-specific action
        if (tab === "notFollowingBack") {
          link.addEventListener("click", () => {
            unfollowedSet.add(name);
            saveUnfollowed();
            renderList();
          });
        } else if (tab === "fans") {
          link.addEventListener("click", () => {
            setTimeout(() => {
              if (window.confirm(t.confirmFollow)) {
                followedSet.add(name);
                saveFollowed();
                renderList();
              }
            }, 250);
          });
        }
        // Di tab mutual dan kategori lainnya: tidak ada popup

        const nameSpan = el("span", { className: "username" }, name);
        const userBoxChildren: (Node | string)[] = [nameSpan];

        if (tab === "notFollowingBack" && isUnfollowed) {
          userBoxChildren.push(
            el("span", { className: "badge-unfollowed" }, `(${t.unfollowedBadge})`)
          );
        } else if (tab === "fans" && isFollowed) {
          userBoxChildren.push(
            el("span", { className: "badge-followed" }, `(${t.followedBadge})`)
          );
        }

        const isActionable = tab === "notFollowingBack" || tab === "fans";
        const userBox = el(
          "div",
          { className: `user-box${isActionable ? " clickable" : ""}` },
          ...userBoxChildren
        );

        if (tab === "notFollowingBack") {
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
        } else if (tab === "fans") {
          userBox.title = isFollowed ? t.followedBadge : "";
          userBox.addEventListener("click", () => {
            if (followedSet.has(name)) {
              followedSet.delete(name);
            } else {
              followedSet.add(name);
            }
            saveFollowed();
            renderList();
          });
        }

        let liClass = "";
        if (tab === "notFollowingBack" && isUnfollowed) {
          liClass = "unfollowed";
        } else if (tab === "fans" && isFollowed) {
          liClass = "followed";
        }

        return el(
          "li",
          { className: liClass },
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
    hideLabel.style.display = tab === "notFollowingBack" ? "inline-flex" : "none";
    renderHistory();
    renderStats();
    renderTabs();
    renderList();
    renderError();
  }

  function show(
    followers: Set<string>,
    following: Set<string>,
    extras: Partial<Record<ExtraCategoryKey, Set<string>>> = {}
  ): void {
    lastError = null;
    const fList = Array.from(followers);
    const gList = Array.from(following);
    rawFollowers = fList;
    rawFollowing = gList;
    result = diff(followers, following, extras);
    tab = "notFollowingBack";
    query = "";
    searchInput.value = "";
    render();
    saveSnapshot(fList, gList, extras);
  }

  function fail(e: unknown): void {
    lastError = e;
    result = null;
    render();
  }

  function handleTexts(items: (string | { name?: string; text: string })[]): void {
    try {
      const { followers, following, extras } = parseFiles(items);
      show(followers, following, extras);
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
      const parsedItems = await Promise.all(
        targetFiles.map(async (f) => ({
          name: f.name,
          text: await f.text(),
        }))
      );
      handleTexts(parsedItems);
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
      btn.replaceChildren(spinner("icon spinner"), label);
      label.textContent = t.checking;
      try {
        const { followers, following } = await run((text) => {
          label.textContent = text;
        });
        show(followers, following);
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } catch (e) {
        fail(e);
      } finally {
        btn.disabled = false;
        btn.replaceChildren(icon("refresh"), label);
        label.textContent = t.check;
      }
    });
  }

  // initial render if restoring state
  if (result !== null || lastError !== null) {
    render();
    if (result !== null && opts.onCheck) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }
}
