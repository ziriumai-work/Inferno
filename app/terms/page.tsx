import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seoConfig";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Use | The Inferno Group LLC",
  description:
    "Terms of Use, government contracting disclaimers, intellectual property rights, and legal governance for The Inferno Group LLC.",
  path: "/terms",
});

/**
 * TODO(OWNER/COUNSEL): Review these Terms of Use with legal counsel before final production deployment.
 * Ensure alignment with active Florida corporate counsel standards and federal prime teaming requirements.
 */

const termSections = [
  {
    title: "1. Acceptance of Terms & Eligibility",
    body: "By accessing or using the digital portals, contracting directories, and consultation coordination desks operated by The Inferno Group LLC (\"TIG,\" \"we,\" \"us,\" or \"our\"), you agree to be bound by these Terms of Use. If you are entering into these terms on behalf of a corporate entity, prime contractor, or government agency, you represent that you hold full legal authority to bind that organization.",
  },
  {
    title: "2. Government Contracting & Teaming Disclaimers",
    body: "Information provided across our public contracting pursuit feeds, SAM.gov opportunities indices, and teaming request portals is published strictly for informational, preliminary alignment, and coordination purposes. Nothing on this website constitutes a formal government solicitation, bid guarantee, binding prime-sub agreement, or subcontract award until a formal, bilateral written Teaming Agreement or Subcontract is executed by authorized corporate officers.",
  },
  {
    title: "3. Socioeconomic Status & Certifications",
    body: "The Inferno Group LLC is a certified HUBZone small business and Veteran-Owned Small Business (VOSB). Any representations regarding socioeconomic certifications, bonding capacity, or NAICS designations are verified against official Federal System for Award Management (SAM.gov) and Small Business Administration (SBA) DSBS registries. Third-party partners are responsible for maintaining and verifying their own active certification statuses.",
  },
  {
    title: "4. Intellectual Property & Proprietary Assets",
    body: "All text, design systems, logos, capability narratives, methodologies, and proprietary operational frameworks displayed on this site are the exclusive intellectual property of The Inferno Group LLC or its licensors and are protected under United States copyright and trademark laws. Unauthorized reproduction, distribution, or reverse-engineering is strictly prohibited.",
  },
  {
    title: "5. Limitation of Liability & Warranty Disclaimer",
    body: "This website and all associated digital services are provided on an \"as-is\" and \"as-available\" basis without warranty of any kind, either express or implied. In no event shall The Inferno Group LLC, its managing members, or personnel be liable for any direct, indirect, incidental, punitive, or consequential damages arising out of your access to or inability to access this portal.",
  },
  {
    title: "6. Governing Law & Jurisdiction",
    body: "These Terms of Use shall be governed by and construed in accordance with the laws of the State of Florida and applicable federal procurement laws, without giving effect to conflict-of-law principles. Any legal action or proceeding arising under these terms shall be brought exclusively in state or federal courts located in Orange County, Florida.",
  },
  {
    title: "7. Inquiries & Legal Notices",
    body: "For formal legal notices, procurement integrity questions, or compliance inquiries, contact: The Inferno Group LLC, 200 E. Robinson Street, Suite 1120, Orlando, FL 32801, or via email at InfernoCares@theinfernogroup.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="page-view block">
      <section id="terms-of-use" className="max-w-[850px] mx-auto py-16 px-6 sm:px-8">
        <div className="text-center max-w-[850px] mx-auto mb-10">
          <div className="section-eyebrow">Legal Governance</div>
          <h1 className="section-title">Terms of Use</h1>
          <p className="section-desc max-w-[760px] mx-auto text-center mb-6">
            Legal terms, government contracting disclaimers, and portal governance for The Inferno Group LLC.
          </p>
          <span className="inline-block text-[0.72rem] font-mono text-[var(--text-muted)] bg-[var(--panel-dark)] px-3 py-1 rounded-full border border-[var(--border)]">
            Last Reviewed: November 2026 &bull; Governance Status: Active
          </span>
        </div>

        <div className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-8 sm:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-6">
            {termSections.map((section, idx) => (
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
              Questions? Email our desk at{" "}
              <a
                href="mailto:InfernoCares@theinfernogroup.com"
                className="text-[var(--primary)] font-bold hover:underline"
              >
                InfernoCares@theinfernogroup.com
              </a>
            </span>
            <Link href="/privacy" className="text-[var(--primary)] font-semibold hover:underline">
              View Privacy Policy &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

