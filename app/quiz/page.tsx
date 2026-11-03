"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { dataStore, QuizQuestionItem } from "@/utils/dataStore";
import { quizQuestions as defaultQuizQuestions } from "@/lib/quizQuestions";

export default function QuizPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestionItem[]>([]);
  const [currentStep, setCurrentStep] = useState(0); // 0 to questions.length - 1, questions.length for lead form, questions.length + 1 for results
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Lead info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recommendations result
  const [eligiblePrograms, setEligiblePrograms] = useState<string[]>([]);

  useEffect(() => {
    const refreshQuestions = () => {
      const list = dataStore.getQuizQuestions().filter((q) => q.status === "published");
      setQuestions(list.length > 0 ? list : (defaultQuizQuestions.map(q => ({ ...q, status: "published" as const }))));
    };

    refreshQuestions();
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "inferno_quiz_questions_v1") {
        refreshQuestions();
      }
    };
    const handleCMS = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.all || detail.key === "inferno_quiz_questions_v1") {
        refreshQuestions();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-update", handleCMS);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-update", handleCMS);
    };
  }, []);

  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (val: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
    
    // Auto-advance
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 150);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      
      // Calculate eligibility
      const programs = [];
      
      if (answers.social === "yes" && answers.econDisadv === "yes" && answers.businessAge === "yes") {
        programs.push("SBA 8(a) Business Development");
      }
      if (answers.location === "yes" && answers.employees === "yes") {
        programs.push("Historically Underutilized Business Zone (HUBZone)");
      }
      if (answers.ownership === "yes") {
        programs.push("Woman-Owned Small Business (WOSB)");
        if (answers.econDisadv === "yes") {
          programs.push("Economically Disadvantaged WOSB (EDWOSB)");
        }
      }
      if (answers.veteran === "yes") {
        programs.push("Veteran-Owned Small Business (VOSB)");
        if (answers.disabled === "yes") {
          programs.push("Service-Disabled Veteran-Owned (SDVOSB)");
        }
      }
      if (programs.length === 0) {
        programs.push("Small Business Set-Asides (SAM.gov Standard)");
      }

      setEligiblePrograms(programs);
      
      // Save lead and sync to Supabase database
      void dataStore.submitLead({
        type: "QUIZ",
        name,
        email,
        company,
        org: company,
        answers,
        recommendations: programs,
      });
      
      setCurrentStep(9); // Show results
    }, 1200);
  };

  const resetQuiz = () => {
    setAnswers({});
    setName("");
    setEmail("");
    setCompany("");
    setEligiblePrograms([]);
    setCurrentStep(0);
  };

  const progressPct = questions.length > 0 ? (currentStep / questions.length) * 100 : 0;

  return (
    <div className="page-view block">
      <section id="quiz">
        <div className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">Interactive Assessment</div>
          <h1 className="section-title">Certification Eligibility Quiz</h1>
          <p className="section-desc">
            Analyze your business parameters against local, state, and federal socioeconomic set-aside frameworks.
          </p>
        </div>

        <div 
          className={`contact-form-container reveal max-w-[680px] mx-auto mt-12 mb-0 min-h-[360px] flex flex-col justify-between ${isMounted ? "active" : ""}`}
        >
          {/* STEP 1-8: QUESTIONS */}
          {currentStep < questions.length && questions[currentStep] && (
            <div className="flex flex-col flex-1">
              {/* Progress bar */}
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(progressPct)}% Complete</span>
              </div>
              <div className="h-1 w-full bg-[var(--panel-dark)] rounded-sm overflow-hidden mb-10">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-[width] duration-300 ease-out" 
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>

              {/* Question text */}
              <div className="flex-1">
                <span className="service-badge py-1 px-2 text-[0.65rem] bg-[rgba(225,77,24,0.08)] border border-[var(--border)] rounded text-[var(--primary)]">
                  {questions[currentStep].id.toUpperCase()} PARAMETER
                </span>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.45rem] font-bold mt-3 mb-2 leading-snug">
                  {questions[currentStep].text}
                </h3>
                <p className="text-[var(--text-muted)] text-[0.9rem] mb-10">
                  {questions[currentStep].description}
                </p>

                {/* Options */}
                <div className="flex flex-col gap-4">
                  {questions[currentStep].options.map((opt) => {
                    const isSelected = answers[questions[currentStep].id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        className={`btn btn-secondary py-4 px-6 text-left w-full text-[0.95rem] ${
                          isSelected ? "bg-[var(--primary-glow)] border-[var(--primary)]" : ""
                        }`}
                        onClick={() => handleOptionSelect(opt.value)}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Back button */}
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 bg-transparent border-none text-[var(--text-muted)] cursor-pointer text-[0.85rem] mt-10 self-start"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Previous Question
                </button>
              )}
            </div>
          )}

          {/* STEP 9: LEAD CAPTURE GATE */}
          {currentStep === questions.length && (
            <div className="flex-1 flex flex-col">
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.45rem] font-bold mb-2">
                Analysis Ready
              </h3>
              <p className="text-[var(--text-muted)] text-[0.9rem] mb-8">
                Our compliance engine has compiled your answers. Please register below to unlock your socioeconomic credentials scorecard.
              </p>

              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-6 flex-1">
                <div className="form-group m-0">
                  <input
                    type="text"
                    id="quiz-name"
                    className="form-input"
                    placeholder=" "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label htmlFor="quiz-name" className="form-label">Full Name</label>
                </div>
                <div className="form-group m-0">
                  <input
                    type="text"
                    id="quiz-company"
                    className="form-input"
                    placeholder=" "
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                  <label htmlFor="quiz-company" className="form-label">Company Name</label>
                </div>
                <div className="form-group m-0">
                  <input
                    type="email"
                    id="quiz-email"
                    className="form-input"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    pattern="[^@\s]+@[^@\s]+\.[^@\s]{2,}"
                    title="Please enter a valid work email address"
                    required
                  />
                  <label htmlFor="quiz-email" className="form-label">Work Email</label>
                </div>

                <button type="submit" className="btn-submit mt-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      Calculating Scorecard...
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
                      Retrieve Recommendations
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 10: RESULTS */}
          {currentStep === 9 && (
            <div className="flex-1 flex flex-col gap-8">
              <div className="text-center">
                <div className="success-icon-wrapper mx-auto mb-6">
                  <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.6rem] font-bold mb-1">
                  Eligibility Scorecard
                </h3>
                <p className="text-[var(--text-muted)] text-[0.85rem]">
                  Analysis compiled for {company} (Authorized: {name})
                </p>
              </div>

              {/* Eligible list */}
              <div className="bg-[var(--panel-dark)] border border-[var(--border)] rounded-xl p-6">
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-[0.95rem] font-bold mb-4 text-[var(--primary)]">
                  MATCHED GOVERNMENT CONTRACTING TARGETS
                </h4>
                <ul className="service-sublist grid-cols-1 gap-3">
                  {eligiblePrograms.map((prog, idx) => (
                    <li key={idx} className="flex gap-3 items-start text-[0.95rem] text-[var(--text-bright)] font-medium">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-1 text-[var(--primary)]">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {prog}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[var(--text-muted)] text-[0.85rem] leading-relaxed text-center">
                Our government advisory specialists will contact you at <strong>{email}</strong> within 12 business hours to coordinate GSA Schedule onboarding, certification submittals, and bid match profile setups.
              </div>

              <div className="flex gap-4 mt-4">
                <button className="btn btn-primary flex-1" onClick={resetQuiz}>
                  Retake Assessment
                </button>
                <Link href="/contact" className="btn btn-secondary flex-1 no-underline text-center">
                  Connect with Advisory
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
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
