"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function CapabilityStatementPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10 print:p-0 print:bg-white text-slate-800 font-sans selection:bg-[var(--primary)] selection:text-white">
      {/* Screen-Only Action Header */}
      <div className="max-w-[850px] mx-auto px-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <Link
          href="/capabilities"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[var(--primary)] transition-colors"
        >
          <span>←</span>
          <span>Return to Capabilities Portal</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <a
            href="/documents/The_Inferno_Group_LLC_Capability_Statement.pdf"
            download="The_Inferno_Group_LLC_Capability_Statement.pdf"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-xs transition-all active:scale-95"
          >
            <svg className="w-4 h-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download Official PDF (500 KB)</span>
          </a>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-[var(--primary)]/20 transition-all active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Letter Aspect Ratio 8.5 x 11) */}
      <div className="statement-sheet max-w-[850px] mx-auto bg-white shadow-xl print:shadow-none print:m-0 print:w-full print:max-w-none border border-slate-200 print:border-none rounded-none overflow-hidden text-[11px] leading-relaxed">
        {/* Header Bar */}
        <div className="p-6 pb-4 sm:p-8 sm:pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src="/logo.png"
                alt="The Inferno Group Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-extrabold text-[#0b1a30] tracking-wider text-base sm:text-lg leading-tight font-[family-name:var(--font-space-grotesk)]">
                THE INFERNO GROUP <span className="text-[10px] font-semibold text-slate-500">LLC</span>
              </div>
              <div className="text-[9px] uppercase tracking-widest text-[#e14d18] font-bold">
                Strategic Planning &amp; Government Procurement
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0b1a30] uppercase font-[family-name:var(--font-space-grotesk)] leading-none">
              Capability Statement
            </h1>
            <div className="text-[11px] font-bold text-[#e14d18] uppercase tracking-wide mt-1">
              Emergency Management &amp; Disaster Recovery
            </div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
              Preparedness | Response | Recovery
            </div>
          </div>
        </div>

        {/* Hero Banner: Mission-Ready */}
        <div className="bg-[#0b1a30] text-white p-5 sm:p-6 mx-4 sm:mx-6 mt-4 rounded-xl relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-1 self-stretch bg-[#e14d18] rounded-full shrink-0 mt-0.5"></div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white mb-1.5 font-[family-name:var(--font-space-grotesk)]">
                Mission-Ready. Compliance-Driven. Built to Scale.
              </h2>
              <p className="text-[10.5px] leading-relaxed text-slate-200">
                The Inferno Group LLC (TIG) is a HUBZone-certified, veteran-owned small business delivering emergency preparedness, disaster response, and recovery support to public-sector clients and prime contractors. We pair disciplined program management with mission-ready personnel and qualified partners to turn emergency management requirements into compliant, accountable, on-time delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Credentials Badges Bar */}
        <div className="px-6 py-3 mx-4 sm:mx-6 flex flex-wrap items-center justify-start gap-4 sm:gap-6 border-b border-slate-200 text-[10px] font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e14d18]"></span>
            <span>HUBZone Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e14d18]"></span>
            <span>Veteran-Owned Small Business (VOSB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e14d18]"></span>
            <span>E-Verify Employer</span>
          </div>
        </div>

        {/* Two-Column Core Layout */}
        <div className="p-6 sm:p-8 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Core Competencies & NAICS */}
          <div className="space-y-5">
            {/* Core Competencies */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-3.5 bg-[#e14d18] rounded-full"></span>
                <h3 className="text-xs font-bold text-[#0b1a30] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                  Core Competencies
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-[#0b1a30] text-[11px]">
                    Emergency Management &amp; Preparedness
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                    Emergency and continuity plans, training and exercises, operational readiness, and incident management support that strengthen readiness before an event occurs.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1a30] text-[11px]">
                    Disaster Response &amp; EOC Support
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                    EOC augmentation, planning, logistics and operations support, resource coordination, and rapid surge staffing that sustains operations when demand peaks.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1a30] text-[11px]">
                    Disaster Recovery Program Support
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                    FEMA Individual Assistance and Public Assistance support, recovery case management, grant documentation, and hazard-mitigation program support that keeps recovery funding compliant and defensible.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1a30] text-[11px]">
                    Debris Monitoring &amp; Field Documentation
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                    Debris monitoring, field records, and quality checks that produce audit-ready documentation and support recovery accountability.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1a30] text-[11px]">
                    Disaster Contact Center &amp; Case Operations
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                    Survivor support, escalation handling, case tracking, quality assurance, training, and supervisory support delivered to consistent service standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission-Aligned NAICS */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-3.5 bg-[#e14d18] rounded-full"></span>
                <h3 className="text-xs font-bold text-[#0b1a30] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                  Mission-Aligned NAICS
                </h3>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="font-bold text-[10.5px] text-[#0b1a30]">
                    <span className="text-[#e14d18] font-mono font-bold mr-1.5">541611</span>
                    Administrative Management and General Management Consulting Services
                  </div>
                  <div className="text-[9.5px] text-slate-500 italic ml-4">
                    Recovery program management and administrative support.
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[10.5px] text-[#0b1a30]">
                    <span className="text-[#e14d18] font-mono font-bold mr-1.5">541690</span>
                    Other Scientific and Technical Consulting Services
                  </div>
                  <div className="text-[9.5px] text-slate-500 italic ml-4">
                    Emergency management technical advisory support.
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[10.5px] text-[#0b1a30]">
                    <span className="text-[#e14d18] font-mono font-bold mr-1.5">624230</span>
                    Emergency and Other Relief Services
                  </div>
                  <div className="text-[9.5px] text-slate-500 italic ml-4">
                    Disaster survivor assistance and relief support.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Differentiators, Leadership & Teaming */}
          <div className="space-y-5">
            {/* Key Differentiators */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-3.5 bg-[#e14d18] rounded-full"></span>
                <h3 className="text-xs font-bold text-[#0b1a30] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                  Key Differentiators
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-[#0b1a30] text-[11px]">
                    Full Disaster Lifecycle Support
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                    Preparedness, response, recovery, and operational sustainment delivered through one coordinated model, with fewer handoffs between phases.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1a30] text-[11px]">
                    Scalable Cadre &amp; Partner Network
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                    Mission personnel and qualified professional-service partners who scale up or down as requirements evolve.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1a30] text-[11px]">
                    Compliance Built Into Delivery
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                    Documentation, reporting, quality assurance, and performance controls embedded in every task rather than added afterward.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#0b1a30] text-[11px]">
                    Flexible Prime / Subcontract Teaming
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-normal mt-0.5">
                    Core management led by TIG and complemented by specialized partners wherever the mission calls for them.
                  </p>
                </div>
              </div>
            </div>

            {/* Leadership Experience */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-3.5 bg-[#e14d18] rounded-full"></span>
                <h3 className="text-xs font-bold text-[#0b1a30] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                  Leadership Experience
                </h3>
              </div>
              <p className="text-[10px] text-slate-700 leading-normal">
                TIG&apos;s leadership brings hands-on experience in emergency management, disaster recovery, and public-sector program operations, including FEMA Public Assistance and hazard-mitigation environments, contact center leadership, and quality assurance.
              </p>
              <p className="text-[9px] text-slate-400 italic mt-1 leading-normal">
                Experience reflects leadership background; entity-level past performance is presented only when separately documented.
              </p>
            </div>

            {/* Target Teaming Opportunities */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-3.5 bg-[#e14d18] rounded-full"></span>
                <h3 className="text-xs font-bold text-[#0b1a30] uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
                  Target Teaming Opportunities
                </h3>
              </div>
              <p className="text-[10px] text-slate-700 mb-1.5 font-medium">
                TIG welcomes teaming with primes and partners on:
              </p>
              <ul className="text-[10px] text-slate-600 space-y-1">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#e14d18] mt-0.5">■</span>
                  <span>Emergency planning and preparedness</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#e14d18] mt-0.5">■</span>
                  <span>Response staffing and EOC augmentation</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#e14d18] mt-0.5">■</span>
                  <span>FEMA IA / PA recovery support</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#e14d18] mt-0.5">■</span>
                  <span>Debris monitoring and field documentation</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#e14d18] mt-0.5">■</span>
                  <span>Disaster case management, QA, and training</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Corporate Footer Bar */}
        <div className="bg-[#0b1a30] text-white p-5 sm:p-6 mx-0 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="font-extrabold text-white text-xs uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
              The Inferno Group LLC
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5 font-mono">
              407-499-1443 &bull; Support@theinfernogroup.com
            </div>
            <div className="text-[9.5px] text-slate-400 mt-0.5">
              200 E. Robinson Street, Suite 1120, Orlando, Florida 32801 &bull; theinfernogroup.com
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <div className="text-xs font-bold text-white tracking-wide">
              UEI: <span className="text-[#e14d18]">QW6RHJACHA56</span>
            </div>
            <div className="text-xs font-bold text-white tracking-wide">
              CAGE CODE: <span className="text-[#e14d18]">22VP2</span>
            </div>
            <div className="text-[8.5px] uppercase tracking-wider text-slate-400 mt-0.5 font-sans font-semibold">
              Capabilities | Teaming | Subcontracting &bull; Government Solutions
            </div>
          </div>
        </div>
      </div>

      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: letter portrait;
            margin: 0.25in;
          }
          .statement-sheet {
            max-width: 100% !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
          nav, footer, .chat-widget, .announcement-banner {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

