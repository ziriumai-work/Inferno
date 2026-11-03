/**
 * Global TypeScript Definitions for The Inferno Group LLC B2G Portal
 * Centralized Type Definitions & Domain Interfaces
 */

// ── 1. CORE DATASTORE & CONTENT ENTITIES ──

interface ValueItem {
  title: string;
  desc: string;
  icon?: string;
}

interface StepItem {
  step: string;
  title: string;
  desc: string;
}

interface AboutData {
  story: string;
  mission: string;
  vision: string;
  coreValues: ValueItem[];
  howWeWorkSummary?: string;
  howWeWork: StepItem[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  status: "draft" | "published";
}

interface ServiceItem {
  id: string;
  num: string;
  badge: string;
  title: string;
  headline?: string;
  desc: string;
  caps: string[];
  idealFor?: string[];
  status: "draft" | "published";
}

interface StatItem {
  id: string;
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface TestimonialItem {
  id: string;
  rating: number;
  text: string;
  name: string;
  company: string;
  role: string;
  status: "draft" | "published";
  image?: string;
}

interface CommunityStory {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  featured: boolean;
  status: "draft" | "published";
}

interface Article {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  publishedDate: string;
  author: string;
  status: "draft" | "published";
}

interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
  lastDate?: string;
  status: "draft" | "published";
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: "draft" | "published";
}

interface LegalPage {
  id: string;
  title: string;
  content: string;
}

interface HeroData {
  eyebrow: string;
  headlineMain: string;
  headlineGradient: string;
  subheadline: string;
  videoUrl: string;
  fallbackImage: string;
  ctaText1: string;
  ctaLink1: string;
  ctaText2: string;
  ctaLink2: string;
}

interface Capability {
  id: string;
  acronym: string;
  name: string;
  title: string;
  desc: string;
  oppLabel: string;
  oppVal: string;
}

interface Contract {
  solicitation: string;
  title: string;
  agency: string;
  naics: string;
  setAside: string;
  postedDate: string;
  deadline: string;
  location: string;
  status: string;
}

interface PageFAQItem {
  question: string;
  answer: string;
  category: string;
}

interface PartnerCard {
  badge: string;
  title: string;
  desc: string;
}

interface Question {
  id: string;
  text: string;
  description: string;
  options: { label: string; value: string }[];
}

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  disabled?: boolean;
}

interface Lead {
  id: string;
  type: string;
  name?: string;
  email?: string;
  org?: string;
  company?: string;
  service?: string;
  message?: string;
  jobId?: string;
  jobTitle?: string;
  resumeName?: string;
  resumeData?: string;
  consultType?: string;
  timezone?: string;
  date?: string;
  time?: string;
  notes?: string;
  recommendations?: string[];
  contactName?: string;
  naics?: string;
  partnerType?: string;
  certStatus?: string;
  cover?: string;
  resourceId?: string;
  resourceTitle?: string;
  phone?: string;
  createdAt: string;
}

// ── 2. LIVE BOOKING & CALENDAR MODELS ──

interface Slot {
  time: string;
  available: boolean;
}

interface BookingSlot {
  id: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_available: boolean;
  external_calendar_event_id?: string | null;
  created_at?: string;
}

interface BookingDetails {
  id?: string;
  slot_id: string;
  full_name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  meeting_type: string;
  status?: string;
  created_at?: string;
}

interface TimeSlotDisplay {
  id: string;
  time: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

interface BookingConfirmationParams {
  recipientEmail: string;
  recipientName: string;
  meetingType: string;
  slotTimeFormatted: string;
  timezone: string;
  notes?: string;
  company?: string;
  phone?: string;
}

interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ── 3. NHC HURRICANE TRACKER & WEATHER MODELS ──

type BasinType = "AL" | "EP" | "CP" | "SL" | "WP" | "IO" | "OTHER";
type StormCategoryType = "TD" | "TS" | "Cat1" | "Cat2" | "Cat3" | "Cat4" | "Cat5" | "Unknown";

interface WindQuadrants {
  NE: number;
  NW: number;
  SE: number;
  SW: number;
}

interface ForecastPoint {
  forecastHour: number;
  latitude: number;
  longitude: number;
  windSpeedMph: number;
  pressureMb: number;
  category: string;
  timestamp: string;
}

interface HistoricalTrackPoint {
  timestamp: string;
  advisoryNumber?: string;
  latitude: number;
  longitude: number;
  windSpeedMph: number;
  pressureMb: number;
  category: string;
}

interface WatchWarningArea {
  id: string;
  type: string;
  region: string;
  status: "Active" | "Expired" | "Pending" | string;
  expirationTime?: string;
}

interface ImpactInfo {
  rainfallForecast?: string;
  floodRisk?: string;
  stormSurgeHeight?: string;
  waveHeight?: string;
  marineConditions?: string;
  dangerousSeas?: string;
  tornadoRisk?: string;
}

type StormImpacts = ImpactInfo;

interface DetailedStorm {
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
  maxSustainedWindKts: number;
  maxSustainedWindMph: number;
  windGustsMph: number;
  hurricaneWindRadiusMiles: number;
  tropicalStormWindRadiusMiles: number;
  windQuadrants: WindQuadrants;
  minimumCentralPressureMb: number;
  pressureTrend: string;
  pressureChangeMb: number;
  forecastPoints: ForecastPoint[];
  forecastConeCoordinates?: [number, number][];
  historicalTrack: HistoricalTrackPoint[];
  watchesAndWarnings: WatchWarningArea[];
  impacts: ImpactInfo;
  gisLinks?: {
    geoJson?: string;
    kml?: string;
    csv?: string;
  };
  // Historical & Recent Activity Metadata
  isHistorical?: boolean;
  activityDates?: string;
  relativeTimeAgo?: string;
  peakCategory?: StormCategoryType;
  peakWindsMph?: number;
  minPressureMb?: number;
  landfallLocation?: string;
  landfallDate?: string;
  impactSummary?: string;
}

interface DisturbanceArea {
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

interface OverviewMetrics {
  activeStormsCount: number;
  hurricanesCount: number;
  tropicalStormsCount: number;
  depressionsCount: number;
  disturbancesCount: number;
  recentStormsCount?: number;
  lastUpdated: string;
  nextUpdateAt?: string;
}

interface Storm {
  id: string;
  name?: string;
  stormName?: string;
  classification?: string;
  intensity?: number;
  windSpeed?: number;
  maxSustainedWind?: number;
  latitude?: number;
  lat?: number;
  longitude?: number;
  lon?: number;
}

interface StormsResponse {
  storms: Storm[];
  fetchedAt: string | null;
  error: string | null;
}

interface TrackerStorm {
  id: string;
  name: string;
  category: string;
  latitudeNumeric?: number;
  longitudeNumeric?: number;
  classification?: string;
  intensity?: string;
  windSpeed: string;
  pressure: string;
  movement: string;
  advisoryUrl?: string;
  updateTime: string;
  forecastPoints?: ForecastPoint[];
  historicalTrack?: HistoricalTrackPoint[];
  forecastConeCoordinates?: [number, number][];
  tsRadiusMiles?: number;
}

interface StormRecord {
  id: string;
  name: string;
  classification?: string;
  intensity?: string;
  pressure?: string;
  latitude?: string;
  longitude?: string;
  latitudeNumeric?: number;
  longitudeNumeric?: number;
  movementDir?: number;
  movementSpeed?: number;
  lastUpdate?: string;
  publicAdvisory?: {
    url?: string;
    issuance?: string;
  };
}

interface StormSummary {
  id: string;
  name: string;
  status: string;
  category: string;
  windSpeed: string;
  pressure: string;
  movement: string;
  latitude: string;
  longitude: string;
  latitudeNumeric?: number;
  longitudeNumeric?: number;
  updateTime: string;
  advisoryUrl?: string;
}

// ── 4. SECURITY & LOGGING MODELS ──

type SecurityLogLevel = "INFO" | "WARN" | "ERROR" | "AUDIT";

interface SecurityLogPayload {
  event: string;
  level: SecurityLogLevel;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  timestamp?: string;
}

interface RateLimitRecord {
  count: number;
  expiresAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// ── 5. CHATBOT MODELS ──

interface Message {
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

// ── 6. COMPONENT PROPS INTERFACES ──

interface SingleStatProps {
  stat: StatItem;
}

interface RevealOnMountProps {
  children: import("react").ReactNode;
  className?: string;
  delay?: number;
  style?: import("react").CSSProperties;
}

interface StormOverviewCardsProps {
  metrics: OverviewMetrics | null;
}

interface TrackerMapProps {
  storms?: (TrackerStorm | DetailedStorm)[];
  activeStormId?: string;
  onStormSelect?: (id: string) => void;
  disturbances?: DisturbanceArea[];
  showDisturbances?: boolean;
  selectedBasin?: string;
}

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
