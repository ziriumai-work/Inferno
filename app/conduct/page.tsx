import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standards of Conduct & Ethics | The Inferno Group LLC",
  description:
    "The Inferno Group LLC's ethical standards, procurement integrity protocols, and FAR compliance guidelines.",
  alternates: {
    canonical: "https://www.theinfernogroup.com/conduct",
  },
};

const conductSections = [
  {
    title: "1. Procurement Integrity and Ethics",
    body: "The Inferno Group LLC enforces absolute transparency, integrity, and ethical conduct across all federal, state, and commercial engagements in accordance with the Procurement Integrity Act (41 U.S.C. §§ 2101-2107). Our staff and partners are held to the highest standards of fair competition and federal procurement ethics.",
  },
  {
    title: "2. Conflict of Interest Guidelines",
    body: "Personnel and teaming subcontractors must prevent actual, apparent, or potential Organizational Conflicts of Interest (OCI) or personal conflicts. Any potential conflict must be disclosed immediately to corporate compliance officers prior to proposal engagement.",
  },
  {
    title: "3. Anti-Kickback & FAR Compliance",
    body: "We adhere strictly to the Anti-Kickback Act of 1986 and Federal Acquisition Regulation (FAR) Part 3.502. We prohibit kickbacks, bribes, or improper gratuities in any procurement, teaming agreement, or vendor relationship.",
  },
  {
    title: "4. Workforce & Equal Opportunity",
    body: "We uphold equal opportunity, fair treatment, and merit-based advancement across all deployment and staffing cadres in compliance with federal labor standards and E-Verify requirements.",
  },
];

export default function ConductPage() {
  return (
    <div className="page-view block">
      <section id="standards-of-conduct" className="max-w-[800px] mx-auto py-16 px-6 sm:px-8">
        <div className="text-center max-w-[850px] mx-auto mb-10">
          <div className="section-eyebrow">Corporate Ethics</div>
          <h1 className="section-title">Standards of Conduct</h1>
          <p className="section-desc max-w-[760px] mx-auto text-center mb-8">
            Ethical frameworks, procurement integrity policies, and compliance parameters for The Inferno Group LLC.
          </p>
        </div>

        <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-8 sm:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-6">
            {conductSections.map((section, idx) => (
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
        </div>
      </section>
    </div>
  );
}
