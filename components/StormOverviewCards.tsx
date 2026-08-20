"use client";

import React, { useState } from "react";

export default function StormOverviewCards({ metrics }: StormOverviewCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = [
    {
      label: "Active Systems",
      value: metrics ? metrics.activeStormsCount : 0,
      color: "#e14d18",
      sub: "Total Tracked",
    },
    {
      label: "Hurricanes",
      value: metrics ? metrics.hurricanesCount : 0,
      color: "#dc2626",
      sub: "Cat 1 - Cat 5",
    },
    {
      label: "Tropical Storms",
      value: metrics ? metrics.tropicalStormsCount : 0,
      color: "#f59e0b",
      sub: "39 - 73 mph",
    },
    {
      label: "Depressions",
      value: metrics ? metrics.depressionsCount : 0,
      color: "#3b82f6",
      sub: "< 38 mph",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 mb-6 sm:mb-10">
      {cards.map((card, idx) => {
        const isHovered = hoveredIndex === idx;
        return (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            /* Per-card accent colour is data, so it travels as custom props;
               all structural styling is expressed as utilities below. */
            style={
              {
                "--card-c": card.color,
              } as React.CSSProperties
            }
            className={`relative overflow-hidden cursor-pointer rounded-xl border px-3 py-3 sm:px-6 sm:py-5 bg-white transition-all duration-200 ease-out ${
              isHovered
                ? "border-(--card-c) shadow-sm -translate-y-0.5"
                : "border-[var(--border)] shadow-none translate-y-0"
            }`}
          >
            <div className="text-[0.68rem] sm:text-[0.75rem] font-semibold text-muted uppercase tracking-wider mb-[0.35rem]">
              {card.label}
            </div>
            <div className="text-[1.5rem] sm:text-[2rem] font-extrabold font-space text-bright leading-none mb-[0.35rem]">
              {card.value}
            </div>
            <div className="text-[0.65rem] sm:text-[0.7rem] text-muted">{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

