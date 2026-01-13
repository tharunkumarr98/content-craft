/*
  subscribe-trigger.ts
  - Site-wide, framework-agnostic trigger that dispatches a `openSubscribeDialog` event
    when the user reaches a configurable scroll depth (default 80%).
  - Uses rAF throttling and a debounce to avoid heavy scroll work.
  - Honors localStorage key `subscribe_dialog_closed_until` so it won't reopen for users
    who closed the dialog (the SubscribeDialog component reads the same key).
  - Disable by setting `window.SUBSCRIBE_POPUP_DISABLED = true` before this script runs.
  - Configure via `window.SUBSCRIBE_POPUP_CONFIG = { threshold, debounceMs, storageKey }`.
*/

if (typeof window !== "undefined") {
  // Quick opt-out
  const globalAny: any = window as any;
  if (globalAny.SUBSCRIBE_POPUP_DISABLED) {
    // noop
  } else {
  const cfg = globalAny.SUBSCRIBE_POPUP_CONFIG || {};
  const THRESHOLD = typeof cfg.threshold === "number" ? Math.max(0, Math.min(1, cfg.threshold)) : 0.8;
  const DEBOUNCE_MS = typeof cfg.debounceMs === "number" ? cfg.debounceMs : 500;
  const STORAGE_KEY_BASE = cfg.storageKey || "subscribe_dialog_closed_until";
  const PER_PAGE = cfg.perPage !== undefined ? Boolean(cfg.perPage) : true; // default: per-page
  const DEBUG = cfg.debug === true;
  const STORAGE_KEY = PER_PAGE ? `${STORAGE_KEY_BASE}:${location.pathname}` : STORAGE_KEY_BASE;
    const SHOW_ONCE_PER_LOAD = true;

  let shownThisLoad = false;
    let throttleScheduled = false;
    let pendingTimer: number | null = null;
  let lastLocation = location.href;

    function isClosedForUser(): boolean {
      try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (!v) return false;
        const ts = parseInt(v, 10);
        if (Number.isNaN(ts)) return false;
        return Date.now() < ts;
      } catch (err) {
        return false;
      }
    }

    function currentScrollRatio(): number {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = (window.scrollY || window.pageYOffset || doc.scrollTop || body.scrollTop || 0);
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, doc.clientHeight, doc.scrollHeight, doc.offsetHeight);
      const winH = window.innerHeight || doc.clientHeight || 0;
      const maxScrollable = Math.max(0, docHeight - winH);
      if (maxScrollable === 0) return 1;
      return (scrollTop / maxScrollable);
    }

    let dialogReady = false;
    window.addEventListener("subscribeDialogReady", () => {
      dialogReady = true;
      if (DEBUG) console.log("[subscribe-trigger] subscribeDialogReady received");
    });

    function onScrollCheck() {
      if (throttleScheduled) return;
      throttleScheduled = true;
      requestAnimationFrame(() => {
        throttleScheduled = false;
        if (shownThisLoad || isClosedForUser()) return;
        const ratio = currentScrollRatio();
        if (ratio >= THRESHOLD) {
          if (pendingTimer) window.clearTimeout(pendingTimer);
          pendingTimer = window.setTimeout(() => {
            if (shownThisLoad || isClosedForUser()) return;
            try {
              // If we know the dialog is mounted and listening, dispatch immediately.
              // Otherwise wait a short grace period and try fallback click if not ready.
              if (dialogReady) {
                window.dispatchEvent(new CustomEvent("openSubscribeDialog"));
              } else {
                // Give components a chance to mount (SPA navigation race)
                setTimeout(() => {
                  if (dialogReady) {
                    window.dispatchEvent(new CustomEvent("openSubscribeDialog"));
                  } else {
                    // fallback: try clicking an open button if present
                    const btn = document.querySelector('#subscribe-popup button, .subscribe-popup button, [data-open-subscribe]') as HTMLElement | null;
                    if (btn) btn.click();
                  }
                }, 500);
              }
              shownThisLoad = true;
            } catch (err) {
              // Fallback: try clicking an open button if present
              try {
                const btn = document.querySelector('#subscribe-popup button, .subscribe-popup button, [data-open-subscribe]') as HTMLElement | null;
                if (btn) btn.click();
                shownThisLoad = true;
              } catch (err2) {
                // ignore
              }
            }
          }, DEBOUNCE_MS);
        }
      });
    }

    window.addEventListener("scroll", onScrollCheck, { passive: true });
    window.addEventListener("resize", onScrollCheck);
    setTimeout(onScrollCheck, 800);

    // SPA route change handling: many routers use history.pushState/replaceState.
    // Patch them to emit a `locationchange` event so we can reset per-page state
    // and re-check scroll on navigation. Also listen to popstate.
    (function () {
      const _wr = (type: string) => {
        const orig = (history as any)[type];
        return function (this: any) {
          const res = orig.apply(this, arguments);
          const ev = new Event("locationchange");
          window.dispatchEvent(ev);
          return res;
        };
      };
      history.pushState = _wr("pushState");
      history.replaceState = _wr("replaceState");
      window.addEventListener("popstate", () => window.dispatchEvent(new Event("locationchange")));

      // When location changes (SPA navigation), reset shownThisLoad so the popup
      // can appear again on the new page (unless the user previously closed it).
      window.addEventListener("locationchange", () => {
        // If location actually changed
        if (location.href === lastLocation) return;
        lastLocation = location.href;
        // reset state so each page can show once
        shownThisLoad = false;
        if (pendingTimer) {
          window.clearTimeout(pendingTimer);
          pendingTimer = null;
        }
        // allow the new page content to settle before checking (images, client render)
        setTimeout(onScrollCheck, 300);
      });
    })();

    // Expose small API
    globalAny.SUBSCRIBE_POPUP = globalAny.SUBSCRIBE_POPUP || {};
    globalAny.SUBSCRIBE_POPUP.forceShow = function forceShow() {
      if (isClosedForUser()) return;
      window.dispatchEvent(new CustomEvent("openSubscribeDialog"));
    };
    globalAny.SUBSCRIBE_POPUP.disable = function disable() {
      globalAny.SUBSCRIBE_POPUP_DISABLED = true;
      window.removeEventListener("scroll", onScrollCheck);
      window.removeEventListener("resize", onScrollCheck);
    };
  }
}

export {};
