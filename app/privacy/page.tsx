import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | The Inferno Group LLC",
  description:
    "The Inferno Group LLC data encryption protocols, PII protection parameters, and privacy compliance standards.",
  alternates: {
    canonical: "https://www.theinfernogroup.com/privacy",
  },
};

const privacySections = [
  {
    title: "1. Information Collection and PII Policy",
    body: "The Inferno Group LLC (\"we,\" \"us,\" or \"our\") collects contact, corporate, and application details necessary to deliver consulting, emergency management, and partnering services. We enforce strict Personally Identifiable Information (PII) safeguards, data isolation protocols, and never sell or lease partner or applicant data to third parties.",
  },
  {
    title: "2. Stafford Act Compliance & Emergency Programs",
    body: "During disaster recovery missions (including FEMA Individual Assistance, Public Assistance intake, and casework), we comply with the Robert T. Stafford Disaster Relief and Emergency Assistance Act and the Privacy Act of 1974. All casework data, intake submissions, and field documentation are encrypted in transit using TLS 1.3 and at rest using AES-256.",
  },
  {
    title: "3. File Uploads & Document Security",
    body: "Resumes, capability statements, and corporate documentation submitted through our portals are stored in encrypted object repositories with restricted access policies limited strictly to authorized recruiting and contracting personnel.",
  },
  {
    title: "4. Policy Inquiries & Governance",
    body: "For questions regarding our privacy practices, data handling, or to request record redaction, contact our administrative coordination office at InfernoCares@theinfernogroup.com.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="page-view block">
      <section id="privacy-policy" className="max-w-[800px] mx-auto py-16 px-6 sm:px-8">
        <div className="text-center max-w-[850px] mx-auto mb-10">
          <div className="section-eyebrow">Regulatory Compliance</div>
          <h1 className="section-title">Privacy Policy</h1>
          <p className="section-desc max-w-[760px] mx-auto text-center mb-8">
            The Inferno Group LLC data encryption protocols and PII protection standard parameters.
          </p>
        </div>

        <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-8 sm:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-6">
            {privacySections.map((section, idx) => (
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
