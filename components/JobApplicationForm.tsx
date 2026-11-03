"use client";

import React, { useState, useEffect } from "react";
import { Job, dataStore, JobApplicationDetails } from "@/utils/dataStore";

interface JobApplicationFormProps {
  job: Job;
  isGeneralApplication?: boolean;
  onSuccess?: () => void;
}

const COMMON_CERTIFICATIONS = [
  "FEMA ICS (100 / 200 / 700 / 800)",
  "FEMA Public Assistance (PA) Specialist",
  "PMP (Project Management Professional)",
  "CFM (Certified Floodplain Manager)",
  "DCAA Compliance & Cost Accounting",
  "PE (Professional Engineer)",
  "CPA / Certified Public Accountant",
  "OSHA 30-Hour Construction/General",
];

const EXPERIENCE_LEVELS = [
  "Entry Level (0 - 2 years)",
  "Mid Level (3 - 5 years)",
  "Senior Level (6 - 10 years)",
  "Executive / Subject Matter Expert (10+ years)",
];

const EDUCATION_LEVELS = [
  "High School Diploma / GED",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate / Ph.D.",
  "Vocational / Technical Certification",
  "Other",
];

const CLEARANCE_LEVELS = [
  "None",
  "Public Trust (NACI / Tier 1 / Tier 2)",
  "Secret (Tier 3)",
  "Top Secret / SCI (Tier 5)",
  "Other Government Agency Credential",
];

const TRAVEL_PREFERENCES = [
  "Local / Remote Only (0% travel)",
  "Occasional Travel (Up to 25%)",
  "Moderate Travel (Up to 50%)",
  "Emergency Disaster On-Site Deployment (75% - 100%)",
];

export default function JobApplicationForm({
  job,
  isGeneralApplication = false,
  onSuccess,
}: JobApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  // Step 1: Personal & Contact
  const [legalName, setLegalName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cityStateZip, setCityStateZip] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Step 2: Experience & Qualifications
  const [yearsExperience, setYearsExperience] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [customCertifications, setCustomCertifications] = useState("");
  const [coreSkills, setCoreSkills] = useState("");

  // Step 3: Authorization, Clearances & Logistics
  const [workAuthorization, setWorkAuthorization] = useState("US Citizen");
  const [requiresSponsorship, setRequiresSponsorship] = useState("No");
  const [securityClearance, setSecurityClearance] = useState("None");
  const [willingToTravel, setWillingToTravel] = useState(
    "Emergency Disaster On-Site Deployment (75% - 100%)"
  );
  const [earliestStartDate, setEarliestStartDate] = useState("Immediately (Within 48-72 hours)");
  const [desiredCompensation, setDesiredCompensation] = useState("");

  // Step 4: Documents, Statement & Legal Sign-off
  const [statementOfInterest, setStatementOfInterest] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [base64File, setBase64File] = useState<string>("");
  const [attestationConfirmed, setAttestationConfirmed] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationRefId, setApplicationRefId] = useState("");
  const [stepError, setStepError] = useState("");

  // Storage draft key
  const storageKey = `inferno_app_draft_${job.id}`;

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.legalName) setLegalName(parsed.legalName);
        if (parsed.preferredName) setPreferredName(parsed.preferredName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.cityStateZip) setCityStateZip(parsed.cityStateZip);
        if (parsed.linkedinUrl) setLinkedinUrl(parsed.linkedinUrl);
        if (parsed.yearsExperience) setYearsExperience(parsed.yearsExperience);
        if (parsed.educationLevel) setEducationLevel(parsed.educationLevel);
        if (parsed.selectedCerts) setSelectedCerts(parsed.selectedCerts);
        if (parsed.customCertifications) setCustomCertifications(parsed.customCertifications);
        if (parsed.coreSkills) setCoreSkills(parsed.coreSkills);
        if (parsed.workAuthorization) setWorkAuthorization(parsed.workAuthorization);
        if (parsed.requiresSponsorship) setRequiresSponsorship(parsed.requiresSponsorship);
        if (parsed.securityClearance) setSecurityClearance(parsed.securityClearance);
        if (parsed.willingToTravel) setWillingToTravel(parsed.willingToTravel);
        if (parsed.earliestStartDate) setEarliestStartDate(parsed.earliestStartDate);
        if (parsed.desiredCompensation) setDesiredCompensation(parsed.desiredCompensation);
        if (parsed.statementOfInterest) setStatementOfInterest(parsed.statementOfInterest);
      }
    } catch {
      // Ignore parse errors
    }
  }, [storageKey]);

  // Auto-save draft changes
  useEffect(() => {
    try {
      const draft = {
        legalName,
        preferredName,
        email,
        phone,
        cityStateZip,
        linkedinUrl,
        yearsExperience,
        educationLevel,
        selectedCerts,
        customCertifications,
        coreSkills,
        workAuthorization,
        requiresSponsorship,
        securityClearance,
        willingToTravel,
        earliestStartDate,
        desiredCompensation,
        statementOfInterest,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      // Ignore storage errors
    }
  }, [
    legalName,
    preferredName,
    email,
    phone,
    cityStateZip,
    linkedinUrl,
    yearsExperience,
    educationLevel,
    selectedCerts,
    customCertifications,
    coreSkills,
    workAuthorization,
    requiresSponsorship,
    securityClearance,
    willingToTravel,
    earliestStartDate,
    desiredCompensation,
    statementOfInterest,
    storageKey,
  ]);

  const handleToggleCert = (cert: string) => {
    setSelectedCerts((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 8 * 1024 * 1024) {
        alert("File size exceeds the 8MB limit. Please upload a smaller document.");
        return;
      }
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setBase64File(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateCurrentStep = (): boolean => {
    setStepError("");
    if (currentStep === 1) {
      if (!legalName.trim()) {
        setStepError("Please provide your full legal name.");
        return false;
      }
      if (!email.trim() || !email.includes("@")) {
        setStepError("Please enter a valid work or professional email address.");
        return false;
      }
      if (!phone.trim()) {
        setStepError("Please enter a primary telephone contact number.");
        return false;
      }
      if (!cityStateZip.trim()) {
        setStepError("Please enter your current location (City, State, ZIP).");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!yearsExperience) {
        setStepError("Please select your years of relevant experience.");
        return false;
      }
      if (!educationLevel) {
        setStepError("Please select your highest level of completed education.");
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!workAuthorization) {
        setStepError("Please select your U.S. work authorization status.");
        return false;
      }
      if (!securityClearance) {
        setStepError("Please select your current or past federal security clearance level.");
        return false;
      }
      if (!willingToTravel) {
        setStepError("Please indicate your deployment or travel availability.");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      const formEl = document.getElementById("job-application-form-top");
      if (formEl) formEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBack = () => {
    setStepError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError("");

    // Step 4 Validations
    if (!file && !base64File) {
      setStepError("Please attach your resume document (PDF or DOCX).");
      return;
    }
    if (!statementOfInterest.trim() || statementOfInterest.trim().length < 20) {
      setStepError("Please provide a brief statement of interest or qualifications summary (at least 20 characters).");
      return;
    }
    if (!attestationConfirmed) {
      setStepError("You must certify the employment accuracy and E-Verify attestation before submitting.");
      return;
    }
    if (!digitalSignature.trim()) {
      setStepError("Please type your full legal name as your digital signature.");
      return;
    }

    // Silent honeypot drop for bot protection
    if (honeypot) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1000);
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? prev : prev + 15));
    }, 150);

    const generatedRefId = `APP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    setApplicationRefId(generatedRefId);

    const applicationDetails: JobApplicationDetails = {
      legalName,
      preferredName: preferredName || undefined,
      cityStateZip,
      linkedinUrl: linkedinUrl || undefined,
      yearsExperience,
      educationLevel,
      certifications: selectedCerts,
      customCertifications: customCertifications || undefined,
      workAuthorization,
      requiresSponsorship,
      securityClearance,
      willingToTravel,
      earliestStartDate: earliestStartDate || "Immediate",
      desiredCompensation: desiredCompensation || "Negotiable / Standard Cadre Rates",
      statementOfInterest,
      attestationConfirmed: true,
      digitalSignature,
      signedAt: new Date().toISOString(),
    };

    try {
      await dataStore.submitLead({
        type: "APPLICATION",
        jobId: job.id,
        jobTitle: job.title,
        targetEmail: "Jobs@theinfernogroup.com",
        name: legalName,
        email,
        phone,
        cover: statementOfInterest,
        resumeName: file ? file.name : "Resume_Document.pdf",
        resumeData: base64File || "",
        applicationDetails,
        // Top-level indexed fields for direct query convenience
        workAuthorization,
        securityClearance,
        yearsExperience,
        educationLevel,
        certifications: selectedCerts,
        willingToTravel,
        earliestStartDate,
        desiredCompensation,
        digitalSignature,
        attestationConfirmed: true,
        cityStateZip,
        linkedinUrl,
      });

      // Clear draft
      sessionStorage.removeItem(storageKey);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      }, 400);
    } catch {
      clearInterval(progressInterval);
      setIsSubmitting(false);
      setStepError("An unexpected error occurred while transmitting your application. Please try again or email Jobs@theinfernogroup.com.");
    }
  };

  const stepTitles = [
    { num: 1, title: "Profile & Contact", subtitle: "Candidate Identity" },
    { num: 2, title: "Qualifications", subtitle: "Experience & Certs" },
    { num: 3, title: "Eligibility & Logistics", subtitle: "Clearances & Availability" },
    { num: 4, title: "Review & Sign", subtitle: "Resume & Legal Sign-off" },
  ];

  return (
    <div id="job-application-form-top" className="relative bg-white border border-[var(--border)] rounded-2xl p-5 sm:p-8 shadow-sm">
      {/* Success Modal / Overlay */}
      {isSuccess && (
        <div className="absolute inset-0 bg-white/98 z-30 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mb-5 shadow-sm">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
            Application Transmitted
          </span>
          <h3 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--text-bright)] mb-2">
            Formal Application Received
          </h3>
          <p className="text-sm text-[var(--text-muted)] max-w-[480px] mb-4 leading-relaxed">
            Thank you, <strong className="text-[var(--text-bright)]">{legalName}</strong>. Your employment application package for{" "}
            <strong className="text-[var(--text-bright)]">{job.title}</strong> has been encrypted, logged into our talent review queue, and assigned reference:
          </p>

          <div className="bg-[var(--panel-dark)] border border-[var(--border)] rounded-xl px-5 py-2.5 mb-6 font-mono text-sm font-bold text-[var(--primary)] tracking-wide">
            {applicationRefId}
          </div>

          <div className="text-xs text-[var(--text-muted)] max-w-[440px] mb-6 text-left bg-[rgba(225,77,24,0.03)] border border-[var(--border)] rounded-xl p-4">
            <div className="font-semibold text-[var(--text-bright)] mb-1">What happens next?</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Our Emergency Relief &amp; Federal Contracting Recruitment Cadre reviews your qualifications.</li>
              <li>Eligible candidates will be contacted via telephone or email (<span className="text-[var(--primary)] font-medium">{email}</span>).</li>
              <li>Verification of work eligibility and credentials will proceed under E-Verify guidelines.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setCurrentStep(1);
            }}
            className="btn btn-secondary py-2.5 px-6 text-xs font-semibold"
          >
            Submit Another Application
          </button>
        </div>
      )}

      {/* Form Header */}
      <div className="mb-6 border-b border-[var(--border)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-[family-name:var(--font-space-grotesk)]">
            {isGeneralApplication ? "Disaster Response Cadre Roster" : "Official Employment Application"}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(225,77,24,0.08)] text-[var(--primary)] border border-[var(--border)]">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[var(--text-bright)]">
          {job.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs text-[var(--primary)] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md font-semibold inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Last Date: {job.lastDate || "Open Until Filled"}
          </span>
          {job.location && (
            <span className="text-xs text-[var(--text-muted)] bg-gray-50 border border-[var(--border)] px-2.5 py-0.5 rounded-md font-medium inline-flex items-center gap-1">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {job.location}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Complete each section below to transmit your candidate credentials to our HR &amp; Operations review team.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-2 mb-3">
          {stepTitles.map((st) => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;
            return (
              <div
                key={st.num}
                onClick={() => {
                  if (st.num < currentStep) setCurrentStep(st.num);
                }}
                className={`flex flex-col cursor-pointer transition-all ${
                  st.num < currentStep ? "hover:opacity-80" : ""
                }`}
              >
                <div
                  className={`h-1.5 rounded-full mb-2 transition-all ${
                    isCompleted
                      ? "bg-emerald-500"
                      : isActive
                      ? "bg-[var(--primary)]"
                      : "bg-[var(--border)]"
                  }`}
                />
                <div className="hidden sm:block">
                  <div
                    className={`text-[0.72rem] font-bold uppercase tracking-wide leading-tight ${
                      isActive
                        ? "text-[var(--primary)]"
                        : isCompleted
                        ? "text-emerald-600"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {st.title}
                  </div>
                  <div className="text-[0.65rem] text-[var(--text-muted)] truncate">
                    {st.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="sm:hidden flex items-center justify-between text-xs font-semibold text-[var(--text-bright)]">
          <span>{stepTitles[currentStep - 1].title}</span>
          <span className="text-[var(--text-muted)] text-[0.7rem]">{stepTitles[currentStep - 1].subtitle}</span>
        </div>
      </div>

      {/* Error Alert */}
      {stepError && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 animate-shake">
          <svg className="w-4 h-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{stepError}</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Honeypot field */}
        <div className="hidden">
          <input
            type="text"
            name="applicant_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* ================= STEP 1: Candidate Profile & Contact ================= */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-legal-name" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Full Legal Name <span className="text-[var(--primary)]">*</span>
                </label>
                <input
                  type="text"
                  id="app-legal-name"
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                  placeholder="e.g. Johnathan Doe"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="app-pref-name" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Preferred / Alias Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="app-pref-name"
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                  placeholder="e.g. John"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-email" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Primary Email Address <span className="text-[var(--primary)]">*</span>
                </label>
                <input
                  type="email"
                  id="app-email"
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="app-phone" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Telephone / Mobile <span className="text-[var(--primary)]">*</span>
                </label>
                <input
                  type="tel"
                  id="app-phone"
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                  placeholder="e.g. (407) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-location" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Current City, State &amp; ZIP <span className="text-[var(--primary)]">*</span>
                </label>
                <input
                  type="text"
                  id="app-location"
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                  placeholder="e.g. Orlando, FL 32801"
                  value={cityStateZip}
                  onChange={(e) => setCityStateZip(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="app-linkedin" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  LinkedIn or Portfolio URL <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  id="app-linkedin"
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="p-3.5 bg-[rgba(26,86,196,0.04)] border border-[rgba(26,86,196,0.18)] rounded-xl text-xs text-[var(--text-muted)] flex items-start gap-2.5">
              <svg className="w-4 h-4 shrink-0 text-[var(--secondary)] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span className="leading-relaxed">
                All contact information is encrypted and strictly used by The Inferno Group LLC Human Resources for employment evaluation and dispatch communications.
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Experience & Qualifications ================= */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-experience-level" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Years of Relevant Experience <span className="text-[var(--primary)]">*</span>
                </label>
                <select
                  id="app-experience-level"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] form-select focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all cursor-pointer font-medium"
                  required
                >
                  <option value="">-- Select Experience Level --</option>
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="app-education-level" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Highest Level of Completed Education <span className="text-[var(--primary)]">*</span>
                </label>
                <select
                  id="app-education-level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] form-select focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all cursor-pointer font-medium"
                  required
                >
                  <option value="">-- Select Education Level --</option>
                  {EDUCATION_LEVELS.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Certifications Selection */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-bright)] mb-1">
                Industry Certifications &amp; Credentials
              </label>
              <p className="text-[0.72rem] text-[var(--text-muted)] mb-3">
                Select any applicable credentials you currently maintain:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMMON_CERTIFICATIONS.map((cert) => {
                  const isChecked = selectedCerts.includes(cert);
                  return (
                    <button
                      type="button"
                      key={cert}
                      onClick={() => handleToggleCert(cert)}
                      className={`text-left p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? "bg-[rgba(225,77,24,0.08)] border-[var(--primary)] text-[var(--primary)] shadow-xs"
                          : "bg-white border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]/50 hover:bg-gray-50/50"
                      }`}
                    >
                      <span className="truncate pr-2">{cert}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isChecked
                            ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                            : "border-[var(--border)] bg-gray-50"
                        }`}
                      >
                        {isChecked && (
                          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="app-custom-certs" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                Other Professional Licenses or Certifications <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="app-custom-certs"
                className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                placeholder="e.g. Certified Floodplain Manager, Certified Cost Estimator, OSHA 30"
                value={customCertifications}
                onChange={(e) => setCustomCertifications(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="app-skills" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                Key Technical Competencies &amp; Software Tools
              </label>
              <textarea
                id="app-skills"
                className="w-full bg-white border border-[var(--border)] rounded-xl p-3.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all resize-y leading-relaxed"
                rows={2}
                placeholder="e.g. EMIE, FEMA Grants Portal, Procore, Cost Estimating, MS Excel, RSMeans..."
                value={coreSkills}
                onChange={(e) => setCoreSkills(e.target.value)}
              ></textarea>
            </div>
          </div>
        )}

        {/* ================= STEP 3: Federal Authorization & Availability ================= */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-work-auth" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  U.S. Employment Eligibility <span className="text-[var(--primary)]">*</span>
                </label>
                <select
                  id="app-work-auth"
                  value={workAuthorization}
                  onChange={(e) => setWorkAuthorization(e.target.value)}
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] form-select focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all cursor-pointer font-medium"
                  required
                >
                  <option value="US Citizen">U.S. Citizen</option>
                  <option value="Permanent Resident">Lawful Permanent Resident (Green Card)</option>
                  <option value="Authorized to Work">Authorized to work for any US employer</option>
                  <option value="Requires Sponsorship">Requires Visa Sponsorship</option>
                </select>
              </div>

              <div>
                <label htmlFor="app-sponsorship" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Will you now or in future require sponsorship? <span className="text-[var(--primary)]">*</span>
                </label>
                <select
                  id="app-sponsorship"
                  value={requiresSponsorship}
                  onChange={(e) => setRequiresSponsorship(e.target.value)}
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] form-select focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all cursor-pointer font-medium"
                  required
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-security-clearance" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Active or Past Federal Security Clearance <span className="text-[var(--primary)]">*</span>
                </label>
                <select
                  id="app-security-clearance"
                  value={securityClearance}
                  onChange={(e) => setSecurityClearance(e.target.value)}
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] form-select focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all cursor-pointer font-medium"
                  required
                >
                  {CLEARANCE_LEVELS.map((clr) => (
                    <option key={clr} value={clr}>
                      {clr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="app-travel-readiness" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Emergency Deployment &amp; Travel Readiness <span className="text-[var(--primary)]">*</span>
                </label>
                <select
                  id="app-travel-readiness"
                  value={willingToTravel}
                  onChange={(e) => setWillingToTravel(e.target.value)}
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] form-select focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all cursor-pointer font-medium"
                  required
                >
                  {TRAVEL_PREFERENCES.map((trav) => (
                    <option key={trav} value={trav}>
                      {trav}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-start-date" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Earliest Available Start Date
                </label>
                <input
                  type="text"
                  id="app-start-date"
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                  placeholder="e.g. Immediately / Within 48 hours"
                  value={earliestStartDate}
                  onChange={(e) => setEarliestStartDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="app-salary" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Desired Hourly Rate / Compensation
                </label>
                <input
                  type="text"
                  id="app-salary"
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                  placeholder="e.g. $28.00–$35.00/hr or $75,000/yr"
                  value={desiredCompensation}
                  onChange={(e) => setDesiredCompensation(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-[rgba(225,77,24,0.04)] border border-[var(--border)] rounded-xl p-3.5 text-xs text-[var(--text-muted)] leading-relaxed">
              <strong className="text-[var(--primary)] font-bold block mb-0.5">
                Federal Disaster Cadre Notice:
              </strong>
              Rapid disaster relief missions may involve short-notice deployments to federally declared disaster recovery centers (DRCs) and regional joint field offices (JFOs).
            </div>
          </div>
        )}

        {/* ================= STEP 4: Documents, Statement & Legal Sign-off ================= */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Resume Upload Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                Resume / Curriculum Vitae Document (PDF or Word) <span className="text-[var(--primary)]">*</span>
              </label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-xl py-6 px-4 text-center cursor-pointer bg-[rgba(225,77,24,0.02)] relative transition-all duration-300 hover:border-[var(--primary)]">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  required={!file && !base64File}
                />
                <svg
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--primary)] mb-2 mx-auto"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="text-xs text-[var(--text-bright)] font-semibold mb-0.5">
                  {file ? file.name : "Click to select or drag and drop your resume"}
                </p>
                <p className="text-[0.7rem] text-[var(--text-muted)]">
                  Supported formats: PDF, DOCX up to 8MB
                </p>
              </div>
            </div>

            {/* Statement of Interest / Candidate Pitch */}
            <div>
              <label htmlFor="app-statement" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                Statement of Interest &amp; Qualifications <span className="text-[var(--primary)]">*</span>
              </label>
              <textarea
                id="app-statement"
                className="w-full bg-white border border-[var(--border)] rounded-xl p-3.5 text-xs sm:text-sm text-[var(--text-bright)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all resize-y leading-relaxed"
                rows={4}
                placeholder="Briefly describe your relevant background, disaster recovery experience, or specialized skills that make you a strong candidate for this position..."
                value={statementOfInterest}
                onChange={(e) => setStatementOfInterest(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Legal Attestation & Truth in Application */}
            <div className="bg-[var(--panel-dark)] border border-[var(--border)] rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-[var(--text-bright)] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                Applicant Legal Certification &amp; E-Verify Notice
              </div>
              <p className="text-[0.72rem] text-[var(--text-muted)] leading-relaxed">
                The Inferno Group LLC is an Equal Opportunity Employer. We participate in E-Verify to confirm employment eligibility of newly hired team members. By signing below, you certify that all information submitted in this application is true, accurate, and complete to the best of your knowledge.
              </p>

              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={attestationConfirmed}
                  onChange={(e) => setAttestationConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  required
                />
                <span className="text-xs font-medium text-[var(--text-bright)] leading-normal">
                  I certify that all statements made in this employment application are true and complete. I understand that false or misleading statements or omissions may result in denial of employment or discharge. *
                </span>
              </label>
            </div>

            {/* Digital Signature */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="app-signature" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Digital Signature (Type Full Legal Name) <span className="text-[var(--primary)]">*</span>
                </label>
                <input
                  type="text"
                  id="app-signature"
                  className="w-full bg-white border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-bright)] font-[family-name:var(--font-space-grotesk)] font-bold tracking-wide placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 transition-all"
                  placeholder="Type your full legal name"
                  value={digitalSignature}
                  onChange={(e) => setDigitalSignature(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="app-signed-date" className="block text-xs font-semibold text-[var(--text-bright)] mb-1.5">
                  Application Submission Date
                </label>
                <input
                  type="text"
                  id="app-signed-date"
                  className="w-full bg-gray-50 border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-muted)] cursor-not-allowed font-medium"
                  value={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  readOnly
                />
              </div>
            </div>

            {/* Upload Progress Indicator */}
            {isSubmitting && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[var(--text-bright)]">
                  <span>Encrypting transmission &amp; documents...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP CONTROLS ================= */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)] mt-2">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="btn btn-secondary py-2.5 px-5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Previous Step
            </button>
          ) : (
            <div className="text-[0.7rem] text-[var(--text-muted)] italic">
              * Required employment screening fields
            </div>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary py-2.5 px-6 text-xs font-semibold flex items-center gap-1.5 ml-auto cursor-pointer"
            >
              Continue to Step {currentStep + 1}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit py-3 px-7 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ml-auto shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  Transmitting Application...
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
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
                  Submit Official Application
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
