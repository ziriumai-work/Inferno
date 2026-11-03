"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import StormOverviewCards from "@/components/StormOverviewCards";
import {
  DetailedStorm,
  OverviewMetrics,
  DisturbanceArea,
  TRACKER_UPDATE_INTERVAL_MS,
} from "@/lib/nhc/types";

const TrackerMap = dynamic(() => import("@/components/TrackerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] flex items-center justify-center text-[var(--text-muted)] text-[0.85rem]">
      Loading interactive map…
    </div>
  ),
});

export default function TrackerPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeStormId, setActiveStormId] = useState("");
  const [activeTab, setActiveTab] = useState<"map" | "forecast" | "warnings">(
    "map",
  );
  const [detailedStorms, setDetailedStorms] = useState<DetailedStorm[]>([]);
  const [recentStorms, setRecentStorms] = useState<DetailedStorm[]>([]);
  const [stormViewMode, setStormViewMode] = useState<"all" | "active" | "recent">("all");
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NOAA outlook & disturbance states
  const [selectedBasin, setSelectedBasin] = useState("atlc");
  const [selectedDays, setSelectedDays] = useState("7");
  const [disturbances, setDisturbances] = useState<DisturbanceArea[]>([]);
  const [showDisturbances, setShowDisturbances] = useState(true);
  const [outlookData, setOutlookData] = useState<{
    title: string;
    pubDate: string;
    description: string;
  } | null>(null);
  const [outlookLoading, setOutlookLoading] = useState(false);
  const [outlookError, setOutlookError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [nextSyncAt, setNextSyncAt] = useState<string | null>(null);
  const [syncCycleTick, setSyncCycleTick] = useState(0);
  const [forceRefreshNext, setForceRefreshNext] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Automatic refresh scheduler + background tab wakeup check
  useEffect(() => {
    const interval = window.setInterval(() => {
      setSyncCycleTick((tick) => tick + 1);
    }, TRACKER_UPDATE_INTERVAL_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && lastSyncedAt) {
        const elapsed = Date.now() - new Date(lastSyncedAt).getTime();
        if (elapsed >= TRACKER_UPDATE_INTERVAL_MS) {
          setSyncCycleTick((tick) => tick + 1);
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lastSyncedAt]);

  const handleManualSync = useCallback(() => {
    setForceRefreshNext(true);
    setSyncCycleTick((tick) => tick + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadStorms() {
      try {
        setLoading(true);
        const query = forceRefreshNext ? "?refresh=true" : "";
        const res = await fetch(`/api/tracker/storms${query}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Unable to fetch NOAA storm feed.");
        const payload = await res.json();

        if (!isCancelled) {
          const activeList: DetailedStorm[] = payload.storms || [];
          const recentList: DetailedStorm[] = payload.recentStorms || [];
          setDetailedStorms(activeList);
          setRecentStorms(recentList);
          setMetrics(payload.metrics || null);
          const fetchedTime =
            payload.fetchedAt ||
            payload.metrics?.lastUpdated ||
            new Date().toISOString();
          const nextTime =
            payload.nextUpdateAt ||
            payload.metrics?.nextUpdateAt ||
            new Date(
              new Date(fetchedTime).getTime() + TRACKER_UPDATE_INTERVAL_MS,
            ).toISOString();
          setLastSyncedAt(fetchedTime);
          setNextSyncAt(nextTime);
          setActiveStormId(
            (current) => current || activeList[0]?.id || recentList[0]?.id || "",
          );
          setError(null);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : "Error loading storm feed.",
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
          if (forceRefreshNext) setForceRefreshNext(false);
        }
      }
    }

    loadStorms();
    return () => {
      isCancelled = true;
    };
  }, [syncCycleTick, forceRefreshNext]);

  // Fetch Graphical Outlook Discussion text (auto-updates on 6h cycle + basin change)
  useEffect(() => {
    if (activeTab !== "map") return;

    let isCancelled = false;
    async function fetchOutlook() {
      try {
        setOutlookLoading(true);
        setOutlookError(null);
        const refreshParam = forceRefreshNext ? "&refresh=true" : "";
        const res = await fetch(
          `/api/tracker/outlook?basin=${selectedBasin}${refreshParam}`,
          {
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error("Unable to load outlook discussion.");
        const data = await res.json();
        if (!isCancelled) setOutlookData(data);
      } catch (err: unknown) {
        if (!isCancelled)
          setOutlookError(
            err instanceof Error ? err.message : "Error loading outlook.",
          );
      } finally {
        if (!isCancelled) setOutlookLoading(false);
      }
    }

    fetchOutlook();
    return () => {
      isCancelled = true;
    };
  }, [activeTab, selectedBasin, syncCycleTick, forceRefreshNext]);

  // Fetch Tropical Weather Outlook Disturbances (auto-updates on 6h cycle + filter change)
  useEffect(() => {
    let isCancelled = false;
    async function loadDisturbances() {
      try {
        const refreshParam = forceRefreshNext ? "&refresh=true" : "";
        const res = await fetch(
          `/api/tracker/disturbances?basin=${selectedBasin}&days=${selectedDays}${refreshParam}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!isCancelled && Array.isArray(data.disturbances)) {
          setDisturbances(data.disturbances);
        }
      } catch {
        // Fallback handled inside API route
      }
    }

    loadDisturbances();
    return () => {
      isCancelled = true;
    };
  }, [selectedBasin, selectedDays, syncCycleTick, forceRefreshNext]);

  // Filter active storms by selected region/basin
  const basinActiveStorms = useMemo(() => {
    return detailedStorms.filter((s) => {
      if (selectedBasin === "atlc") return s.basin === "AL";
      if (selectedBasin === "epac") return s.basin === "EP";
      if (selectedBasin === "cpac") return s.basin === "CP";
      return true;
    });
  }, [detailedStorms, selectedBasin]);

  // Filter recent historical storms by selected region/basin
  const basinRecentStorms = useMemo(() => {
    return recentStorms.filter((s) => {
      if (selectedBasin === "atlc") return s.basin === "AL";
      if (selectedBasin === "epac") return s.basin === "EP";
      if (selectedBasin === "cpac") return s.basin === "CP";
      return true;
    });
  }, [recentStorms, selectedBasin]);

  // Visible storms list based on stormViewMode ("all" | "active" | "recent")
  const visibleStorms = useMemo(() => {
    if (stormViewMode === "active") return basinActiveStorms;
    if (stormViewMode === "recent") return basinRecentStorms;
    return [...basinActiveStorms, ...basinRecentStorms];
  }, [basinActiveStorms, basinRecentStorms, stormViewMode]);

  const activeStorm = useMemo(() => {
    if (activeStormId) {
      const match =
        detailedStorms.find((s) => s.id === activeStormId) ||
        recentStorms.find((s) => s.id === activeStormId);
      if (match) return match;
    }
    // Default to first active storm in the basin, or if none, first recent storm (e.g. Milton)
    return (
      visibleStorms[0] ||
      basinActiveStorms[0] ||
      basinRecentStorms[0] ||
      detailedStorms[0] ||
      recentStorms[0] ||
      null
    );
  }, [
    activeStormId,
    detailedStorms,
    recentStorms,
    visibleStorms,
    basinActiveStorms,
    basinRecentStorms,
  ]);

  // Mapping for interactive map component
  const legacyStorms = useMemo(() => {
    const list = activeStorm
      ? [activeStorm, ...visibleStorms.filter((s) => s.id !== activeStorm.id)]
      : visibleStorms;

    return list.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      latitudeNumeric: s.latitude,
      longitudeNumeric: s.longitude,
      windSpeed: `${s.isHistorical ? s.peakWindsMph || s.maxSustainedWindMph : s.maxSustainedWindMph} mph`,
      pressure: `${s.minimumCentralPressureMb} mb`,
      movement: s.movementDirection
        ? `${s.movementDirection} at ${s.movementSpeedMph} mph`
        : s.isHistorical
          ? "Historical Best-Track"
          : "Monitoring",
      advisoryUrl: s.publicAdvisoryUrl,
      updateTime: s.lastUpdated,
      forecastPoints: s.forecastPoints,
      forecastConeCoordinates: s.forecastConeCoordinates,
      historicalTrack: s.historicalTrack,
      tsRadiusMiles: s.tropicalStormWindRadiusMiles,
      isHistorical: s.isHistorical,
    }));
  }, [activeStorm, visibleStorms]);

  return (
    <div className="page-view block">
      <section id="tracker" className="max-w-[1400px] mx-auto">
        <div className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">
            NOAA / NHC Real-Time Intelligence
          </div>
          <h1 className="section-title">
            Hurricane Tracker &amp; Intelligence Dashboard
          </h1>
          <p className="section-desc">
            Live NOAA National Hurricane Center tracking—featuring forecast
            cones, tropical disturbances, wind radii, and coastal advisories.
          </p>

          {/* Real-Time Live Sync Status Bar */}
          <div className="mt-4 mb-6 inline-flex flex-wrap items-center gap-3 sm:gap-5 px-4 py-2.5 rounded-xl bg-white border border-[var(--border)] text-xs text-[var(--text-muted)] shadow-xs">
            <span className="inline-flex items-center gap-2 font-bold text-[var(--text-bright)]">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  loading
                    ? "bg-amber-500 animate-pulse"
                    : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                }`}
              />
              Live Sync (60s Cadence)
            </span>
            {lastSyncedAt && (
              <span>
                Last Updated:{" "}
                <strong className="text-[var(--text-bright)]">
                  {new Date(lastSyncedAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </span>
            )}
            {nextSyncAt && (
              <span>
                Next Auto-Update:{" "}
                <strong className="text-[var(--primary)] font-semibold">
                  {new Date(nextSyncAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </span>
            )}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-[var(--panel-dark)] hover:bg-[var(--primary)] text-[var(--text-bright)] hover:text-white border border-[var(--border)] font-bold text-[0.72rem] transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 active:scale-95 shadow-2xs"
            >
              <svg
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>{loading ? "Syncing…" : "Sync Now"}</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <StormOverviewCards metrics={metrics} />

        {/* Navigation Tabs */}
        <div
          className={`reveal flex justify-center gap-2.5 mb-8 flex-wrap ${isMounted ? "active" : ""}`}
        >
          {[
            {
              key: "map",
              label: "Live Interactive Map",
              icon: (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
              ),
            },
            {
              key: "forecast",
              label: "Forecast Table & Track Log",
              icon: (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              ),
            },
            {
              key: "warnings",
              label: "Watches & Warnings",
              icon: (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              ),
            },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "bg-white hover:bg-gray-100 text-[var(--text-bright)] border border-[var(--border)]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Live Interactive Map & System Details */}
        {activeTab === "map" && (
          <div className="flex flex-col gap-8">
            {/* Top Consolidated Controls Bar (Region, Forecast Horizon, Disturbances Filter) */}
            <div
              className={`glow-card reveal bg-white border border-[var(--border)] rounded-2xl py-4 sm:py-5 px-5 sm:px-6 flex flex-col gap-4 shadow-xs ${isMounted ? "active" : ""}`}
            >
              <div className="flex justify-between items-center flex-wrap gap-4">
                {/* Region / Basin Control Group */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-bright)]">
                    Region:
                  </span>
                  <div className="inline-flex bg-gray-100/90 border border-[var(--border)] rounded-xl p-1 gap-1">
                    {[
                      { key: "cpac", name: "Central Pacific" },
                      { key: "epac", name: "Pacific" },
                      { key: "atlc", name: "Atlantic" },
                    ].map((basin) => (
                      <button
                        key={basin.key}
                        onClick={() => setSelectedBasin(basin.key)}
                        className={`py-1.5 px-3.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-all duration-200 ${
                          selectedBasin === basin.key
                            ? "bg-[var(--primary)] text-white shadow-xs"
                            : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-white/80"
                        }`}
                      >
                        {basin.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Forecast Horizon & Disturbances Toggle Control Group */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-bright)]">
                      Horizon:
                    </span>
                    <div className="inline-flex bg-gray-100/90 border border-[var(--border)] rounded-xl p-1 gap-1">
                      {[
                        { key: "2", name: "2-Day" },
                        { key: "7", name: "7-Day" },
                      ].map((day) => (
                        <button
                          key={day.key}
                          onClick={() => setSelectedDays(day.key)}
                          className={`py-1.5 px-3.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-all duration-200 ${
                            selectedDays === day.key
                              ? "bg-[var(--primary)] text-white shadow-xs"
                              : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-white/80"
                          }`}
                        >
                          {day.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Disturbances Layer Toggle Button (Polished High-Contrast Design) */}
                  <button
                    type="button"
                    onClick={() => setShowDisturbances((prev) => !prev)}
                    className={`py-1.5 px-3.5 text-xs font-bold rounded-xl border cursor-pointer flex items-center gap-2 transition-all duration-200 shadow-2xs ${
                      showDisturbances
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-800 hover:bg-amber-500/15"
                        : "bg-white hover:bg-gray-50 border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-bright)]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        showDisturbances
                          ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                          : "bg-gray-400 shadow-none"
                      }`}
                    />
                    <span>
                      {showDisturbances
                        ? "Disturbances: Visible"
                        : "Disturbances: Hidden"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Storm Feed Selector Bar: Active Storms & Recent Activity */}
            <div
              className={`glow-card reveal bg-white border border-[var(--border)] rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-xs ${isMounted ? "active" : ""}`}
            >
              <div className="flex justify-between items-center flex-wrap gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Storm Feed:
                  </span>
                  <div className="inline-flex bg-gray-100/90 border border-[var(--border)] rounded-xl p-1 gap-1">
                    <button
                      onClick={() => setStormViewMode("all")}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        stormViewMode === "all"
                          ? "bg-[var(--primary)] text-white shadow-xs"
                          : "text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-white/80"
                      }`}
                    >
                      All ({basinActiveStorms.length + basinRecentStorms.length})
                    </button>
                    <button
                      onClick={() => setStormViewMode("active")}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        stormViewMode === "active"
                          ? "bg-[var(--primary)] text-white shadow-xs"
                          : "text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-white/80"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active ({basinActiveStorms.length})
                    </button>
                    <button
                      onClick={() => setStormViewMode("recent")}
                      className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        stormViewMode === "recent"
                          ? "bg-[var(--primary)] text-white shadow-xs"
                          : "text-[var(--text-muted)] hover:text-[var(--text-bright)] hover:bg-white/80"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      Recent Activity ({basinRecentStorms.length})
                    </button>
                  </div>
                </div>

                {activeStorm?.isHistorical && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                    Historical System: {activeStorm.name} ({activeStorm.relativeTimeAgo || activeStorm.activityDates})
                  </span>
                )}
              </div>

              {/* Horizontal Scrollable Storm Pills with Crisp Contrast */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
                {visibleStorms.map((storm) => {
                  const isSelected = activeStorm?.id === storm.id;
                  return (
                    <button
                      key={storm.id}
                      onClick={() => setActiveStormId(storm.id)}
                      className={`px-3.5 py-2.5 rounded-xl text-left border shrink-0 transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? "bg-white border-[var(--primary)] text-[var(--text-bright)] shadow-md ring-2 ring-[var(--primary)]/20"
                          : "bg-gray-50/90 border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/50 hover:bg-white hover:text-[var(--text-bright)]"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          storm.isHistorical
                            ? "bg-purple-600"
                            : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                        }`}
                      />
                      <div>
                        <div className="font-bold text-xs text-[var(--text-bright)] flex items-center gap-1.5">
                          <span>{storm.name}</span>
                          <span
                            className={`text-[0.62rem] px-1.5 py-0.5 rounded font-mono font-bold ${
                              storm.isHistorical
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-orange-100 text-[var(--primary)] border border-orange-200"
                            }`}
                          >
                            {storm.category}
                          </span>
                        </div>
                        <div className="text-[0.68rem] text-[var(--text-muted)] mt-0.5">
                          {storm.isHistorical
                            ? `${storm.relativeTimeAgo || "Recent"} · Peak ${storm.peakWindsMph || storm.maxSustainedWindMph} mph`
                            : `Active · ${storm.maxSustainedWindMph} mph`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Map & Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 xl:gap-10">
              {/* Single Interactive Map Container */}
              <div
                className={`glow-card reveal bg-white border border-[var(--border)] rounded-[20px] p-3 sm:p-4 relative overflow-hidden shadow-xs ${isMounted ? "active" : ""}`}
              >
                <TrackerMap
                  storms={legacyStorms}
                  activeStormId={activeStorm?.id || ""}
                  onStormSelect={(id) => setActiveStormId(id)}
                  disturbances={disturbances}
                  showDisturbances={showDisturbances}
                  selectedBasin={selectedBasin}
                />
              </div>

              {/* Active Storm Details & NOAA Outlook Discussion Panel */}
              <div className="flex flex-col gap-6">
                {/* Active Storm Details Card */}
                <div
                  className={`glow-card reveal bg-white border border-[var(--border)] rounded-[20px] p-6 sm:p-7 flex flex-col gap-5 shadow-xs ${isMounted ? "active" : ""}`}
                >
                  {activeStorm ? (
                    <>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--primary)] font-bold uppercase tracking-wider">
                              ID: {activeStorm.id} · {activeStorm.basin} Basin
                            </span>
                            {activeStorm.isHistorical && (
                              <span className="text-[0.68rem] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
                                {activeStorm.relativeTimeAgo || "Historical Archive"}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1 mb-0 font-[family-name:var(--font-space-grotesk)] text-[1.4rem] font-extrabold text-[var(--text-bright)]">
                            {activeStorm.isHistorical ? `Hurricane ${activeStorm.name}` : activeStorm.name}
                          </h3>
                        </div>
                        <span
                          className={`py-1.5 px-3 rounded-lg font-bold text-xs ${
                            activeStorm.isHistorical
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-[rgba(225,77,24,0.1)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)]"
                          }`}
                        >
                          {activeStorm.isHistorical
                            ? `Peak: ${activeStorm.saffirSimpsonScale}`
                            : activeStorm.saffirSimpsonScale}
                        </span>
                      </div>

                      {/* Historical Summary Box (Clean High-Contrast Design) */}
                      {activeStorm.isHistorical && (
                        <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-2">
                          <div className="flex justify-between items-center flex-wrap gap-1">
                            <span className="font-bold text-purple-950">
                              Status: {activeStorm.status}
                            </span>
                            <span className="text-purple-700 font-mono font-semibold text-[0.72rem]">
                              {activeStorm.activityDates}
                            </span>
                          </div>
                          {activeStorm.landfallLocation && (
                            <div className="text-purple-900 font-medium">
                              📍 <strong>Landfall:</strong> {activeStorm.landfallLocation}{" "}
                              {activeStorm.landfallDate ? `(${activeStorm.landfallDate})` : ""}
                            </div>
                          )}
                          {activeStorm.impactSummary && (
                            <p className="mt-1 mb-0 text-purple-950/85 leading-relaxed text-[0.75rem]">
                              {activeStorm.impactSummary}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3.5 text-[0.85rem]">
                        <div className="bg-[var(--panel-dark)] p-3.5 rounded-xl border border-[var(--border)]">
                          <span className="text-[var(--text-muted)] text-[0.72rem] block mb-0.5">
                            {activeStorm.isHistorical
                              ? "Peak Sustained Winds"
                              : "Max Sustained Winds"}
                          </span>
                          <div className="font-bold text-[var(--text-bright)] text-[1.15rem]">
                            {activeStorm.isHistorical
                              ? `${activeStorm.peakWindsMph || activeStorm.maxSustainedWindMph} mph`
                              : `${activeStorm.maxSustainedWindMph} mph`}
                          </div>
                          <span className="text-[0.68rem] text-[var(--text-muted)]">
                            ({activeStorm.maxSustainedWindKts} kts)
                          </span>
                        </div>

                        <div className="bg-[var(--panel-dark)] p-3.5 rounded-xl border border-[var(--border)]">
                          <span className="text-[var(--text-muted)] text-[0.72rem] block mb-0.5">
                            {activeStorm.isHistorical
                              ? "Lowest Central Pressure"
                              : "Min Central Pressure"}
                          </span>
                          <div className="font-bold text-[var(--text-bright)] text-[1.15rem]">
                            {activeStorm.minimumCentralPressureMb || "N/A"} mb
                          </div>
                          <span className="text-[0.68rem] text-[var(--text-muted)] truncate block">
                            {activeStorm.pressureTrend}
                          </span>
                        </div>

                        <div className="bg-[var(--panel-dark)] p-3.5 rounded-xl border border-[var(--border)]">
                          <span className="text-[var(--text-muted)] text-[0.72rem] block mb-0.5">
                            {activeStorm.isHistorical ? "Track Motion" : "Current Movement"}
                          </span>
                          <div className="font-bold text-[var(--text-bright)] text-xs sm:text-sm">
                            {activeStorm.movementDirection} at{" "}
                            {activeStorm.movementSpeedMph} mph
                          </div>
                        </div>

                        <div className="bg-[var(--panel-dark)] p-3.5 rounded-xl border border-[var(--border)]">
                          <span className="text-[var(--text-muted)] text-[0.72rem] block mb-0.5">
                            {activeStorm.isHistorical ? "Terminal Position" : "Current Position"}
                          </span>
                          <div className="font-bold text-[var(--text-bright)] text-xs sm:text-sm">
                            {activeStorm.currentPositionFormatted}
                          </div>
                        </div>
                      </div>

                      {/* Wind Quadrants (when available) */}
                      {activeStorm.windQuadrants &&
                        (activeStorm.windQuadrants.NE > 0 ||
                          activeStorm.windQuadrants.SE > 0 ||
                          activeStorm.windQuadrants.SW > 0 ||
                          activeStorm.windQuadrants.NW > 0) && (
                          <div className="bg-[var(--panel-dark)] p-4 rounded-xl border border-[var(--border)]">
                            <div className="text-xs font-bold text-[var(--text-muted)] mb-2">
                              Tropical Storm Wind Quadrant Radii (nm)
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold text-[var(--text-bright)]">
                              <div className="p-2 rounded-lg bg-white border border-[var(--border)]">
                                NE: {activeStorm.windQuadrants.NE}
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-[var(--border)]">
                                NW: {activeStorm.windQuadrants.NW}
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-[var(--border)]">
                                SE: {activeStorm.windQuadrants.SE}
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-[var(--border)]">
                                SW: {activeStorm.windQuadrants.SW}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Dataset Export Download Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
                        <a
                          href={`/api/tracker/storm/${activeStorm.id}?format=geojson`}
                          download
                          className="btn btn-secondary flex-1 text-center text-xs py-2 px-3 justify-center inline-flex items-center gap-1.5"
                        >
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          <span>Export GeoJSON</span>
                        </a>
                        <a
                          href={`/api/tracker/storm/${activeStorm.id}?format=csv`}
                          download
                          className="btn btn-secondary flex-1 text-center text-xs py-2 px-3 justify-center inline-flex items-center gap-1.5"
                        >
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          <span>Export CSV</span>
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-[var(--text-muted)] text-center p-8">
                      No storm system currently selected.
                    </div>
                  )}
                </div>

                {/* NOAA Discussion Panel */}
                <div
                  className={`glow-card reveal bg-white border border-[var(--border)] rounded-[20px] p-6 sm:p-7 shadow-xs ${isMounted ? "active" : ""}`}
                >
                  <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.1rem] font-bold mb-3 text-[var(--text-bright)]">
                    NOAA Outlook Text Discussion (
                    {selectedBasin === "atlc"
                      ? "Atlantic"
                      : selectedBasin === "epac"
                        ? "Pacific"
                        : "Central Pacific"}
                    )
                  </h4>
                  {outlookLoading ? (
                    <div className="text-[var(--text-muted)] text-xs">
                      Loading official text statement…
                    </div>
                  ) : outlookData?.description ? (
                    <div className="bg-slate-50 border border-[var(--border)] p-4 rounded-xl max-h-[220px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-[var(--text-bright)] leading-relaxed">
                        {outlookData.description}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-[var(--text-muted)] text-xs">
                      No text discussion available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Forecast Points or Historical Track Log */}
        {activeTab === "forecast" && (
          <div className="glow-card bg-white border border-[var(--border)] rounded-[20px] p-6 sm:p-8 shadow-xs">
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2.5">
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-bold text-[var(--text-bright)]">
                {activeStorm?.isHistorical
                  ? `Historical Advisory Best-Track Log (${activeStorm?.name || "Storm"})`
                  : `Forecast Points & Track Progression (${activeStorm?.name || "Storm"})`}
              </h3>
              {activeStorm?.isHistorical && (
                <span className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-800 font-bold border border-purple-200">
                  Historical Archive Record · {activeStorm.activityDates} ({activeStorm.relativeTimeAgo})
                </span>
              )}
            </div>
            <div className="overflow-x-auto border border-[var(--border)] rounded-xl">
              <table className="w-full border-collapse text-[0.85rem]">
                <thead>
                  <tr className="bg-gray-50 border-b border-[var(--border)] uppercase text-[0.7rem] font-bold text-[var(--text-muted)]">
                    <th className="p-3.5 text-left">
                      {activeStorm?.isHistorical ? "Advisory Fix" : "Forecast Hour"}
                    </th>
                    <th className="p-3.5 text-left">
                      {activeStorm?.isHistorical ? "Advisory Timestamp" : "Target Timestamp"}
                    </th>
                    <th className="p-3.5 text-left">Coordinates</th>
                    <th className="p-3.5 text-left">Wind Speed</th>
                    <th className="p-3.5 text-left">Pressure</th>
                    <th className="p-3.5 text-right">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {activeStorm?.isHistorical &&
                  activeStorm.historicalTrack &&
                  activeStorm.historicalTrack.length > 0 ? (
                    activeStorm.historicalTrack.map((pt, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="p-3.5 font-bold text-[var(--primary)] font-mono text-xs">
                          {pt.advisoryNumber || `Fix #${idx + 1}`}
                        </td>
                        <td className="p-3.5 text-[var(--text-muted)] text-xs">
                          {pt.timestamp}
                        </td>
                        <td className="p-3.5 font-semibold text-xs text-[var(--text-bright)]">
                          {pt.latitude}°N, {Math.abs(pt.longitude)}°W
                        </td>
                        <td className="p-3.5 text-[var(--primary)] font-bold text-xs">
                          {pt.windSpeedMph} mph
                        </td>
                        <td className="p-3.5 text-[var(--secondary)] font-medium text-xs">
                          {pt.pressureMb ? `${pt.pressureMb} mb` : "N/A"}
                        </td>
                        <td className="p-3.5 text-right font-bold text-xs text-[var(--text-bright)]">
                          <span className="px-2 py-0.5 rounded bg-gray-100 border border-[var(--border)] font-mono">
                            {pt.category}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : activeStorm &&
                    activeStorm.forecastPoints &&
                    activeStorm.forecastPoints.length > 0 ? (
                    activeStorm.forecastPoints.map((pt, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="p-3.5 font-bold text-[var(--primary)] font-mono text-xs">
                          +{pt.forecastHour} Hours
                        </td>
                        <td className="p-3.5 text-[var(--text-muted)] text-xs">
                          {pt.timestamp}
                        </td>
                        <td className="p-3.5 font-semibold text-xs text-[var(--text-bright)]">
                          {pt.latitude}°N, {Math.abs(pt.longitude)}°W
                        </td>
                        <td className="p-3.5 text-[var(--primary)] font-bold text-xs">
                          {pt.windSpeedMph} mph
                        </td>
                        <td className="p-3.5 text-[var(--secondary)] font-medium text-xs">
                          {pt.pressureMb ? `${pt.pressureMb} mb` : "N/A"}
                        </td>
                        <td className="p-3.5 text-right font-bold text-xs text-[var(--text-bright)]">
                          <span className="px-2 py-0.5 rounded bg-gray-100 border border-[var(--border)] font-mono">
                            {pt.category}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-[var(--text-muted)] text-xs"
                      >
                        No track points published in the current statement.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Coastal Watches & Warnings */}
        {activeTab === "warnings" && (
          <div className="glow-card bg-white border border-[var(--border)] rounded-[20px] p-6 sm:p-8 shadow-xs">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-bold text-[var(--text-bright)] mb-6">
              {activeStorm?.isHistorical
                ? `Coastal Watches & Warnings Issued During System (${activeStorm ? activeStorm.name : ""})`
                : `Active Coastal Watches & Warnings (${activeStorm ? activeStorm.name : ""})`}
            </h3>
            <div className="grid gap-4">
              {activeStorm &&
              activeStorm.watchesAndWarnings &&
              activeStorm.watchesAndWarnings.length > 0 ? (
                activeStorm.watchesAndWarnings.map((area) => (
                  <div
                    key={area.id}
                    className="border-l-4 border-red-600 bg-red-50/70 p-5 rounded-r-xl border-y border-r border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
                        {area.type}
                      </span>
                      <span className="text-xs font-medium text-[var(--text-muted)]">
                        Status: {area.status}
                      </span>
                    </div>
                    <div className="text-base font-bold text-[var(--text-bright)]">
                      {area.region}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[var(--text-muted)] text-center p-8 bg-gray-50 border border-[var(--border)] rounded-xl text-xs">
                  No active coastal watches or warnings issued by NHC for this
                  system.
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
