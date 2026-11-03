"use client";

import React, { useEffect, useState } from "react";
import RevealOnMount from "@/components/RevealOnMount";
import { partnerCardsData, PartnerCard } from "@/lib/partnerCardsData";

export default function PartnershipsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const partnerCards: PartnerCard[] = partnerCardsData;

  // Form states
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [uei, setUei] = useState("");
  const [naics, setNaics] = useState("");
  const [partnerType, setPartnerType] = useState("");
  const [certStatus, setCertStatus] = useState("");
  const [bondingCapacity, setBondingCapacity] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Clean up legacy localStorage key if present
    try {
      localStorage.removeItem("inferno_partner_cards_v1");
    } catch {
      // ignore in environments without localStorage
    }

    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PARTNER",
          company,
          partnerCompany: company,
          contactName,
          name: contactName,
          email,
          contactEmail: email,
          phone,
          uei,
          naics,
          service: "Teaming & Partnerships",
          partnerType,
          certStatus,
          bondingCapacity,
          message,
        }),
      });
    } catch (err) {
      console.warn("Failed to submit partner application:", err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsModalOpen(false);
      setIsSuccess(false);
      setCompany("");
      setContactName("");
      setEmail("");
      setPhone("");
      setUei("");
      setNaics("");
      setPartnerType("");
      setCertStatus("");
      setBondingCapacity("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="page-view block">
      <section id="partnerships">
        <RevealOnMount
          className={`reveal text-center ${isMounted ? "active" : ""}`}
        >
          <div className="section-eyebrow">Partners &amp; Subcontractors</div>
          <h1 className="section-title">Built to Partner. Ready to Perform.</h1>
          <p className="section-desc max-w-[850px] mx-auto mb-8 leading-[1.8]">
            We partner with qualified subcontractors, specialty trades,
            consultants, suppliers, and emerging businesses to deliver
            responsive, compliant solutions for government and commercial
            clients.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              className="btn btn-primary px-7 py-3 text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              Register as Teaming Partner / Subcontractor
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </button>
          </div>
        </RevealOnMount>

        {/* 4 Teaming Pillars */}
        <div className={`partner-grid reveal ${isMounted ? "active" : ""}`}>
          {partnerCards.map((card, index) => (
            <div
              key={index}
              className="partner-card flex flex-col justify-between h-full p-8 bg-[var(--glass)] border border-[var(--border)] rounded-[24px] hover:border-[var(--primary)] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div>
                <span className="service-badge py-1 px-3 text-[0.68rem] bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[rgba(225,77,24,0.2)] rounded-full font-bold uppercase tracking-wider mb-4 inline-block">
                  {card.badge}
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold text-[var(--text-bright)] mb-3">
                  {card.title}
                </h3>
                <p className="text-[var(--text-muted)] text-[0.88rem] leading-[1.65]">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* COMPREHENSIVE PARTNER & SUBCONTRACTOR FRAMEWORK */}
        <div
          className={`reveal mt-16 flex flex-col gap-10 ${isMounted ? "active" : ""}`}
        >
          {/* Overview Statement */}
          <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[24px] p-8 md:p-10">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.5rem] font-bold text-[var(--text-bright)] mb-3">
              Reliable Teaming Without Unnecessary Barriers
            </h3>
            <p className="text-[var(--text-muted)] text-[0.95rem] leading-[1.8]">
              We welcome established primes and capable emerging businesses
              alike—removing unnecessary barriers to build a trusted network
              committed to quality, integrity, and execution.
            </p>
          </div>

          {/* Grid of Partner Criteria & Teaming Approaches */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Partnership Criteria */}
            <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[24px] p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(225,77,24,0.1)] text-[var(--primary)] flex items-center justify-center shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </div>
                  <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold text-[var(--text-bright)]">
                    Partnership Criteria
                  </h4>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-4 leading-[1.6]">
                  Prospective partners and subcontractors should generally
                  demonstrate:
                </p>
                <ul className="space-y-2.5 text-xs text-[var(--text-muted)] mb-6">
                  {[
                    "Active and legally registered business status",
                    "Ability to perform the proposed scope of work",
                    "Competitive and commercially reasonable pricing",
                    "Commitment to quality, safety, professionalism, and timely performance",
                    "Appropriate licenses or trade credentials when required for the work",
                    "Ability to provide certificates of insurance appropriate to the project",
                    "Compliance with applicable federal, state, and local regulations",
                    "Willingness to meet project-specific reporting, documentation, invoicing, and recordkeeping requirements",
                    "Ability to provide references, past-performance information, or examples of relevant work when requested",
                    "Commitment to ethical business practices and transparent communication",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[var(--primary)] font-bold shrink-0 mt-0.5">
                        &bull;
                      </span>
                      <span className="leading-[1.55]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[rgba(225,77,24,0.04)] border border-[rgba(225,77,24,0.15)] p-4 rounded-xl">
                <p className="text-[0.78rem] text-[var(--text-muted)] leading-[1.6]">
                  <strong className="text-[var(--text-bright)] font-semibold">
                    Flexible Evaluation:
                  </strong>{" "}
                  TIG evaluates partners based on the requirements of each
                  opportunity.{" "}
                  <em>
                    Not every criterion or credential is required for every
                    engagement.
                  </em>{" "}
                  Smaller, emerging, and specialized firms are encouraged to
                  connect with us even if they do not currently maintain every
                  credential.
                </p>
              </div>
            </div>

            {/* Our Approach to Teaming */}
            <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[24px] p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[var(--navy)]/10 text-[var(--navy)] flex items-center justify-center shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h4 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold text-[var(--text-bright)]">
                    Our Approach to Teaming
                  </h4>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-4 leading-[1.6]">
                  We recognize that no single company needs to do everything.
                  TIG works with partners through a variety of arrangements:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[var(--text-bright)] font-medium mb-6">
                  {[
                    "Prime contractor / subcontractor relationships",
                    "Specialty subcontracting",
                    "Professional consulting partnerships",
                    "Supplier and distributor relationships",
                    "Emergency-response vendor networks",
                    "Disaster-recovery support teams",
                    "Construction and facilities trade partnerships",
                    "Logistics and transportation partnerships",
                    "Staffing and administrative support relationships",
                    "Joint pursuit and strategic teaming arrangements",
                  ].map((arr, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--panel-dark)] p-3 rounded-xl border border-[var(--border)] flex items-center gap-2.5 shadow-2xs"
                    >
                      <div className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0"></div>
                      <span className="leading-tight text-[0.82rem]">
                        {arr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[var(--navy)] text-white p-4 rounded-xl text-center">
                <p className="text-xs font-semibold text-white/90">
                  Whether you have substantial bonding capacity or are a
                  specialized small business looking for your first government
                  teaming opportunity:
                </p>
                <p className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-[var(--primary)] mt-1 uppercase tracking-wider">
                  We are interested in what you can do and how we can win
                  together.
                </p>
              </div>
            </div>
          </div>

          {/* Bonding, Insurance, Certifications & Government Readiness */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bonding Capacity */}
            <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[20px] p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h5 className="font-[family-name:var(--font-space-grotesk)] text-[1.1rem] font-bold text-[var(--text-bright)] mb-2">
                  Bonding Capacity
                </h5>
                <p className="text-xs text-[var(--text-muted)] leading-[1.6] mb-3">
                  For construction, facilities, infrastructure,
                  disaster-recovery, and projects requiring bonding, TIG may
                  request evidence of capability:
                </p>
                <ul className="space-y-2 text-xs text-[var(--text-bright)]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[var(--primary)] font-bold">
                      &bull;
                    </span>
                    <span>
                      <strong>Bid Bonds:</strong> Solicitation required %
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[var(--primary)] font-bold">
                      &bull;
                    </span>
                    <span>
                      <strong>Performance Bonds:</strong> Up to 100% of
                      subcontract value
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[var(--primary)] font-bold">
                      &bull;
                    </span>
                    <span>
                      <strong>Payment Bonds:</strong> Up to 100% of subcontract
                      value
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[var(--primary)] font-bold">
                      &bull;
                    </span>
                    <span>Single-project &amp; aggregate bonding capacity</span>
                  </li>
                </ul>
              </div>
              <p className="text-[0.72rem] text-[var(--text-muted)] mt-4 pt-3 border-t border-[var(--border)] italic">
                Evaluated on a project-by-project basis. Lack of bonding does
                not disqualify partners from reduced scopes or supplier roles.
              </p>
            </div>

            {/* Insurance Requirements */}
            <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[20px] p-6 shadow-sm">
              <h5 className="font-[family-name:var(--font-space-grotesk)] text-[1.1rem] font-bold text-[var(--text-bright)] mb-2">
                Insurance &amp; Risk Requirements
              </h5>
              <p className="text-xs text-[var(--text-muted)] leading-[1.5] mb-3">
                Partners maintain coverage appropriate to assigned project
                scope:
              </p>
              <ul className="space-y-1.5 text-xs text-[var(--text-muted)]">
                <li>&bull; Commercial General Liability</li>
                <li>&bull; Workers&apos; Compensation</li>
                <li>&bull; Employer&apos;s Liability</li>
                <li>&bull; Commercial Automobile Liability</li>
                <li>&bull; Professional Liability / E&amp;O</li>
                <li>&bull; Cyber Liability</li>
                <li>&bull; Pollution or Environmental Liability</li>
                <li>&bull; Umbrella / Excess Liability</li>
              </ul>
            </div>

            {/* Certifications & Credentials */}
            <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[20px] p-6 shadow-sm">
              <h5 className="font-[family-name:var(--font-space-grotesk)] text-[1.1rem] font-bold text-[var(--text-bright)] mb-1">
                Certifications &amp; Credentials
              </h5>
              <span className="text-[0.68rem] text-[var(--primary)] font-semibold block mb-3">
                (Provides teaming value — not required)
              </span>
              <ul className="space-y-1 text-[0.75rem] text-[var(--text-muted)]">
                <li>&bull; SBA Small Business</li>
                <li>&bull; HUBZone</li>
                <li>&bull; Veteran-Owned Small Business (VOSB)</li>
                <li>&bull; Service-Disabled Veteran-Owned (SDVOSB)</li>
                <li>&bull; Women-Owned Small Business (WOSB)</li>
                <li>&bull; Economically Disadvantaged WOSB (EDWOSB)</li>
                <li>&bull; Minority Business Enterprise (MBE)</li>
                <li>&bull; Disadvantaged Business Enterprise (DBE)</li>
                <li>&bull; Small / Local Business Enterprise (SBE/LBE)</li>
                <li>&bull; State or municipal diversity certs</li>
                <li>&bull; Trade, safety, or industry credentials</li>
              </ul>
            </div>

            {/* Government Contracting Readiness */}
            <div className="glow-card bg-[var(--panel-dark)] border border-[var(--border)] rounded-[20px] p-6 shadow-sm">
              <h5 className="font-[family-name:var(--font-space-grotesk)] text-[1.1rem] font-bold text-[var(--text-bright)] mb-2">
                Government Readiness
              </h5>
              <p className="text-xs text-[var(--text-muted)] leading-[1.5] mb-2">
                Requirements based on specific contract scope:
              </p>
              <ul className="space-y-1 text-[0.75rem] text-[var(--text-muted)]">
                <li>&bull; Unique Entity ID (UEI)</li>
                <li>&bull; Active SAM.gov registration</li>
                <li>&bull; Current W-9</li>
                <li>&bull; E-Verify participation</li>
                <li>&bull; Applicable NAICS classifications</li>
                <li>&bull; State/local contractor licenses</li>
                <li>&bull; OSHA or safety training</li>
                <li>&bull; Background screening / site access</li>
                <li>&bull; Drug-free workplace compliance</li>
                <li>&bull; Debarment &amp; suspension certs</li>
                <li>&bull; Conflict-of-interest disclosures</li>
                <li>&bull; Certificates of insurance &amp; bonding</li>
              </ul>
            </div>
          </div>

          {/* Become a TIG Partner CTA */}
          <div className="text-center bg-gradient-to-r from-[#0c1838] via-[#102048] to-[var(--navy)] text-white border border-[rgba(225,77,24,0.35)] rounded-[28px] p-10 md:p-12 shadow-2xl">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.8rem] md:text-[2.2rem] font-bold text-white mb-3">
              Become a TIG Partner
            </h3>
            <p className="text-sm md:text-base text-slate-200 max-w-[720px] mx-auto mb-6 leading-[1.7]">
              If your organization can bring specialized capability, competitive
              pricing, geographic reach, technical expertise, products, labor,
              equipment, or professional services to our projects, we welcome
              the opportunity to connect.
            </p>
            <p className="font-[family-name:var(--font-space-grotesk)] text-lg md:text-xl font-extrabold text-amber-300 mb-8 tracking-wider">
              &ldquo;Build with us. Respond with us. Deliver with us.&rdquo;
            </p>
            <button
              className="btn btn-primary px-8 py-3.5 text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              Register Teaming Profile Now
            </button>
          </div>
        </div>
      </section>

      {/* Partner Application Modal */}
      <div className={`modal-overlay ${isModalOpen ? "show" : ""}`}>
        <div className="modal-content contact-form-container p-8 md:p-10 max-w-[620px]">
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
              <h3>Teaming Profile Registered</h3>
              <p className="text-center text-[var(--text-muted)] text-[0.95rem] mt-2">
                Your partnership profile has been transmitted to our Partner
                Relations team. We will review your capabilities and connect
                within 1–2 business days.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.4rem] font-bold mb-1">
                Partner &amp; Subcontractor Registration
              </h3>
              <p className="text-[var(--text-muted)] text-[0.82rem] mb-6">
                Register your organization to explore subcontracting, supplier,
                and joint-pursuit teaming opportunities with The Inferno Group
                LLC.
              </p>

              <form
                onSubmit={handlePartnerSubmit}
                className="flex flex-col gap-4"
              >
                <div className="form-grid-2">
                  <div className="form-group m-0">
                    <input
                      type="text"
                      id="partner-company"
                      className="form-input"
                      placeholder=" "
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                    <label htmlFor="partner-company" className="form-label">
                      Company Legal Name
                    </label>
                  </div>
                  <div className="form-group m-0">
                    <input
                      type="text"
                      id="partner-contact"
                      className="form-input"
                      placeholder=" "
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                    <label htmlFor="partner-contact" className="form-label">
                      Point of Contact
                    </label>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group m-0">
                    <input
                      type="email"
                      id="partner-email"
                      className="form-input"
                      placeholder=" "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      pattern="[^@\s]+@[^@\s]+\.[^@\s]{2,}"
                      title="Please provide a valid email address (e.g. name@company.com)"
                      required
                    />
                    <label htmlFor="partner-email" className="form-label">
                      Work Email
                    </label>
                  </div>
                  <div className="form-group m-0">
                    <input
                      type="tel"
                      id="partner-phone"
                      className="form-input"
                      placeholder=" "
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      pattern="^\+?[0-9\s\-\(\)]{7,15}$"
                      inputMode="tel"
                      title="Please provide a valid phone number"
                    />
                    <label htmlFor="partner-phone" className="form-label">
                      Phone Number (Optional)
                    </label>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group m-0">
                    <input
                      type="text"
                      id="partner-uei"
                      className="form-input uppercase"
                      placeholder=" "
                      value={uei}
                      onChange={(e) => setUei(e.target.value.toUpperCase())}
                      maxLength={12}
                      pattern="[A-Za-z0-9]{5,12}"
                      title="12-character alphanumeric Unique Entity ID or 5-character CAGE code"
                    />
                    <label htmlFor="partner-uei" className="form-label">
                      Unique Entity ID (UEI / CAGE)
                    </label>
                  </div>
                  <div className="form-group m-0">
                    <input
                      type="text"
                      id="partner-naics"
                      className="form-input"
                      placeholder=" "
                      value={naics}
                      onChange={(e) => setNaics(e.target.value)}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      inputMode="numeric"
                      title="Primary 6-digit NAICS code (e.g. 541611)"
                      required
                    />
                    <label htmlFor="partner-naics" className="form-label">
                      Primary NAICS (e.g. 541611, 561210)
                    </label>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group m-0">
                    <select
                      id="partner-type"
                      className="form-input form-select"
                      value={partnerType}
                      onChange={(e) => setPartnerType(e.target.value)}
                      required
                    >
                      <option value="" disabled hidden></option>
                      <option value="sub">
                        Subcontractor (Specialty Trade / Scope)
                      </option>
                      <option value="prime">Prime Contractor Teaming</option>
                      <option value="supplier">Supplier / Distributor</option>
                      <option value="emergency">
                        Emergency Response Vendor Network
                      </option>
                      <option value="consulting">
                        Professional Consulting / Advisory
                      </option>
                      <option value="logistics">
                        Logistics &amp; Transportation
                      </option>
                    </select>
                    <label htmlFor="partner-type" className="form-label">
                      Teaming Arrangement Interest
                    </label>
                  </div>
                  <div className="form-group m-0">
                    <select
                      id="partner-certs"
                      className="form-input form-select"
                      value={certStatus}
                      onChange={(e) => setCertStatus(e.target.value)}
                      required
                    >
                      <option value="" disabled hidden></option>
                      <option value="hubzone">HUBZone Certified</option>
                      <option value="vosb">
                        Veteran-Owned Small Business (VOSB/SDVOSB)
                      </option>
                      <option value="wosb">Women-Owned (WOSB / EDWOSB)</option>
                      <option value="8a">SBA 8(a) / Small Disadvantaged</option>
                      <option value="mbe-dbe">
                        Minority / DBE / SBE Certified
                      </option>
                      <option value="small">
                        Small Business (Self-Certified)
                      </option>
                      <option value="commercial">
                        Commercial / Large Business
                      </option>
                    </select>
                    <label htmlFor="partner-certs" className="form-label">
                      Socioeconomic Status
                    </label>
                  </div>
                </div>

                <div className="form-group m-0">
                  <select
                    id="partner-bonding"
                    className="form-input form-select"
                    value={bondingCapacity}
                    onChange={(e) => setBondingCapacity(e.target.value)}
                  >
                    <option value="" disabled hidden></option>
                    <option value="none">
                      No Bonding Currently Established
                    </option>
                    <option value="under500k">
                      Under $500K Single Project
                    </option>
                    <option value="500k-2m">$500K – $2 Million</option>
                    <option value="2m-10m">$2 Million – $10 Million</option>
                    <option value="over10m">
                      $10 Million+ Aggregate Capacity
                    </option>
                  </select>
                  <label htmlFor="partner-bonding" className="form-label">
                    Bonding Capacity Range (If Applicable)
                  </label>
                </div>

                <div className="form-group m-0">
                  <textarea
                    id="partner-msg"
                    className="form-input"
                    rows={3}
                    placeholder=" "
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                  <label htmlFor="partner-msg" className="form-label">
                    Summary of Capabilities, Geographic Reach &amp; Past Work
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-submit mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      Submitting Registration...
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
                      Submit Teaming Profile
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
