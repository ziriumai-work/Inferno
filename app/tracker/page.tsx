"use client";

import React, { type CSSProperties, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import StormOverviewCards from "@/components/StormOverviewCards";
import { DetailedStorm, OverviewMetrics, DisturbanceArea } from "@/lib/nhc/types";

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
  const [activeTab, setActiveTab] = useState<"map" | "forecast" | "warnings">("map");
  const [detailedStorms, setDetailedStorms] = useState<DetailedStorm[]>([]);
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NOAA outlook & disturbance states
  const [selectedBasin, setSelectedBasin] = useState("atlc");
  const [selectedDays, setSelectedDays] = useState("7");
  const [disturbances, setDisturbances] = useState<DisturbanceArea[]>([]);
  const [showDisturbances, setShowDisturbances] = useState(true);
  const [outlookData, setOutlookData] = useState<{ title: string; pubDate: string; description: string } | null>(null);
  const [outlookLoading, setOutlookLoading] = useState(false);
  const [outlookError, setOutlookError] = useState<string | null>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadStorms() {
      try {
        setLoading(true);
        const res = await fetch("/api/tracker/storms", { cache: "no-store" });
        if (!res.ok) throw new Error("Unable to fetch NOAA storm feed.");
        const payload = await res.json();

        if (!isCancelled) {
          setDetailedStorms(payload.storms || []);
          setMetrics(payload.metrics || null);
          setActiveStormId((current) => current || payload.storms?.[0]?.id || "");
          setError(null);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Error loading storm feed.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadStorms();
    const interval = window.setInterval(loadStorms, 45000);
    return () => {
      isCancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  // Fetch Graphical Outlook Discussion text
  useEffect(() => {
    if (activeTab !== "map") return;

    let isCancelled = false;
    async function fetchOutlook() {
      try {
        setOutlookLoading(true);
        setOutlookError(null);
        const res = await fetch(`/api/tracker/outlook?basin=${selectedBasin}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Unable to load outlook discussion.");
        const data = await res.json();
        if (!isCancelled) setOutlookData(data);
      } catch (err: unknown) {
        if (!isCancelled) setOutlookError(err instanceof Error ? err.message : "Error loading outlook.");
      } finally {
        if (!isCancelled) setOutlookLoading(false);
      }
    }

    fetchOutlook();
    return () => {
      isCancelled = true;
    };
  }, [activeTab, selectedBasin]);

  // Fetch Tropical Weather Outlook Disturbances
  useEffect(() => {
    let isCancelled = false;
    async function loadDisturbances() {
      try {
        const res = await fetch(`/api/tracker/disturbances?basin=${selectedBasin}&days=${selectedDays}`, { cache: "no-store" });
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
  }, [selectedBasin, selectedDays]);


  const activeStorm = useMemo(() => {
    return detailedStorms.find((s) => s.id === activeStormId) || detailedStorms[0] || null;
  }, [activeStormId, detailedStorms]);

  // Mapping for legacy map component
  const legacyStorms = useMemo(() => {
    return detailedStorms.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      latitudeNumeric: s.latitude,
      longitudeNumeric: s.longitude,
      windSpeed: `${s.maxSustainedWindMph} mph`,
      pressure: `${s.minimumCentralPressureMb} mb`,
      movement: s.movementDirection ? `${s.movementDirection} at ${s.movementSpeedMph} mph` : "Monitoring",
      advisoryUrl: s.publicAdvisoryUrl,
      updateTime: s.lastUpdated,
      forecastPoints: s.forecastPoints,
      forecastConeCoordinates: s.forecastConeCoordinates,
      historicalTrack: s.historicalTrack,
      tsRadiusMiles: s.tropicalStormWindRadiusMiles,
    }));
  }, [detailedStorms]);

  return (
    <div className="page-view block">
      <section id="tracker">
        <div className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">NOAA / NHC Real-Time Intelligence</div>
          <h2 className="section-title">Hurricane Tracker &amp; Intelligence Dashboard</h2>
          <p className="section-desc">
            Comprehensive surveillance dashboard direct-synced with NOAA National Hurricane Center APIs, providing forecast cones, wind radii, satellite imagery, warnings, and analytical charts.
          </p>
        </div>

        {/* Top Metric Cards */}
        <StormOverviewCards metrics={metrics} />

        {/* Navigation Tabs */}
        <div
          className={`reveal flex justify-center gap-2 mb-10 flex-wrap ${isMounted ? "active" : ""}`}
        >
          {[
            { key: "map", label: "Live Interactive Map" },
            { key: "forecast", label: "Forecast Table & Cone" },
            { key: "warnings", label: "Watches & Warnings" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`btn text-xs py-2 px-4 ${activeTab === tab.key ? "btn-primary" : "btn-secondary"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Live Interactive Map & System Details */}
        {activeTab === "map" && (
          <div className="flex flex-col gap-8">
            {/* Top Consolidated Controls Bar (Region, Forecast Horizon, Disturbances Filter) */}
            <div
              className={`glow-card reveal bg-[var(--glass)] border border-[var(--border)] rounded-2xl py-5 px-6 flex flex-col gap-4 ${isMounted ? "active" : ""}`}
            >
              <div className="flex justify-between items-center flex-wrap gap-4">
                {/* Region / Basin Control Group */}
                <div className="flex items-center gap-3">
                  <span className="text-[0.85rem] font-bold text-[var(--text-bright)]">Region:</span>
                  <div
                    className="inline-flex bg-[var(--panel-dark)] border border-[var(--border)] rounded-lg p-[3px] gap-[2px]"
                  >
                    {[
                      { key: "cpac", name: "Central Pacific" },
                      { key: "epac", name: "Pacific" },
                      { key: "atlc", name: "Atlantic" },
                    ].map((basin) => (
                      <button
                        key={basin.key}
                        onClick={() => setSelectedBasin(basin.key)}
                        className={`py-1.5 px-3.5 text-xs font-bold rounded-md border-none cursor-pointer transition-all duration-200 ${
                          selectedBasin === basin.key ? "bg-[var(--primary)] text-white" : "bg-transparent text-[var(--text-muted)]"
                        }`}
                      >
                        {basin.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Forecast Horizon & Disturbances Toggle Control Group */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.85rem] font-bold text-[var(--text-bright)]">Forecast Horizon:</span>
                    <div
                      className="inline-flex bg-[var(--panel-dark)] border border-[var(--border)] rounded-lg p-[3px] gap-[2px]"
                    >
                      {[
                        { key: "2", name: "2-Day" },
                        { key: "7", name: "7-Day" },
                      ].map((day) => (
                        <button
                          key={day.key}
                          onClick={() => setSelectedDays(day.key)}
                          className={`py-1.5 px-3.5 text-xs font-bold rounded-md border-none cursor-pointer transition-all duration-200 ${
                            selectedDays === day.key ? "bg-[var(--primary)] text-white" : "bg-transparent text-[var(--text-muted)]"
                          }`}
                        >
                          {day.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Disturbances Layer Toggle Button */}
                  <button
                    onClick={() => setShowDisturbances((prev) => !prev)}
                    className={`py-1.5 px-3.5 text-xs font-bold rounded-lg border border-[var(--border)] cursor-pointer flex items-center gap-2 transition-all duration-200 ${
                      showDisturbances ? "bg-yellow-400/15 text-yellow-400" : "bg-[var(--panel-dark)] text-[var(--text-muted)]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        showDisturbances ? "bg-yellow-400 shadow-[0_0_8px_#facc15]" : "bg-[var(--text-muted)] shadow-none"
                      }`}
                    />
                    {showDisturbances ? "Disturbances Layer: Active" : "Disturbances Layer: Hidden"}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Interactive Map & Details Grid */}
            <div
              className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10"
            >
              {/* Single Interactive Map Container */}
              <div
                className={`glow-card reveal bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-4 relative overflow-hidden ${isMounted ? "active" : ""}`}
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
                  className={`glow-card reveal bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-7 flex flex-col gap-5 ${isMounted ? "active" : ""}`}
                >
                  {activeStorm ? (
                    <>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs text-[#e14d18] font-bold uppercase">
                            ID: {activeStorm.id} · {activeStorm.basin} Basin
                          </span>
                          <h3 className="mt-1 mb-0 font-[family-name:var(--font-space-grotesk)] text-[1.4rem] text-[var(--text-bright)]">
                            {activeStorm.name}
                          </h3>
                        </div>
                        <span className="bg-[#e14d18]/15 text-[#e14d18] py-1.5 px-3 rounded-lg font-bold text-xs">
                          {activeStorm.saffirSimpsonScale}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-[0.85rem]">
                        <div className="bg-[var(--panel-dark)] p-3 rounded-xl border border-[var(--border)]">
                          <span className="text-[var(--text-muted)] text-xs">Max Sustained Winds</span>
                          <div className="font-bold text-[var(--text-bright)] text-[1.1rem]">{activeStorm.maxSustainedWindMph} mph</div>
                          <span className="text-[0.7rem] text-[var(--text-muted)]">({activeStorm.maxSustainedWindKts} kts)</span>
                        </div>

                        <div className="bg-[var(--panel-dark)] p-3 rounded-xl border border-[var(--border)]">
                          <span className="text-[var(--text-muted)] text-xs">Min Central Pressure</span>
                          <div className="font-bold text-[var(--text-bright)] text-[1.1rem]">{activeStorm.minimumCentralPressureMb || "N/A"} mb</div>
                          <span className="text-[0.7rem] text-[var(--text-muted)]">Trend: {activeStorm.pressureTrend}</span>
                        </div>

                        <div className="bg-[var(--panel-dark)] p-3 rounded-xl border border-[var(--border)]">
                          <span className="text-[var(--text-muted)] text-xs">Current Movement</span>
                          <div className="font-bold text-[var(--text-bright)]">
                            {activeStorm.movementDirection} at {activeStorm.movementSpeedMph} mph
                          </div>
                        </div>

                        <div className="bg-[var(--panel-dark)] p-3 rounded-xl border border-[var(--border)]">
                          <span className="text-[var(--text-muted)] text-xs">Position</span>
                          <div className="font-bold text-[var(--text-bright)]">{activeStorm.currentPositionFormatted}</div>
                        </div>
                      </div>

                      {/* Wind Quadrants */}
                      <div className="bg-[var(--panel-dark)] p-4 rounded-xl border border-[var(--border)]">
                        <div className="text-xs font-bold text-[var(--text-muted)] mb-2">
                          Tropical Storm Wind Quadrant Radii (nm)
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold text-[var(--text-bright)]">
                          <div className="p-1.5 rounded bg-[var(--glass)]">NE: {activeStorm.windQuadrants.NE}</div>
                          <div className="p-1.5 rounded bg-[var(--glass)]">NW: {activeStorm.windQuadrants.NW}</div>
                          <div className="p-1.5 rounded bg-[var(--glass)]">SE: {activeStorm.windQuadrants.SE}</div>
                          <div className="p-1.5 rounded bg-[var(--glass)]">SW: {activeStorm.windQuadrants.SW}</div>
                        </div>
                      </div>

                      {/* Dataset Export Download Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <a
                          href={`/api/tracker/storm/${activeStorm.id}?format=geojson`}
                          download
                          className="btn btn-secondary flex-1 text-center text-xs p-2 justify-center"
                        >
                          Export GeoJSON
                        </a>
                        <a
                          href={`/api/tracker/storm/${activeStorm.id}?format=csv`}
                          download
                          className="btn btn-secondary flex-1 text-center text-xs p-2 justify-center"
                        >
                          Export CSV
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-[var(--text-muted)] text-center p-8">
                      No active storm system currently selected.
                    </div>
                  )}
                </div>

                {/* NOAA Discussion Panel */}
                <div className={`glow-card reveal bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-7 ${isMounted ? "active" : ""}`}>
                  <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.1rem] font-bold mb-3 text-[var(--text-bright)]">
                    NOAA Outlook Text Discussion ({selectedBasin === "atlc" ? "Atlantic" : selectedBasin === "epac" ? "Pacific" : "Central Pacific"})
                  </h4>
                  {outlookLoading ? (
                    <div className="text-[var(--text-muted)] text-[0.85rem]">Loading outlook...</div>
                  ) : outlookData?.description ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs text-[var(--text-bright)] leading-normal max-h-[220px] overflow-y-auto">
                      {outlookData.description}
                    </pre>
                  ) : (
                    <div className="text-[var(--text-muted)] text-[0.85rem]">No text discussion available.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Forecast Points Table */}
        {activeTab === "forecast" && (
          <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-8">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] text-[var(--text-bright)] mb-4">
              Forecast Points &amp; Track Progression {activeStorm ? `(${activeStorm.name})` : ""}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.85rem]">
                <thead>
                  <tr className="border-b border-[var(--border)] uppercase text-[0.7rem] text-[var(--text-muted)]">
                    <th className="p-3 text-left">Forecast Hour</th>
                    <th className="p-3 text-left">Target Timestamp</th>
                    <th className="p-3 text-left">Coordinates</th>
                    <th className="p-3 text-left">Wind Speed</th>
                    <th className="p-3 text-left">Pressure</th>
                    <th className="p-3 text-right">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStorm && activeStorm.forecastPoints && activeStorm.forecastPoints.length > 0 ? (
                    activeStorm.forecastPoints.map((pt, idx) => (
                      <tr key={idx} className="forecast-table-row border-b border-black/5">
                        <td className="p-3 font-bold text-[var(--primary)]">+{pt.forecastHour} Hours</td>
                        <td className="p-3 text-[var(--text-muted)]">{pt.timestamp}</td>
                        <td className="p-3 font-semibold">{pt.latitude}°N, {Math.abs(pt.longitude)}°W</td>
                        <td className="p-3 text-[#e14d18] font-bold">{pt.windSpeedMph} mph</td>
                        <td className="p-3 text-[#3b82f6]">{pt.pressureMb ? `${pt.pressureMb} mb` : "N/A"}</td>
                        <td className="p-3 text-right font-bold text-[var(--text-bright)]">{pt.category}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">
                        No forecast points published in current NHC advisory statement.
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
          <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-8">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] text-[var(--text-bright)] mb-6">
              Active Coastal Watches &amp; Warnings {activeStorm ? `(${activeStorm.name})` : ""}
            </h3>
            <div className="grid gap-4">
              {activeStorm && activeStorm.watchesAndWarnings && activeStorm.watchesAndWarnings.length > 0 ? (
                activeStorm.watchesAndWarnings.map((area) => (
                  <div key={area.id} className="border-l-4 border-red-600 bg-red-600/5 p-5 rounded-r-xl border-y border-r border-red-600/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-red-600 uppercase">{area.type}</span>
                      <span className="text-xs text-[var(--text-muted)]">Status: {area.status}</span>
                    </div>
                    <div className="text-base font-bold text-[var(--text-bright)]">{area.region}</div>
                  </div>
                ))
              ) : (
                <div className="text-[var(--text-muted)] text-center p-8">
                  No active coastal watches or warnings issued by NHC for this system.
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
