"use client";

import React, { Fragment, useEffect } from "react";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  Polyline,
  Circle,
  Polygon,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const BASIN_CENTERS: Record<
  string,
  { center: [number, number]; zoom: number }
> = {
  atlc: { center: [21.0, -65.0], zoom: 4 },
  epac: { center: [16.0, -112.0], zoom: 4 },
  cpac: { center: [19.0, -162.0], zoom: 4 },
};

const NOAA_OCEAN_BASE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";
const NOAA_OCEAN_REF_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}";
const NOAA_TILE_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH";

function MapViewControl({
  basin,
  bounds,
}: {
  basin: string;
  bounds: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    if (basin && BASIN_CENTERS[basin]) {
      const preset = BASIN_CENTERS[basin];
      map.setView(preset.center, preset.zoom, { animate: true });
      return;
    }
    if (bounds && bounds.length > 0) {
      if (bounds.length === 1) {
        map.setView(bounds[0], 5);
      } else {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
      }
    }
  }, [basin, bounds, map]);

  return null;
}

function getDisturbanceColor(chance: number) {
  if (chance >= 60) return "#ef4444"; // Red (High Risk >60%)
  if (chance >= 30) return "#f97316"; // Orange (Medium Risk 30-60%)
  return "#facc15"; // Yellow (Low Risk <30%)
}

function createDisturbanceIcon(name: string, chance: number) {
  const color = getDisturbanceColor(chance);
  const badgeText = name.includes("Invest")
    ? name.split("Invest")[1]?.trim() || "X"
    : name.replace(/[^0-9]/g, "") || "X";

  return L.divIcon({
    className: "custom-noaa-disturbance-icon",
    html: `
      <div style="
        background: ${color};
        color: #000000;
        font-weight: 900;
        font-size: 11px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 0 12px ${color}, 0 2px 8px rgba(0,0,0,0.7);
        font-family: system-ui, -apple-system, sans-serif;
      ">
        ${badgeText.length > 3 ? "X" : badgeText}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function getStormLat(storm: TrackerStorm | DetailedStorm): number | null {
  if ("latitudeNumeric" in storm && typeof storm.latitudeNumeric === "number")
    return storm.latitudeNumeric;
  if ("latitude" in storm && typeof storm.latitude === "number")
    return storm.latitude;
  return null;
}

function getStormLon(storm: TrackerStorm | DetailedStorm): number | null {
  if ("longitudeNumeric" in storm && typeof storm.longitudeNumeric === "number")
    return storm.longitudeNumeric;
  if ("longitude" in storm && typeof storm.longitude === "number")
    return storm.longitude;
  return null;
}

function getStormWind(storm: TrackerStorm | DetailedStorm): string {
  if ("windSpeed" in storm && storm.windSpeed) return storm.windSpeed;
  if (
    "maxSustainedWindMph" in storm &&
    typeof storm.maxSustainedWindMph === "number"
  )
    return `${storm.maxSustainedWindMph} mph`;
  return "N/A";
}

function getStormPressure(storm: TrackerStorm | DetailedStorm): string {
  if ("pressure" in storm && storm.pressure) return storm.pressure;
  if (
    "minimumCentralPressureMb" in storm &&
    typeof storm.minimumCentralPressureMb === "number"
  )
    return `${storm.minimumCentralPressureMb} mb`;
  return "N/A";
}

function getStormMovement(storm: TrackerStorm | DetailedStorm): string {
  if ("movement" in storm && storm.movement) return storm.movement;
  if ("movementDirection" in storm && storm.movementDirection)
    return `${storm.movementDirection} at ${storm.movementSpeedMph || 0} mph`;
  return "N/A";
}

function getStormUpdateTime(
  storm: TrackerStorm | DetailedStorm,
): string | undefined {
  if ("updateTime" in storm && storm.updateTime) return storm.updateTime;
  if ("advisoryTime" in storm && storm.advisoryTime) return storm.advisoryTime;
  if ("lastUpdated" in storm && storm.lastUpdated) return storm.lastUpdated;
  return undefined;
}

function getStormAdvisoryUrl(
  storm: TrackerStorm | DetailedStorm,
): string | undefined {
  if ("advisoryUrl" in storm && storm.advisoryUrl) return storm.advisoryUrl;
  if ("publicAdvisoryUrl" in storm && storm.publicAdvisoryUrl)
    return storm.publicAdvisoryUrl;
  return undefined;
}

function getStormTsRadiusMiles(storm: TrackerStorm | DetailedStorm): number {
  if ("tsRadiusMiles" in storm && typeof storm.tsRadiusMiles === "number")
    return storm.tsRadiusMiles;
  if (
    "tropicalStormWindRadiusMiles" in storm &&
    typeof storm.tropicalStormWindRadiusMiles === "number"
  )
    return storm.tropicalStormWindRadiusMiles;
  return 0;
}

export default function TrackerMap({
  storms = [],
  activeStormId = "",
  onStormSelect,
  disturbances = [],
  showDisturbances = true,
  selectedBasin = "atlc",
}: TrackerMapProps) {
  const validStorms = storms.filter((storm) => {
    const lat = getStormLat(storm);
    const lon = getStormLon(storm);
    return typeof lat === "number" && typeof lon === "number";
  });

  const bounds: [number, number][] = validStorms.map((storm) => [
    getStormLat(storm)!,
    getStormLon(storm)!,
  ]);

  const basinPreset = BASIN_CENTERS[selectedBasin] || BASIN_CENTERS.atlc;
  const initialCenter: [number, number] = bounds.length
    ? bounds[0]
    : basinPreset.center;

  return (
    <div className="h-[360px] sm:h-[460px] lg:h-[560px] min-h-[300px] w-full rounded-[20px] sm:rounded-[24px] overflow-hidden relative shadow-[0_8px_32px_rgba(225,77,24,0.08),0_2px_8px_rgba(0,0,0,0.04)]">
      <MapContainer
        center={initialCenter}
        zoom={basinPreset.zoom}
        scrollWheelZoom={true}
        attributionControl={false}
        className="w-full h-full"
      >
        {/* Official NOAA / Esri Ocean Base Map Layer */}
        <TileLayer url={NOAA_OCEAN_BASE_URL} />
        {/* Ocean Reference Labels & Geographic Boundaries Overlay */}
        <TileLayer url={NOAA_OCEAN_REF_URL} pane="shadowPane" />

        <MapViewControl basin={selectedBasin} bounds={bounds} />

        {validStorms.map((storm) => {
          const isActive = storm.id === activeStormId;
          const stormLat = getStormLat(storm)!;
          const stormLon = getStormLon(storm)!;

          // Real forecast track line from NHC forecast advisory points
          const forecastTrack: [number, number][] =
            isActive &&
            Array.isArray(storm.forecastPoints) &&
            storm.forecastPoints.length > 0
              ? [
                  [stormLat, stormLon],
                  ...storm.forecastPoints.map(
                    (pt) => [pt.latitude, pt.longitude] as [number, number],
                  ),
                ]
              : [];

          // Real historical track line from past advisories
          const pastTrack: [number, number][] =
            isActive &&
            Array.isArray(storm.historicalTrack) &&
            storm.historicalTrack.length > 0
              ? storm.historicalTrack.map(
                  (pt) => [pt.latitude, pt.longitude] as [number, number],
                )
              : [];

          const radiusMeters = getStormTsRadiusMiles(storm) * 1609.34;
          const updateTime = getStormUpdateTime(storm);
          const advisoryUrl = getStormAdvisoryUrl(storm);
          const windSpeed = getStormWind(storm);
          const pressure = getStormPressure(storm);
          const movement = getStormMovement(storm);

          return (
            <Fragment key={storm.id}>
              {/* Official NOAA Forecast Cone Polygon */}
              {isActive &&
                Array.isArray(storm.forecastConeCoordinates) &&
                storm.forecastConeCoordinates.length > 0 && (
                  <Polygon
                    positions={storm.forecastConeCoordinates}
                    pathOptions={{
                      color: "#dc2626",
                      fillColor: "#dc2626",
                      fillOpacity: 0.14,
                      weight: 1.5,
                      dashArray: "4, 4",
                    }}
                    eventHandlers={{
                      mouseover: () => onStormSelect?.(storm.id),
                    }}
                  />
                )}

              {/* Historical Track Line & Waypoints */}
              {isActive && pastTrack.length > 0 && (
                <>
                  <Polyline
                    positions={pastTrack}
                    pathOptions={{
                      color: "#3b82f6",
                      weight: 3,
                      dashArray: "4, 4",
                    }}
                  />
                  {Array.isArray(storm.historicalTrack) &&
                    storm.historicalTrack.map((pt, pIdx) => (
                      <CircleMarker
                        key={`track-pt-${pIdx}`}
                        center={[pt.latitude, pt.longitude]}
                        radius={5}
                        pathOptions={{
                          color: "#1e3a8a",
                          fillColor:
                            pt.windSpeedMph >= 130
                              ? "#dc2626"
                              : pt.windSpeedMph >= 96
                                ? "#ea580c"
                                : pt.windSpeedMph >= 74
                                  ? "#f59e0b"
                                  : "#3b82f6",
                          fillOpacity: 0.95,
                          weight: 1.5,
                        }}
                      >
                        <Tooltip direction="top" offset={[0, -6]}>
                          <div className="text-xs p-1">
                            <div className="font-bold text-slate-900">
                              {pt.advisoryNumber || pt.timestamp}
                            </div>
                            <div className="text-slate-600">
                              {pt.windSpeedMph} mph · {pt.pressureMb ? `${pt.pressureMb} mb` : ""} ({pt.category})
                            </div>
                            <div className="text-[0.65rem] text-slate-400">
                              {pt.latitude}°N, {Math.abs(pt.longitude)}°W
                            </div>
                          </div>
                        </Tooltip>
                      </CircleMarker>
                    ))}
                </>
              )}

              {/* Forecast Track Line */}
              {isActive && forecastTrack.length > 0 && (
                <Polyline
                  positions={forecastTrack}
                  pathOptions={{
                    color: "#e14d18",
                    weight: 3,
                    dashArray: "6, 6",
                  }}
                />
              )}

              {/* Real Tropical Storm Wind Radius Circle */}
              {isActive && radiusMeters > 0 && (
                <Circle
                  center={[stormLat, stormLon]}
                  radius={radiusMeters}
                  pathOptions={{
                    color: "#f59e0b",
                    fillColor: "#f59e0b",
                    fillOpacity: 0.15,
                    weight: 1,
                  }}
                  eventHandlers={{ mouseover: () => onStormSelect?.(storm.id) }}
                />
              )}

              {/* Storm Center Marker */}
              <CircleMarker
                center={[stormLat, stormLon]}
                radius={isActive ? 14 : 10}
                pathOptions={{
                  color: isActive ? "#dc2626" : "#22c55e",
                  fillColor: isActive
                    ? "rgba(220,38,38,0.3)"
                    : "rgba(34,197,94,0.2)",
                  fillOpacity: 1,
                  weight: isActive ? 3 : 2,
                }}
                eventHandlers={{
                  mouseover: () => onStormSelect?.(storm.id),
                  click: () => onStormSelect?.(storm.id),
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -10]}
                  opacity={0.95}
                  sticky
                >
                  <div className="py-[0.2rem] px-[0.4rem] max-w-[230px] text-[0.85rem]">
                    <strong className="text-base text-[#dc2626] block">
                      {storm.name}
                    </strong>
                    <div className="font-bold text-[var(--navy)] my-[0.2rem]">
                      {storm.category}
                    </div>
                    <div className="text-[#475569] text-xs">
                      Pos: {stormLat.toFixed(2)}°N,{" "}
                      {Math.abs(stormLon).toFixed(2)}°W
                    </div>
                    <div className="text-[#334155] text-xs mt-[0.25rem]">
                      Winds: <strong>{windSpeed}</strong>
                    </div>
                    <div className="text-[#334155] text-xs">
                      Pressure: <strong>{pressure}</strong>
                    </div>
                    <div className="text-[#334155] text-xs">
                      Movement: <strong>{movement}</strong>
                    </div>
                    {updateTime && (
                      <div className="text-[#64748b] text-[0.7rem] mt-[0.3rem] italic">
                        Updated: {updateTime}
                      </div>
                    )}
                  </div>
                </Tooltip>
                <Popup>
                  <div className="max-w-[240px] text-[0.85rem]">
                    <strong className="text-base text-[#dc2626]">
                      {storm.name}
                    </strong>
                    <p className="mt-[0.4rem] mb-0 font-bold">
                      {storm.category}
                    </p>
                    <p className="mt-[0.25rem] mb-0 text-[#64748b]">
                      Pos: {stormLat.toFixed(2)}°N,{" "}
                      {Math.abs(stormLon).toFixed(2)}°W
                    </p>
                    <p className="mt-[0.25rem] mb-0">Winds: {windSpeed}</p>
                    <p className="mt-[0.25rem] mb-0">Pressure: {pressure}</p>
                    <p className="mt-[0.25rem] mb-0">Movement: {movement}</p>
                    {advisoryUrl && (
                      <a
                        href={advisoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--primary)] underline inline-block mt-2"
                      >
                        View Official NOAA Statement
                      </a>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          );
        })}

        {/* NOAA Graphical Tropical Weather Outlook (GTWO) Disturbances */}
        {showDisturbances &&
          disturbances.map((dist) => {
            const chance =
              dist.formationChance7Day || dist.formationChance2Day || 0;
            const distColor = getDisturbanceColor(chance);

            return (
              <Fragment key={dist.id}>
                {/* Disturbance Formation Polygon */}
                {Array.isArray(dist.coordinates) &&
                  dist.coordinates.length > 0 && (
                    <Polygon
                      positions={dist.coordinates}
                      pathOptions={{
                        color: distColor,
                        fillColor: distColor,
                        fillOpacity: 0.2,
                        weight: 2,
                        dashArray: "4, 4",
                      }}
                    >
                      <Tooltip sticky>
                        <div className="p-[0.2rem] text-[0.85rem]">
                          <strong
                            className="text-[0.95rem]"
                            style={{ color: distColor }}
                          >
                            {dist.name}
                          </strong>
                          <div className="mt-[0.2rem] text-xs">
                            Formation Chance (7-Day):{" "}
                            <strong>{dist.formationChance7Day}%</strong>
                          </div>
                          <div className="text-xs">
                            Formation Chance (2-Day):{" "}
                            <strong>{dist.formationChance2Day}%</strong>
                          </div>
                        </div>
                      </Tooltip>
                    </Polygon>
                  )}

                {/* Disturbance Center Marker (NOAA X-Badge Marker) */}
                {dist.centerPosition && Array.isArray(dist.centerPosition) && (
                  <Marker
                    position={dist.centerPosition}
                    icon={createDisturbanceIcon(dist.name, chance)}
                  >
                    <Tooltip direction="top" offset={[0, -14]}>
                      <div
                        className="text-xs font-bold"
                        style={{ color: distColor }}
                      >
                        {dist.name} ({dist.riskLevel} Risk)
                      </div>
                    </Tooltip>
                    <Popup>
                      <div className="max-w-[260px] text-[0.85rem]">
                        <span
                          className="text-[0.7rem] font-bold uppercase"
                          style={{ color: distColor }}
                        >
                          NOAA Tropical Outlook · {dist.riskLevel} Formation
                          Risk
                        </span>
                        <h4 className="mt-[0.2rem] mb-[0.4rem] text-base text-[var(--navy)]">
                          {dist.name}
                        </h4>
                        <div className="bg-[#f8fafc] p-2 rounded-md border border-[#e2e8f0] mb-2">
                          <div>
                            <strong>2-Day Formation Chance:</strong>{" "}
                            {dist.formationChance2Day}%
                          </div>
                          <div>
                            <strong>7-Day Formation Chance:</strong>{" "}
                            {dist.formationChance7Day}%
                          </div>
                        </div>
                        <p className="my-[0.4rem] text-[#334155] text-xs leading-[1.4]">
                          {dist.description}
                        </p>
                        {dist.discussionUrl && (
                          <a
                            href={dist.discussionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--primary)] underline inline-block mt-[0.3rem] text-xs"
                          >
                            Read Official NOAA Outlook Discussion &rarr;
                          </a>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </Fragment>
            );
          })}
      </MapContainer>
    </div>
  );
}