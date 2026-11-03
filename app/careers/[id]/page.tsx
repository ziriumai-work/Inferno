"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { dataStore, Job } from "@/utils/dataStore";
import JobApplicationForm from "@/components/JobApplicationForm";

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const refreshJob = () => {
      const list = dataStore.getJobs();
      const found = list.find((j) => j.id === jobId);
      if (found) {
        setJob(found);
      }
    };

    refreshJob();
    setIsMounted(true);

    window.addEventListener("storage", refreshJob);
    window.addEventListener("cms-update", refreshJob);

    return () => {
      window.removeEventListener("storage", refreshJob);
      window.removeEventListener("cms-update", refreshJob);
    };
  }, [jobId]);

  if (!isMounted) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Loading Opportunity...</h2>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Opportunity Not Found</h2>
        <p className="my-6 text-[var(--text-muted)]">
          The requested career ID does not correspond to an active posting.
        </p>
        <Link href="/careers" className="btn btn-primary">
          Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className="page-view block">
      <section id="job-details" className="max-w-[1360px] mx-auto">
        <Link 
          href="/careers" 
          className="back-btn inline-flex items-center gap-2 text-[var(--text-muted)] no-underline text-sm mb-8 transition-all duration-300 hover:text-[var(--primary)]"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Careers Board
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 xl:gap-14 items-start">
          {/* Details Column */}
          <div className={`reveal flex flex-col gap-8 ${isMounted ? "active" : ""}`}>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="service-badge py-1 px-3 text-xs bg-[rgba(225,77,24,0.08)] border border-[var(--border)] rounded text-[var(--primary)] font-semibold">
                  {job.department}
                </span>
                <span className="text-xs text-[var(--text-muted)] bg-[var(--panel-dark)] px-3 py-1 rounded border border-[var(--border)]">
                  {job.type}
                </span>
                {job.location && (
                  <span className="text-xs text-[var(--text-muted)] bg-white px-3 py-1 rounded border border-[var(--border)] flex items-center gap-1">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {job.location}
                  </span>
                )}
                <span className="text-xs text-[var(--primary)] bg-orange-50 px-3 py-1 rounded border border-orange-200 font-semibold flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Last Date: {job.lastDate || "Open Until Filled"}
                </span>
              </div>
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-extrabold text-[var(--text-bright)]">
                {job.title}
              </h1>
            </div>

            <div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.15rem] font-bold mb-3 border-b border-[var(--border)] pb-2 text-[var(--text-bright)]">
                Role Overview
              </h3>
              <p className="text-[var(--text-muted)] text-[0.95rem] leading-[1.75]">
                {job.description}
              </p>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.15rem] font-bold mb-3 border-b border-[var(--border)] pb-2 text-[var(--text-bright)]">
                  Core Responsibilities
                </h3>
                <ul className="service-sublist grid grid-cols-1 gap-2.5">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex gap-3 items-start text-[0.92rem] text-[var(--text-muted)] leading-relaxed">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-[0.25rem] text-[var(--primary)]">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.15rem] font-bold mb-3 border-b border-[var(--border)] pb-2 text-[var(--text-bright)]">
                  Required Qualifications
                </h3>
                <ul className="service-sublist grid grid-cols-1 gap-2.5">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex gap-3 items-start text-[0.92rem] text-[var(--text-muted)] leading-relaxed">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-[0.25rem] text-[var(--secondary)]">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-[rgba(225,77,24,0.04)] border border-[var(--border)] rounded-xl p-4 text-xs text-[var(--text-muted)] leading-relaxed">
              <strong className="text-[var(--primary)] font-bold block mb-1">
                Standard Employment Eligibility &amp; Compliance Notice
              </strong>
              The Inferno Group LLC participates in E-Verify and verifies the identity and employment eligibility of newly hired employees in accordance with applicable federal law. All candidate information is encrypted and treated under strict confidentiality protocols.
            </div>

            <div className="p-4 bg-[var(--panel-dark)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-muted)] flex items-center justify-between">
              <span>Direct inquiries &amp; executive references:</span>
              <a href="mailto:Jobs@theinfernogroup.com" className="text-[var(--primary)] font-bold hover:underline">
                Jobs@theinfernogroup.com
              </a>
            </div>
          </div>

          {/* Form Column - Comprehensive Multi-Step Application */}
          <div className={`reveal ${isMounted ? "active" : ""}`}>
            <JobApplicationForm job={job} />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .back-btn:hover {
          color: var(--primary) !important;
          transform: translateX(-4px);
        }
      `}</style>
    </div>
  );
}
