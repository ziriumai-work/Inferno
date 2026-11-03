"use client";

import React, { useEffect, useState, useRef } from "react";

export interface RevealOnMountProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "left" | "right" | "up" | "down" | "fade";
  style?: React.CSSProperties;
}

export default function RevealOnMount({
  children,
  className = "",
  delay = 0,
  direction = "left",
  style,
}: RevealOnMountProps) {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = setTimeout(() => setIsActive(true), delay);
          } else {
            setIsActive(true);
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(el);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [delay]);

  const dirClass =
    direction === "left"
      ? "reveal-left"
      : direction === "right"
      ? "reveal-right"
      : direction === "down"
      ? "reveal-down"
      : direction === "fade"
      ? "reveal-fade"
      : "reveal";

  return (
    <div
      ref={ref}
      className={`${dirClass} ${isActive ? "active" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
