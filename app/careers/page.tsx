"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import { dataStore, Job } from "@/utils/dataStore";
import JobApplicationForm from "@/components/JobApplicationForm";

const generalCadreJob: Job = {
  id: "general-talent-cadre",
  title: "Emergency Deployment Cadre & General Talent Pool",
  department: "Emergency Operations & Strategic Staffing",
  location: "Nationwide Deployments / Remote / On-Site",
  type: "Cadre Roster / Ongoing Screening",
  lastDate: "Ongoing Screening",
  summary:
    "Open application for disaster response specialists, FEMA public assistance consultants, cost estimators, and grant managers seeking rapid roster deployment.",
  description:
    "The Inferno Group LLC maintains a pre-qualified cadre of disaster recovery professionals, federal compliance experts, and emergency operations personnel.",
  responsibilities: [
    "Support emergency response deployments, field operations, or remote consulting as missions activate.",
    "Perform grant reviews, damage assessments, or financial compliance oversight under federal guidelines.",
    "Collaborate with multi-disciplinary crisis response teams and governmental partners.",
  ],
  requirements: [
    "Relevant background in disaster recovery, public assistance, case management, engineering, or accounting.",
    "U.S. work authorization and ability to pass standard government background checks.",
    "Flexibility for rapid mobilization during federally declared emergencies.",
  ],
  postedDate: "Ongoing Roster",
  status: "published",
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);

  const itemsPerPage = 6;

  useEffect(() => {
    const refreshJobs = () => {
      setJobs(dataStore.getJobs().filter((j) => j.status === "published"));
    };

    refreshJobs();
    setIsMounted(true);

    window.addEventListener("storage", refreshJobs);
    window.addEventListener("cms-update", refreshJobs);

    return () => {
      window.removeEventListener("storage", refreshJobs);
      window.removeEventListener("cms-update", refreshJobs);
    };
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesDept =
      selectedDept === "all" || job.department === selectedDept;
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
  const departments = [
    "all",
    ...Array.from(new Set(jobs.map((j) => j.department))),
  ];

  return (
    <div className="page-view block">
      <section id="careers">
        <RevealOnMount className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">Join the Mission</div>
          <h1 className="section-title">Open Positions</h1>
          <p className="section-desc mb-4">
            We assemble high-performance teams to coordinate critical disaster
            response programs, federal compliance reviews, and strategic growth.
          </p>
          <div className="bg-[rgba(225,77,24,0.04)] border border-[var(--border)] rounded-xl py-3.5 px-6 max-w-[750px] mx-auto text-xs text-[var(--text-muted)] italic mb-4">
            <strong className="text-[var(--primary)] not-italic font-bold">
              Standard Employment Eligibility Note:
            </strong>{" "}
            The Inferno Group LLC participates in E-Verify and verifies the
            identity and employment eligibility of newly hired employees in
            accordance with applicable law.
          </div>
        </RevealOnMount>

        {/* Filters and Search */}
        <div
          className={`faq-controls reveal flex flex-col gap-6 mb-14 max-w-[800px] mx-auto ${isMounted ? "active" : ""}`}
        >
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              id="job-search"
              className="w-full bg-white border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all shadow-xs"
              placeholder="Search open roles by title or keyword (e.g. Case Manager, DCAA)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
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
        <div
          className={`faq-container reveal flex flex-col gap-8 ${isMounted ? "active" : ""}`}
        >
          {currentItems.length > 0 ? (
            currentItems.map((job) => (
              <div
                key={job.id}
                className="glow-card p-6 sm:p-8 md:p-10 bg-[var(--glass)] border border-[var(--border)] rounded-2xl flex flex-col gap-6 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <span className="service-badge py-1 px-2.5 text-[0.7rem] bg-[rgba(225,77,24,0.08)] border border-[var(--border)] rounded text-[var(--primary)] mb-2 inline-block">
                      {job.department}
                    </span>
                    <h3 className="text-[1.25rem] sm:text-[1.4rem] font-bold font-[family-name:var(--font-space-grotesk)] mt-1">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 sm:gap-6 text-xs text-[var(--text-muted)] mt-2">
                      <span className="flex items-center gap-1.5">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <rect
                            x="2"
                            y="7"
                            width="20"
                            height="14"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
                    <Link
                      href={`/careers/${job.id}`}
                      className="btn btn-primary no-underline w-full sm:w-auto text-center justify-center"
                    >
                      Apply for Position
                    </Link>
                    <span className="text-[0.72rem] text-[var(--text-muted)] text-center sm:text-right">
                      Last Date:{" "}
                      <strong className="text-[var(--primary)]">
                        {job.lastDate || "Open Until Filled"}
                      </strong>
                    </span>
                  </div>
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

        {/* General Cadre Application Card */}
        <div className="mt-14 max-w-[900px] mx-auto p-6 sm:p-8 bg-[var(--glass)] border border-[var(--border)] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xs">
          <div>
            <span className="text-[0.75rem] font-bold tracking-wider uppercase text-[var(--primary)] mb-1 block">
              Deployable Cadre Talent Network
            </span>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg sm:text-xl font-bold text-[var(--text-bright)]">
              Don&apos;t See an Exact Match? Join Our Roster
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1.5 max-w-[520px] leading-relaxed">
              We are actively vetting disaster recovery specialists, DCAA
              analysts, FEMA public assistance advisors, and emergency
              operations personnel for upcoming regional deployments. Fill out
              an official general application to be registered in our active
              recruitment pool.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setIsGeneralModalOpen(true)}
              className="btn btn-primary whitespace-nowrap inline-flex items-center justify-center gap-2"
            >
              <span>Submit Application</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* General Application Modal */}
        {isGeneralModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative border border-[var(--border)] animate-fadeIn">
              <button
                type="button"
                onClick={() => setIsGeneralModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-all z-20 cursor-pointer"
                aria-label="Close application modal"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <JobApplicationForm
                job={generalCadreJob}
                isGeneralApplication={true}
                onSuccess={() => {
                  setTimeout(() => setIsGeneralModalOpen(false), 4000);
                }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
