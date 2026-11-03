"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { dataStore } from "@/utils/dataStore";

/**
 * Global Realtime Provider for The Inferno Group portal.
 * Ensures all public pages and admin panels automatically pull live
 * content from Supabase PostgreSQL, listen to Supabase Realtime websocket
 * events, and dispatch reactive updates across all components.
 */
export default function CMSRealtimeProvider() {
  useEffect(() => {
    // 1. Initial live hydration from Supabase database
    void dataStore.syncFromSupabase();

    // 2. Re-synchronize when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void dataStore.syncFromSupabase();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3. Periodic polling fallback (every 20 seconds) for resilient synchronization
    const interval = setInterval(() => {
      void dataStore.syncFromSupabase();
    }, 20_000);

    // 4. Supabase Realtime WebSocket Subscription on 'settings' table
    let channel: any = null;
    let supabase: any = null;
    try {
      supabase = createClient();
      channel = supabase
        .channel("inferno-cms-realtime-global")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "settings" },
          (payload: any) => {
            if (payload.new && payload.new.key) {
              const key = payload.new.key;
              // STRICT SECURITY CHECK: Never write user leads, bookings, or private user data to localStorage
              if (
                key === "inferno_leads" ||
                key.includes("lead") ||
                key.includes("booking") ||
                key.includes("applicant")
              ) {
                return;
              }

              try {
                const val =
                  typeof payload.new.value === "string"
                    ? JSON.parse(payload.new.value)
                    : payload.new.value;
                try {
                  localStorage.setItem(payload.new.key, JSON.stringify(val));
                } catch {
                  // Ignore storage quota in private browsing
                }
                window.dispatchEvent(
                  new CustomEvent("cms-update", {
                    detail: { key: payload.new.key, value: val },
                  })
                );
                try {
                  window.dispatchEvent(new StorageEvent("storage", { key: payload.new.key }));
                } catch {
                  window.dispatchEvent(new Event("storage"));
                }
              } catch (err) {
                console.warn("[Realtime Sync] Failed to parse updated payload:", err);
              }
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("[CMS Realtime] Supabase subscription skipped or failed:", err);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
      if (supabase && channel) {
        try {
          void supabase.removeChannel(channel);
        } catch {
          // ignore cleanup error
        }
      }
    };
  }, []);

  return null;
}

