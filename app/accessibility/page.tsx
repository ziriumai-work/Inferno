import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Accessibility Statement & Section 508 Commitment | The Inferno Group LLC",
  description:
    "The Inferno Group LLC's accessibility commitment, WCAG 2.1 Level AA conformance status, and reporting channel for digital accessibility barriers.",
  path: "/accessibility",
});

const accessibilitySections = [
  {
    title: "1. Our Commitment to Universal Accessibility",
    body: "The Inferno Group LLC is dedicated to providing an accessible, inclusive digital experience across all federal, emergency management, and contracting portals. As a government consulting firm frequently supporting public agency operations, disaster survivors, and socioeconomic small business partners, we strive to adhere strictly to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and Section 508 of the Rehabilitation Act.",
  },
  {
    title: "2. Standards & Technical Measures",
    body: "We implement rigorous technical standards across our codebase, including semantic HTML structure, keyboard-navigable interactive controls, ARIA landmark regions, sufficient color contrast ratios (≥ 4.5:1 for standard text), video closed captions and transcripts, skip-to-content bypass links, and screen-reader accessible alternatives for real-time GIS weather mapping.",
  },
  {
    title: "3. Known Limitations & Ongoing Enhancements",
    body: "While we make every reasonable effort to ensure universal access, third-party GIS feeds (such as NOAA/NHC MapServer weather radar tiles) and certain legacy PDF contract files may present minor navigation barriers to certain assistive technologies. We continuously audit these components and provide accessible tabular and plain-text alternatives directly alongside interactive maps and data tables.",
  },
  {
    title: "4. Feedback & Barrier Reporting Channel",
    body: "If you encounter an accessibility barrier or require an alternate format (such as plain-text capability statements, large-print contract descriptions, or verbal phone assistance), our team is here to assist you promptly. Please contact our administrative desk at InfernoCares@theinfernogroup.com or call 407-499-1443 with the specific URL and nature of the barrier.",
  },
  {
    title: "5. Formal Conformance Status & Review Date",
    body: "This digital property has been designed to conform with WCAG 2.1 Level AA guidelines. Date of last comprehensive accessibility review: November 4, 2026.",
  },
];

export default function AccessibilityPage() {
  return (
    <div className="page-view block">
      <section id="accessibility-statement" className="max-w-[850px] mx-auto py-16 px-6 sm:px-8">
        <div className="text-center max-w-[850px] mx-auto mb-10">
          <div className="section-eyebrow">Section 508 &bull; WCAG 2.1 AA</div>
          <h1 className="section-title">Accessibility Statement</h1>
          <p className="section-desc max-w-[760px] mx-auto text-center mb-6">
            Our corporate commitment to digital inclusion, federal Section 508 conformance, and accessible emergency services.
          </p>
          <span className="inline-block text-[0.72rem] font-mono text-[var(--text-muted)] bg-[var(--panel-dark)] px-3 py-1 rounded-full border border-[var(--border)]">
            Last Audit: November 4, 2026 &bull; Status: Conforming (WCAG 2.1 AA)
          </span>
        </div>

        <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-8 sm:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-6">
            {accessibilitySections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-[1.2rem] sm:text-[1.3rem] font-[750] text-[var(--text-bright)]">
                  {section.title}
                </h2>
                <p className="text-[var(--text-muted)] text-[0.95rem] leading-[1.7]">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border)] flex flex-wrap justify-between items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>
              Encountering a barrier? Email{" "}
              <a
                href="mailto:InfernoCares@theinfernogroup.com"
                className="text-[var(--primary)] font-bold hover:underline"
              >
                InfernoCares@theinfernogroup.com
              </a>
            </span>
            <Link href="/contact" className="text-[var(--primary)] font-semibold hover:underline">
              Contact Operations Desk &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

