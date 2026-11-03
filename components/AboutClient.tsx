"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import RevealOnMount from "./RevealOnMount";
import AnimatedStats from "./AnimatedStats";
import TypewriterText from "./TypewriterText";
import {
  dataStore,
  TeamMember,
  AboutData,
  CommunityStory,
} from "@/utils/dataStore";

export default function AboutClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [playingVideoStoryId, setPlayingVideoStoryId] = useState<string | null>(null);
  const [selectedStoryPhotos, setSelectedStoryPhotos] = useState<Record<string, number>>({});

  // Selected team member for modal detail view
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const refreshData = () => {
      setAbout(dataStore.getAbout());
      setTeam(dataStore.getTeam().filter((t) => t.status === "published"));
      setStories(
        dataStore.getCommunityStories().filter((s) => s.status === "published")
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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (!isMounted || !about) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Loading Intelligence...</h2>
      </div>
    );
  }

  // Helper to map icon names to SVGs
  const getIconSvg = (iconName: string) => {
    switch (iconName) {
      case "shield":
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        );
      case "lock":
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
      case "zap":
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        );
      case "file-check":
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <polyline points="9 15 11 17 15 13"></polyline>
          </svg>
        );
      case "cpu":
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
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="15" x2="23" y2="15"></line>
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="15" x2="4" y2="15"></line>
          </svg>
        );
    }
  };

  const naicsCodes = [
    { code: "541611", title: "Administrative & General Management Consulting" },
    { code: "541618", title: "Other Management Consulting" },
    { code: "541690", title: "Other Scientific & Technical Consulting" },
    { code: "624230", title: "Emergency & Other Relief Services" },
    { code: "561210", title: "Facilities Support Services" },
    { code: "562910", title: "Remediation Services" },
    { code: "238320", title: "Painting & Wall Covering Contractors" },
    { code: "561720", title: "Janitorial Services" },
    { code: "561790", title: "Other Services to Buildings & Dwellings" },
    { code: "238990", title: "All Other Specialty Trade Contractors" },
    { code: "423990", title: "Other Miscellaneous Durable Goods" },
    { code: "488510", title: "Freight Transportation Arrangement" },
    { code: "561422", title: "Telemarketing & Other Contact Centers" },
  ];

  return (
    <div className="page-view block overflow-x-clip">
      {/* HERO / STORY SECTION */}
      <section id="about-hero" className="pt-16 md:pt-24 pb-8 overflow-hidden">
        <RevealOnMount direction="left">
          <div className="section-eyebrow">
            <TypewriterText
              text="Corporate Briefing • Who We Are"
              speed={40}
              delay={200}
            />
          </div>
          <h1 className="section-title">About The Inferno Group</h1>
          <p className="section-desc">
            Advisors in crisis management, regulatory compliance, and strategic
            public sector business growth.
          </p>
        </RevealOnMount>

        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-12 mt-12 items-start min-w-0 w-full">
          <RevealOnMount direction="left" className="about-story-text min-w-0 w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(225,77,24,0.08)] border border-[rgba(225,77,24,0.2)] text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
              Origin &amp; Mission Narrative
            </div>

            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.75rem] font-bold mb-6 text-[var(--text-bright)]">
              Meaningful impact begins with the courage to create it.
            </h3>

            {about.story.split("\n\n").map((para, idx) => (
              <p
                key={idx}
                className="text-[var(--text-muted)] text-[1.05rem] leading-[1.8] mb-5"
              >
                {para}
              </p>
            ))}

            {/* Mission & Vision Callout Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
              <div className="bg-[rgba(225,77,24,0.03)] border-l-[3px] border-l-[var(--primary)] p-6 rounded-r-xl border-y border-r border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-[var(--primary)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="12 6 12 12 16 14"></polygon>
                  </svg>
                  <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.05rem] font-bold text-[var(--primary)]">
                    Our Mission
                  </h4>
                </div>
                <p className="text-[0.92rem] text-[var(--text-muted)] leading-[1.6]">
                  {about.mission}
                </p>
              </div>

              <div className="bg-[rgba(15,23,42,0.02)] border-l-[3px] border-l-[var(--navy)] p-6 rounded-r-xl border-y border-r border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-[var(--navy)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.05rem] font-bold text-[var(--text-bright)]">
                    Our Vision
                  </h4>
                </div>
                <p className="text-[0.92rem] text-[var(--text-muted)] leading-[1.6]">
                  {about.vision ||
                    "We believe every mission matters because every community matters."}
                </p>
              </div>
            </div>
          </RevealOnMount>

          {/* Hero Feature Visual Card */}
          <RevealOnMount
            direction="right"
            className="about-hero-image-wrapper lg:sticky lg:top-[100px] min-w-0 w-full max-w-full overflow-hidden"
          >
            <div className="glow-card rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[var(--border)] bg-[var(--panel-dark)] shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative flex flex-col min-w-0 w-full max-w-full">
              {/* Top Banner Image with Overlay */}
              <div className="relative h-[220px] w-full overflow-hidden bg-[var(--navy)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-bg.jpg"
                  alt="The Inferno Group Emergency Management Headquarters"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover opacity-85 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--panel-dark)] via-[rgba(15,23,42,0.4)] to-transparent"></div>

                {/* Floating Logo Badge */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-auto flex items-center gap-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-[var(--border)] shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="The Inferno Group"
                    loading="eager"
                    decoding="async"
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain shadow-sm shrink-0"
                  />
                  <div>
                    <h4 className="font-[family-name:var(--font-space-grotesk)] text-[0.95rem] sm:text-[1.05rem] font-black text-slate-900 leading-tight">
                      The Inferno Group LLC
                    </h4>
                    <span className="text-[0.68rem] sm:text-[0.72rem] font-semibold text-[var(--primary)] uppercase tracking-wider block">
                      Orlando, FL • Nationwide Operations
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges & Core Snapshot */}
              <div className="p-5 sm:p-7 flex flex-col gap-5">
                <p className="text-[var(--text-muted)] text-[0.9rem] leading-[1.65]">
                  Veteran-led government consulting and emergency management firm
                  delivering rapid mobilization, strict compliance, and measurable
                  results.
                </p>

                {/* Federal Identifier Quick Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div
                    onClick={() => handleCopy("QW6RHJACHA56", "UEI")}
                    className="p-3 rounded-xl bg-[var(--glass)] border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer transition-all duration-200 group"
                    title="Click to copy Unique Entity ID"
                  >
                    <span className="text-[0.68rem] text-[var(--text-muted)] uppercase tracking-wider block font-semibold">
                      Unique Entity ID (UEI)
                    </span>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-bold text-[var(--text-bright)] group-hover:text-[var(--primary)] flex items-center justify-between mt-1">
                      QW6RHJACHA56
                      <span className="text-[0.65rem] text-[var(--primary)] font-sans">
                        {copiedCode === "UEI" ? "✓ Copied" : "Copy"}
                      </span>
                    </span>
                  </div>

                  <div
                    onClick={() => handleCopy("22VP2", "CAGE")}
                    className="p-3 rounded-xl bg-[var(--glass)] border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer transition-all duration-200 group"
                    title="Click to copy CAGE Code"
                  >
                    <span className="text-[0.68rem] text-[var(--text-muted)] uppercase tracking-wider block font-semibold">
                      CAGE Code
                    </span>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-bold text-[var(--text-bright)] group-hover:text-[var(--primary)] flex items-center justify-between mt-1">
                      22VP2
                      <span className="text-[0.65rem] text-[var(--primary)] font-sans">
                        {copiedCode === "CAGE" ? "✓ Copied" : "Copy"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Socioeconomic Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(225,77,24,0.08)] text-[var(--primary)] text-xs font-bold border border-[rgba(225,77,24,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></span>
                    SBA HUBZone Certified
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(15,23,42,0.06)] text-slate-800 text-xs font-bold border border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                    Veteran-Owned Small Business (VOSB)
                  </span>
                </div>

                {/* Quick Action CTAs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
                  <Link
                    href="/contact"
                    className="btn btn-primary text-xs py-2.5 px-3 text-center justify-center no-underline"
                  >
                    Initiate Contact
                  </Link>
                  <Link
                    href="/partnerships"
                    className="btn btn-secondary text-xs py-2.5 px-3 text-center justify-center no-underline"
                  >
                    Partner With Us
                  </Link>
                </div>
              </div>
            </div>
          </RevealOnMount>
        </div>
      </section>

      {/* FEDERAL CREDENTIALS & SOCIOECONOMIC STATUS STRIP */}
      <section className="py-10 px-[8vw]">
        <RevealOnMount direction="up">
          <div className="glow-card bg-gradient-to-br from-[var(--panel-dark)] to-[rgba(225,77,24,0.02)] border border-[var(--border)] rounded-[24px] p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[var(--border)]">
              <div>
                <span className="service-badge py-1 px-3 text-[0.68rem] bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)] rounded-full font-bold uppercase tracking-wider">
                  Federal Procurement Credentials
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.45rem] font-bold text-[var(--text-bright)] mt-2">
                  Official Socioeconomic Certifications Held
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/capabilities?download=true"
                  className="btn btn-secondary text-xs py-2 px-4 no-underline"
                >
                  Download Capability Statement
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              {/* HUBZone Card */}
              <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(225,77,24,0.1)] text-[var(--primary)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.15rem] font-bold text-[var(--text-bright)]">
                      HUBZone Certified
                    </h4>
                    <span className="text-[0.7rem] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      SBA Verified
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--primary)] block mt-0.5">
                    U.S. Small Business Administration
                  </span>
                  <p className="text-[var(--text-muted)] text-[0.88rem] mt-2 leading-[1.6]">
                    Delivering federal socioeconomic contracting value and
                    economic growth in historically underutilized zones.
                  </p>
                </div>
              </div>

              {/* VOSB Card */}
              <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--navy)]/10 text-[var(--navy)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.15rem] font-bold text-[var(--text-bright)]">
                      Veteran-Owned Small Business (VOSB)
                    </h4>
                    <span className="text-[0.7rem] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                      Active
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-bright)] block mt-0.5">
                    Veteran-Led • Mission-Focused
                  </span>
                  <p className="text-[var(--text-muted)] text-[0.88rem] mt-2 leading-[1.6]">
                    Supporting public and private supplier diversity mandates
                    and socioeconomic teaming goals.
                  </p>
                </div>
              </div>
            </div>

            {/* NAICS Code Directory Accordion / Grid */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <h5 className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-[var(--text-bright)] uppercase tracking-wider mb-3">
                Core NAICS Classifications Registered:
              </h5>
              <div className="flex flex-wrap gap-2">
                {naicsCodes.map((item) => (
                  <div
                    key={item.code}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--glass)] border border-[var(--border)] text-xs hover:border-[var(--primary)] transition-colors group cursor-default"
                    title={item.title}
                  >
                    <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-[var(--primary)]">
                      {item.code}
                    </span>
                    <span className="text-[var(--text-muted)] text-[0.78rem]">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnMount>
      </section>

      {/* STATS STRIP */}
      <section className="px-[8vw] pb-16">
        <RevealOnMount direction="left">
          <AnimatedStats />
        </RevealOnMount>
      </section>

      {/* CORE VALUES SECTION */}
      <section id="about-values" className="pt-4 pb-16 px-[8vw]">
        <RevealOnMount direction="up">
          <div className="text-center mb-12">
            <div className="section-eyebrow">
              <TypewriterText
                text="Operating Principles"
                speed={40}
                delay={200}
              />
            </div>
            <h2 className="section-title">Core Values</h2>
            <p className="section-desc">
              The foundational standards that guide every mission, partnership,
              and operational response.
            </p>
          </div>
        </RevealOnMount>

        <div className="partner-grid grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
          {about.coreValues.map((val, idx) => (
            <RevealOnMount
              key={idx}
              direction={
                ["left", "up", "right"][idx % 3] as "left" | "up" | "right"
              }
              delay={idx * 120}
              className="h-full flex flex-col"
            >
              <div className="partner-card py-10 px-8 bg-[var(--glass)] rounded-2xl h-full flex flex-col gap-5 border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="partner-card-icon w-12 h-12 rounded-[12px] bg-[var(--primary-glow)] text-[var(--primary)] flex items-center justify-center">
                  {getIconSvg(val.icon || "cpu")}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.2rem] font-[750] mb-2">
                    {val.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-[0.88rem] leading-[1.65]">
                    {val.desc}
                  </p>
                </div>
              </div>
            </RevealOnMount>
          ))}
        </div>
      </section>

      {/* HOW WE WORK TIMELINE */}
      <section id="about-workflow" className="py-16 px-[8vw]">
        <RevealOnMount direction="right">
          <div className="text-center mb-14">
            <div className="section-eyebrow">
              <TypewriterText
                text="Execution Methodology"
                speed={40}
                delay={200}
              />
            </div>
            <h2 className="section-title">How We Work</h2>
            <p className="section-desc max-w-[800px] mx-auto mt-4 leading-[1.7]">
              {about.howWeWorkSummary ||
                "We approach every project with the mindset that every mission matters. Our team works collaboratively with clients to identify challenges, develop strategic solutions, and execute with discipline and precision."}
            </p>
          </div>
        </RevealOnMount>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 relative">
          {about.howWeWork.map((step, idx) => (
            <RevealOnMount
              key={idx}
              direction={
                ["left", "up", "right"][idx % 3] as "left" | "up" | "right"
              }
              delay={idx * 120}
              className="h-full flex flex-col"
            >
              <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-2xl py-10 px-8 relative h-full flex flex-col">
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-[2.5rem] font-black text-[rgba(225,77,24,0.12)] absolute top-6 right-6 leading-none select-none">
                  {step.step}
                </span>
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.15rem] font-[750] mb-3 pr-8 text-[var(--text-bright)]">
                  {step.title}
                </h4>
                <p className="text-[var(--text-muted)] text-[0.88rem] leading-[1.65]">
                  {step.desc}
                </p>
              </div>
            </RevealOnMount>
          ))}
        </div>
      </section>

      {/* LEADERSHIP & TEAM */}
      <section id="about-team" className="py-16 px-[8vw]">
        <RevealOnMount direction="left">
          <div className="text-center mb-12">
            <div className="section-eyebrow">
              <TypewriterText
                text="Operations Command"
                speed={40}
                delay={200}
              />
            </div>
            <h2 className="section-title">Leadership &amp; Advisory Team</h2>
            <p className="section-desc max-w-[750px] mx-auto">
              Senior government operations leaders, legal counsel, and emergency
              management directors dedicated to mission excellence.
            </p>
          </div>
        </RevealOnMount>

        <div className="partner-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <RevealOnMount
              key={member.id}
              direction={
                ["left", "up", "right"][idx % 3] as "left" | "up" | "right"
              }
              delay={idx * 120}
            >
              <div
                className="partner-card p-8 bg-[var(--glass)] border border-[var(--border)] hover:border-[var(--primary)] rounded-[24px] text-center cursor-pointer transition-all duration-300 group flex flex-col h-full justify-between shadow-sm hover:shadow-lg"
                onClick={() => setSelectedMember(member)}
              >
                <div>
                  {/* Avatar wrapper with Orange & Navy Blue Theme styling */}
                  <div className="team-member-avatar-wrapper relative w-[140px] h-[140px] mx-auto mb-6 rounded-full overflow-hidden p-[3px] bg-gradient-to-br from-[var(--navy)] via-[#1E293B] to-[var(--primary)] shadow-[0_6px_25px_rgba(225,77,24,0.25)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        member.image.startsWith("data:") ||
                        member.image.startsWith("/")
                          ? member.image
                          : "/logo.png"
                      }
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("logo.png")) {
                          target.src = "/logo.png";
                        }
                      }}
                      className={`team-member-avatar w-full h-full rounded-full transition-transform duration-500 group-hover:scale-105 ${
                        member.id === "charnelle-smith"
                          ? "object-contain bg-[#111E42]"
                          : member.id === "fady-youssef"
                            ? "object-cover object-[center_20%]"
                            : member.id === "andre-montgomery"
                              ? "object-cover object-[center_15%]"
                              : member.id === "kelly-clerveaux"
                                ? "object-cover object-[center_15%]"
                                : "object-cover object-center"
                      }`}
                    />
                  </div>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-[750] text-[var(--text-bright)]">
                    {member.name}
                  </h3>
                  <span className="text-[var(--primary)] text-xs font-bold block mt-1.5 uppercase tracking-wider">
                    {member.role}
                  </span>
                  <p className="text-[var(--text-muted)] text-xs mt-3 line-clamp-3 leading-[1.65]">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-5 border-t border-[var(--border)] mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-bold group-hover:translate-x-1 transition-transform">
                    View Executive Briefing
                    <svg
                      className="view-briefing-icon"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            </RevealOnMount>
          ))}
        </div>
      </section>

      {/* COMMUNITY IMPACT & INFERNO CARES */}
      <section id="about-impact" className="py-16 px-[8vw]">
        <RevealOnMount direction="up">
          <div className="text-center mb-14">
            <div className="section-eyebrow">
              <TypewriterText
                text="Service Beyond the Contract"
                speed={40}
                delay={200}
              />
            </div>
            <h2 className="section-title">
              Community Impact &amp; Inferno Cares
            </h2>
            <p className="section-desc max-w-[850px] mx-auto mt-4 leading-[1.7]">
              Service extends beyond our contracts. Through{" "}
              <strong>Inferno Cares</strong>, TIG invests directly in disaster
              relief, youth education, and underserved communities when support
              is needed most.
            </p>
          </div>
        </RevealOnMount>

        {/* Featured Stories */}
        <div className="flex flex-col gap-12 mb-16">
          {stories.map((story, idx) => {
            const isEven = idx % 2 === 0;
            const currentPhotoIdx = selectedStoryPhotos[story.id] ?? 0;
            const galleryList = story.gallery && story.gallery.length > 0 ? story.gallery : [story.image];
            const currentImg = galleryList[currentPhotoIdx] || story.image;
            const isVideoActive = playingVideoStoryId === story.id;

            return (
              <RevealOnMount
                key={story.id}
                direction={isEven ? "left" : "right"}
                delay={idx * 150}
              >
                <div className="glow-card grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] bg-[var(--glass)] border border-[var(--border)] rounded-[24px] p-8 md:p-10 gap-10 md:gap-12 items-center">
                  <div className={`flex flex-col gap-3 ${isEven ? "order-0" : "order-1"}`}>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[var(--border)] shadow-md group">
                      {isVideoActive && story.videoUrl ? (
                        <video
                          src={story.videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support HTML5 video.
                        </video>
                      ) : (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              currentImg.startsWith("data:") ||
                              currentImg.startsWith("/")
                                ? currentImg
                                : "/hero-bg.jpg"
                            }
                            alt={story.title}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                story.id.includes("scholarship")
                                  ? "/impact_debris.png"
                                  : "/impact_texas.png";
                            }}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                          {story.videoUrl && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none group-hover:bg-black/50 transition-colors">
                              <button
                                type="button"
                                onClick={() => setPlayingVideoStoryId(story.id)}
                                className="pointer-events-auto px-4 py-2 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                Play Video
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Thumbnail gallery if multiple photos */}
                    {galleryList.length > 1 && (
                      <div className="flex items-center gap-2 pt-1">
                        {galleryList.map((photo, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              setSelectedStoryPhotos((prev) => ({
                                ...prev,
                                [story.id]: pIdx,
                              }));
                              setPlayingVideoStoryId(null);
                            }}
                            className={`w-16 h-10 rounded-lg overflow-hidden border transition-all ${
                              currentPhotoIdx === pIdx && !isVideoActive
                                ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30 scale-105"
                                : "border-[var(--border)] opacity-70 hover:opacity-100"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  story.id.includes("scholarship")
                                    ? "/impact_debris.png"
                                    : "/impact_texas.png";
                              }}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {story.featured && (
                        <span className="service-badge py-1 px-3 text-[0.68rem] bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)] rounded-full font-bold uppercase tracking-wider">
                          Inferno Cares Initiative
                        </span>
                      )}
                      <span className="text-[0.68rem] font-bold uppercase tracking-wider py-1 px-3 rounded-full bg-[var(--panel-dark)] border border-[var(--border)] text-[var(--text-muted)]">
                        {story.id.includes("scholarship")
                          ? "Higher Education & Academic Opportunity"
                          : "Disaster Relief & Community Resilience"}
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.6rem] font-[750] mb-3 text-[var(--text-bright)]">
                      {story.title}
                    </h3>
                    <p className="text-[var(--primary)] text-[0.95rem] font-semibold mb-3 leading-[1.6]">
                      {story.summary}
                    </p>
                    <p className="text-[var(--text-muted)] text-[0.9rem] leading-[1.75]">
                      {story.content}
                    </p>
                  </div>
                </div>
              </RevealOnMount>
            );
          })}
        </div>

        {/* Our Commitment to Community Checklist & Contact */}
        <RevealOnMount direction="up">
          <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[24px] p-8 md:p-10 mt-8">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.5rem] font-bold mb-4 text-[var(--text-bright)]">
              Our Commitment to Community
            </h3>
            <p className="text-[var(--text-muted)] text-[0.95rem] leading-[1.7] mb-8">
              TIG expands its impact across the{" "}
              <strong>Greater Orlando metropolitan area</strong> through
              targeted resources, mentorship, and community partnerships:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                "Youth development and education",
                "College and career readiness",
                "Disaster relief and community resilience",
                "Food, clothing, and essential-needs initiatives",
                "Veteran and military-family support",
                "Community beautification and neighborhood improvement",
                "Volunteer service projects",
                "School, nonprofit, and community partnerships",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-[var(--glass)] p-4 rounded-xl border border-[var(--border)] shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[rgba(225,77,24,0.1)] text-[var(--primary)] flex items-center justify-center shrink-0">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-[0.92rem] font-medium text-[var(--text-bright)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[0.95rem] text-[var(--text-muted)] leading-[1.7] mb-10 italic border-l-2 border-l-[var(--primary)] pl-4 py-1">
              Our approach is simple:{" "}
              <strong className="text-[var(--text-bright)] not-italic">
                when there is an opportunity to serve with purpose, we want to
                be part of the conversation.
              </strong>
            </p>

            <div className="bg-gradient-to-r from-[rgba(225,77,24,0.06)] via-[rgba(15,23,42,0.04)] to-transparent border border-[rgba(225,77,24,0.2)] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
              <div>
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold text-[var(--text-bright)]">
                  Partner With Inferno Cares
                </h4>
                <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1.5 max-w-[580px] leading-[1.65]">
                  We welcome community partnerships across Greater Orlando where
                  TIG&apos;s team, expertise, and resources can create lasting
                  local impact.
                </p>
                <p className="text-xs font-semibold text-[var(--primary)] mt-3 italic">
                  &ldquo;Stronger communities create stronger futures. At TIG,
                  service does not stop when the contract ends.&rdquo;
                </p>
              </div>
              <a
                href="mailto:InfernoCares@theinfernogroup.com"
                className="btn btn-primary no-underline px-6 py-3.5 shrink-0 flex items-center gap-2 text-xs md:text-sm shadow-md"
              >
                InfernoCares@theinfernogroup.com
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </RevealOnMount>
      </section>

      {/* TEAMING & PARTNERSHIP CALLOUT */}
      <section className="py-12 px-[8vw]">
        <RevealOnMount direction="up">
          <div className="bg-[var(--navy)] text-white rounded-[28px] p-8 md:p-12 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(225,77,24,0.15)_0%,transparent_70%)] pointer-events-none"></div>

            <div className="relative z-10 max-w-[800px]">
              <span className="inline-block text-[0.72rem] font-bold text-[var(--primary)] uppercase tracking-wider px-3 py-1 bg-white/10 rounded-full mb-4">
                Subcontractors &amp; Teaming Partners
              </span>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.8rem] md:text-[2.2rem] font-bold leading-tight mb-4">
                Built to Partner. Ready to Perform.
              </h3>
              <p className="text-slate-300 text-[0.95rem] md:text-[1.05rem] leading-[1.7] mb-8">
                We partner with qualified subcontractors, specialty trades,
                consultants, and suppliers—building reliable teaming arrangements
                that win and deliver together.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/partnerships"
                  className="btn btn-primary no-underline px-6 py-3 text-xs md:text-sm"
                >
                  Apply as Subcontractor / Partner
                </Link>
                <Link
                  href="/contact"
                  className="btn text-white bg-white/10 hover:bg-white/20 border border-white/20 no-underline px-6 py-3 text-xs md:text-sm"
                >
                  Schedule Teaming Discussion
                </Link>
              </div>
            </div>
          </div>
        </RevealOnMount>
      </section>

      {/* TEAM MEMBER MODAL DETAIL VIEW */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-[1100] bg-[var(--navy)]/60 backdrop-blur-md flex justify-center items-center p-4 sm:p-8"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[24px] sm:rounded-[28px] max-w-[540px] w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 md:p-10 relative shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--surface-color)]/90 hover:bg-[var(--surface-color)] border border-[var(--border)] text-[var(--foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all cursor-pointer shadow-md active:scale-90 z-10"
              aria-label="Close dialog"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="relative w-[130px] h-[130px] mx-auto mb-5 rounded-full overflow-hidden p-[3px] bg-gradient-to-br from-[var(--navy)] via-[#1E293B] to-[var(--primary)] shadow-[0_8px_25px_rgba(225,77,24,0.3)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    selectedMember.image.startsWith("data:") ||
                    selectedMember.image.startsWith("/")
                      ? selectedMember.image
                      : "/logo.png"
                  }
                  alt={selectedMember.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("logo.png")) {
                      target.src = "/logo.png";
                    }
                  }}
                  className={`w-full h-full rounded-full ${
                    selectedMember.id === "charnelle-smith"
                      ? "object-contain bg-[#111E42]"
                      : selectedMember.id === "fady-youssef"
                        ? "object-cover object-[center_20%]"
                        : selectedMember.id === "andre-montgomery"
                          ? "object-cover object-[center_15%]"
                          : selectedMember.id === "kelly-clerveaux"
                            ? "object-cover object-[center_15%]"
                            : "object-cover object-center"
                  }`}
                />
              </div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.5rem] font-[750] text-[var(--text-bright)]">
                {selectedMember.name}
              </h3>
              <span className="text-[var(--primary)] text-[0.82rem] font-bold uppercase tracking-wider block mt-1">
                {selectedMember.role}
              </span>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-[var(--text-muted)] text-sm leading-[1.75] mb-2 text-center">
                {selectedMember.bio}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-center border-t border-[var(--border)] pt-6 mt-6">
              <button
                onClick={() => setSelectedMember(null)}
                className="btn btn-secondary px-6 py-2 text-xs cursor-pointer"
              >
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
