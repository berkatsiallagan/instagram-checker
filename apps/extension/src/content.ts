import { parseApiPage } from "@follback/core";

// App ID web Instagram yang dipakai situs instagram.com sendiri.
const IG_APP_ID = "936619743392459";
const PAGE_SIZE = 100;
// Batas keras per daftar: 100 halaman x 100 = 10.000 akun.
const MAX_PAGES = 100;
const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 3000;

type Kind = "followers" | "following";

class FetchError extends Error {}

function cookie(name: string): string {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = () =>
  MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

function report(text: string): void {
  void chrome.runtime.sendMessage({ type: "follback-progress", text });
}

async function fetchList(
  kind: Kind,
  userId: string,
  csrf: string
): Promise<string[]> {
  const names = new Set<string>();
  let maxId: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const qs = new URLSearchParams({ count: String(PAGE_SIZE) });
    if (maxId) qs.set("max_id", maxId);

    const res = await fetch(
      `/api/v1/friendships/${encodeURIComponent(userId)}/${kind}/?${qs}`,
      {
        credentials: "include",
        headers: {
          "x-ig-app-id": IG_APP_ID,
          "x-csrftoken": csrf,
          "x-requested-with": "XMLHttpRequest",
        },
      }
    );

    if (res.status === 429) {
      throw new FetchError(
        "Instagram membatasi permintaan (429). Tunggu beberapa menit, atau pakai file JSON. / Instagram rate limited the requests (429). Wait a few minutes, or use the JSON files."
      );
    }
    if (res.status === 401 || res.status === 403) {
      throw new FetchError(
        "Sesi Instagram ditolak. Login ulang lalu coba lagi. / Instagram rejected the session. Log in again and retry."
      );
    }
    if (!res.ok) {
      throw new FetchError(`Instagram membalas status ${res.status}.`);
    }

    const parsed = parseApiPage(await res.json());
    parsed.usernames.forEach((n) => names.add(n));
    const stage = kind === "followers" ? "1/2" : "2/2";
    const stageLabel = kind === "followers" ? "Followers" : "Following";
    report(`Tahap ${stage}: ${stageLabel} (${names.size})`);

    if (!parsed.nextMaxId) return [...names];
    maxId = parsed.nextMaxId;
    await sleep(jitter());
  }
  return [...names];
}

let running = false;

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg || msg.type !== "follback-fetch") return false;

  if (running) {
    sendResponse({ ok: false, error: "Pengecekan masih berjalan." });
    return false;
  }

  const userId = cookie("ds_user_id");
  const csrf = cookie("csrftoken");
  if (!userId || !csrf) {
    sendResponse({
      ok: false,
      error:
        "Kamu belum login di Instagram. / You are not logged in to Instagram.",
    });
    return false;
  }

  running = true;
  (async () => {
    try {
      report("Tahap 1/2: Memeriksa followers...");
      const followers = await fetchList("followers", userId, csrf);
      await sleep(jitter());
      report("Tahap 2/2: Memeriksa following...");
      const following = await fetchList("following", userId, csrf);
      sendResponse({ ok: true, followers, following });
    } catch (e) {
      sendResponse({
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      });
    } finally {
      running = false;
    }
  })();

  return true; // respons async
});
