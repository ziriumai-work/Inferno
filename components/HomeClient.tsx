"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import HeroCanvas from "./HeroCanvas";
import RevealOnMount from "./RevealOnMount";
import AnimatedStats from "./AnimatedStats";
import TestimonialsCarousel from "./TestimonialsCarousel";
import TypewriterText from "./TypewriterText";
import {
  dataStore,
  Article,
  FeatureCard,
  AboutData,
  HeroData,
  CommunityStory,
} from "@/utils/dataStore";

function HeroInteractiveBackground({
  fallbackImage,
}: {
  fallbackImage: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Calculate normalized offset from center (-1 to 1)
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;

    const moveX = (x * -16).toFixed(2);
    const moveY = (y * -16).toFixed(2);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.style.transform = `scale(1.06) translate(${moveX}px, ${moveY}px)`;
        containerRef.current.style.transition = "transform 0.15s ease-out";
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (containerRef.current) {
      containerRef.current.style.transform = "scale(1.03) translate(0px, 0px)";
      containerRef.current.style.transition =
        "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="hero-video-wrapper overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 pointer-events-none"
        style={{
          transform: "scale(1.03) translate(0px, 0px)",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <picture className="w-full h-full absolute inset-0 block">
          <source media="(max-width: 768px)" srcSet="/mobile-hero-image.jpg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fallbackImage}
            alt="The Inferno Group Emergency Operations Command Center"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="hero-fallback-image object-cover object-center lg:object-[65%_center] w-full h-full"
          />
        </picture>
      </div>
      <div className="hero-overlay"></div>
    </div>
  );
}

export default function HomeClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [aiFeatures, setAiFeatures] = useState<FeatureCard[]>([]);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [communityStories, setCommunityStories] = useState<CommunityStory[]>(
    [],
  );
  const [activeStoryMedia, setActiveStoryMedia] = useState<
    "scholarship" | "kickball"
  >("scholarship");
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isQuizPopupOpen, setIsQuizPopupOpen] = useState(false);
  const [isQuizTriggerVisible, setIsQuizTriggerVisible] = useState(false);
  const [showQuizTooltip, setShowQuizTooltip] = useState(false);
  const [quizPos, setQuizPos] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [isDraggingQuiz, setIsDraggingQuiz] = useState(false);
  const [isHoveringTrash, setIsHoveringTrash] = useState(false);

  const quizRef = useRef<HTMLDivElement>(null);
  const isHoveringTrashRef = useRef(false);
  const dragRafRef = useRef<number | null>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasMoved: false,
  });

  useEffect(() => {
    const refreshData = () => {
      const list = dataStore
        .getArticles()
        .filter((a) => a.status === "published")
        .slice(0, 3);
      setArticles(list);
      setAiFeatures(dataStore.getAIInnovation());
      setAbout(dataStore.getAbout());
      setHero(dataStore.getHero());
      setCommunityStories(
        dataStore.getCommunityStories().filter((s) => s.status === "published"),
      );
    };

    refreshData();
    setIsMounted(true);

    const handleStorage = () => refreshData();
    const handleCMS = () => refreshData();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-update", handleCMS);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-update", handleCMS);
    };
  }, []);

  // Show quiz trigger icon after initial mount delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsQuizTriggerVisible(true);
    }, 1500);
    // Show tooltip after 15 seconds
    const tooltipTimer = setTimeout(() => {
      setShowQuizTooltip(true);
    }, 15000);
    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  // Quiz swipable / draggable icon handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;

    const rect = quizRef.current?.getBoundingClientRect();
    const currentX = rect ? rect.left : 32;
    const currentY = rect
      ? rect.top
      : typeof window !== "undefined"
        ? window.innerHeight - 92
        : 500;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY,
      hasMoved: false,
    };

    if (quizRef.current) {
      try {
        quizRef.current.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback on touch platforms where capture cannot be established
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!quizRef.current || !quizRef.current.hasPointerCapture(e.pointerId))
      return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    const distance = Math.hypot(dx, dy);

    if (distance > 4) {
      dragStartRef.current.hasMoved = true;
      if (!isDraggingQuiz) setIsDraggingQuiz(true);
    }

    if (dragStartRef.current.hasMoved) {
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = requestAnimationFrame(() => {
        const iconSize = 60;
        const padding = 16;

        let newX = dragStartRef.current.initialX + dx;
        let newY = dragStartRef.current.initialY + dy;

        const maxX = window.innerWidth - iconSize - padding;
        const maxY = window.innerHeight - iconSize - padding;

        newX = Math.max(padding, Math.min(newX, maxX));
        newY = Math.max(padding, Math.min(newY, maxY));

        setQuizPos({ x: newX, y: newY });

        // Collision detection with top Trash drop zone
        const iconCenterX = newX + iconSize / 2;
        const isOverTrash =
          newY <= 110 && Math.abs(iconCenterX - window.innerWidth / 2) < 140;

        isHoveringTrashRef.current = isOverTrash;
        setIsHoveringTrash(isOverTrash);
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
    if (quizRef.current) {
      try {
        if (quizRef.current.hasPointerCapture(e.pointerId)) {
          quizRef.current.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Safe fallback for pointer release
      }
    }
    if (!dragStartRef.current.hasMoved) {
      const isDismissBtn = (e.target as HTMLElement).closest("[data-no-drag]");
      if (!isDismissBtn) {
        setIsQuizPopupOpen((prev) => !prev);
        setShowQuizTooltip(false);
      }
    } else {
      if (isHoveringTrashRef.current) {
        // Dismiss quiz trigger icon when dropped into the trash zone (reappears on page refresh)
        setIsQuizTriggerVisible(false);
        setShowQuizTooltip(false);
        setIsQuizPopupOpen(false);
      }
      setTimeout(() => {
        setIsDraggingQuiz(false);
        setIsHoveringTrash(false);
        isHoveringTrashRef.current = false;
      }, 50);
    }
  };

  // Helper to map icons to SVGs
  const getIconSvg = (icon: string) => {
    switch (icon) {
      case "search":
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        );
      case "cloud-lightning":
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 8.58"></path>
            <polyline points="13 11 9 17 12 17 11 23 15 17 12 17 13 11"></polyline>
          </svg>
        );
      case "lock":
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        );
    }
  };

  if (!isMounted) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Loading Intelligence...</h2>
      </div>
    );
  }

  return (
    <div className="page-view home-page-view block">
      {/* HERO SECTION */}
      <section className="hero mt-0">
        <HeroInteractiveBackground
          fallbackImage={hero?.fallbackImage || "/hero-bg.jpg"}
        />

        <HeroCanvas />

        <RevealOnMount direction="up" className="hero-container">
          {/* Prominent Business Name & Credential Banner */}
          <div className="hero-brand-badge mb-3 sm:mb-4 inline-flex items-center gap-2.5 px-4 py-1.5 sm:py-2 rounded-full border border-[rgba(225,77,24,0.3)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] animate-pulse shrink-0"></span>
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase font-[family-name:var(--font-space-grotesk)] text-[var(--primary)]">
              THE INFERNO GROUP LLC
            </span>
            <span className="hidden sm:inline-block text-[0.72rem] text-[var(--text-muted)] font-mono pl-2 border-l border-[var(--border)]">
              UEI: QW6RHJACHA56 • HUBZone &amp; VOSB Certified
            </span>
          </div>

          <div className="hero-eyebrow">
            <TypewriterText
              text={
                hero?.eyebrow ||
                "Emergency Management & Small Business Strategic Advisory"
              }
              speed={35}
              delay={400}
            />
          </div>
          <h1 className="hero-headline">
            {hero?.headlineMain || "Where Crisis"}
            <br />
            <span className="gradient-text">
              {hero?.headlineGradient || "Meets Command."}
            </span>
          </h1>
          <p className="hero-sub">
            {hero?.subheadline ||
              "Ideas don't solve problems—execution does. Practical consulting, disaster recovery, and small business growth solutions with measurable impact."}
          </p>
          <div className="hero-actions">
            <Link
              href={hero?.ctaLink1 || "/services"}
              className="btn btn-glass-primary no-underline"
            >
              {hero?.ctaText1 || "Explore Services"}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link
              href="/services#strategic-consulting-and-operational-excellence"
              className="btn btn-glass-secondary no-underline"
            >
              Small Business Advisory
            </Link>
            <Link
              href={hero?.ctaLink2 || "/partnerships"}
              className="btn btn-secondary no-underline"
            >
              {hero?.ctaText2 || "Partner With Us"}
            </Link>
          </div>
        </RevealOnMount>
      </section>

      {/* STATISTICS STRIP (Scroll Animated) */}
      <RevealOnMount direction="left">
        <AnimatedStats />
      </RevealOnMount>

      {/* FEDERAL CREDENTIALS & SOCIOECONOMIC HIGHLIGHTS STRIP */}
      <section
        id="home-credentials"
        className="py-16 px-[5vw] bg-[var(--glass)] border-b border-[var(--border)]"
      >
        <RevealOnMount direction="up">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-[var(--panel-dark)] border border-[var(--border)] rounded-[24px] p-8 lg:p-10 shadow-lg">
            <div className="flex flex-col gap-3 max-w-[500px]">
              <div className="section-eyebrow text-xs uppercase tracking-wider text-[var(--primary)] font-bold">
                Federal Credentials
              </div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.5rem] font-bold text-[var(--text-bright)]">
                Registered Federal Vendor &amp; Teaming Partner
              </h3>
              <div className="flex flex-wrap gap-3 text-xs text-[var(--text-bright)] font-mono font-semibold pt-1">
                <span className="bg-[var(--glass)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                  UEI: QW6RHJACHA56
                </span>
                <span className="bg-[var(--glass)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                  CAGE: 22VP2
                </span>
              </div>
              <p className="text-[0.75rem] text-[var(--text-muted)] mt-1">
                <strong>NAICS:</strong> 541611, 541618, 541690, 624230, 561210,
                562910, 238320, 561720, 561790, 238990, 423990, 488510, 561422
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
              <div className="bg-[var(--glass)] p-5 rounded-2xl border border-[var(--border)] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm font-[family-name:var(--font-space-grotesk)]">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  HUBZone Certified
                </div>
                <div className="text-[0.7rem] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                  U.S. Small Business Administration
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-[1.5] mt-1">
                  Delivering federal socioeconomic contracting value and
                  economic growth in historically underutilized communities.
                </p>
              </div>

              <div className="bg-[var(--glass)] p-5 rounded-2xl border border-[var(--border)] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--secondary)] font-bold text-sm font-[family-name:var(--font-space-grotesk)]">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="12 6 15 11 20 11 16 15 18 20 12 17 6 20 8 15 4 11 9 11 12 6"></polygon>
                  </svg>
                  Veteran-Owned Small Business (VOSB)
                </div>
                <div className="text-[0.7rem] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                  Veteran-Led &middot; Mission-Focused
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-[1.5] mt-1">
                  Supporting public and commercial supplier diversity goals with
                  disciplined, veteran-led execution.
                </p>
              </div>
            </div>
          </div>
        </RevealOnMount>
      </section>

      {/* CORE CAPABILITIES & DUAL PILLAR SOLUTIONS SHOWCASE */}
      <section
        id="home-services"
        className="py-24 px-[5vw] border-b border-[var(--border)] bg-[var(--background)]"
      >
        <RevealOnMount direction="up">
          <div className="text-center max-w-[850px] mx-auto mb-16">
            <div className="section-eyebrow">
              <TypewriterText
                text="Solutions & Capabilities"
                speed={40}
                delay={200}
              />
            </div>
            <h2 className="section-title">
              Dual-Pillar Operational Excellence
            </h2>
            <p className="section-desc mt-3">
              Bridging high-stakes emergency command and sustainable commercial
              growth—delivering proven disaster recovery for public agencies and
              revenue-scaling strategy for independent and small businesses.
            </p>
          </div>
        </RevealOnMount>

        {/* Dual Pillar Highlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Pillar 1: Emergency Management & Disaster Recovery */}
          <RevealOnMount direction="left" delay={100}>
            <div className="glow-card h-full p-8 md:p-10 rounded-[24px] bg-[var(--glass)] border border-[var(--border)] flex flex-col justify-between relative overflow-hidden group hover:border-[rgba(225,77,24,0.4)] transition-all">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[rgba(225,77,24,0.06)] rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[var(--primary)] px-3 py-1 rounded-full bg-[rgba(225,77,24,0.08)] border border-[rgba(225,77,24,0.2)]">
                    Public Sector &amp; Federal Core
                  </span>
                  <span className="font-mono text-xs text-[var(--text-muted)] font-semibold">
                    Pillar 01
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.65rem] font-bold text-[var(--text-bright)] mb-3 leading-snug">
                  Emergency Management &amp; Disaster Recovery
                </h3>
                <p className="text-[var(--text-muted)] text-[0.92rem] leading-[1.7] mb-6">
                  24/7 disaster response, FEMA Public &amp; Individual
                  Assistance, Category A debris monitoring, Stafford Act audit
                  compliance, and rapid field cadre deployment.
                </p>

                <div className="space-y-2.5 mb-8">
                  {[
                    "FEMA PA/IA Grants & 2 CFR Part 200 Compliance",
                    "EOC Command & Incident Management Staffing",
                    "Category A Debris Monitoring & Load Verification",
                    "Rapid Field Cadre Mobilization & Surge Response",
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs text-[var(--text-main)]"
                    >
                      <div className="w-5 h-5 rounded-full bg-[rgba(225,77,24,0.1)] text-[var(--primary)] flex items-center justify-center shrink-0">
                        <svg
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border)] flex flex-wrap gap-4 items-center justify-between">
                <Link
                  href="/services/emergency-management-and-disaster-recovery"
                  className="btn btn-primary no-underline text-xs inline-flex items-center gap-2"
                >
                  Explore Emergency Scopes
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <Link
                  href="/tracker"
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  Live Hurricane Tracker &rarr;
                </Link>
              </div>
            </div>
          </RevealOnMount>

          {/* Pillar 2: Strategic Planning for Independent & Small Businesses */}
          <RevealOnMount direction="right" delay={200}>
            <div className="glow-card h-full p-8 md:p-10 rounded-[24px] bg-[var(--glass)] border border-[rgba(26,86,196,0.3)] flex flex-col justify-between relative overflow-hidden group hover:border-[var(--secondary)] transition-all">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[rgba(26,86,196,0.08)] rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[var(--secondary)] px-3 py-1 rounded-full bg-[rgba(26,86,196,0.08)] border border-[rgba(26,86,196,0.25)]">
                    Commercial Growth &amp; Revenue Focus
                  </span>
                  <span className="font-mono text-xs text-[var(--text-muted)] font-semibold">
                    Pillar 02
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.65rem] font-bold text-[var(--text-bright)] mb-3 leading-snug">
                  Strategic Planning &amp; Small Business Advisory
                </h3>
                <p className="text-[var(--text-muted)] text-[0.92rem] leading-[1.7] mb-6">
                  Built to expand commercial revenue: strategic growth roadmaps,
                  workflow optimization, business continuity, and SBA teaming to
                  capture public and private contracts.
                </p>

                <div className="space-y-2.5 mb-8">
                  {[
                    "Strategic Growth & Revenue Roadmaps for Small Businesses",
                    "Process Engineering & Workflow Optimization",
                    "SBA Teaming & B2G Capture (HUBZone / VOSB)",
                    "Commercial Business Continuity & Risk Mitigation",
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-xs text-[var(--text-main)]"
                    >
                      <div className="w-5 h-5 rounded-full bg-[rgba(26,86,196,0.1)] text-[var(--secondary)] flex items-center justify-center shrink-0">
                        <svg
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border)] flex flex-wrap gap-4 items-center justify-between">
                <Link
                  href="/services/strategic-consulting-and-operational-excellence"
                  className="btn btn-secondary no-underline text-xs inline-flex items-center gap-2"
                >
                  Explore Small Business Advisory
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <Link
                  href="/calendar"
                  className="text-xs font-semibold text-[var(--secondary)] hover:underline"
                >
                  Book Strategic Consultation &rarr;
                </Link>
              </div>
            </div>
          </RevealOnMount>
        </div>

        {/* Quick Service Categories Bar */}
        <RevealOnMount direction="up" delay={250}>
          <div className="p-6 rounded-2xl bg-[var(--panel-dark)] border border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-[var(--text-bright)] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                Full Service Spectrum:
              </span>
              <span className="text-xs px-3 py-1 rounded-md bg-[var(--glass)] border border-[var(--border)] text-[var(--text-muted)]">
                Incident Management (ICS/NIMS)
              </span>
              <span className="text-xs px-3 py-1 rounded-md bg-[var(--glass)] border border-[var(--border)] text-[var(--text-muted)]">
                Contact Center &amp; Survivor Helpline
              </span>
              <span className="text-xs px-3 py-1 rounded-md bg-[var(--glass)] border border-[var(--border)] text-[var(--text-muted)]">
                DCAA &amp; Financial Controls
              </span>
              <span className="text-xs px-3 py-1 rounded-md bg-[var(--glass)] border border-[var(--border)] text-[var(--text-muted)]">
                Cadre Workforce Development
              </span>
            </div>
            <Link
              href="/services"
              className="text-xs font-bold text-[var(--primary)] hover:underline shrink-0 flex items-center gap-1.5"
            >
              View All 7 Capabilities &rarr;
            </Link>
          </div>
        </RevealOnMount>
      </section>

      {/* COMPANY STORY TEASER SECTION */}
      {about && (
        <section
          id="story-teaser"
          className="py-24 px-[5vw] border-b border-[var(--border)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
            <RevealOnMount direction="left">
              <div className="section-eyebrow">
                <TypewriterText
                  text="Operational Readiness"
                  speed={40}
                  delay={200}
                />
              </div>
              <h2 className="section-title">The Inferno Command</h2>
              <p className="text-[var(--text-muted)] text-base leading-[1.7] mb-8">
                {about.story.substring(0, 210)}...
              </p>
              <Link href="/about" className="btn btn-secondary no-underline">
                Read Corporate Story
              </Link>
            </RevealOnMount>

            <RevealOnMount direction="right">
              <div className="glow-card rounded-[20px] bg-[rgba(225,77,24,0.015)] border border-[var(--border)] p-10 flex flex-col gap-5">
                <div className="text-[0.85rem] font-bold text-[var(--primary)] uppercase">
                  Core Mandate
                </div>
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-[750]">
                  FEMA &amp; FAR Alignment
                </h4>
                <p className="text-[0.85rem] text-[var(--text-muted)] leading-[1.5]">
                  Every field load ticket, cost log, and survivor filing aligns
                  with Stafford Act and FAR standards to protect grant
                  reimbursements.
                </p>
              </div>
            </RevealOnMount>
          </div>
        </section>
      )}

      {/* PARTNERS & SUBCONTRACTORS TEASER */}
      <section
        id="home-partnerships"
        className="py-20 px-[5vw] bg-[var(--panel-dark)] border-b border-[var(--border)]"
      >
        <RevealOnMount direction="left">
          <div className="text-center max-w-[800px] mx-auto mb-14">
            <div className="section-eyebrow">
              <TypewriterText
                text="Teaming & Procurement"
                speed={40}
                delay={200}
              />
            </div>
            <h2 className="section-title">
              Built to Partner. Ready to Perform.
            </h2>
            <p className="section-desc mt-3">
              We partner with qualified subcontractors, specialty trades,
              consultants, suppliers, and emerging businesses to deliver
              compliant, high-impact results.
            </p>
          </div>
        </RevealOnMount>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <RevealOnMount direction="left" delay={100}>
            <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-8 h-full flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider block mb-2">
                  Teaming Approach
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-bold mb-3">
                  Prime &amp; Subcontracting
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-[1.7]">
                  Flexible teaming across prime/sub roles, specialty
                  subcontracting, consulting, and joint pursuits.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border)] mt-6 text-[0.75rem] font-semibold text-[var(--text-bright)]">
                &bull; Commercial &amp; Public-Sector Bids
              </div>
            </div>
          </RevealOnMount>

          <RevealOnMount direction="up" delay={200}>
            <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-8 h-full flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wider block mb-2">
                  Operational Readiness
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-bold mb-3">
                  Bonding &amp; Compliance
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-[1.7]">
                  Supporting Bid, Performance, and Payment bonds up to 100% of
                  contract value with practical scope evaluation.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border)] mt-6 text-[0.75rem] font-semibold text-[var(--text-bright)]">
                &bull; Single &amp; Aggregate Bonding
              </div>
            </div>
          </RevealOnMount>

          <RevealOnMount direction="right" delay={300}>
            <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-8 h-full flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider block mb-2">
                  Network Expansion
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-bold mb-3">
                  Emergency Vendor Network
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-[1.7]">
                  Deployable disaster recovery teams, logistics carriers,
                  equipment suppliers, and specialty trades.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border)] mt-6 text-[0.75rem] font-semibold text-[var(--text-bright)]">
                &bull; Rapid Mobilization Ready
              </div>
            </div>
          </RevealOnMount>
        </div>

        <div className="text-center">
          <p className="font-[family-name:var(--font-space-grotesk)] text-base font-bold text-[var(--primary)] mb-6 tracking-wider">
            &ldquo;Build with us. Respond with us. Deliver with us.&rdquo;
          </p>
          <Link href="/partnerships" className="btn btn-primary no-underline">
            Register Teaming Profile
          </Link>
        </div>
      </section>

      {/* INFERNO CARES / COMMUNITY IMPACT HIGHLIGHT */}
      <section
        id="home-community"
        className="py-20 px-[5vw] border-b border-[var(--border)]"
      >
        <RevealOnMount direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
            <div>
              <div className="section-eyebrow">
                <TypewriterText text="Inferno Cares" speed={40} delay={200} />
              </div>
              <h2 className="section-title">Service Beyond the Contract</h2>
              <p className="text-[var(--text-muted)] text-[0.95rem] leading-[1.8] mb-6">
                True impact is measured by how we show up for communities when
                support is needed most—beyond completed contracts.
              </p>
              <div className="space-y-4 mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStoryMedia("kickball");
                    setIsPlayingVideo(false);
                  }}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    activeStoryMedia === "kickball"
                      ? "bg-[rgba(225,77,24,0.06)] border-[var(--primary)] shadow-sm"
                      : "bg-[var(--glass)] border-[var(--border)] hover:border-[rgba(225,77,24,0.3)]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[rgba(225,77,24,0.1)] text-[var(--primary)] flex items-center justify-center shrink-0 font-bold text-xs">
                    01
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[var(--text-bright)]">
                        Kicking for Relief Kickball Tournament
                      </h4>
                      <span className="text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(225,77,24,0.1)] text-[var(--primary)]">
                        Relief Sports
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Annual charity tournament uniting community teams to fund
                      direct relief for storm-displaced families.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStoryMedia("scholarship");
                    setIsPlayingVideo(false);
                  }}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    activeStoryMedia === "scholarship"
                      ? "bg-[rgba(26,86,196,0.06)] border-[var(--secondary)] shadow-sm"
                      : "bg-[var(--glass)] border-[var(--border)] hover:border-[rgba(26,86,196,0.3)]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[rgba(26,86,196,0.08)] text-[var(--secondary)] flex items-center justify-center shrink-0 font-bold text-xs">
                    02
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-[var(--text-bright)]">
                        The Inferno Ignite Scholarship
                      </h4>
                      <span className="text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(26,86,196,0.1)] text-[var(--secondary)]">
                        Higher Ed
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Academic book stipends and micro-grants for Orlando high
                      school seniors entering college.
                    </p>
                  </div>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/about#about-impact"
                  className="btn btn-secondary no-underline text-xs"
                >
                  Learn About Inferno Cares
                </Link>
                <a
                  href="mailto:InfernoCares@theinfernogroup.com"
                  className="text-xs font-bold text-[var(--primary)] hover:underline"
                >
                  InfernoCares@theinfernogroup.com &rarr;
                </a>
              </div>
            </div>

            {/* INTERACTIVE MEDIA SPOTLIGHT (PHOTOS & VIDEO) */}
            <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[24px] p-6 md:p-8 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-bright)] font-[family-name:var(--font-space-grotesk)]">
                  {activeStoryMedia === "scholarship"
                    ? "Ignite Scholarship Media"
                    : "Kickball Tournament Media"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStoryMedia("scholarship");
                      setIsPlayingVideo(false);
                    }}
                    className={`px-3 py-1 rounded-full text-[0.7rem] font-bold transition-all ${
                      activeStoryMedia === "scholarship"
                        ? "bg-[var(--secondary)] text-white shadow-xs"
                        : "bg-[var(--panel-dark)] text-[var(--text-muted)] hover:text-[var(--text-bright)]"
                    }`}
                  >
                    Scholarship
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStoryMedia("kickball");
                      setIsPlayingVideo(false);
                    }}
                    className={`px-3 py-1 rounded-full text-[0.7rem] font-bold transition-all ${
                      activeStoryMedia === "kickball"
                        ? "bg-[var(--primary)] text-white shadow-xs"
                        : "bg-[var(--panel-dark)] text-[var(--text-muted)] hover:text-[var(--text-bright)]"
                    }`}
                  >
                    Kickball
                  </button>
                </div>
              </div>

              {activeStoryMedia === "scholarship" ? (
                <div className="flex flex-col gap-4">
                  {/* Video & Ceremony Presentation */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-[var(--border)] shadow-md group">
                    {isPlayingVideo ? (
                      <video
                        src="/scholarship_video.mp4"
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                      >
                        Your browser does not support HTML video.
                      </video>
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            activePhotoIdx === 0
                              ? "/scholarship_ceremony.png"
                              : "/impact_debris.png"
                          }
                          alt="The Inferno Ignite Scholarship Recipients"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/impact_debris.png";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
                          <span className="text-[0.65rem] font-bold uppercase tracking-wider text-white/80 mb-1">
                            Inferno Ignite Academic Awards
                          </span>
                          <h4 className="text-white text-base font-bold leading-tight mb-3 font-[family-name:var(--font-space-grotesk)]">
                            Investing in Tomorrow&apos;s Scholars
                          </h4>
                          <button
                            type="button"
                            onClick={() => setIsPlayingVideo(true)}
                            className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[var(--primary)] text-white text-xs font-bold hover:bg-[#c93f10] shadow-md transition-all"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            Watch Scholarship Video
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Scholarship Photo Thumbnails */}
                  <div>
                    <span className="text-[0.7rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
                      Event Photo Gallery
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          label: "Award Ceremony",
                          src: "/scholarship_ceremony.png",
                          fallback: "/impact_debris.png",
                        },
                      ].map((thumb, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setActivePhotoIdx(idx);
                            setIsPlayingVideo(false);
                          }}
                          className={`relative rounded-lg overflow-hidden border aspect-video transition-all ${
                            activePhotoIdx === idx && !isPlayingVideo
                              ? "border-[var(--secondary)] ring-2 ring-[var(--secondary)]/30"
                              : "border-[var(--border)] opacity-75 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumb.src}
                            alt={thumb.label}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                thumb.fallback;
                            }}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Kickball Tournament Card */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-[var(--border)] shadow-md group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/kickball_tournament.png"
                      alt="Kicking for Relief Charity Kickball Tournament"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/impact_texas.png";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                        Disaster Relief Tournament
                      </span>
                      <h4 className="text-white text-base font-bold leading-tight font-[family-name:var(--font-space-grotesk)]">
                        Kicking for Relief Annual Fundraiser
                      </h4>
                      <p className="text-white/80 text-xs mt-1">
                        Uniting businesses, emergency leaders, and volunteers to
                        raise critical funds for disaster-affected families.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[rgba(225,77,24,0.05)] border border-[rgba(225,77,24,0.15)] flex items-center justify-between text-xs">
                    <span className="text-[var(--text-bright)] font-semibold">
                      Subcategory: Community Disaster Resilience
                    </span>
                    <Link
                      href="/about#about-impact"
                      className="text-[var(--primary)] font-bold hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </RevealOnMount>
      </section>

      {/* CAREERS & CADRE RECRUITMENT TEASER */}
      <section
        id="home-careers"
        className="py-20 px-[5vw] bg-[var(--panel-dark)] border-b border-[var(--border)]"
      >
        <RevealOnMount direction="up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <div className="section-eyebrow">Join the Mission</div>
              <h2 className="section-title">
                Open Positions &amp; Cadre Mobilization
              </h2>
              <p className="section-desc max-w-[650px] mt-2">
                Recruiting corporate leaders, project managers, and deployable
                response cadres across 12 active roles. Send resumes to{" "}
                <a
                  href="mailto:Jobs@theinfernogroup.com"
                  className="text-[var(--primary)] font-bold hover:underline"
                >
                  Jobs@theinfernogroup.com
                </a>
                .
              </p>
            </div>
            <Link
              href="/careers"
              className="btn btn-primary no-underline shrink-0"
            >
              View All 12 Openings
            </Link>
          </div>

          <div className="bg-[rgba(225,77,24,0.04)] border border-[var(--border)] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-glow)] text-[var(--primary)] flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <polyline points="17 11 19 13 23 9"></polyline>
                </svg>
              </div>
              <div>
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-bright)]">
                  E-Verify Employer
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 max-w-[600px] leading-[1.5]">
                  The Inferno Group LLC participates in E-Verify and verifies
                  employment eligibility for all newly hired personnel.
                </p>
              </div>
            </div>
            <Link
              href="/careers"
              className="btn btn-secondary no-underline text-xs shrink-0"
            >
              Explore Career Portal
            </Link>
          </div>
        </RevealOnMount>
      </section>

      {/* AI & INNOVATION SECTION */}
      <section
        id="ai-innovation"
        className="py-24 px-[5vw] border-b border-[var(--border)]"
      >
        <RevealOnMount direction="up">
          <div className="text-center mb-16">
            <div className="section-eyebrow">
              <TypewriterText text="Next-Gen Delivery" speed={40} delay={200} />
            </div>
            <h2 className="section-title">AI &amp; Innovation</h2>
            <p className="section-desc">
              Automated procurement matching, encrypted data gateways, and live
              weather intelligence.
            </p>
          </div>
        </RevealOnMount>

        <div className="partner-grid grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10">
          {aiFeatures.map((feat, idx) => (
            <RevealOnMount
              key={feat.id}
              direction={
                ["left", "up", "right"][idx % 3] as "left" | "up" | "right"
              }
              delay={idx * 120}
            >
              <div className="partner-card py-10 px-8 bg-[var(--glass)] border border-[var(--border)] rounded-2xl h-full flex flex-col gap-5">
                <div className="partner-card-icon w-12 h-12 rounded-[10px] bg-[var(--primary-glow)] text-[var(--primary)] flex items-center justify-center">
                  {getIconSvg(feat.icon)}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.2rem] font-[750] mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-[0.85rem] leading-[1.6]">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </RevealOnMount>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        id="testimonials-section"
        className="py-24 px-[5vw] bg-[var(--panel-dark)]"
      >
        <RevealOnMount direction="right">
          <div className="text-center mb-14">
            <div className="section-eyebrow">
              <TypewriterText text="Verified Reviews" speed={40} delay={200} />
            </div>
            <h2 className="section-title">Client Success Endorsements</h2>
          </div>
        </RevealOnMount>

        <RevealOnMount direction="up">
          <TestimonialsCarousel />
        </RevealOnMount>
      </section>

      {/* TRASH DROP ZONE (APPEARS AT TOP WHEN DRAGGING QUIZ ICON) */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[2000] flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 pointer-events-none ${
          isDraggingQuiz && isQuizTriggerVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-8 scale-90"
        } ${
          isHoveringTrash
            ? "bg-red-600/90 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] scale-110 border-2 border-red-400"
            : "bg-slate-900/85 backdrop-blur-xl text-white/90 border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${isHoveringTrash ? "rotate-12 scale-125" : ""}`}
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          {isHoveringTrash && <line x1="10" y1="11" x2="10" y2="17" />}
          {isHoveringTrash && <line x1="14" y1="11" x2="14" y2="17" />}
        </svg>
        <span className="font-semibold text-xs tracking-wider uppercase font-[family-name:var(--font-space-grotesk)]">
          {isHoveringTrash ? "Release to Remove" : "Drag here to remove"}
        </span>
      </div>

      {/* ELIGIBILITY QUIZ TRIGGER ICON (SWIPABLE / DRAGGABLE) */}
      <div
        ref={quizRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={
          quizPos.x !== null && quizPos.y !== null
            ? {
                left: `${quizPos.x}px`,
                top: `${quizPos.y}px`,
                bottom: "auto",
                right: "auto",
              }
            : undefined
        }
        className={`fixed bottom-6 left-4 sm:bottom-8 sm:left-8 z-[1999] flex items-center select-none touch-none ${
          isDraggingQuiz
            ? "cursor-grabbing scale-105 transition-none"
            : "cursor-grab transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        } ${isQuizTriggerVisible ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-80"}`}
      >
        {/* Tooltip popup — dynamically flips if icon is dragged to right half of screen */}
        {(() => {
          const isTooltipLeft =
            quizPos.x !== null &&
            typeof window !== "undefined" &&
            quizPos.x > window.innerWidth / 2;
          return (
            <div
              className={`hidden sm:block absolute ${
                isTooltipLeft
                  ? "right-[70px] left-auto"
                  : "left-[70px] right-auto"
              } top-1/2 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none whitespace-nowrap ${
                showQuizTooltip
                  ? "-translate-y-1/2 translate-x-0 opacity-100"
                  : "-translate-y-1/2 -translate-x-5 opacity-0"
              }`}
            >
              <div className="bg-[var(--primary)] text-white px-4 py-[0.55rem] rounded-md text-[0.85rem] font-medium font-[family-name:var(--font-space-grotesk)] shadow-sm relative">
                Take the Quiz
                {isTooltipLeft ? (
                  <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[var(--primary)]" />
                ) : (
                  <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[var(--primary)]" />
                )}
              </div>
            </div>
          );
        })()}

        <button
          onClick={() => {
            if (!dragStartRef.current.hasMoved) {
              setIsQuizPopupOpen(true);
              setShowQuizTooltip(false);
            }
          }}
          className={`w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] rounded-full bg-[var(--primary)] border-none flex items-center justify-center shadow-md text-white relative transition-all duration-300 ${
            isDraggingQuiz ? "cursor-grabbing" : "cursor-grab"
          }`}
          aria-label="Open eligibility quiz"
        >
          {/* Quiz icon — clipboard with question mark */}
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="sm:w-[26px] sm:h-[26px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14h6" />
            <path d="M9 18h6" />
            <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
          </svg>
          <div className="quiz-pulse" />
        </button>

        <button
          data-no-drag="true"
          onClick={(e) => {
            e.stopPropagation();
            setIsQuizTriggerVisible(false);
            setShowQuizTooltip(false);
          }}
          className="absolute -top-[5px] -right-[5px] w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] rounded-full bg-[var(--text-bright)] hover:bg-red-600 border border-[var(--border)] cursor-pointer flex items-center justify-center text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)] p-0 transition-all duration-300 z-10 group"
          aria-label="Remove quiz icon"
          title="Remove quiz icon"
        >
          {/* Trash / Delete SVG Icon */}
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:scale-110 transition-transform"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* ELIGIBILITY QUIZ CORNER POPUP (CHATBOT STYLE) */}
      <div
        style={
          quizPos.x !== null && quizPos.y !== null
            ? {
                left: `${
                  typeof window !== "undefined" &&
                  quizPos.x > window.innerWidth / 2
                    ? Math.max(12, quizPos.x - 350 + 60)
                    : Math.max(12, quizPos.x)
                }px`,
                ...(typeof window !== "undefined" &&
                quizPos.y > window.innerHeight / 2
                  ? {
                      bottom: `${window.innerHeight - quizPos.y + 12}px`,
                      top: "auto",
                    }
                  : { top: `${quizPos.y + 70}px`, bottom: "auto" }),
              }
            : undefined
        }
        className={`fixed bottom-20 left-3 sm:bottom-8 sm:left-8 w-[350px] max-w-[calc(100vw-24px)] max-h-[85vh] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl border border-[var(--border)] shadow-[0_10px_30px_rgba(0,0,0,0.08)] z-[1998] p-4 sm:p-6 flex flex-col gap-3.5 sm:gap-4 transition-all duration-400 ease-in-out ${isQuizPopupOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-5"}`}
      >
        <button
          onClick={() => {
            setIsQuizPopupOpen(false);
          }}
          className="absolute top-[0.85rem] right-[0.85rem] bg-transparent border-none cursor-pointer text-[var(--text-muted)] flex items-center justify-center p-1 rounded-full transition-all duration-300"
          aria-label="Close promotion"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-[var(--primary-glow)] text-[var(--primary)] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(225,77,24,0.05)]">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <div className="flex-1 pr-6">
            <span className="text-[0.7rem] font-[750] text-[var(--primary)] uppercase tracking-wider inline-block mb-1">
              GovCon Eligibility
            </span>
            <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.05rem] font-[750] leading-[1.3] text-[var(--text-bright)] m-0">
              Qualify for Federal Set-Asides?
            </h4>
            <p className="text-[var(--text-muted)] text-xs leading-[1.4] mt-[0.35rem] mb-0">
              Verify if your business qualifies for SBA 8(a), HUBZone, WOSB, or
              SDVOSB in under 2 minutes.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-1">
          <Link
            href="/quiz"
            className="btn btn-primary no-underline flex-1 justify-center inline-flex text-xs py-2 px-4 h-auto min-h-0"
            onClick={() => {
              setIsQuizPopupOpen(false);
              setIsQuizTriggerVisible(false);
            }}
          >
            Take Quiz
          </Link>
          <button
            className="btn btn-secondary flex-1 justify-center text-xs py-2 px-4 h-auto min-h-0"
            onClick={() => {
              setIsQuizPopupOpen(false);
              setIsQuizTriggerVisible(false);
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
