import React from "react";

/**
 * Government / civic institution mark.
 *
 * Supplied as artwork rather than taken from an icon set, so it keeps
 * details a stroke-only glyph cannot carry: the flag, the filled dome
 * and the stepped plinth. Partial `fill-opacity` on those shapes gives
 * depth while the outline stays a single 1.75 stroke, matching the
 * Lucide icons it sits beside.
 *
 * Everything paints in `currentColor`, so the parent tile sets the hue.
 */
export default function GovernmentIcon({
  className,
  strokeWidth = 1.75,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* flagpole + pennant */}
      <path d="M12 1.75V3.5" />
      <path
        d="M12 1.75h2.75l-.75 1 .75 1H12"
        fill="currentColor"
        fillOpacity=".35"
        strokeWidth={1.25}
      />
      <path d="M11 5V3.5h2V5" strokeWidth={1.5} />
      {/* dome */}
      <path d="M7.5 9.5a4.5 4.5 0 0 1 9 0z" fill="currentColor" fillOpacity=".18" />
      <path d="M12 5.4v4" strokeWidth={1} opacity=".5" />
      <path
        d="M10 9.5c0-1.9.8-3.3 2-4.1M14 9.5c0-1.9-.8-3.3-2-4.1"
        strokeWidth={1}
        opacity=".5"
      />
      {/* architrave, columns, steps */}
      <rect x="4" y="9.5" width="16" height="2.25" rx=".6" fill="currentColor" fillOpacity=".18" />
      <path d="M6.5 11.75v5.75M10.17 11.75v5.75M13.83 11.75v5.75M17.5 11.75v5.75" />
      <rect x="3.5" y="17.5" width="17" height="1.75" rx=".6" fill="currentColor" fillOpacity=".18" />
      <rect x="2.5" y="19.25" width="19" height="1.75" rx=".6" fill="currentColor" fillOpacity=".18" />
    </svg>
  );
}
