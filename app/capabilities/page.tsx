"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import { capabilitiesData } from "@/lib/capabilitiesData";

export default function CapabilitiesPage() {
  const [activeTab, setActiveTab] = useState("hubzone");
  const [isMounted, setIsMounted] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Email Gate Modal States
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const activeCap = capabilitiesData.find((cap) => cap.id === activeTab) || capabilitiesData[0];

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

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Save lead to localStorage
      const newLead = {
        id: Date.now().toString(),
        type: "DOWNLOAD",
        name,
        email,
        org,
        createdAt: new Date().toISOString()
      };
      const currentLeads = JSON.parse(localStorage.getItem("inferno_leads") || "[]");
      currentLeads.push(newLead);
      localStorage.setItem("inferno_leads", JSON.stringify(currentLeads));
      
      // Trigger client-side download representing Capability Statement
      const element = document.createElement("a");
      const fileText = `=================================================================\n` +
                       `THE INFERNO GROUP LLC (TIG) - CORPORATE CAPABILITY STATEMENT\n` +
                       `=================================================================\n\n` +
                       `COMPANY OVERVIEW:\n` +
                       `The Inferno Group LLC is a mission-focused government consulting and\n` +
                       `emergency management firm supporting public-sector and commercial clients\n` +
                       `through preparedness, incident response, disaster recovery, operational\n` +
                       `support, and scalable workforce solutions.\n\n` +
                       `FEDERAL CREDENTIALS & IDENTIFIERS:\n` +
                       `• Unique Entity ID (UEI): QW6RHJACHA56\n` +
                       `• CAGE Code: 22VP2\n` +
                       `• SAM.gov Registration: Active & Verified\n` +
                       `• Headquarters: Orlando, Florida (Nationwide Field Deployments)\n\n` +
                       `SOCIOECONOMIC CERTIFICATIONS HELD:\n` +
                       `• SBA HUBZone Certified (U.S. Small Business Administration)\n` +
                       `• Veteran-Owned Small Business (VOSB)\n\n` +
                       `BONDING CAPACITY:\n` +
                       `• Bid Bonds: Up to required solicitation percentage\n` +
                       `• Performance Bonds: Up to 100% of subcontract/contract value\n` +
                       `• Payment Bonds: Up to 100% of subcontract/contract value\n` +
                       `• Single-Project & Aggregate Capacity available upon request\n\n` +
                       `REGISTERED NAICS CODES:\n` +
                       `• 541611 - Administrative and General Management Consulting Services (Primary)\n` +
                       `• 541618 - Other Management Consulting Services\n` +
                       `• 541690 - Other Scientific and Technical Consulting Services\n` +
                       `• 624230 - Emergency and Other Relief Services\n` +
                       `• 561210 - Facilities Support Services\n` +
                       `• 562910 - Remediation Services\n` +
                       `• 238320 - Painting and Wall Covering Contractors\n` +
                       `• 561720 - Janitorial Services\n` +
                       `• 561790 - Other Services to Buildings and Dwellings\n` +
                       `• 238990 - All Other Specialty Trade Contractors\n` +
                       `• 423990 - Other Miscellaneous Durable Goods Merchant Wholesalers\n` +
                       `• 488510 - Freight Transportation Arrangement\n` +
                       `• 561422 - Telemarketing Bureaus and Other Contact Centers\n\n` +
                       `CORE SERVICE CAPABILITIES:\n` +
                       `1. Emergency Management & Disaster Recovery (FEMA PA / IA, Debris Monitoring, ICS/NIMS)\n` +
                       `2. Planning, Preparedness & EOC Incident Leadership\n` +
                       `3. Mission-Focused Contact Center Operations & Disaster Survivor Support\n` +
                       `4. Program, Project & Financial Management (DCAA Accounting Controls)\n` +
                       `5. Strategic Consulting, Capture Strategy & Legal Compliance\n` +
                       `6. Training, Workforce Development & Rapid Cadre Mobilization\n` +
                       `7. Facilities Support, Logistics & Specialty Trade Services\n\n` +
                       `POINT OF CONTACT:\n` +
                       `The Inferno Group LLC\n` +
                       `Email: Contact@theinfernogroup.com / InfernoCares@theinfernogroup.com\n` +
                       `Website: https://theinfernogroup.com\n` +
                       `Generated: ${new Date().toLocaleDateString()}\n`;
      const file = new Blob([fileText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "The_Inferno_Group_LLC_Capability_Statement.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setTimeout(() => {
        setIsDownloadOpen(false);
        setIsSuccess(false);
        setName("");
        setEmail("");
        setOrg("");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="page-view block">
      <section id="capabilities">
        <RevealOnMount className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">Federal Credentials &amp; Teaming</div>
          <h2 className="section-title">Corporate Capabilities &amp; Contracting Readiness</h2>
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
            {capabilitiesData.map((cap) => (
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

      {/* Email Gate Modal */}
      <div className={`modal-overlay ${isDownloadOpen ? "show" : ""}`}>
        <div className="modal-content contact-form-container p-6 sm:p-10">
          <button className="modal-close" onClick={() => setIsDownloadOpen(false)} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className="success-icon-wrapper">
                <svg viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Download Initiated</h3>
              <p className="text-center text-[var(--text-muted)] text-[0.95rem]">
                Verification confirmed. The official Corporate Capability Statement for The Inferno Group LLC has been generated and download has begun.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.4rem] font-bold mb-2">Corporate Capability Statement</h3>
              <p className="text-[var(--text-muted)] text-[0.85rem] mb-8">
                Please supply your contact details to download the official Corporate Capability Statement including UEI, CAGE, bonding capacity, NAICS codes, and past performance profile.
              </p>

              <form onSubmit={handleDownloadSubmit} className="flex flex-col gap-6">
                <div className="form-group m-0">
                  <input
                    type="text"
                    id="download-name"
                    className="form-input"
                    placeholder=" "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label htmlFor="download-name" className="form-label">Full Name</label>
                </div>

                <div className="form-group m-0">
                  <input
                    type="text"
                    id="download-org"
                    className="form-input"
                    placeholder=" "
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    required
                  />
                  <label htmlFor="download-org" className="form-label">Organization / Prime Contractor / Agency</label>
                </div>

                <div className="form-group m-0">
                  <input
                    type="email"
                    id="download-email"
                    className="form-input"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="download-email" className="form-label">Work Email</label>
                </div>

                <button type="submit" className="btn-submit mt-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      Verifying &amp; Generating...
                      <svg
                        className="animate-spin"
                        width="18"
                        height="18"
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
                      Download Capability Statement
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

