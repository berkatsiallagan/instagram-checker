import { mountApp } from "@follback/ui";

interface FetchOk {
  ok: true;
  followers: string[];
  following: string[];
}
interface FetchFail {
  ok: false;
  error: string;
}

interface StateRes {
  ok: boolean;
  status: "idle" | "running" | "done";
  progress?: string;
  result?: {
    time: number;
    followers: string[];
    following: string[];
  };
}

const SNAPSHOT_KEY = "instagram-checker-snapshot";

async function getInstagramTab(): Promise<chrome.tabs.Tab> {
  // 1. Cek tab aktif saat ini di jendela aktif (misal user klik icon ekstensi saat di tab IG)
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab?.id && activeTab.url && activeTab.url.startsWith("https://www.instagram.com/")) {
    return activeTab;
  }

  // 2. Jika bukan tab aktif (misal user lagi buka popup.html di Tab Baru), cari tab instagram.com manapun di browser
  const igTabs = await chrome.tabs.query({ url: "*://*.instagram.com/*" });
  const found = igTabs.find(
    (t) => t.id && t.url && t.url.startsWith("https://www.instagram.com/")
  );
  if (found) {
    return found;
  }

  throw new Error(
    "Tab instagram.com tidak ditemukan. Buka instagram.com di salah satu tab browser dan pastikan sudah login, lalu klik Cek lagi. / Instagram tab not found. Open instagram.com in a browser tab and ensure you are logged in, then click Check again."
  );
}

async function check(
  progress: (text: string) => void
): Promise<{ followers: Set<string>; following: Set<string> }> {
  const tab = await getInstagramTab();
  if (!tab.id) {
    throw new Error(
      "Tab instagram.com tidak valid. Muat ulang tab Instagram lalu coba lagi. / Invalid Instagram tab. Reload the Instagram tab and retry."
    );
  }

  const listener = (msg: unknown) => {
    const m = msg as { type?: string; text?: string };
    if (m?.type === "follback-progress" && m.text) progress(m.text);
  };
  chrome.runtime.onMessage.addListener(listener);

  try {
    const res = (await chrome.tabs.sendMessage(tab.id, {
      type: "follback-fetch",
    })) as FetchOk | FetchFail | undefined;
    if (!res) {
      throw new Error(
        "Tidak ada respons dari tab Instagram. Muat ulang (refresh) tab instagram.com lalu coba lagi. / No response from Instagram tab. Reload the Instagram tab and try again."
      );
    }
    if (!res.ok) throw new Error(res.error);
    return { followers: new Set(res.followers), following: new Set(res.following) };
  } finally {
    chrome.runtime.onMessage.removeListener(listener);
  }
}

const mountOpts = {
  onCheck: check,
};

const rootEl = document.getElementById("root") as HTMLElement;

// Pasang aplikasi UI
mountApp(rootEl, mountOpts);

// Periksa apakah di tab Instagram sudah ada hasil selesai atau proses yang masih berjalan di latar belakang
async function checkBackgroundState(): Promise<void> {
  try {
    const tab = await getInstagramTab();
    if (!tab?.id) return;
    const state = (await chrome.tabs.sendMessage(tab.id, {
      type: "follback-get-state",
    })) as StateRes | undefined;

    if (!state || !state.ok) return;

    if (state.status === "done" && state.result) {
      let localTime = 0;
      try {
        const raw = localStorage.getItem(SNAPSHOT_KEY);
        if (raw) {
          const snap = JSON.parse(raw);
          localTime = snap.time || 0;
        }
      } catch {
        // ignore
      }
      if (!localTime || state.result.time > localTime) {
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(state.result));
        mountApp(rootEl, mountOpts);
      }
    } else if (state.status === "running") {
      // Ada proses yang sedang berjalan di background tab Instagram
      const btn = document.querySelector<HTMLButtonElement>(".check-row button");
      if (btn && !btn.disabled) {
        btn.click();
      }
    }
  } catch {
    // Normal jika tab Instagram belum dibuka
  }
}

void checkBackgroundState();
