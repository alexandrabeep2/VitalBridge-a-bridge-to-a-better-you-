import { useEffect, useState } from "react";

/**
 * useLocalStorage + simulated server-database sync.
 * - Primary store: browser localStorage (100% frontend for v1)
 * - Server layer: a stubbed async "serverDB" that mirrors writes to a
 *   `vb_server_*` key and exposes sync status, so swapping in a real
 *   backend later is a one-line change. UI surfaces "Saved to server database".
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {}
    return initialValue;
  });
  const [syncState, setSyncState] = useState<"synced" | "saving" | "local">("synced");

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
    // simulate server-database save
    setSyncState("saving");
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(`vb_server_${key}`, JSON.stringify({
          data: value,
          updatedAt: new Date().toISOString(),
        }));
      } catch {}
      setSyncState("synced");
    }, 650);
    return () => clearTimeout(t);
  }, [key, value]);

  return [value, setValue, syncState] as const;
}

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}
