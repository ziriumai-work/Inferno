import React from "react";
import {
  BriefcaseBusiness,
  Network,
  FlaskConical,
  LifeBuoy,
  Building2,
  Leaf,
  PaintRoller,
  SprayCan,
  House,
  Hammer,
  Package,
  Truck,
  Headset,
} from "lucide-react";

/**
 * The firm's registered NAICS classifications.
 *
 * Single source of truth: /capabilities and /about both render this,
 * so the codes, titles and artwork cannot drift apart the way two
 * hand-maintained copies did.
 *
 * Each code shows its illustration from public/naics/<code>.png. The
 * `Icon` entry is the fallback for any code without artwork yet —
 * 541611 is currently the only one, so it renders a line icon rather
 * than a broken image.
 */
type NaicsEntry = {
  code: string;
  title: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  primary?: boolean;
};

export const NAICS_LIST: NaicsEntry[] = [
  {
    code: "541611",
    title: "Administrative & General Management Consulting",
    Icon: BriefcaseBusiness,
    primary: true,
  },
  { code: "541618", title: "Other Management Consulting", Icon: Network },
  {
    code: "541690",
    title: "Other Scientific & Technical Consulting",
    Icon: FlaskConical,
  },
  {
    code: "624230",
    title: "Emergency & Other Relief Services",
    Icon: LifeBuoy,
  },
  { code: "561210", title: "Facilities Support Services", Icon: Building2 },
  { code: "562910", title: "Remediation Services", Icon: Leaf },
  {
    code: "238320",
    title: "Painting & Wall Covering Contractors",
    Icon: PaintRoller,
  },
  { code: "561720", title: "Janitorial Services", Icon: SprayCan },
  {
    code: "561790",
    title: "Other Services to Buildings & Dwellings",
    Icon: House,
  },
  {
    code: "238990",
    title: "All Other Specialty Trade Contractors",
    Icon: Hammer,
  },
  {
    code: "423990",
    title: "Other Miscellaneous Durable Goods",
    Icon: Package,
  },
  { code: "488510", title: "Freight Transportation Arrangement", Icon: Truck },
  {
    code: "561422",
    title: "Telemarketing & Other Contact Centers",
    Icon: Headset,
  },
];

/** Codes with an illustration on disk. */
export const NAICS_ART = new Set([
  "541618",
  "541690",
  "624230",
  "561210",
  "562910",
  "238320",
  "561720",
  "561790",
  "238990",
  "423990",
  "488510",
  "561422",
]);

export default function NaicsGrid({ className }: { className?: string }) {
  return (
    <ul className={`naics-grid${className ? ` ${className}` : ""}`}>
      {NAICS_LIST.map((item) => (
        <li
          key={item.code}
          className={`naics-card${item.primary ? " naics-card--primary" : ""}`}
        >
          {item.primary && <span className="naics-flag">Primary</span>}
          <span
            className={`naics-icon${
              NAICS_ART.has(item.code) ? " naics-icon--art" : ""
            }`}
          >
            {NAICS_ART.has(item.code) ? (
              /* decorative: the title beside it carries the meaning */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/naics/${item.code}.png`}
                alt=""
                loading="lazy"
                decoding="async"
                className="naics-art"
              />
            ) : (
              <item.Icon
                className="naics-art"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )}
          </span>
          <span className="naics-title">{item.title}</span>
          <span className="naics-code">{item.code}</span>
        </li>
      ))}
    </ul>
  );
}
