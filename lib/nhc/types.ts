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
  lastUpdated: string;
}

