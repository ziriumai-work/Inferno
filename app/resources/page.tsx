"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import { resourcesData } from "@/lib/resourcesData";

export default function ResourcesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  
  // Download states
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleDownloadClick = (res: Resource) => {
    setSelectedResource(res);
    setIsModalOpen(true);
  };

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Save lead to localStorage
      const newLead = {
        id: Date.now().toString(),
        type: "RESOURCE_DOWNLOAD",
        resourceId: selectedResource.id,
        resourceTitle: selectedResource.title,
        name,
        email,
        org,
        createdAt: new Date().toISOString()
      };
      const currentLeads = JSON.parse(localStorage.getItem("inferno_leads") || "[]");
      currentLeads.push(newLead);
      localStorage.setItem("inferno_leads", JSON.stringify(currentLeads));

      // Trigger document export
      const element = document.createElement("a");
      const fileText = `=================================================================\n` +
                       `THE INFERNO GROUP LLC - INTEL & COMPLIANCE RESOURCE TRANSMISSION\n` +
                       `=================================================================\n\n` +
                       `DOCUMENT: ${selectedResource.title}\n` +
                       `CATEGORY: ${selectedResource.category}\n` +
                       `FORMAT: ${selectedResource.fileType}\n` +
                       `AUTHORIZED TO: ${name} (${org})\n` +
                       `WORK EMAIL: ${email}\n` +
                       `ISSUED ON: ${new Date().toLocaleDateString()}\n\n` +
                       `CORPORATE OVERVIEW & CREDENTIALS:\n` +
                       `• Entity: The Inferno Group LLC\n` +
                       `• Unique Entity ID (UEI): QW6RHJACHA56\n` +
                       `• CAGE Code: 22VP2\n` +
                       `• Status: SBA HUBZone Certified & Veteran-Owned Small Business (VOSB)\n` +
                       `• Primary NAICS: 541611 (Admin & General Management Consulting)\n` +
                       `• Secondary NAICS: 624230, 561210, 562910, 238320, 561720, 561790, 238990, 423990, 488510, 561422\n` +
                       `• Bonding Capacity: Bid, Performance (up to 100%), and Payment (up to 100%)\n\n` +
                       `DOCUMENT SUMMARY:\n` +
                       `${selectedResource.description}\n\n` +
                       `COMPLIANCE & CONTACT:\n` +
                       `The Inferno Group LLC | Contracts & Alliances\n` +
                       `Email: Contact@theinfernogroup.com\n` +
                       `Portal: https://theinfernogroup.com\n`;
      const file = new Blob([fileText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${selectedResource.id}_TIG_Compliance_Package.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Reset & close
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setName("");
        setEmail("");
        setOrg("");
        setSelectedResource(null);
      }, 1500);

    }, 1200);
  };

  const filteredResources = resourcesData.filter((res) => {
    const matchesCat = selectedCat === "all" || res.category === selectedCat;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    "all",
    "Capability Statements",
    "Emergency Playbooks",
    "Teaming Tools",
    "Templates",
    "Fact Sheets",
  ];

  return (
    <div className="page-view block">
      <section id="resources">
        <RevealOnMount className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">Intel &amp; Compliance Library</div>
          <h2 className="section-title">Resources, Playbooks &amp; Guidelines</h2>
          <p className="section-desc max-w-[850px] mx-auto">
            Access downloadable compliance playbooks, FEMA Public Assistance checklists, DCAA indirect cost rate templates, and official corporate capability statements.
          </p>
        </RevealOnMount>

        {/* Search & Filters */}
        <RevealOnMount className={`faq-controls reveal flex flex-col gap-6 mt-10 mb-12 max-w-[840px] mx-auto ${isMounted ? "active" : ""}`}>
          <div className="form-group m-0">
            <input
              type="text"
              id="resource-search"
              className="form-input"
              placeholder=" "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <label htmlFor="resource-search" className="form-label">
              Search playbooks, templates, checklists (e.g. FEMA, DCAA, HUBZone)...
            </label>
          </div>
          <div className="faq-tabs flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`btn py-1.5 px-4 text-xs font-semibold rounded-full transition-all ${
                  selectedCat === cat ? "btn-primary" : "btn-secondary"
                }`}
              >
                {cat === "all" ? "All Resources" : cat}
              </button>
            ))}
          </div>
        </RevealOnMount>

        {/* Resources Grid */}
        <div className={`faq-container reveal flex flex-col gap-6 max-w-[900px] mx-auto ${isMounted ? "active" : ""}`}>
          {filteredResources.length > 0 ? (
            filteredResources.map((res) => (
              <div
                key={res.id}
                className="glow-card p-6 md:p-8 bg-[var(--glass)] border border-[var(--border)] rounded-[24px] flex flex-col gap-4 hover:border-[var(--primary)] transition-all shadow-sm"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1 min-w-[280px]">
                    <span className="service-badge py-1 px-3 text-[0.68rem] bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)] rounded-full font-bold uppercase tracking-wider mb-2 inline-block">
                      {res.category}
                    </span>
                    <h3 className="text-[1.25rem] font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--text-bright)] leading-snug">
                      {res.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => handleDownloadClick(res)}
                    className="btn btn-primary flex items-center gap-2 text-xs py-2 px-5 shrink-0"
                  >
                    Download Resource
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                </div>

                <p className="text-[var(--text-muted)] text-[0.88rem] leading-[1.65]">
                  {res.description}
                </p>

                <div className="flex flex-wrap gap-6 text-xs text-[var(--text-muted)] border-t border-dashed border-[var(--border)] pt-3.5">
                  <span>Format: <strong className="text-[var(--text-bright)] font-mono">{res.fileType}</strong></span>
                  <span>Payload: <strong className="text-[var(--text-bright)] font-mono">{res.fileSize}</strong></span>
                  <span>Accesses: <strong className="text-[var(--text-bright)] font-mono">{res.downloads} downloads</strong></span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-16 text-[var(--text-muted)] bg-[var(--panel-dark)] border border-[var(--border)] rounded-2xl">
              No playbooks currently match your filter query parameters.
            </div>
          )}
        </div>

        {/* Bottom Teaming Callout */}
        <RevealOnMount className={`mt-16 text-center reveal ${isMounted ? "active" : ""}`}>
          <div className="bg-[var(--panel-dark)] border border-[var(--border)] rounded-[24px] p-8 max-w-[760px] mx-auto">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold text-[var(--text-bright)] mb-2">
              Need Customized Playbooks or Teaming Advisory?
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-[550px] mx-auto mb-6 leading-[1.7]">
              The Inferno Group LLC provides tailored emergency management consulting, DCAA rate formulation, and SBA socioeconomic application guidance for primes and small businesses.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn btn-primary py-2.5 px-6 text-xs no-underline">
                Contact Advisory Desk
              </Link>
              <Link href="/capabilities" className="btn btn-secondary py-2.5 px-6 text-xs no-underline">
                View Credentials &amp; NAICS
              </Link>
            </div>
          </div>
        </RevealOnMount>
      </section>

      {/* Gated Download Modal */}
      <div className={`modal-overlay ${isModalOpen ? "show" : ""}`}>
        <div className="modal-content contact-form-container p-8 md:p-10 max-w-[580px]">
          <button 
            className="modal-close" 
            onClick={() => {
              setIsModalOpen(false);
              setSelectedResource(null);
            }} 
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center h-full py-6">
              <div className="success-icon-wrapper">
                <svg viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Download Transmitted</h3>
              <p className="text-center text-[var(--text-muted)] text-[0.92rem] mt-2">
                Your credentials have been verified. The download for <strong>{selectedResource?.title}</strong> has been generated and initiated.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.35rem] font-bold mb-1">
                Resource Download Authorization
              </h3>
              <p className="text-[var(--text-muted)] text-[0.82rem] mb-6">
                Document: <strong className="text-[var(--text-bright)]">{selectedResource?.title}</strong>
              </p>

              <form onSubmit={handleDownloadSubmit} className="flex flex-col gap-4">
                <div className="form-group m-0">
                  <input
                    type="text"
                    id="res-name"
                    className="form-input"
                    placeholder=" "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label htmlFor="res-name" className="form-label">Full Name</label>
                </div>

                <div className="form-group m-0">
                  <input
                    type="text"
                    id="res-org"
                    className="form-input"
                    placeholder=" "
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    required
                  />
                  <label htmlFor="res-org" className="form-label">Organization / Agency / Prime</label>
                </div>

                <div className="form-group m-0">
                  <input
                    type="email"
                    id="res-email"
                    className="form-input"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="res-email" className="form-label">Work Email</label>
                </div>

                <button type="submit" className="btn-submit mt-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      Authorizing...
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
                      Authorize &amp; Download Document
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-2">
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

