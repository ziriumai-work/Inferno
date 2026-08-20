"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import { dataStore, Job } from "@/utils/dataStore";

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  const itemsPerPage = 6;

  useEffect(() => {
    setJobs(dataStore.getJobs().filter((j) => j.status === "published"));
    setIsMounted(true);
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDept === "all" || job.department === selectedDept;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Pagination slicing
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // Extract unique departments dynamically
  const departments = ["all", ...Array.from(new Set(jobs.map((j) => j.department)))];

  return (
    <div className="page-view block">
      <section id="careers">
        <RevealOnMount className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">Join the Mission</div>
          <h2 className="section-title">Open Positions</h2>
          <p className="section-desc mb-4">
            We assemble high-performance teams to coordinate critical disaster response programs, federal compliance reviews, and strategic growth.
          </p>
          <div className="bg-[rgba(225,77,24,0.04)] border border-[var(--border)] rounded-xl py-3.5 px-6 max-w-[750px] mx-auto text-xs text-[var(--text-muted)] italic mb-4">
            <strong className="text-[var(--primary)] not-italic font-bold">Standard Employment Eligibility Note:</strong> The Inferno Group LLC participates in E-Verify and verifies the identity and employment eligibility of newly hired employees in accordance with applicable law.
          </div>
        </RevealOnMount>

        {/* Filters and Search */}
        <div className={`faq-controls reveal flex flex-col gap-6 mb-14 max-w-[800px] mx-auto ${isMounted ? "active" : ""}`}>
          <div className="form-group m-0">
            <input
              type="text"
              id="job-search"
              className="form-input"
              placeholder=" "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <label htmlFor="job-search" className="form-label">
              Search open roles (e.g. Consultant, DCAA)...
            </label>
          </div>
          <div className="faq-tabs flex flex-wrap gap-3 justify-center">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setSelectedDept(dept);
                  setCurrentPage(1);
                }}
                className={`btn py-2 px-5 text-[0.85rem] ${selectedDept === dept ? "btn-primary" : "btn-secondary"}`}
              >
                {dept === "all" ? "All Departments" : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Listing */}
        <div className={`faq-container reveal flex flex-col gap-8 ${isMounted ? "active" : ""}`}>
          {currentItems.length > 0 ? (
            currentItems.map((job) => (
              <div
                key={job.id}
                className="glow-card p-6 sm:p-8 md:p-10 bg-[var(--glass)] border border-[var(--border)] rounded-2xl flex flex-col gap-6 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <span
                      className="service-badge py-1 px-2.5 text-[0.7rem] bg-[rgba(225,77,24,0.08)] border border-[var(--border)] rounded text-[var(--primary)] mb-2 inline-block"
                    >
                      {job.department}
                    </span>
                    <h3 className="text-[1.25rem] sm:text-[1.4rem] font-bold font-[family-name:var(--font-space-grotesk)] mt-1">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 sm:gap-6 text-xs text-[var(--text-muted)] mt-2">
                      <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Link href={`/careers/${job.id}`} className="btn btn-secondary no-underline w-full sm:w-auto text-center justify-center">
                    View Opportunity
                  </Link>
                </div>
                <p className="text-[var(--text-muted)] text-[0.95rem] leading-[1.6]">
                  {job.summary}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center p-16 text-[var(--text-muted)] bg-[var(--panel-dark)] border border-[var(--border)] rounded-2xl">
              No careers currently open match your filter parameters.
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary py-2 px-4 min-w-[40px]"
            >
              Prev
            </button>
            <span className="text-xs text-[var(--text-muted)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary py-2 px-4 min-w-[40px]"
            >
              Next
            </button>
          </div>
        )}

        {/* Direct Talent & Resume Submission Card */}
        <div className="mt-14 max-w-[800px] mx-auto p-6 sm:p-8 bg-[var(--glass)] border border-[var(--border)] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xs">
          <div>
            <span className="text-[0.75rem] font-bold tracking-wider uppercase text-[var(--primary)] mb-1 block">
              Deployable Cadre Talent Pool
            </span>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-bright)]">
              Don&apos;t See an Exact Fit? Submit Your Resume
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1.5 max-w-[480px] leading-relaxed">
              We are constantly staging emergency recovery specialists, DCAA analysts, and public assistance specialists for rapid deployment. Forward your resume and credentials directly to <strong className="text-[var(--primary)]">Jobs@theinfernogroup.com</strong>.
            </p>
          </div>
          <a
            href="mailto:Jobs@theinfernogroup.com?subject=Cadre%20Resume%20Submission"
            className="btn btn-primary whitespace-nowrap shrink-0 inline-flex items-center gap-2"
          >
            <span>Email Resume</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
