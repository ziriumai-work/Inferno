"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import RevealOnMount from "@/components/RevealOnMount";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { dataStore, ServiceItem } from "@/utils/dataStore";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;
  const [service, setService] = useState<ServiceItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const list = dataStore.getServices();
    const found = list.find((s) => s.id === serviceId);
    if (found) {
      setService(found);
    }
    setIsMounted(true);
  }, [serviceId]);

  if (!isMounted) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Loading Service Profile...</h2>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Service Profile Not Found</h2>
        <p className="my-6 text-[var(--text-muted)]">
          The requested service classification classification does not exist or has been decommissioned.
        </p>
        <Link href="/services" className="btn btn-primary">
          Return to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="page-view block">
      <section id="service-profile-details">
        {/* Back Link */}
        <Link 
          href="/services" 
          className="back-btn inline-flex items-center gap-2 text-[var(--text-muted)] no-underline text-sm mb-8 transition-all duration-300"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Services Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16 items-start">
          {/* Main Info */}
          <RevealOnMount>
            <div className="flex flex-col gap-10">
              <div>
                <span className="service-badge mb-3 inline-block">
                  {service.badge}
                </span>
                <h2 className="text-[2.2rem] font-extrabold font-[family-name:var(--font-space-grotesk)] leading-tight">
                  {service.title}
                </h2>
                {service.headline && (
                  <h4 className="text-[var(--primary)] text-[1.1rem] font-semibold mt-2">
                    {service.headline}
                  </h4>
                )}
                <div className="text-xs text-[var(--text-muted)] mt-2">
                  Classification Reference ID: <strong>{service.id}</strong> &middot; Code: <strong>0{service.num}</strong>
                </div>
              </div>

            <div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-[750] mb-3 border-b border-[var(--border)] pb-2">
                Operational Overview
              </h3>
              <p className="text-[var(--text-muted)] text-base leading-[1.7]">
                {service.desc}
              </p>
            </div>

            <div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-[750] mb-4 border-b border-[var(--border)] pb-2">
                What We Include
              </h3>
              <ul className="service-sublist grid grid-cols-1 gap-[0.85rem]">
                {service.caps.map((cap, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-[0.95rem] text-[var(--text-muted)]">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-[0.15rem] text-[var(--primary)]">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {cap}
                  </li>
                ))}
              </ul>
            </div>

            {service.idealFor && service.idealFor.length > 0 && (
              <div>
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.3rem] font-[750] mb-4 border-b border-[var(--border)] pb-2">
                  Ideal For
                </h3>
                <div className="flex flex-wrap gap-[0.6rem]">
                  {service.idealFor.map((target, idx) => (
                    <span 
                      key={idx}
                      className="bg-[rgba(225,77,24,0.08)] border border-[rgba(225,77,24,0.2)] text-[var(--text-main)] py-[0.4rem] px-[0.85rem] rounded-full text-[0.85rem] font-semibold"
                    >
                      {target}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </RevealOnMount>

          {/* Action Card Sidebar */}
          <RevealOnMount>
            <div 
              className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-10 flex flex-col gap-6"
            >
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-[750]">
                Need Contracting Support?
              </h3>
              <p className="text-[var(--text-muted)] text-[0.85rem] leading-[1.6]">
                Establish a secure connection with our advisory desk to coordinate bidding configurations, Stafford Act alignment, or DCAA cost accounting compliance.
              </p>
              
              <div className="flex flex-col gap-3 mt-4">
                <Link 
                  href={`/contact?service=${service.id}`} 
                  className="btn btn-primary no-underline text-center p-3"
                >
                  Initiate Secure Handshake
                </Link>
                <Link 
                  href="/calendar" 
                  className="btn btn-secondary no-underline text-center p-3"
                >
                  Book Live Booking Session
                </Link>
              </div>

              <div className="border-t border-[var(--border)] pt-5 text-xs text-[var(--text-muted)]">
                <strong>Verification Status:</strong> CAGE Code Active &middot; Joint Ventures Enabled &middot; Subcontracting Matches Available
              </div>
            </div>
          </RevealOnMount>
        </div>

        {/* Testimonials section */}
        <div className="mt-24 border-t border-[var(--border)] pt-16">
          <div className="text-center mb-12">
            <div className="section-eyebrow">Client Endorsements</div>
            <h3 className="section-title">Verified Contractor Reviews</h3>
          </div>
          <TestimonialsCarousel />
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
