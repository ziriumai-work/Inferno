"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import { faqData } from "@/lib/faqData";
import { dataStore } from "@/utils/dataStore";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState<PageFAQItem[]>(faqData);

  useEffect(() => {
    const refreshFaqs = () => {
      const stored = dataStore
        .getFAQs()
        .filter((f) => f.status === "published");
      if (stored.length > 0) {
        setItems(stored);
      }
    };

    refreshFaqs();
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    window.addEventListener("storage", refreshFaqs);
    window.addEventListener("cms-update", refreshFaqs);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", refreshFaqs);
      window.removeEventListener("cms-update", refreshFaqs);
    };
  }, []);

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  const categories = [
    { id: "all", label: "All Topics" },
    { id: "credentials", label: "Credentials & HUBZone" },
    { id: "emergency", label: "Emergency Management" },
    { id: "services", label: "Services & Logistics" },
    { id: "partnership", label: "Teaming & Bonding" },
    { id: "community", label: "Inferno Cares" },
  ];

  const filteredFAQ = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-view block">
      <section id="faq">
        <RevealOnMount className={`reveal ${isMounted ? "active" : ""}`}>
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="section-desc max-w-[800px] mx-auto mb-8">
            Answers regarding The Inferno Group LLC&apos;s federal credentials
            (UEI / CAGE), HUBZone &amp; VOSB status, emergency response
            capabilities, bonding capacity, and teaming criteria.
          </p>
        </RevealOnMount>

        {/* Search & Categories controls */}
        <RevealOnMount
          className={`faq-controls reveal flex flex-col gap-6 mb-12 max-w-[760px] mx-auto ${isMounted ? "active" : ""}`}
        >
          <div className="form-group m-0">
            <input
              type="text"
              id="faq-search"
              className="form-input"
              placeholder=" "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null);
              }}
            />
            <label htmlFor="faq-search" className="form-label">
              Search questions, credentials, services, or teaming criteria...
            </label>
          </div>
          <div className="faq-tabs flex flex-wrap gap-2.5 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`btn py-2 px-4 text-xs font-semibold rounded-full transition-all ${
                  selectedCategory === cat.id ? "btn-primary" : "btn-secondary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </RevealOnMount>

        {/* FAQ Accordion Items */}
        <div
          className={`faq-container reveal max-w-[900px] mx-auto ${isMounted ? "active" : ""}`}
        >
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`faq-item ${isOpen ? "active" : ""} mb-3 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--panel-dark)] transition-colors hover:border-[var(--primary)]`}
                >
                  <button
                    className="faq-trigger w-full p-6 text-left flex justify-between items-center gap-4 bg-transparent cursor-pointer"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question font-[family-name:var(--font-space-grotesk)] text-[1.05rem] font-bold text-[var(--text-bright)] flex items-center flex-wrap gap-2.5">
                      <span className="badge-acronym text-[0.65rem] py-1 px-2.5 bg-[rgba(225,77,24,0.08)] border border-[rgba(225,77,24,0.2)] rounded-md text-[var(--primary)] font-mono uppercase tracking-wider font-bold">
                        {item.category}
                      </span>
                      {item.question}
                    </span>
                    <span className="faq-icon shrink-0 text-[var(--primary)] font-bold text-xl">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className={`faq-content transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="faq-content-inner px-6 pb-6 pt-1 text-[var(--text-muted)] text-[0.92rem] leading-[1.75] border-t border-dashed border-[var(--border)] mt-2">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-12 text-[var(--text-muted)] bg-[var(--panel-dark)] border border-[var(--border)] rounded-2xl">
              No FAQs matched your query parameters. Try a different keyword or
              category.
            </div>
          )}
        </div>

        {/* Still Have Questions CTA */}
        <RevealOnMount
          className={`mt-16 text-center reveal ${isMounted ? "active" : ""}`}
        >
          <div className="bg-[var(--glass)] border border-[var(--border)] rounded-[24px] p-8 max-w-[700px] mx-auto flex flex-col items-center">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold text-[var(--text-bright)] mb-2">
              Have Specific Teaming or Procurement Questions?
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-[500px] mb-6">
              Our contracts and alliances team is ready to provide tailored
              answers, compliance briefings, and capability presentations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="btn btn-primary py-2.5 px-6 text-xs no-underline"
              >
                Contact Contracts Office
              </Link>
              <Link
                href="/capabilities"
                className="btn btn-secondary py-2.5 px-6 text-xs no-underline"
              >
                View Capabilities &amp; NAICS
              </Link>
            </div>
          </div>
        </RevealOnMount>
      </section>
    </div>
  );
}
