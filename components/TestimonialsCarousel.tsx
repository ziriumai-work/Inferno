"use client";

import React, { useEffect, useState, useRef } from "react";
import { dataStore, TestimonialItem } from "@/utils/dataStore";

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0]?.toUpperCase() || "";
};

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() =>
    dataStore.getTestimonials().filter((t) => t.status === "published")
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const refreshTestimonials = () => {
      const all = dataStore.getTestimonials();
      const published = all.filter((t) => t.status === "published");
      setTestimonials(published);
    };

    refreshTestimonials();

    window.addEventListener("storage", refreshTestimonials);
    window.addEventListener("cms-update", refreshTestimonials);

    return () => {
      window.removeEventListener("storage", refreshTestimonials);
      window.removeEventListener("cms-update", refreshTestimonials);
    };
  }, []);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (testimonials.length > 1) {
      timeoutRef.current = setTimeout(
        () =>
          setActiveIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
          ),
        7000
      );
    }
    return () => {
      resetTimeout();
    };
  }, [activeIndex, testimonials.length]);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (testimonials.length === 0) {
    return null;
  }

  const minSwipeDistance = 45;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  const current = testimonials[activeIndex];

  return (
    <div
      className="testimonials-carousel-wrapper relative max-w-[800px] mx-auto p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-2xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="Client and Teaming Partner Testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      id="testimonials-carousel"
    >
      {/* Testimonial Card */}
      <div
        className="glow-card testimonial-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] pt-8 px-6 pb-6 sm:pt-12 sm:px-10 sm:pb-10 min-h-[240px] sm:min-h-[260px] flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.02)] relative overflow-hidden select-none touch-pan-y"
        aria-live="polite"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Quote Icon Overlay */}
        <span
          className="absolute top-4 right-6 sm:top-6 sm:right-8 text-[4rem] sm:text-[5rem] font-black font-[family-name:var(--font-space-grotesk)] text-[rgba(225,77,24,0.06)] leading-none pointer-events-none"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <div>
          {/* Stars */}
          <div
            className="flex gap-1 mb-4 sm:mb-6"
            aria-label={`${current.rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill={i < current.rating ? "var(--primary)" : "none"}
                stroke={i < current.rating ? "var(--primary)" : "var(--border)"}
                strokeWidth="2"
                aria-hidden="true"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
          </div>

          {/* Quote Text */}
          <blockquote className="m-0">
            <p className="text-[0.95rem] sm:text-[1.1rem] italic leading-[1.7] text-[var(--text-bright)] mb-6 sm:mb-8 font-normal">
              &ldquo;{current.text}&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Author Details */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 border-t border-[var(--border)] pt-4 sm:pt-5">
          <div className="flex items-center gap-3 sm:gap-4">
            {current.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.image}
                alt={current.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[var(--border)] shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white flex items-center justify-center font-semibold text-[0.9rem] sm:text-[0.95rem] font-[family-name:var(--font-space-grotesk)] shrink-0"
                aria-hidden="true"
              >
                {getInitials(current.name)}
              </div>
            )}
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[var(--text-bright)] font-[family-name:var(--font-space-grotesk)] m-0">
                {current.name}
              </h4>
              <span className="text-[0.72rem] sm:text-xs text-[var(--text-muted)] block">
                {current.role} &middot; {current.company}
              </span>
            </div>
          </div>

          {/* Manual Arrow Controls */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handlePrev}
              className="btn btn-secondary w-[36px] h-[36px] p-0 flex items-center justify-center rounded-full border-[var(--border)] hover:border-[var(--primary)]"
              aria-label="Previous testimonial"
              aria-controls="testimonials-carousel"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="btn btn-secondary w-[36px] h-[36px] p-0 flex items-center justify-center rounded-full border-[var(--border)] hover:border-[var(--primary)]"
              aria-label="Next testimonial"
              aria-controls="testimonials-carousel"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div
        className="flex justify-center gap-2 mt-4"
        role="tablist"
        aria-label="Testimonial slides"
      >
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full border-none cursor-pointer transition-all duration-300 ${
              activeIndex === idx
                ? "w-6 bg-[var(--primary)]"
                : "w-2 bg-[var(--border)]"
            }`}
            aria-label={`Testimonial ${idx + 1} of ${testimonials.length}`}
            aria-selected={activeIndex === idx}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}
