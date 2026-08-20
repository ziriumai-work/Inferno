"use client";

import React, { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  showCursor?: boolean;
}

export default function TypewriterText({
  text,
  speed = 45,
  delay = 300,
  className = "",
  style,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    let currentIndex = 0;
    const startDelay = setTimeout(() => {
      setIsTyping(true);
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [isStarted, text, speed, delay]);

  return (
    <span ref={containerRef} className={`typewriter-container ${className}`} style={style}>
      {displayedText}
      {showCursor && (
        <span className={`typewriter-cursor ${isTyping ? "typing" : "idle"}`}>|</span>
      )}
    </span>
  );
}
