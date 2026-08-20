"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RevealOnMount from "@/components/RevealOnMount";

function ContactFormInner() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams?.get("service") || "";

  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  const [honeypot, setHoneypot] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  const validatePhone = (num: string) => {
    const re = /^\+?[0-9\s\-()]{7,15}$/;
    return re.test(num);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Spam Protection: Honeypot field check
    if (honeypot) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1000);
      return;
    }

    // Input Validation
    if (!name.trim() || !org.trim() || !email.trim() || !message.trim()) {
      setIsError(true);
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (phone && !validatePhone(phone)) {
      setIsError(true);
      setErrorMessage("Please enter a valid telephone coordinate configuration.");
      return;
    }

    setIsSubmitting(true);
    setIsError(false);

    // Simulate network latency
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (email === "fail@infernogroup.com") {
        setIsError(true);
        setErrorMessage("Transmission Failed. Secure handshake could not be established with Inferno servers. Please verify your email and try again.");
      } else {
        setIsSubmitted(true);
        
        // Save lead in localStorage
        const newLead = {
          id: Date.now().toString(),
          type: "CONTACT",
          name,
          org,
          email,
          phone,
          service,
          message,
          createdAt: new Date().toISOString()
        };
        const currentLeads = JSON.parse(localStorage.getItem("inferno_leads") || "[]");
        currentLeads.push(newLead);
        localStorage.setItem("inferno_leads", JSON.stringify(currentLeads));
        
        // Clear form inputs
        setName("");
        setOrg("");
        setEmail("");
        setPhone("");
        setService("");
        setMessage("");
      }
    }, 1500);
  };

  return (
    <div className="contact-form-container relative">
      {/* Interactive Success Overlay */}
      <div className={`success-overlay ${isSubmitted ? "show" : ""}`} id="form-success">
        <div className="success-icon-wrapper">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3>Transmission Received</h3>
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          The Inferno Group has registered your request. An emergency operations or contracting desk officer will contact you within 12 business hours.
        </p>
        <button type="button" className="btn btn-secondary" onClick={() => setIsSubmitted(false)}>
          Dismiss
        </button>
      </div>

      {/* Interactive Error Overlay */}
      <div className={`error-overlay ${isError ? "show" : ""}`} id="form-error">
        <div className="error-icon-wrapper">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h3>Transmission Failed</h3>
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          {errorMessage}
        </p>
        <button type="button" className="btn btn-secondary" onClick={() => setIsError(false)}>
          Try Again
        </button>
      </div>

      <form id="coordination-form" onSubmit={handleFormSubmit}>
        {/* Honeypot field for spam protection */}
        <div className="hidden">
          <input
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            id="form-name"
            className="form-input"
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="form-name" className="form-label">
            Full Name
          </label>
        </div>

        <div className="form-group">
          <input
            type="text"
            id="form-org"
            className="form-input"
            placeholder=" "
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            required
          />
          <label htmlFor="form-org" className="form-label">
            Organization / Agency
          </label>
        </div>

        <div className="form-group">
          <input
            type="email"
            id="form-email"
            className="form-input"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="form-email" className="form-label">
            Work Email
          </label>
        </div>

        <div className="form-group">
          <input
            type="tel"
            id="form-phone"
            className="form-input"
            placeholder=" "
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label htmlFor="form-phone" className="form-label">
            Phone Number (Optional)
          </label>
        </div>

        <div className="form-group">
          <select
            id="form-service"
            className="form-input form-select"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="" disabled hidden></option>
            <option value="planning-and-preparedness">Planning &amp; Preparedness</option>
            <option value="emergency-management-and-disaster-recovery">Emergency Management &amp; Disaster Recovery</option>
            <option value="program-and-project-management">Program &amp; Project Management</option>
            <option value="strategic-consulting-and-operational-excellence">Strategic Consulting &amp; Operational Excellence</option>
            <option value="training-exercises-and-workforce-development">Training, Exercises &amp; Workforce Development</option>
            <option value="teaming">Strategic Teaming / Partnership</option>
          </select>
          <label htmlFor="form-service" className="form-label">
            Primary Requirement
          </label>
        </div>

        <div className="form-group">
          <textarea
            id="form-message"
            className="form-input"
            rows={4}
            placeholder=" "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <label htmlFor="form-message" className="form-label">
            Message details / Scope parameters
          </label>
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Sending Transmission...
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
              Confirm Transmission
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
    </div>
  );
}

export default function ContactPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="page-view block">
      <section id="contact">
        <div className="contact-layout">
          {/* Left side: Direct connection info */}
          <RevealOnMount className={`contact-info-panel reveal ${isMounted ? "active" : ""}`}>
            <div className="section-eyebrow">Get In Touch</div>
            <h2>
              Ready to Move?
              <br />
              Let&apos;s Connect.
            </h2>
            <p>
              Whether targeting set-aside contracts, organizing emergency programs, or establishing strategic joint ventures, our advisory specialists are ready to coordinate your plan.
            </p>

            <div className="contact-direct-links">
              <a href="mailto:Contact@theinfernogroup.com" className="contact-direct-card">
                <div className="contact-direct-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <span className="contact-direct-label">Contracting &amp; Teaming Desk</span>
                  <span className="contact-direct-val">Contact@theinfernogroup.com</span>
                </div>
              </a>

              <a href="mailto:Jobs@theinfernogroup.com" className="contact-direct-card">
                <div className="contact-direct-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </div>
                <div>
                  <span className="contact-direct-label">Talent Acquisition &amp; Resumes</span>
                  <span className="contact-direct-val">Jobs@theinfernogroup.com</span>
                </div>
              </a>

              <a href="mailto:InfernoCares@theinfernogroup.com" className="contact-direct-card">
                <div className="contact-direct-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <div>
                  <span className="contact-direct-label">Inferno Cares Desk</span>
                  <span className="contact-direct-val">InfernoCares@theinfernogroup.com</span>
                </div>
              </a>

              <div className="contact-direct-card">
                <div className="contact-direct-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <span className="contact-direct-label">Headquarters Coordinates</span>
                  <span className="contact-direct-val">Orlando, Florida (Nationwide Deployments)</span>
                </div>
              </div>

              <div className="contact-direct-card">
                <div className="contact-direct-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <span className="contact-direct-label">Coordination Window</span>
                  <span className="contact-direct-val">Response within 12 business hours</span>
                </div>
              </div>
            </div>
          </RevealOnMount>

          {/* Right side: Form (Wrapped in Suspense) */}
          <RevealOnMount className={`reveal ${isMounted ? "active" : ""}`}>
            <Suspense fallback={<div className="contact-form-container">Loading secure coordination form...</div>}>
              <ContactFormInner />
            </Suspense>
          </RevealOnMount>
        </div>

        {/* Integrated Styled Map Section */}
        <div className="mt-20 border-t border-[var(--border)] pt-16">
          <RevealOnMount>
            <div className="text-center mb-10">
              <div className="section-eyebrow">Tactical Headquarters</div>
              <h3 className="section-title">Corporate Coordinates &mdash; Orlando, FL</h3>
            </div>
          </RevealOnMount>

          <RevealOnMount>
            <div 
              className="glow-card h-[260px] sm:h-[340px] md:h-[400px] rounded-2xl overflow-hidden border border-[var(--border)] relative"
            >
              {/* Embedded maps Iframe (Orlando, FL Headquarters Coordinates) */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224444.82136015502!2d-81.48834954492193!3d28.52844510000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e773d8fec350fb%3A0x6d9eb46a05954e!2sOrlando%2C%20FL!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                className="border-0 grayscale invert-[0.9] contrast-[1.2]" 
                allowFullScreen={false} 
                loading="lazy"
                title="Tactical Coordinates Map"
              ></iframe>
            </div>
          </RevealOnMount>
        </div>

      </section>

      {/* Inline styles for spinner animation */}
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
