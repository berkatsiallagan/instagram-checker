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

async function check(
  progress: (text: string) => void
): Promise<{ followers: Set<string>; following: Set<string> }> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.startsWith("https://www.instagram.com/")) {
    throw new Error(
      "Buka instagram.com dan login dulu, lalu klik Cek lagi. / Open instagram.com and log in first, then click Check again."
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
        "Tidak ada respons dari halaman. Muat ulang tab Instagram lalu coba lagi. / No response from the page. Reload the Instagram tab and try again."
      );
    }
    if (!res.ok) throw new Error(res.error);
    return { followers: new Set(res.followers), following: new Set(res.following) };
  } finally {
    chrome.runtime.onMessage.removeListener(listener);
  }
}

mountApp(document.getElementById("root") as HTMLElement, {
  onCheck: check,
  onOpenFullTab: () => {
    void chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
  },
});
