"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { dataStore, Job } from "@/utils/dataStore";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cover, setCover] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [base64File, setBase64File] = useState<string>("");
  const [honeypot, setHoneypot] = useState("");

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const list = dataStore.getJobs();
    const found = list.find((j) => j.id === jobId);
    if (found) {
      setJob(found);
    }
    setIsMounted(true);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setFile(selectedFile);

      // Convert to Base64 for storing in localStorage
      const reader = new FileReader();
      reader.onload = () => {
        setBase64File(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      // Honeypot silently drop
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1000);
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    // Network timeout simulation
    setTimeout(() => {
      clearInterval(interval);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      const newApplication = {
        id: Date.now().toString(),
        type: "APPLICATION",
        jobId: job.id,
        jobTitle: job.title,
        targetEmail: "Jobs@theinfernogroup.com",
        name,
        email,
        phone,
        cover,
        resumeName: file ? file.name : "Resume_Document.pdf",
        resumeData: base64File || "", // Store Base64 string payload
        createdAt: new Date().toISOString()
      };
      
      const currentLeads = JSON.parse(localStorage.getItem("inferno_leads") || "[]");
      currentLeads.push(newApplication);
      localStorage.setItem("inferno_leads", JSON.stringify(currentLeads));

      // Reset
      setName("");
      setEmail("");
      setPhone("");
      setCover("");
      setFile(null);
      setBase64File("");

      // Auto clear success overlay
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    }, 1500);
  };

  return (
    <div className="page-view block">
      <section id="job-details">
        <Link 
          href="/careers" 
          className="back-btn inline-flex items-center gap-2 text-[var(--text-muted)] no-underline text-sm mb-8 transition-all duration-300"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Careers Board
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          {/* Details Column */}
          <div className={`reveal flex flex-col gap-10 ${isMounted ? "active" : ""}`}>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="service-badge py-1 px-3 text-xs bg-[rgba(225,77,24,0.08)] border border-[var(--border)] rounded text-[var(--primary)] font-semibold">
                  {job.department}
                </span>
                <span className="text-xs text-[var(--text-muted)] bg-[var(--panel-dark)] px-3 py-1 rounded border border-[var(--border)]">
                  {job.type}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-bold mb-3 border-b border-[var(--border)] pb-2">Role Overview</h3>
              <p className="text-[var(--text-muted)] text-[0.95rem] leading-[1.7]">
                {job.description}
              </p>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-bold mb-3 border-b border-[var(--border)] pb-2">Core Responsibilities</h3>
                <ul className="service-sublist grid grid-cols-1 gap-3">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex gap-3 items-start text-[0.95rem] text-[var(--text-muted)]">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-[0.2rem] text-[var(--primary)]">
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
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-bold mb-3 border-b border-[var(--border)] pb-2">Required Qualifications</h3>
                <ul className="service-sublist grid grid-cols-1 gap-3 mb-6">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex gap-3 items-start text-[0.95rem] text-[var(--text-muted)]">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-[0.2rem] text-[var(--secondary)]">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-[rgba(225,77,24,0.04)] border border-[var(--border)] rounded-xl p-4 text-xs text-[var(--text-muted)] leading-[1.6]">
              <strong className="text-[var(--primary)] font-bold block mb-1">Standard Employment Eligibility Note</strong>
              The Inferno Group LLC participates in E-Verify and verifies the identity and employment eligibility of newly hired employees in accordance with applicable law.
            </div>
          </div>

          {/* Form Column */}
          <div className={`contact-form-container reveal relative ${isMounted ? "active" : ""}`}>
            {/* Success Overlay */}
            <div className={`success-overlay ${isSuccess ? "show" : ""}`} id="form-success">
              <div className="success-icon-wrapper">
                <svg viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Application Received</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Your transmission file package has been encrypted and received. Our human resources desk will evaluate your parameters.
              </p>
            </div>

            <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-bold mb-2">Apply For Role</h3>
            <p className="text-[var(--text-muted)] text-[0.85rem] mb-8">
              Submit your credentials below to establish review coordination.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Honeypot spam field */}
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

              <div className="form-group m-0">
                <input
                  type="text"
                  id="app-name"
                  className="form-input"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="app-name" className="form-label">Full Name</label>
              </div>

              <div className="form-group m-0">
                <input
                  type="email"
                  id="app-email"
                  className="form-input"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="app-email" className="form-label">Work Email</label>
              </div>

              <div className="form-group m-0">
                <input
                  type="tel"
                  id="app-phone"
                  className="form-input"
                  placeholder=" "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <label htmlFor="app-phone" className="form-label">Phone Number</label>
              </div>

              <div className="form-group m-0">
                <textarea
                  id="app-cover"
                  className="form-input"
                  rows={3}
                  placeholder=" "
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  required
                ></textarea>
                <label htmlFor="app-cover" className="form-label">Brief Cover Message</label>
              </div>

              {/* Custom Resume Upload Dropzone */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.85rem] font-semibold text-[var(--text-bright)]">
                  Resume Document (PDF / Word)
                </label>
                <div 
                  className="border-2 border-dashed border-[var(--border)] rounded-xl py-6 px-4 text-center cursor-pointer bg-[rgba(225,77,24,0.02)] relative transition-all duration-300 hover:border-[var(--primary)]"
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    required={!file}
                  />
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-muted)] mb-2 mx-auto">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p className="text-xs text-[var(--text-bright)] font-medium">
                    {file ? file.name : "Select or drag file here"}
                  </p>
                  <p className="text-[0.7rem] text-[var(--text-muted)]">
                    Supported formats: PDF, DOCX up to 5MB
                  </p>
                </div>
              </div>

              {isSubmitting && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-[var(--text-bright)] font-semibold">
                    <span>Encrypting &amp; uploading files...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--panel-dark)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-150 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    Encrypting...
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
              Direct resume packages &amp; portfolio submissions:{" "}
              <a href="mailto:Jobs@theinfernogroup.com" className="text-[var(--primary)] font-bold hover:underline">
                Jobs@theinfernogroup.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
        .back-btn:hover {
          color: var(--primary) !important;
          transform: translateX(-4px);
        }
      `}</style>
    </div>
  );
}
