import { fetchRawStorms, normalizeStorm, fetchTropicalDisturbances, fetchActiveNWSAlerts } from "./apiService";
import { getRecentHistoricalStorms, getHistoricalStormById } from "./historicalArchive";
import {
  DetailedStorm,
  OverviewMetrics,
  RealtimeUnifiedFeed,
  DisturbanceArea,
  RealtimeNWSAlert,
  TRACKER_UPDATE_INTERVAL_MS,
  REALTIME_TRACKER_INTERVAL_SECONDS,
} from "./types";

interface CacheState {
  storms: DetailedStorm[];
  lastFetchedAt: string | null;
}

const cache: CacheState = {
  storms: [],
  lastFetchedAt: null,
};

export async function getActiveStorms(forceRefresh = false): Promise<{
  storms: DetailedStorm[];
  recentStorms: DetailedStorm[];
  metrics: OverviewMetrics;
  fetchedAt: string;
  nextUpdateAt: string;
}> {
  const now = Date.now();
  const isStale =
    forceRefresh ||
    !cache.lastFetchedAt ||
    now - new Date(cache.lastFetchedAt).getTime() >= TRACKER_UPDATE_INTERVAL_MS;

  if (isStale) {
    const rawData = await fetchRawStorms(forceRefresh);
    if (rawData !== null) {
      const rawList = Array.isArray(rawData?.activeStorms) ? rawData.activeStorms : [];
      if (rawList.length > 0) {
        cache.storms = await Promise.all(rawList.map(normalizeStorm));
      } else {
        cache.storms = [];
      }
      cache.lastFetchedAt = new Date().toISOString();
    } else if (!cache.lastFetchedAt) {
      cache.lastFetchedAt = new Date().toISOString();
    }
  }

  const fetchedAt = cache.lastFetchedAt || new Date().toISOString();
  const nextUpdateAt = new Date(
    new Date(fetchedAt).getTime() + TRACKER_UPDATE_INTERVAL_MS
  ).toISOString();

  const storms = cache.storms;
  const recentStorms = getRecentHistoricalStorms();

  const metrics: OverviewMetrics = {
    activeStormsCount: storms.length,
    hurricanesCount: storms.filter((s) => s.category.startsWith("Cat")).length,
    tropicalStormsCount: storms.filter((s) => s.category === "TS").length,
    depressionsCount: storms.filter((s) => s.category === "TD").length,
    disturbancesCount: 0,
    recentStormsCount: recentStorms.length,
    lastUpdated: fetchedAt,
    nextUpdateAt,
  };

  return {
    storms,
    recentStorms,
    metrics,
    fetchedAt,
    nextUpdateAt,
  };
}

export async function getStormById(id: string): Promise<DetailedStorm | null> {
  const { storms, recentStorms } = await getActiveStorms();
  const matchActive = storms.find(
    (s) => s.id.toLowerCase() === id.toLowerCase() || s.name.toLowerCase() === id.toLowerCase()
  );
  if (matchActive) return matchActive;

  const matchRecent = recentStorms.find(
    (s) => s.id.toLowerCase() === id.toLowerCase() || s.name.toLowerCase() === id.toLowerCase()
  );
  if (matchRecent) return matchRecent;

  return getHistoricalStormById(id) || storms[0] || recentStorms[0] || null;
}

export function generateStormGeoJSON(storm: DetailedStorm) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [storm.longitude, storm.latitude],
        },
        properties: {
          id: storm.id,
          name: storm.name,
          category: storm.category,
          windSpeedMph: storm.maxSustainedWindMph,
          pressureMb: storm.minimumCentralPressureMb,
          status: storm.status,
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            ...storm.historicalTrack.map((pt) => [pt.longitude, pt.latitude]),
            [storm.longitude, storm.latitude],
            ...storm.forecastPoints.map((pt) => [pt.longitude, pt.latitude]),
          ],
        },
        properties: {
          trackType: "Full Track",
          stormName: storm.name,
        },
      },
    ],
  };
}

export function generateStormCSV(storm: DetailedStorm): string {
  const headers = "PointType,Hour,Timestamp,Latitude,Longitude,WindMph,PressureMb,Category\n";
  const current = `Current,0,${storm.lastUpdated},${storm.latitude},${storm.longitude},${storm.maxSustainedWindMph},${storm.minimumCentralPressureMb},${storm.category}\n`;
  const forecast = storm.forecastPoints
    .map((pt) => `Forecast,${pt.forecastHour},${pt.timestamp},${pt.latitude},${pt.longitude},${pt.windSpeedMph},${pt.pressureMb},${pt.category}`)
    .join("\n");

  return headers + current + forecast;
}

export async function getRealtimeUnifiedData(
  basin = "atlc",
  days = "7",
  forceRefresh = false
): Promise<RealtimeUnifiedFeed> {
  const [{ storms, recentStorms, metrics, fetchedAt, nextUpdateAt }, disturbances, alerts] =
    await Promise.all([
      getActiveStorms(forceRefresh),
      fetchTropicalDisturbances(basin, days),
      fetchActiveNWSAlerts(),
    ]);

  metrics.disturbancesCount = disturbances.length;
  metrics.recentStormsCount = recentStorms.length;

  return {
    fetchedAt,
    nextUpdateAt,
    updateIntervalSeconds: REALTIME_TRACKER_INTERVAL_SECONDS,
    dataSource: "NOAA National Hurricane Center (NHC) & National Weather Service (NWS)",
    metrics,
    storms,
    recentStorms,
    disturbances,
    alerts,
  };
}

