"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dataStore, SiteSettings } from "@/utils/dataStore";

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const refreshSettings = () => setSettings(dataStore.getSiteSettings());
    refreshSettings();

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "inferno_site_settings_v1") {
        refreshSettings();
      }
    };
    const handleCMS = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.all || detail.key === "inferno_site_settings_v1") {
        refreshSettings();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-update", handleCMS);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-update", handleCMS);
    };
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/infernollc/admin")) {
    return null;
  }
  return (
    <footer>
      <div className="footer-columns">
        <div className="footer-brand">
          <Link href="/" className="footer-logo inline-flex items-center gap-3 mb-4 no-underline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="The Inferno Group Logo"
              loading="lazy"
              decoding="async"
              className="h-10 w-auto object-contain rounded-md"
            />
            <span className="font-[family-name:var(--font-space-grotesk)] text-[1.15rem] font-bold tracking-tight text-[var(--text-bright)] leading-tight">
              The <span className="text-[var(--primary)]">Inferno</span> Group
            </span>
          </Link>
          <p>
            Full-scale GovCon consulting, strategic agency growth positioning,
            and emergency management operations.
          </p>
        </div>

        <div>
          <h4 className="footer-title">Directory</h4>
          <ul className="footer-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/services">Our Services</Link>
            </li>
            <li>
              <Link href="/capabilities">Capabilities Dashboard</Link>
            </li>
            <li>
              <Link href="/partnerships">Partnerships</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">B2G Portal</h4>
          <ul className="footer-links">
            <li>
              <Link href="/contracts">Active Contracts</Link>
            </li>
            <li>
              <Link href="/tracker">Hurricane Tracker</Link>
            </li>
            <li>
              <Link href="/quiz">Eligibility Quiz</Link>
            </li>
            <li>
              <Link href="/calendar">Live Booking</Link>
            </li>
            <li>
              <Link href="/careers">Careers Portal</Link>
            </li>
            <li>
              <Link href="/news">News &amp; Insights</Link>
            </li>
            <li>
              <Link href="/resources">Resources Center</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Federal Credentials</h4>
          <div className="footer-meta text-xs space-y-1.5">
            <div>
              <strong className="text-[var(--navy)]">UEI:</strong>{" "}
              {settings?.uei && settings.uei !== "22VP2"
                ? settings.uei
                : "QW6RHJACHA56"}
            </div>
            <div>
              <strong className="text-[var(--navy)]">Cage Code:</strong>{" "}
              {settings?.cageCode &&
              settings.cageCode !== "9H2E1" &&
              settings.cageCode !== "8XYZ1"
                ? settings.cageCode
                : "22VP2"}
            </div>
            <div>
              <strong className="text-[var(--navy)]">Primary NAICS:</strong>{" "}
              {settings?.primaryNaics || "541611"}
            </div>
            <div className="pt-2 border-t border-[var(--border)] mt-2">
              <div className="font-semibold text-[var(--primary)] mb-1">
                Certifications Held
              </div>
              <div className="text-[0.75rem] text-[var(--text-muted)] space-y-1 mt-1">
                <div>
                  &bull; <strong>HUBZone Certified</strong> &mdash; U.S. Small
                  Business Administration. Supporting federal socioeconomic
                  contracting objectives and economic development in
                  historically underutilized communities.
                </div>
                <div>
                  &bull; <strong>Veteran-Owned Small Business (VOSB)</strong>{" "}
                  &mdash; Veteran-led. Mission-focused. Positioned to support
                  public-sector and private-sector supplier diversity
                  objectives.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} {settings?.companyName || "The Inferno Group LLC"}. All rights reserved. &middot;{" "}
          <Link href="/privacy">Privacy Policy</Link> &middot;{" "}
          <Link href="/conduct">Standards of Conduct</Link>
        </div>
        <div className="footer-disclaimer">
          Government Advisory Specialists &nbsp;&middot;&nbsp; Emergency
          Management Consultants
        </div>
      </div>
    </footer>
  );
}
