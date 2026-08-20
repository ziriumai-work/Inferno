"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer>
      <div className="footer-columns">
        <div className="footer-brand">
          <h3>
            The <span>Inferno</span> Group LLC
          </h3>
          <p>
            Full-scale GovCon consulting, strategic agency growth positioning, and emergency management operations.
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
            <div><strong className="text-[var(--text-bright)]">UEI:</strong> QW6RHJACHA56</div>
            <div><strong className="text-[var(--text-bright)]">Cage Code:</strong> 22VP2</div>
            <div><strong className="text-[var(--text-bright)]">NAICS Codes:</strong> 541611, 541618, 541690, 624230, 561210, 562910, 238320, 561720, 561790, 238990, 423990, 488510, 561422</div>
            <div className="pt-2 border-t border-[var(--border)] mt-2">
              <div className="font-semibold text-[var(--primary)] mb-1">Certifications Held</div>
              <div className="text-[0.75rem] text-[var(--text-muted)] space-y-1 mt-1">
                <div>&bull; <strong>HUBZone Certified</strong> &mdash; U.S. Small Business Administration. Supporting federal socioeconomic contracting objectives and economic development in historically underutilized communities.</div>
                <div>&bull; <strong>Veteran-Owned Small Business (VOSB)</strong> &mdash; Veteran-led. Mission-focused. Positioned to support public-sector and private-sector supplier diversity objectives.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; 2026 The Inferno Group LLC. All rights reserved. &middot; <Link href="/privacy">Privacy Policy</Link> &middot; <Link href="/conduct">Standards of Conduct</Link>
        </div>
        <div className="footer-disclaimer">
          Government Advisory Specialists &nbsp;&middot;&nbsp; Emergency Management Consultants
        </div>
      </div>
    </footer>
  );
}
