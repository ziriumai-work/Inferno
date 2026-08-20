"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

/** Derive Saffir-Simpson category from wind speed (knots) */
function deriveCategory(storm: Storm): string | null {
  const cls = (storm.classification ?? "").toUpperCase();
  const kt = Number(
    storm.intensity ?? storm.windSpeed ?? storm.maxSustainedWind ?? 0
  );

  if (/^PTC/.test(cls) || /potential/i.test(cls)) return null;
  if (/^TD/.test(cls) || kt < 34) return null;
  if (/^TS/.test(cls) || (kt >= 34 && kt < 64)) return null; // Tropical Storm — no alert

  // C1+
  if (kt >= 64 && kt < 83) return "C1";
  if (kt >= 83 && kt < 96) return "C2";
  if (kt >= 96 && kt < 113) return "C3";
  if (kt >= 113 && kt < 137) return "C4";
  if (kt >= 137) return "C5";
  return null;
}

function categoryLabel(cat: string) {
  const map: Record<string, string> = {
    C1: "Category 1 Hurricane",
    C2: "Category 2 Hurricane",
    C3: "Category 3 Major Hurricane",
    C4: "Category 4 Major Hurricane",
    C5: "Category 5 Major Hurricane",
  };
  return map[cat] ?? "Hurricane";
}

function categoryColor(cat: string) {
  const map: Record<string, string> = {
    C1: "#F2A341",
    C2: "#EF8354",
    C3: "#E85D4C",
    C4: "#D6395C",
    C5: "#B33C86",
  };
  return map[cat] ?? "#e14d18";
}

const DISMISS_KEY = "tracker-alert-dismissed-ids";
const POLL_INTERVAL_MS = 60_000;

function getDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveDismissed(ids: Set<string>) {
  try {
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

export default function TrackerAlert() {
  const [alertStorms, setAlertStorms] = useState<
    Array<{ storm: Storm; cat: string }>
  >([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  const fetchStorms = useCallback(async () => {
    try {
      const res = await fetch("/api/tracker/storms", { cache: "no-store" });
      if (!res.ok) return;
      const data: StormsResponse = await res.json();
      const storms = data.storms ?? [];

      const active: Array<{ storm: Storm; cat: string }> = [];
      for (const s of storms) {
        const cat = deriveCategory(s);
        if (cat) active.push({ storm: s, cat });
      }
      setAlertStorms(active);
    } catch {
      // silently ignore — alert is non-critical
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    setDismissed(getDismissed());
    fetchStorms();
    const timer = setInterval(fetchStorms, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchStorms]);

  function dismiss(id: string) {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveDismissed(next);
      return next;
    });
  }

  if (!isMounted) return null;

  const visible = alertStorms.filter((a) => !dismissed.has(a.storm.id));
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map(({ storm, cat }) => {
        const color = categoryColor(cat);
        const name = storm.name ?? storm.stormName ?? storm.id;
        return (
          <div
            key={storm.id}
            role="alert"
            aria-live="assertive"
            className="relative z-[9999] px-3 sm:px-5 py-[0.5rem] sm:py-[0.6rem] flex items-center gap-2 sm:gap-4 flex-wrap text-[0.78rem] sm:text-[0.82rem] font-[family-name:var(--font-outfit,sans-serif)] border-b-2"
            style={{
              background: `linear-gradient(135deg, ${color}18 0%, rgba(10,15,26,0.97) 60%)`,
              borderColor: color,
            }}
          >
            {/* Pulsing dot */}
            <span
              className="inline-block w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-full shrink-0 animate-[alert-pulse_1.8s_infinite]"
              style={{
                background: color,
                boxShadow: `0 0 0 0 ${color}`,
              }}
            />

            {/* Category badge */}
            <span
              className="px-[0.5rem] py-[0.12rem] sm:px-[0.6rem] sm:py-[0.15rem] rounded font-bold text-[0.65rem] sm:text-[0.7rem] tracking-wider uppercase shrink-0"
              style={{
                background: `${color}22`,
                border: `1px solid ${color}44`,
                color,
              }}
            >
              {categoryLabel(cat)}
            </span>

            {/* Message */}
            <span className="text-white font-medium flex-1 min-w-[200px] text-xs sm:text-sm">
              <strong style={{ color }}>{name}</strong> is currently active.
              Monitor real-time position, forecast cone, and emergency advisories.
            </span>

            {/* CTA & Dismiss group */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <Link
                href="/tracker"
                className="px-[0.75rem] py-[0.25rem] sm:px-[0.85rem] sm:py-[0.3rem] rounded-md text-white font-bold text-[0.7rem] sm:text-xs no-underline shrink-0 whitespace-nowrap"
                style={{ background: color }}
              >
                Live Tracker →
              </Link>

              {/* Dismiss */}
              <button
                onClick={() => dismiss(storm.id)}
                aria-label="Dismiss hurricane alert"
                className="bg-transparent border-none text-white/60 hover:text-white cursor-pointer text-lg leading-none p-[0.2rem] shrink-0"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes alert-pulse {
          0%   { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
          70%  { box-shadow: 0 0 0 10px transparent; opacity: 0.6; }
          100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
        }
      `}</style>
    </>
  );
}
