"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import { dataStore, Article } from "@/utils/dataStore";

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setArticles(dataStore.getArticles().filter((a) => a.status === "published"));
    setIsMounted(true);
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCat === "all" || art.category === selectedCat;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    "all",
    "Emergency Management",
    "Federal Credentials",
    "B2G Accounting",
    "Strategic Teaming",
    "Community Impact",
  ];

  return (
    <div className="page-view block">
      <section id="news">
        <RevealOnMount className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">Firm Intel &amp; Bulletins</div>
          <h2 className="section-title">News, Insights &amp; Operational Bulletins</h2>
          <p className="section-desc max-w-[850px] mx-auto">
            Stay informed with official briefings on FEMA Public Assistance documentation, SBA HUBZone / VOSB procurement advantages, DCAA cost accounting compliance, and Inferno Cares community impact initiatives.
          </p>
        </RevealOnMount>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 mt-10 items-start">
          {/* Left Column: News Articles List */}
          <div className="flex flex-col gap-8">
            {/* Filters & Search */}
            <div className={`faq-controls reveal flex flex-col gap-4 w-full m-0 ${isMounted ? "active" : ""}`}>
              <div className="form-group m-0">
                <input
                  type="text"
                  id="news-search"
                  className="form-input"
                  placeholder=" "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <label htmlFor="news-search" className="form-label">
                  Search bulletins (e.g. FEMA, HUBZone, DCAA, Debris)...
                </label>
              </div>
              <div className="faq-tabs flex flex-wrap gap-2 justify-start">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`btn py-1.5 px-4 text-xs font-semibold rounded-full transition-all ${
                      selectedCat === cat ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {cat === "all" ? "All Insights" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className={`reveal flex flex-col gap-6 ${isMounted ? "active" : ""}`}>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <div
                    key={art.slug}
                    className="glow-card flex flex-col justify-between p-8 bg-[var(--glass)] border border-[var(--border)] rounded-[22px] hover:border-[var(--primary)] transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <span className="service-badge py-1 px-3 text-[0.68rem] bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)] rounded-full font-bold uppercase tracking-wider">
                          {art.category}
                        </span>
                        <span className="text-[0.72rem] text-[var(--text-muted)] font-mono">
                          {art.publishedDate}
                        </span>
                      </div>
                      <h3 className="text-[1.25rem] font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--text-bright)] my-2 leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-[0.88rem] text-[var(--text-muted)] leading-[1.65]">
                        {art.summary}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-6 border-t border-[var(--border)] pt-4">
                      <div className="text-xs text-[var(--text-muted)]">
                        By <strong>{art.author}</strong>
                      </div>
                      <Link href={`/news/${art.slug}`} className="text-xs font-bold text-[var(--primary)] no-underline flex items-center gap-1.5 hover:underline">
                        Read Full Bulletin
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-16 text-[var(--text-muted)] bg-[var(--panel-dark)] border border-[var(--border)] rounded-2xl">
                  No intelligence bulletins match your filter parameters.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Feed & Credentials Strip */}
          <div className="flex flex-col gap-6 w-full">
            {/* Live Operational Status Card */}
            <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[22px] p-6">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3 mb-4">
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-bright)] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Operational Status
                </h4>
                <span className="text-[0.65rem] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded font-semibold font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-[1.6] mb-3">
                Emergency coordination desk is active for Hurricane Season 2026 monitoring across the Atlantic and Gulf Coast sectors. Field cadres and debris monitoring teams are on 48-hour activation standby.
              </p>
              <div className="flex gap-2">
                <Link href="/tracker" className="btn btn-secondary py-1.5 px-3 text-xs w-full text-center no-underline">
                  Launch Storm Tracker
                </Link>
              </div>
            </div>

            {/* Social Feed Embed */}
            <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[22px] p-7">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-4 mb-5">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.1rem] font-bold flex items-center gap-2 text-[var(--text-bright)]">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-[var(--primary)]">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                  </svg>
                  LinkedIn Live Feed
                </h3>
                <span className="text-[0.6rem] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded font-semibold font-mono">
                  LIVE SYNC
                </span>
              </div>

              {/* Feed Items */}
              <div className="flex flex-col gap-4">
                <div className="bg-[rgba(225,77,24,0.03)] border border-[var(--border)] p-4 rounded-xl text-xs">
                  <div className="flex gap-2.5 items-center mb-2.5">
                    <div className="w-7 h-7 rounded-full bg-[var(--primary)]/10 flex items-center justify-center p-0.5 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo.jpeg" alt="Inferno Logo" className="w-full rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text-bright)] text-xs">The Inferno Group LLC</h4>
                      <span className="text-[0.65rem] text-[var(--text-muted)]">Official &middot; Public</span>
                    </div>
                  </div>
                  <p className="text-[var(--text-muted)] leading-[1.5] mb-2">
                    Our rapid-response cadre is deploying to assist municipal partners with Category A debris monitoring and FEMA Public Assistance project worksheet formulation.
                  </p>
                  <div className="text-[var(--primary)] font-semibold text-[0.7rem]">
                    #EmergencyManagement #FEMA #DisasterRecovery #HUBZone
                  </div>
                </div>

                <div className="bg-[rgba(225,77,24,0.03)] border border-[var(--border)] p-4 rounded-xl text-xs">
                  <div className="flex gap-2.5 items-center mb-2.5">
                    <div className="w-7 h-7 rounded-full bg-[var(--primary)]/10 flex items-center justify-center p-0.5 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo.jpeg" alt="Inferno Logo" className="w-full rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text-bright)] text-xs">Inferno Cares</h4>
                      <span className="text-[0.65rem] text-[var(--text-muted)]">Community Impact</span>
                    </div>
                  </div>
                  <p className="text-[var(--text-muted)] leading-[1.5] mb-2">
                    Proud to sponsor the &lsquo;Kicking for Relief&rsquo; charity kickball tournament supporting disaster-affected families and launching our 2026 Inferno Flame Academic Scholarships!
                  </p>
                  <div className="text-[var(--primary)] font-semibold text-[0.7rem]">
                    #InfernoCares #CommunityImpact #Orlando #YouthRelief
                  </div>
                </div>
              </div>

              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary w-full mt-5 no-underline text-center py-2 text-xs block"
              >
                Follow The Inferno Group on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

