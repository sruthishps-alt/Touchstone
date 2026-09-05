/* Touchstone service worker.
 *
 * Two jobs: make repeat launches instant, and keep the app usable with no
 * signal. Deliberately conservative about staleness, because the classic
 * service-worker failure is an app frozen on an old version forever:
 *
 *   SHELL  (page, icons, manifest) — cache first, but revalidated in the
 *          background; when a new page arrives the app shows a "new version
 *          ready" bar rather than swapping under the reader's feet.
 *   DATA   (desk.json, spot_30m.json) — NETWORK FIRST, always. A cached price
 *          is a fallback for no-signal, never the preferred answer. Stale
 *          numbers that look live are the one thing this project refuses to do.
 */
const V = "touchstone-v9.79.0";
const SHELL = [
  "./", "./index.html", "./manifest.json", "./icon.svg",
  "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png",
];

self.addEventListener("install", e => {
  // Take over as soon as the new files are cached, instead of sitting in
  // "waiting" until every tab of the old version is closed. On a phone that
  // wait is effectively forever: an installed app is suspended and resumed,
  // not closed and reopened, so the old worker never releases and the user
  // stays on a stale build with no way to know it.
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", e => { if (e.data === "skip") self.skipWaiting(); });

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // data: network first, cache only as a no-signal fallback
  if (url.pathname.includes("/data/")) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req, {cache: "no-store"});
        const c = await caches.open(V);
        c.put(req, fresh.clone()).catch(() => {});
        return fresh;
      } catch (err) {
        const hit = await caches.match(req, {ignoreSearch: true});
        if (hit) return hit;
        throw err;
      }
    })());
    return;
  }

  // shell: cache first, refresh in the background
  e.respondWith((async () => {
    const hit = await caches.match(req, {ignoreSearch: true});
    const net = fetch(req).then(res => {
      if (res && res.ok) caches.open(V).then(c => c.put(req, res.clone())).catch(() => {});
      return res;
    }).catch(() => null);
    return hit || (await net) || new Response("offline", {status: 503});
  })());
});
