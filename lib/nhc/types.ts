// Real-time NOAA Hurricane & Cyclone Tracker intervals
// Server cache revalidation: 60 seconds to catch new advisory packages immediately upon issuance
export const REALTIME_TRACKER_INTERVAL_SECONDS = 60;
export const REALTIME_TRACKER_INTERVAL_MS = REALTIME_TRACKER_INTERVAL_SECONDS * 1000; // 60,000 ms

export const TRACKER_UPDATE_INTERVAL_HOURS = 1; 
export const TRACKER_UPDATE_INTERVAL_SECONDS = REALTIME_TRACKER_INTERVAL_SECONDS;
export const TRACKER_UPDATE_INTERVAL_MS = REALTIME_TRACKER_INTERVAL_MS;

export type BasinType = "AL" | "EP" | "CP" | "SL" | "WP" | "IO" | "OTHER";
export type StormCategoryType = "TD" | "TS" | "Cat1" | "Cat2" | "Cat3" | "Cat4" | "Cat5" | "Unknown";

export interface WindQuadrants {
  NE: number;
  NW: number;
  SE: number;
  SW: number;
}

export interface ForecastPoint {
  forecastHour: number;
  latitude: number;
  longitude: number;
  windSpeedMph: number;
  pressureMb: number;
  category: string;
  timestamp: string;
}

export interface HistoricalTrackPoint {
  timestamp: string;
  advisoryNumber?: string;
  latitude: number;
  longitude: number;
  windSpeedMph: number;
  pressureMb: number;
  category: string;
}

export interface WatchWarningArea {
  id: string;
  type: string;
  region: string;
  status: "Active" | "Expired" | "Pending" | string;
  expirationTime?: string;
}

export interface ImpactInfo {
  rainfallForecast?: string;
  floodRisk?: string;
  stormSurgeHeight?: string;
  waveHeight?: string;
  marineConditions?: string;
  dangerousSeas?: string;
  tornadoRisk?: string;
}

export type StormImpacts = ImpactInfo;



export interface DetailedStorm {
  // Storm Information
  id: string;
  name: string;
  basin: BasinType;
  stormType: string;
  status: string;
  category: StormCategoryType;
  saffirSimpsonScale: string;
  currentAdvisoryNumber: string;
  currentDiscussionNumber?: string;
  currentForecastNumber?: string;
  publicAdvisoryUrl?: string;
  discussionUrl?: string;
  startTime?: string;
  lastUpdated: string;
  advisoryTime: string;
  localTime: string;
  utcTime: string;

  // Location Information
  latitude: number;
  longitude: number;
  currentPositionFormatted: string;
  movementDirection: string;
  movementDegrees: number;
  movementSpeedMph: number;
  distanceNearestLand?: string;
  distanceNearestCity?: string;
  region: string;
  oceanBasin: string;

  // Wind Information
  maxSustainedWindKts: number;
  maxSustainedWindMph: number;
  windGustsMph: number;
  hurricaneWindRadiusMiles: number;
  tropicalStormWindRadiusMiles: number;
  windQuadrants: WindQuadrants;

  // Pressure Information
  minimumCentralPressureMb: number;
  pressureTrend: string;
  pressureChangeMb: number;

  // Forecast Information
  forecastPoints: ForecastPoint[];
  forecastConeCoordinates?: [number, number][];

  // Historical Track
  historicalTrack: HistoricalTrackPoint[];

  // Watches and Warnings
  watchesAndWarnings: WatchWarningArea[];

  // Impact Information
  impacts: ImpactInfo;

  // Downloadable GIS Links
  gisLinks?: {
    geoJson?: string;
    kml?: string;
    csv?: string;
  };

  // Historical & Recent Activity Metadata
  isHistorical?: boolean;
  activityDates?: string; // e.g. "October 5 – 10, 2026"
  relativeTimeAgo?: string; // e.g. "3 weeks ago"
  peakCategory?: StormCategoryType;
  peakWindsMph?: number;
  minPressureMb?: number;
  landfallLocation?: string;
  landfallDate?: string;
  impactSummary?: string;
}

export interface DisturbanceArea {
  id: string;
  name: string;
  basin: BasinType;
  formationChance2Day: number;
  formationChance7Day: number;
  riskLevel: "Low" | "Medium" | "High";
  coordinates: [number, number][];
  centerPosition?: [number, number];
  discussionUrl?: string;
  description?: string;
  lastUpdated?: string;
}

export interface OverviewMetrics {
  activeStormsCount: number;
  hurricanesCount: number;
  tropicalStormsCount: number;
  depressionsCount: number;
  disturbancesCount: number;
  recentStormsCount?: number;
  lastUpdated: string;
  nextUpdateAt?: string;
}

export interface RealtimeStormFeed {
  fetchedAt: string;
  nextUpdateAt: string;
  updateIntervalSeconds: number;
  dataSource: string;
  metrics: OverviewMetrics;
  storms: DetailedStorm[];
  recentStorms?: DetailedStorm[];
}

export interface RealtimeNWSAlert {
  id: string;
  event: string;
  headline: string;
  severity: string;
  urgency: string;
  areaDesc: string;
  effective: string;
  expires: string;
}

export interface RealtimeUnifiedFeed extends RealtimeStormFeed {
  disturbances: DisturbanceArea[];
  outlook?: {
    basin: string;
    title: string;
    pubDate: string;
    description: string;
  } | null;
  alerts: RealtimeNWSAlert[];
}

