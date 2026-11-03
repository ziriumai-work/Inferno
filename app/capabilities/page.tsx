"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import RevealOnMount from "@/components/RevealOnMount";
import { capabilitiesData } from "@/lib/capabilitiesData";
import { dataStore } from "@/utils/dataStore";

function CapabilitiesContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("hubzone");
  const [isMounted, setIsMounted] = useState(false);
  const [caps, setCaps] = useState<Capability[]>(capabilitiesData);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Email Gate Modal States
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (searchParams?.get("download") === "true") {
      setIsDownloadOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const refreshCaps = () => {
      const stored = dataStore.getCapabilities();
      if (stored.length > 0) {
        setCaps(stored);
      }
    };
    refreshCaps();
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    window.addEventListener("storage", refreshCaps);
    window.addEventListener("cms-update", refreshCaps);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", refreshCaps);
      window.removeEventListener("cms-update", refreshCaps);
    };
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const activeCap = caps.find((cap) => cap.id === activeTab) || caps[0] || capabilitiesData[0];

  const naicsList = [
    { code: "541611", title: "Admin & General Management Consulting (Primary)" },
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

  const triggerPDFDownload = () => {
    const element = document.createElement("a");
    element.href = "/documents/The_Inferno_Group_LLC_Capability_Statement.pdf";
    element.download = "The_Inferno_Group_LLC_Capability_Statement.pdf";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Save lead securely and sync to Supabase (Zero LocalStorage policy strictly preserved)
      void dataStore.submitLead({
        type: "CAPABILITY_DOWNLOAD",
        name,
        email,
        org,
        company: org,
      });
      
      // Trigger official Corporate Capability Statement PDF download
      triggerPDFDownload();
    }, 1200);
  };

  const handleResetModal = () => {
    setIsDownloadOpen(false);
    setIsSuccess(false);
    setName("");
    setEmail("");
    setOrg("");
  };

  return (
    <div className="page-view block">
      <section id="capabilities">
        <RevealOnMount className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">Federal Credentials &amp; Teaming</div>
          <h1 className="section-title">Corporate Capabilities &amp; Contracting Readiness</h1>
          <p className="section-desc max-w-[850px] mx-auto">
            The Inferno Group LLC (TIG) is a HUBZone Certified and Veteran-Owned Small Business (VOSB). We support federal, state, and local agencies while partnering with prime contractors across high-consequence procurements.
          </p>
        </RevealOnMount>

        {/* Federal Identifiers Grid Banner */}
        <RevealOnMount className={`mt-10 mb-12 reveal ${isMounted ? "active" : ""}`}>
          <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[24px] p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* UEI */}
              <div 
                onClick={() => handleCopy("QW6RHJACHA56", "UEI")}
                className="p-5 rounded-2xl bg-[var(--glass)] border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer transition-all duration-200 group"
              >
                <span className="text-[0.7rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold block">
                  Unique Entity ID (UEI)
                </span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-base font-bold text-[var(--text-bright)] group-hover:text-[var(--primary)] flex items-center justify-between mt-1">
                  QW6RHJACHA56
                  <span className="text-xs text-[var(--primary)] font-sans">
                    {copiedCode === "UEI" ? "✓ Copied" : "Copy"}
                  </span>
                </span>
              </div>

              {/* CAGE Code */}
              <div 
                onClick={() => handleCopy("22VP2", "CAGE")}
                className="p-5 rounded-2xl bg-[var(--glass)] border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer transition-all duration-200 group"
              >
                <span className="text-[0.7rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold block">
                  CAGE Code
                </span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-base font-bold text-[var(--text-bright)] group-hover:text-[var(--primary)] flex items-center justify-between mt-1">
                  22VP2
                  <span className="text-xs text-[var(--primary)] font-sans">
                    {copiedCode === "CAGE" ? "✓ Copied" : "Copy"}
                  </span>
                </span>
              </div>

              {/* Primary Designation */}
              <div className="p-5 rounded-2xl bg-[rgba(225,77,24,0.04)] border border-[rgba(225,77,24,0.2)]">
                <span className="text-[0.7rem] text-[var(--primary)] uppercase tracking-wider font-semibold block">
                  Socioeconomic Status
                </span>
                <span className="text-sm font-bold text-[var(--text-bright)] block mt-1">
                  HUBZone Certified (SBA)
                </span>
                <span className="text-xs text-[var(--text-muted)] block mt-0.5">
                  &amp; Veteran-Owned Small Business
                </span>
              </div>

              {/* Bonding Capacity */}
              <div className="p-5 rounded-2xl bg-[var(--glass)] border border-[var(--border)]">
                <span className="text-[0.7rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold block">
                  Bonding Readiness
                </span>
                <span className="text-sm font-bold text-[var(--text-bright)] block mt-1">
                  Up to 100% Performance &amp; Payment
                </span>
                <span className="text-xs text-[var(--text-muted)] block mt-0.5">
                  Single &amp; Aggregate Project Limits
                </span>
              </div>
            </div>
          </div>
        </RevealOnMount>

        {/* Socioeconomic Teaming Selector & Details */}
        <div className={`caps-layout reveal ${isMounted ? "active" : ""}`}>
          {/* Left side: Badge Selector Grid */}
          <div className="badge-grid" id="cert-badge-grid">
            {caps.map((cap) => (
              <button
                key={cap.id}
                className={`badge-button ${activeTab === cap.id ? "active" : ""}`}
                onClick={() => setActiveTab(cap.id)}
                aria-label={cap.name}
              >
                <span className="badge-acronym">{cap.acronym}</span>
                <span className="badge-name">{cap.name}</span>
              </button>
            ))}
          </div>

          {/* Right side: Details Display Panel */}
          <div className="caps-details-panel">
            <div className="caps-details-content">
              <div className="caps-details-header">
                <div className="caps-indicator"></div>
                <h3 className="caps-details-title">{activeCap.title}</h3>
              </div>
              <p className="caps-desc-text">{activeCap.desc}</p>
              <div className="caps-benefit-card">
                <span className="caps-benefit-label">{activeCap.oppLabel}</span>
                <span className="caps-benefit-val">{activeCap.oppVal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registered NAICS Classifications */}
        <RevealOnMount className={`mt-16 reveal ${isMounted ? "active" : ""}`}>
          <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[24px] p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-[var(--border)]">
              <div>
                <span className="service-badge py-1 px-3 text-[0.68rem] bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)] rounded-full font-bold uppercase tracking-wider">
                  SAM.gov Active Classifications
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.4rem] font-bold text-[var(--text-bright)] mt-2">
                  Registered North American Industry Classification System (NAICS)
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {naicsList.map((item) => (
                <div 
                  key={item.code}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--glass)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                >
                  <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-xs px-2 py-1 rounded bg-[rgba(225,77,24,0.08)] text-[var(--primary)]">
                    {item.code}
                  </span>
                  <span className="text-xs font-medium text-[var(--text-bright)]">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </RevealOnMount>

        {/* CTA Action Buttons */}
        <div className={`caps-actions reveal flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center mt-12 sm:mt-16 items-stretch sm:items-center ${isMounted ? "active" : ""}`}>
          <button className="btn btn-primary justify-center text-center" onClick={() => setIsDownloadOpen(true)}>
            Download Capability Statement
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <Link href="/capabilities/statement" target="_blank" className="btn btn-secondary no-underline justify-center text-center">
            View Online Statement
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </Link>
          <Link href="/partnerships" className="btn btn-secondary no-underline justify-center text-center">
            Partner / Teaming Application
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
          <Link href="/quiz" className="btn btn-secondary no-underline justify-center text-center">
            Check Certification Eligibility
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </Link>
        </div>
      </section>

      {/* Official Capability Statement Email Gate Modal */}
      <div className={`modal-overlay ${isDownloadOpen ? "show" : ""}`}>
        <div className="modal-content contact-form-container p-6 sm:p-8 max-w-[650px] w-full">
          <button className="modal-close" onClick={handleResetModal} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-2 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg sm:text-xl font-bold text-[var(--text-bright)] mb-1">
                Capability Statement Dispatched
              </h3>
              <p className="text-[var(--text-muted)] text-xs max-w-md mx-auto mb-5 leading-relaxed">
                Verification confirmed. The official Corporate Capability Statement for The Inferno Group LLC (PDF) has been generated and initiated for download.
              </p>

              {/* Document Confirmation Card */}
              <div className="w-full p-4 bg-[var(--glass)] border border-[var(--border)] rounded-2xl flex flex-col sm:flex-row items-center gap-4 mb-6 text-left">
                <div className="relative w-20 h-28 rounded-lg overflow-hidden border border-slate-300 shadow-sm shrink-0 bg-white">
                  <Image
                    src="/documents/The_Inferno_Group_LLC_Capability_Statement_Preview.png"
                    alt="Capability Statement Preview"
                    fill
                    className="object-cover object-top"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-[var(--text-bright)] font-[family-name:var(--font-space-grotesk)]">
                    The_Inferno_Group_LLC_Capability_Statement.pdf
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    1-Page Executive PDF &bull; 500 KB &bull; Emergency Management &amp; Disaster Recovery
                  </div>
                  <div className="text-[10px] text-[var(--primary)] font-mono mt-1.5 font-bold">
                    UEI: QW6RHJACHA56 &bull; CAGE: 22VP2 &bull; HUBZone &bull; VOSB
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
                <button
                  type="button"
                  onClick={triggerPDFDownload}
                  className="btn btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Download PDF Again</span>
                </button>
                <a
                  href="/documents/The_Inferno_Group_LLC_Capability_Statement.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-xs py-2 px-4 no-underline inline-flex items-center gap-1.5 active:scale-95"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>Open in New Tab</span>
                </a>
                <Link
                  href="/capabilities/statement"
                  target="_blank"
                  className="btn btn-secondary text-xs py-2 px-4 no-underline inline-flex items-center gap-1 active:scale-95"
                >
                  <span>Printable Web View</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Document Summary Card */}
              <div className="mb-5 p-4 bg-[var(--glass)] border border-[var(--border)] rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-32 sm:w-24 sm:h-32 rounded-lg overflow-hidden border border-slate-300 shadow-md shrink-0 bg-white group">
                  <Image
                    src="/documents/The_Inferno_Group_LLC_Capability_Statement_Preview.png"
                    alt="The Inferno Group Corporate Capability Statement"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    sizes="96px"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white bg-black/70 px-2 py-0.5 rounded">PDF</span>
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)] mb-1">
                    Official Executive Brief (PDF)
                  </div>
                  <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-bright)]">
                    Corporate Capability Statement
                  </h4>
                  <div className="text-xs text-[var(--text-muted)] mt-1 space-y-0.5">
                    <div><strong>Discipline:</strong> Emergency Management &amp; Disaster Recovery</div>
                    <div><strong>Credentials:</strong> HUBZone Certified &bull; VOSB &bull; E-Verify</div>
                    <div className="font-mono text-[11px]"><strong>UEI:</strong> QW6RHJACHA56 &bull; <strong>CAGE:</strong> 22VP2</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-[var(--primary)] font-semibold flex items-center gap-1">
                      <span>✓</span> 1-Page Vector PDF (500 KB)
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <Link
                      href="/capabilities/statement"
                      target="_blank"
                      className="text-[11px] text-[var(--secondary)] hover:text-[var(--primary)] font-semibold underline underline-offset-2"
                    >
                      Preview Online Statement &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <p className="text-[var(--text-muted)] text-xs mb-5">
                Supply your contact details to download the official Corporate Capability Statement including verified credentials, past performance differentiators, and contracting readiness.
              </p>

              <form onSubmit={handleDownloadSubmit} className="flex flex-col gap-4">
                <div className="form-group m-0">
                  <input
                    type="text"
                    id="download-name"
                    className="form-input text-xs"
                    placeholder=" "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label htmlFor="download-name" className="form-label text-xs">Full Name</label>
                </div>

                <div className="form-group m-0">
                  <input
                    type="text"
                    id="download-org"
                    className="form-input text-xs"
                    placeholder=" "
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    required
                  />
                  <label htmlFor="download-org" className="form-label text-xs">Organization / Prime Contractor / Agency</label>
                </div>

                <div className="form-group m-0">
                  <input
                    type="email"
                    id="download-email"
                    className="form-input text-xs"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="download-email" className="form-label text-xs">Work Email</label>
                </div>

                <button type="submit" className="btn-submit mt-2 text-xs py-3" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span>Verifying &amp; Generating PDF...</span>
                      <svg
                        className="animate-spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Download Capability Statement (PDF)</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default function CapabilitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CapabilitiesContent />
    </Suspense>
  );
}
