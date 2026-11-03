"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import { contractsData } from "@/lib/contractsData";
import { dataStore } from "@/utils/dataStore";

export default function ContractsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>(contractsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNaics, setSelectedNaics] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  // Teaming / Review Modal State
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
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

  useEffect(() => {
    const refreshContracts = () => {
      setContracts(dataStore.getContracts());
      setLastRefreshed(new Date().toLocaleTimeString());
    };

    refreshContracts();
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    window.addEventListener("storage", refreshContracts);
    window.addEventListener("cms-update", refreshContracts);

    return () => {
      window.removeEventListener("storage", refreshContracts);
      window.removeEventListener("cms-update", refreshContracts);
      clearTimeout(timer);
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }, 1200);
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

      // Save teaming lead and sync to Supabase database
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
    }, 1200);
  };

  const filteredContracts = contracts.filter((contract) => {
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

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContracts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

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
      <section id="contracts">
        {/* Header */}
        <RevealOnMount
          className={`reveal flex flex-wrap justify-between items-end gap-6 ${isMounted ? "active" : ""}`}
        >
          <div>
            <div className="section-eyebrow">
              B2G &amp; Public Sector Opportunities
            </div>
            <h1 className="section-title">
              Active Government Contracts &amp; Pursuits
            </h1>
            <p className="section-desc max-w-[820px]">
              Federal, state, and regional emergency management and consulting
              solicitations matching The Inferno Group LLC&apos;s registered
              NAICS codes, HUBZone, and VOSB socioeconomic parameters.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-jetbrains-mono)]">
              Feed Synced: {lastRefreshed}
            </span>
            <button
              onClick={handleRefresh}
              className="btn btn-secondary py-2 px-4 text-xs flex items-center gap-2"
              disabled={isRefreshing}
            >
              <svg
                className={isRefreshing ? "animate-spin" : ""}
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              {isRefreshing ? "Syncing..." : "Sync Feed"}
            </button>
          </div>
        </RevealOnMount>

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
          className={`faq-controls reveal flex flex-col gap-6 mb-10 max-w-[840px] mx-auto ${isMounted ? "active" : ""}`}
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
            <label htmlFor="contract-search" className="form-label">
              Search by Solicitation ID, Title, Agency, Set-Aside, or
              Location...
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
                  <span className="text-xs py-1 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full font-semibold shrink-0">
                    {contract.status}
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
                    <strong className="text-[var(--primary)] font-semibold">
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
                  <div className="flex gap-3">
                    <button
                      className="btn btn-primary py-2 px-5 text-xs"
                      onClick={() => openReviewModal(contract)}
                    >
                      Request Teaming / Review
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-16 text-[var(--text-muted)] bg-[var(--panel-dark)] border border-[var(--border)] rounded-2xl">
              No contracting opportunities currently match your search filters.
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary py-2 px-4 text-xs min-w-[40px]"
            >
              Prev
            </button>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary py-2 px-4 text-xs min-w-[40px]"
            >
              Next
            </button>
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
              </Link>
              <Link
                href="/capabilities?download=true"
                className="btn btn-secondary py-2.5 px-6 text-xs no-underline"
              >
                Download Capability Statement
              </Link>
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
