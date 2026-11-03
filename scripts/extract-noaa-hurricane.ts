/**
 * NOAA Real-Time Hurricane & Tropical Cyclone Extractor
 * 
 * Directly queries NOAA operational endpoints:
 * - National Hurricane Center (NHC) CurrentStorms Feed
 * - NHC Real-Time GIS KMZ Forecast Cones & Best Track
 * - NWS Tropical MapServer Active Disturbances (GTWO)
 * - NWS Weather Alerts API (api.weather.gov)
 * 
 * Usage:
 *   npx tsx scripts/extract-noaa-hurricane.ts
 *   npx tsx scripts/extract-noaa-hurricane.ts --json
 */

import AdmZip from "adm-zip";

const CURRENT_STORMS_URL = "https://www.nhc.noaa.gov/CurrentStorms.json";
const MAPSERVER_BASE = "https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer";
const NWS_ALERTS_URL = "https://api.weather.gov/alerts/active?event=Hurricane%20Warning,Hurricane%20Watch,Tropical%20Storm%20Warning,Tropical%20Storm%20Watch,Storm%20Surge%20Warning,Storm%20Surge%20Watch";

const USER_AGENT = "InfernoGroup-HurricaneDashboard/2.0 (contact: ops@infernogroup.com)";

interface ExtractedStorm {
  id: string;
  name: string;
  classification: string;
  intensityKts: number;
  intensityMph: number;
  pressureMb: number;
  latitude: number;
  longitude: number;
  movement: {
    directionDegrees: number;
    speedMph: number;
  };
  lastUpdate: string;
  advisoryNumber: string;
  advisoryUrl?: string;
  conePolygonPointsCount: number;
  forecastPointsCount: number;
  forecastPoints: Array<{
    hour: number;
    lat: number;
    lon: number;
    windMph: number;
  }>;
}

async function fetchKmzPoints(kmzUrl?: string): Promise<Array<{ hour: number; lat: number; lon: number; windMph: number }>> {
  if (!kmzUrl) return [];
  try {
    const res = await fetch(kmzUrl, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return [];
    const buf = Buffer.from(await res.arrayBuffer());
    const zip = new AdmZip(buf);
    const kmlEntry = zip.getEntries().find((e) => e.entryName.endsWith(".kml"));
    if (!kmlEntry) return [];
    const kmlText = zip.readAsText(kmlEntry);

    const points: Array<{ hour: number; lat: number; lon: number; windMph: number }> = [];
    const placemarks = Array.from(kmlText.matchAll(/<Placemark>([\s\S]*?)<\/Placemark>/gi));

    for (const pm of placemarks) {
      const content = pm[1];
      if (!content.includes("<Point>")) continue;
      const coords = /<Point>\s*<coordinates>\s*([^,\s]+),([^,\s]+)/i.exec(content);
      if (!coords) continue;
      const lon = parseFloat(coords[1]);
      const lat = parseFloat(coords[2]);
      const windMatch = /Maximum Wind:\s*(\d+)\s*knots/i.exec(content) || /<Data name="maxWindKnots">\s*<value>(\d+)<\/value>/i.exec(content);
      const windKt = windMatch ? parseInt(windMatch[1], 10) : 35;
      const hourMatch = /(\d+)\s*hr Forecast/i.exec(content) || /<Data name="fcstpd">\s*<value>(\d+)<\/value>/i.exec(content);
      const hour = hourMatch ? parseInt(hourMatch[1], 10) : 0;

      points.push({
        hour,
        lat: parseFloat(lat.toFixed(2)),
        lon: parseFloat(lon.toFixed(2)),
        windMph: Math.round(windKt * 1.15078),
      });
    }
    return points;
  } catch {
    return [];
  }
}

async function fetchConePointsCount(kmzUrl?: string): Promise<number> {
  if (!kmzUrl) return 0;
  try {
    const res = await fetch(kmzUrl, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return 0;
    const buf = Buffer.from(await res.arrayBuffer());
    const zip = new AdmZip(buf);
    const kmlEntry = zip.getEntries().find((e) => e.entryName.endsWith(".kml"));
    if (!kmlEntry) return 0;
    const kmlText = zip.readAsText(kmlEntry);
    const coordsMatch = /<coordinates>([\s\S]*?)<\/coordinates>/i.exec(kmlText);
    if (!coordsMatch) return 0;
    return coordsMatch[1].trim().split(/\s+/).length;
  } catch {
    return 0;
  }
}

async function fetchDisturbances(): Promise<Array<{ id: string; name: string; chance7Day: number; risk: string }>> {
  try {
    const url = `${MAPSERVER_BASE}/0/query?where=1%3D1&outFields=*&f=geojson`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return [];
    const json = await res.json();
    const features = json?.features || [];
    return features.map((f: any, idx: number) => {
      const p = f.properties || {};
      const chance7 = Number(p.HIGH_FORMATION_CHANCE || p.PROB7DAY || p.FORMATION_CHANCE_7D || 0);
      return {
        id: p.DISTURBANCE_ID || `DIST-${idx + 1}`,
        name: p.NAME || `Disturbance ${idx + 1}`,
        chance7Day: chance7,
        risk: chance7 >= 60 ? "High" : chance7 >= 30 ? "Medium" : "Low",
      };
    });
  } catch {
    return [];
  }
}

async function fetchNWSAlerts(): Promise<Array<{ event: string; headline: string; area: string }>> {
  try {
    const res = await fetch(NWS_ALERTS_URL, {
      headers: { "User-Agent": USER_AGENT, "Accept": "application/geo+json" },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const features = json?.features || [];
    return features.map((f: any) => ({
      event: f.properties?.event || "Tropical Alert",
      headline: f.properties?.headline || "",
      area: f.properties?.areaDesc || "",
    }));
  } catch {
    return [];
  }
}

async function main() {
  const asJson = process.argv.includes("--json");
  const startTime = Date.now();

  console.log("===============================================================");
  console.log(" NOAA REAL-TIME HURRICANE & TROPICAL WEATHER DATA EXTRACTOR   ");
  console.log(" Source: https://www.noaa.gov/data (NHC & NWS Operational Hub)");
  console.log(" Timestamp:", new Date().toISOString());
  console.log("===============================================================\n");

  // 1. Fetch Current Storms
  console.log("Connecting to NHC CurrentStorms feed...");
  const stormsRes = await fetch(CURRENT_STORMS_URL, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!stormsRes.ok) {
    throw new Error(`Failed to fetch NHC CurrentStorms.json: HTTP ${stormsRes.status}`);
  }

  const stormsJson = await stormsRes.json();
  const rawStorms = Array.isArray(stormsJson?.activeStorms) ? stormsJson.activeStorms : [];

  console.log(`✓ NHC feed received: ${rawStorms.length} active tropical cyclone(s) detected.\n`);

  // Process storms
  const processedStorms: ExtractedStorm[] = [];
  for (const raw of rawStorms) {
    const name = raw.name || "Unnamed";
    const classification = raw.classification || "TS";
    const windKt = Number(raw.intensity) || 0;
    const windMph = Math.round(windKt * 1.15078);
    const pressure = Number(raw.pressure) || 0;
    const lat = Number(raw.latitudeNumeric) || 0;
    const lon = Number(raw.longitudeNumeric) || 0;
    const moveDir = Number(raw.movementDir) || 0;
    const moveSpeedKt = Number(raw.movementSpeed) || 0;

    const [forecastPoints, coneCount] = await Promise.all([
      fetchKmzPoints(raw?.forecastTrack?.kmzFile),
      fetchConePointsCount(raw?.trackCone?.kmzFile),
    ]);

    processedStorms.push({
      id: raw.id,
      name,
      classification,
      intensityKts: windKt,
      intensityMph: windMph,
      pressureMb: pressure,
      latitude: lat,
      longitude: lon,
      movement: {
        directionDegrees: moveDir,
        speedMph: Math.round(moveSpeedKt * 1.15078),
      },
      lastUpdate: raw.lastUpdate || new Date().toISOString(),
      advisoryNumber: raw?.publicAdvisory?.advNum || "",
      advisoryUrl: raw?.publicAdvisory?.url,
      conePolygonPointsCount: coneCount,
      forecastPointsCount: forecastPoints.length,
      forecastPoints,
    });
  }

  // 2. Fetch Disturbances & NWS Alerts
  console.log("Querying Tropical Weather Outlook (GTWO) & NWS Active Alerts...");
  const [disturbances, alerts] = await Promise.all([
    fetchDisturbances(),
    fetchNWSAlerts(),
  ]);

  const durationMs = Date.now() - startTime;

  if (asJson) {
    console.log(JSON.stringify({
      extractedAt: new Date().toISOString(),
      latencyMs: durationMs,
      activeStormsCount: processedStorms.length,
      storms: processedStorms,
      disturbances,
      alerts,
    }, null, 2));
    return;
  }

  // Display summary
  if (processedStorms.length === 0) {
    console.log("No active tropical cyclones currently being monitored by NHC.");
  } else {
    for (const s of processedStorms) {
      console.log(`---------------------------------------------------------------`);
      console.log(`🌀 STORM: ${s.name.toUpperCase()} (${s.id})`);
      console.log(`   Type:                 ${s.classification}`);
      console.log(`   Max Sustained Winds:  ${s.intensityMph} mph (${s.intensityKts} kts)`);
      console.log(`   Central Pressure:     ${s.pressureMb > 0 ? `${s.pressureMb} mb` : "N/A"}`);
      console.log(`   Current Location:     ${Math.abs(s.latitude)}°${s.latitude >= 0 ? "N" : "S"}, ${Math.abs(s.longitude)}°${s.longitude >= 0 ? "E" : "W"}`);
      console.log(`   Movement:             ${s.movement.directionDegrees}° at ${s.movement.speedMph} mph`);
      console.log(`   Latest Advisory:      #${s.advisoryNumber} (${s.lastUpdate})`);
      if (s.advisoryUrl) console.log(`   Public Advisory URL:  ${s.advisoryUrl}`);
      console.log(`   Forecast Path:        ${s.forecastPointsCount} forecast points extracted`);
      console.log(`   Cone of Uncertainty:  ${s.conePolygonPointsCount} polygon boundary vertices extracted`);
      if (s.forecastPoints.length > 0) {
        console.log(`   5-Day Track Outlook:`);
        s.forecastPoints.forEach((pt) => {
          console.log(`      +${pt.hour}h -> ${pt.lat}°N, ${pt.lon}°W | Winds: ${pt.windMph} mph`);
        });
      }
    }
    console.log(`---------------------------------------------------------------\n`);
  }

  console.log(`📊 TROPICAL DISTURBANCES & GENESIS OUTLOOK:`);
  if (disturbances.length === 0) {
    console.log(`   None currently active in 7-day outlook.`);
  } else {
    disturbances.forEach((d) => {
      console.log(`   • ${d.name} (${d.id}): 7-day formation chance: ${d.chance7Day}% [${d.risk} Risk]`);
    });
  }

  console.log(`\n🚨 ACTIVE COASTAL WATCHES & WARNINGS (NWS API):`);
  if (alerts.length === 0) {
    console.log(`   No active hurricane or storm surge watches/warnings along US coastlines.`);
  } else {
    alerts.forEach((a) => {
      console.log(`   • [${a.event}] ${a.headline} (${a.area})`);
    });
  }

  console.log(`\n✓ Real-time extraction complete in ${durationMs}ms.`);
}

main().catch((err) => {
  console.error("Extraction error:", err);
  process.exit(1);
});

