"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import {
  contractsData,
  rawMockContracts,
  getSolicitationStatus,
} from "@/lib/contractsData";
import { dataStore } from "@/utils/dataStore";

export default function ContractsPage() {
  const [isMounted, setIsMounted] = useState(false);
  // In dev/test use rawMockContracts so user/QA can inspect behavior; in prod use contractsData
  const initialData =
    process.env.NODE_ENV === "production" ? contractsData : rawMockContracts;
  const [contracts, setContracts] = useState<Contract[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNaics, setSelectedNaics] = useState("all");
  const [showClosed, setShowClosed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedDate, setLastRefreshedDate] = useState<Date>(() => new Date());
  const lastRefreshedRef = useRef<Date>(new Date());
  const [relativeTime, setRelativeTime] = useState("just now");

  // Teaming / Review Modal State
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partnerCompany, setPartnerCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [teamingRole, setTeamingRole] = useState("subcontractor");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const itemsPerPage = 4;

  const updateRelativeTime = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 30) {
      setRelativeTime("just now");
    } else if (seconds < 60) {
      setRelativeTime(`${seconds} seconds ago`);
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      setRelativeTime(`${mins} ${mins === 1 ? "minute" : "minutes"} ago`);
    } else {
      setRelativeTime(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }
  };

  useEffect(() => {
    const refreshContracts = () => {
      const stored = dataStore.getContracts();
      // Ensure we don't present mock items as active
      if (stored && stored.length > 0) {
        setContracts(stored);
      } else {
        setContracts(process.env.NODE_ENV === "production" ? [] : rawMockContracts);
      }
      const now = new Date();
      lastRefreshedRef.current = now;
      setLastRefreshedDate(now);
      updateRelativeTime(now);
    };

    refreshContracts();
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    const interval = setInterval(() => {
      updateRelativeTime(lastRefreshedRef.current);
    }, 15000);

    window.addEventListener("storage", refreshContracts);
    window.addEventListener("cms-update", refreshContracts);

    return () => {
      window.removeEventListener("storage", refreshContracts);
      window.removeEventListener("cms-update", refreshContracts);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Check SAM.gov opportunities stub/API route
      const res = await fetch("/api/sam-gov/opportunities");
      if (res.ok) {
        const json = await res.json();
        if (json.opportunities && Array.isArray(json.opportunities) && json.opportunities.length > 0) {
          setContracts(json.opportunities);
        }
      }
    } catch {
      // Fallback silently
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        const now = new Date();
        lastRefreshedRef.current = now;
        setLastRefreshedDate(now);
        updateRelativeTime(now);
      }, 600);
    }
  };

  const openReviewModal = (contract: Contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      void dataStore.submitLead({
        type: "CONTRACT_REVIEW",
        solicitation: selectedContract?.solicitation,
        contractTitle: selectedContract?.title,
        agency: selectedContract?.agency,
        partnerCompany,
        company: partnerCompany,
        contactName,
        name: contactName,
        contactEmail,
        email: contactEmail,
        teamingRole,
        notes: reviewNotes,
        reviewNotes,
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setPartnerCompany("");
        setContactName("");
        setContactEmail("");
        setReviewNotes("");
        setSelectedContract(null);
      }, 1600);
    }, 1000);
  };

  // Enhance each contract with status derived dynamically from deadline
  const contractsWithDynamicStatus = contracts.map((c) => {
    const statusMeta = getSolicitationStatus(c.deadline);
    return {
      ...c,
      statusMeta,
    };
  });

  const totalClosedCount = contractsWithDynamicStatus.filter(
    (c) => c.statusMeta.status === "closed"
  ).length;

  const filteredContracts = contractsWithDynamicStatus.filter((contract) => {
    // If showClosed is false, hide closed solicitations
    if (!showClosed && contract.statusMeta.status === "closed") {
      return false;
    }

    const matchesNaics =
      selectedNaics === "all" || contract.naics === selectedNaics;
    const matchesSearch =
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.solicitation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.setAside.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNaics && matchesSearch;
  });

  // Pagination calculations strictly derived from filtered results
  const totalPages = Math.max(1, Math.ceil(filteredContracts.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContracts.slice(indexOfFirstItem, indexOfLastItem);

  const naicsList = [
    { code: "all", label: "All Classifications" },
    { code: "541611", label: "541611 - Admin Mgmt Consulting" },
    { code: "624230", label: "624230 - Emergency & Relief" },
    { code: "562910", label: "562910 - Debris & Remediation" },
    { code: "561422", label: "561422 - Contact Center" },
    { code: "561210", label: "561210 - Facilities Support" },
    { code: "488510", label: "488510 - Freight Logistics" },
    { code: "541690", label: "541690 - Technical Consulting" },
  ];

  return (
    <div className="page-view block">
      {/* Full-viewport page hero: nothing below it is visible until scroll */}
      <section id="contracts-hero" className="page-hero-full">
        {/* Header */}
        <RevealOnMount
          className={`reveal text-center max-w-[850px] mx-auto mb-10 ${isMounted ? "active" : ""}`}
        >
          <h1 className="section-title">
            Active Government Contracts &amp; Pursuits
          </h1>
          <p className="section-desc max-w-[760px] mx-auto text-center mb-6">
            Federal, state, and regional emergency management and consulting
            solicitations matching The Inferno Group LLC&apos;s registered
            NAICS codes, HUBZone, and VOSB socioeconomic parameters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-jetbrains-mono)] flex items-center gap-1.5">
              <span>Last synced:</span>
              <time dateTime={lastRefreshedDate.toISOString()} className="font-semibold text-[var(--text-bright)]">
                {relativeTime}
              </time>
            </span>
            <button
              onClick={handleRefresh}
              className="btn btn-secondary py-2 px-4 text-xs flex items-center gap-2"
              disabled={isRefreshing}
              aria-label="Refresh opportunities feed"
            >
              <svg
                className={isRefreshing ? "animate-spin" : ""}
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span>{isRefreshing ? "Syncing..." : "Refresh Feed"}</span>
            </button>
          </div>
        </RevealOnMount>

      </section>

      <section id="contracts">
        {/* Federal Identifiers Badge Card */}
        <RevealOnMount
          className={`mt-8 mb-10 reveal ${isMounted ? "active" : ""}`}
        >
          <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[20px] p-5 sm:p-6">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
              <div>
                <span className="text-[0.68rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold block">
                  Unique Entity ID (UEI)
                </span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-sm text-[var(--text-bright)]">
                  QW6RHJACHA56
                </span>
              </div>
              <div>
                <span className="text-[0.68rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold block">
                  CAGE Code
                </span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] font-bold text-sm text-[var(--text-bright)]">
                  22VP2
                </span>
              </div>
              <div>
                <span className="text-[0.68rem] text-[var(--primary)] uppercase tracking-wider font-semibold block">
                  Socioeconomic Status
                </span>
                <span className="font-bold text-xs text-[var(--text-bright)] block">
                  HUBZone Certified &amp; VOSB
                </span>
              </div>
              <div>
                <span className="text-[0.68rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold block">
                  Bonding Capacity
                </span>
                <span className="font-bold text-xs text-[var(--text-bright)] block">
                  Up to 100% Performance &amp; Payment
                </span>
              </div>
            </div>
          </div>
        </RevealOnMount>

        {/* Filters & Search */}
        <RevealOnMount
          className={`faq-controls reveal flex flex-col gap-6 mb-8 max-w-[840px] mx-auto ${isMounted ? "active" : ""}`}
        >
          <div className="form-group m-0">
            <input
              type="text"
              id="contract-search"
              className="form-input"
              placeholder=" "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <label htmlFor="contract-search" className="form-label max-w-[calc(100%-2rem)] truncate">
              <span className="hidden sm:inline">
                Search by Solicitation ID, Title, Agency, Set-Aside, or Location...
              </span>
              <span className="sm:hidden">
                Search solicitations or agency...
              </span>
            </label>
          </div>

          <div className="faq-tabs flex flex-wrap gap-2 justify-center">
            {naicsList.map((naics) => (
              <button
                key={naics.code}
                onClick={() => {
                  setSelectedNaics(naics.code);
                  setCurrentPage(1);
                }}
                className={`btn py-1.5 px-3.5 text-xs font-semibold rounded-full transition-all ${
                  selectedNaics === naics.code ? "btn-primary" : "btn-secondary"
                }`}
              >
                {naics.label}
              </button>
            ))}
          </div>

          {/* Toggle for Closed Opportunities */}
          {totalClosedCount > 0 && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text-muted)] select-none hover:text-[var(--text-bright)] transition-colors">
                <input
                  type="checkbox"
                  checked={showClosed}
                  onChange={(e) => {
                    setShowClosed(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded border-[var(--border)] accent-[var(--primary)] w-4 h-4"
                />
                <span>Show closed / concluded opportunities ({totalClosedCount})</span>
              </label>
            </div>
          )}
        </RevealOnMount>

        {/* Opportunities Feed */}
        <div
          className={`faq-container reveal flex flex-col gap-6 max-w-[900px] mx-auto ${isMounted ? "active" : ""}`}
        >
          {currentItems.length > 0 ? (
            currentItems.map((contract) => (
              <div
                key={contract.solicitation}
                className="glow-card p-6 md:p-8 bg-[var(--glass)] border border-[var(--border)] rounded-[24px] flex flex-col gap-5 hover:border-[var(--primary)] transition-all shadow-sm"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1 min-w-[280px]">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="service-badge py-1 px-2.5 text-[0.68rem] bg-[rgba(225,77,24,0.08)] border border-[rgba(225,77,24,0.2)] rounded-md text-[var(--primary)] font-mono font-bold">
                        NAICS {contract.naics}
                      </span>
                      <span className="service-badge py-1 px-2.5 text-[0.68rem] bg-[var(--navy)]/10 border border-[var(--navy)]/20 rounded-md text-[var(--navy)] font-semibold">
                        {contract.setAside}
                      </span>
                    </div>
                    <h3 className="text-[1.25rem] font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--text-bright)] leading-snug">
                      {contract.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                      <span>
                        <strong>Solicitation:</strong>{" "}
                        <code className="text-[var(--text-bright)] font-mono">
                          {contract.solicitation}
                        </code>
                      </span>
                      <span>&bull;</span>
                      <span>
                        <strong>Agency:</strong> {contract.agency}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`text-xs py-1 px-3 border rounded-full font-semibold shrink-0 ${contract.statusMeta.badgeClass}`}
                  >
                    {contract.statusMeta.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--text-muted)] bg-[var(--panel-dark)] py-3 px-5 rounded-xl border border-[var(--border)]">
                  <div>
                    Posted:{" "}
                    <strong className="text-[var(--text-bright)]">
                      {contract.postedDate}
                    </strong>
                  </div>
                  <div>
                    Deadline:{" "}
                    <strong
                      className={
                        contract.statusMeta.isPast
                          ? "text-zinc-400 line-through"
                          : "text-[var(--primary)] font-semibold"
                      }
                    >
                      {contract.deadline}
                    </strong>
                  </div>
                  <div>
                    Location:{" "}
                    <strong className="text-[var(--text-bright)]">
                      {contract.location}
                    </strong>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-dashed border-[var(--border)]">
                  <span className="text-xs text-[var(--text-muted)] italic">
                    Bonding: Up to 100% Performance &amp; Payment available
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/partnerships?solicitation=${encodeURIComponent(contract.solicitation)}`}
                      className="btn btn-secondary py-2 px-4 text-xs no-underline inline-flex items-center gap-1.5"
                    >
                      Team on this
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></Link>
                    <button
                      className="btn btn-primary py-2 px-5 text-xs"
                      onClick={() => openReviewModal(contract)}
                    >
                      Request Teaming / Review
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-12 md:p-16 text-[var(--text-muted)] bg-[var(--panel-dark)] border border-[var(--border)] rounded-2xl flex flex-col items-center gap-4">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-[var(--text-muted)]/60"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <div className="max-w-[480px]">
                <h4 className="text-[1.1rem] font-bold text-[var(--text-bright)] mb-1">
                  No open opportunities right now
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Register as a teaming partner to be notified immediately when solicitations
                  matching your socioeconomic class or NAICS codes are released.
                </p>
              </div>
              <Link
                href="/partnerships"
                className="btn btn-primary py-2.5 px-6 text-xs mt-2 no-underline"
              >
                Register as a Teaming Partner
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg></Link>
            </div>
          )}
        </div>

        {/* Pagination controls: hidden when totalPages <= 1 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary py-2 px-4 text-xs min-w-[40px]"
              aria-label="Previous page"
            >
              Prev
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary py-2 px-4 text-xs min-w-[40px]"
              aria-label="Next page"
            >
              Next
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
          </div>
        )}

        {/* Bottom Teaming Callout */}
        <RevealOnMount
          className={`mt-16 text-center reveal ${isMounted ? "active" : ""}`}
        >
          <div className="bg-[var(--glass)] border border-[var(--border)] rounded-[24px] p-8 max-w-[760px] mx-auto">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold text-[var(--text-bright)] mb-2">
              Pursuing a Government Contract or Need Teaming Capacity?
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-[550px] mx-auto mb-6 leading-[1.7]">
              The Inferno Group LLC structures compliant prime-sub teaming
              agreements, joint pursuits, and subcontracting arrangements across
              federal civilian, defense, and emergency agencies.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/partnerships"
                className="btn btn-primary py-2.5 px-6 text-xs no-underline"
              >
                Register as Teaming Partner
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg></Link>
              <Link
                href="/capabilities?download=true"
                className="btn btn-secondary py-2.5 px-6 text-xs no-underline"
              >
                Download Capability Statement
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></Link>
            </div>
          </div>
        </RevealOnMount>
      </section>

      {/* Teaming / Compliance Review Modal */}
      <div className={`modal-overlay ${isModalOpen ? "show" : ""}`}>
        <div className="modal-content contact-form-container p-8 md:p-10 max-w-[580px]">
          <button
            className="modal-close"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="success-icon-wrapper">
                <svg viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Teaming Request Logged</h3>
              <p className="text-center text-[var(--text-muted)] text-[0.92rem] mt-2">
                Your review request for{" "}
                <strong>{selectedContract?.solicitation}</strong> has been
                transmitted to our GovCon alliances desk.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.35rem] font-bold mb-1">
                Teaming &amp; Compliance Inquiry
              </h3>
              <p className="text-[var(--text-muted)] text-[0.82rem] mb-6">
                Solicitation:{" "}
                <strong className="text-[var(--text-bright)]">
                  {selectedContract?.solicitation}
                </strong>{" "}
                &bull; {selectedContract?.title}
              </p>

              <form
                onSubmit={handleReviewSubmit}
                className="flex flex-col gap-4"
              >
                <div className="form-group m-0">
                  <input
                    type="text"
                    id="review-company"
                    className="form-input"
                    placeholder=" "
                    value={partnerCompany}
                    onChange={(e) => setPartnerCompany(e.target.value)}
                    required
                  />
                  <label htmlFor="review-company" className="form-label">
                    Company Legal Name
                  </label>
                </div>

                <div className="form-grid-2">
                  <div className="form-group m-0">
                    <input
                      type="text"
                      id="review-contact"
                      className="form-input"
                      placeholder=" "
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                    <label htmlFor="review-contact" className="form-label">
                      Contact Name
                    </label>
                  </div>
                  <div className="form-group m-0">
                    <input
                      type="email"
                      id="review-email"
                      className="form-input"
                      placeholder=" "
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="review-email" className="form-label">
                      Work Email
                    </label>
                  </div>
                </div>

                <div className="form-group m-0">
                  <select
                    id="review-role"
                    className="form-input form-select"
                    value={teamingRole}
                    onChange={(e) => setTeamingRole(e.target.value)}
                    required
                  >
                    <option value="prime">
                      Prime Contractor Seeking TIG (HUBZone / VOSB) Teaming
                    </option>
                    <option value="subcontractor">
                      Subcontractor / Supplier Seeking to Join TIG Bid
                    </option>
                    <option value="joint-venture">
                      Joint Venture / Mentor-Protégé Opportunity
                    </option>
                  </select>
                  <label htmlFor="review-role" className="form-label">
                    Proposed Teaming Role
                  </label>
                </div>

                <div className="form-group m-0">
                  <textarea
                    id="review-notes"
                    className="form-input"
                    rows={3}
                    placeholder=" "
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    required
                  ></textarea>
                  <label htmlFor="review-notes" className="form-label">
                    Brief Scope Alignment / Specific Questions
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-submit mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      Processing Request...
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
                        <line
                          x1="16.24"
                          y1="16.24"
                          x2="19.07"
                          y2="19.07"
                        ></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                      </svg>
                    </>
                  ) : (
                    <>
                      Submit Teaming Inquiry
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
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
    </div>
  );
}
