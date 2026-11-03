"use client";

import React, { useEffect, useState, useRef } from "react";
import { dataStore, StatItem } from "@/utils/dataStore";

const SingleStat: React.FC<SingleStatProps> = ({ stat }) => {
  const [count, setCount] = useState<string | number>(stat.value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = stat.value;
    const numericTarget = parseInt(target, 10);

    // If it's not a number, we just show it directly
    if (isNaN(numericTarget)) {
      setCount(target);
      return;
    }

    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500; // ms
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutQuad)
            const easeProgress = progress * (2 - progress);
            const current = Math.floor(easeProgress * numericTarget);

            setCount(current);

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            } else {
              setCount(target); // Ensure it lands exactly on the target string/value
            }
          };

          rafId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stat.value, hasAnimated]);

  return (
    <div className="stat-item" ref={elementRef}>
      <div className="stat-number">
        {stat.prefix && <span>{stat.prefix}</span>}
        {count}
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
};

export default function AnimatedStats() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const refreshStats = () => setStats(dataStore.getStats());
    refreshStats();
    setIsMounted(true);

    window.addEventListener("storage", refreshStats);
    window.addEventListener("cms-update", refreshStats);

    return () => {
      window.removeEventListener("storage", refreshStats);
      window.removeEventListener("cms-update", refreshStats);
    };
  }, []);

  if (!isMounted || stats.length === 0) {
    return (
      <div className="stats-strip min-h-30">
        <div className="stat-item">
          <div className="stat-number">7<span>+</span></div>
          <div className="stat-label">Core Competencies</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">SBA<span>8(a)</span></div>
          <div className="stat-label">HUBZone &amp; WOSB Ready</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100<span>%</span></div>
          <div className="stat-label">Compliance Mandate</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24<span>/7</span></div>
          <div className="stat-label">Disaster Response Ready</div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-strip">
      {stats.map((stat) => (
        <SingleStat key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
