import React from "react";

/**
 * Mission and Vision marks, supplied as artwork.
 *
 * Both paint in `currentColor`, so the surrounding tile sets the hue —
 * orange for Mission, navy for Vision. Outlines stay on a single 1.75
 * stroke to match the Lucide icons used elsewhere, with partial
 * `fill-opacity` carrying the depth a stroke-only glyph cannot.
 */

/** Bullseye with an arrow striking the centre. */
export function MissionIcon({
  className = "h-6 w-6",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="13" r="8.5" fill="currentColor" fillOpacity=".1" />
      <circle cx="11" cy="13" r="5" fill="currentColor" fillOpacity=".16" />
      <path d="M11 13l8-8" />
      <path
        d="M19 5V2.5L21.5 5z"
        fill="currentColor"
        fillOpacity=".4"
        strokeWidth="1.25"
      />
      <circle cx="11" cy="13" r="1.75" fill="currentColor" />
    </svg>
  );
}

/** Telescope on a tripod, angled upward, with a spark and star. */
export function VisionIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <g transform="translate(0 1.5) rotate(-25 12 8)">
        <path
          d="M13.5 5.6L20.5 4.5v7L13.5 10.4z"
          fill="currentColor"
          fillOpacity=".18"
        />
        <rect
          x="7.5"
          y="5.9"
          width="6"
          height="4.2"
          rx=".8"
          fill="currentColor"
          fillOpacity=".1"
        />
        <rect
          x="4"
          y="6.7"
          width="3.5"
          height="2.6"
          rx=".6"
          fill="currentColor"
          fillOpacity=".18"
        />
        <path d="M17 4.9v6.2" strokeWidth="1" opacity=".5" />
        <path d="M10.5 5.9v4.2" strokeWidth="1" opacity=".5" />
      </g>
      <path d="M11.5 12.3L8 21.5M11.5 12.3L15 21.5" />
      <path d="M9.75 17h3.5" strokeWidth="1" opacity=".5" />
      <circle cx="11.5" cy="12.3" r="1" fill="currentColor" />
      <path d="M4.5 2.5v4M2.5 4.5h4" strokeWidth="1.25" opacity=".6" />
      <circle
        cx="9.5"
        cy="2.8"
        r=".8"
        fill="currentColor"
        stroke="none"
        opacity=".6"
      />
    </svg>
  );
}
