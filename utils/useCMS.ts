"use client";

import { useState, useEffect } from "react";

/**
 * Reactive hook that syncs component state with the CMS in real time.
 * Automatically updates when changes are saved in the Admin Dashboard,
 * when Supabase Realtime pushes database updates, or across browser tabs.
 */
export function useCMS<T>(key: string | string[], getter: () => T): T {
  const [data, setData] = useState<T>(getter);

  useEffect(() => {
    // Always refresh with current state upon mount
    setData(getter());

    const keys = Array.isArray(key) ? key : [key];

    const handleCMSUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        !customEvent.detail ||
        customEvent.detail.all ||
        !customEvent.detail.key ||
        keys.includes(customEvent.detail.key)
      ) {
        setData(getter());
      }
    };

    const handleStorageUpdate = (e: StorageEvent) => {
      if (!e.key || keys.includes(e.key)) {
        setData(getter());
      }
    };

    window.addEventListener("cms-update", handleCMSUpdate as EventListener);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("cms-update", handleCMSUpdate as EventListener);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [key]);

  return data;
}

