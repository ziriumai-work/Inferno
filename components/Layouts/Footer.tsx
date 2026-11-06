"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Settings,
  LayoutDashboard,
  Handshake,
  MessageCircleQuestion,
  Mail,
  FileText,
  Radar,
  ClipboardCheck,
  CalendarCheck,
  UserPlus,
  Newspaper,
  BookOpen,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { dataStore, SiteSettings } from "@/utils/dataStore";

const FOOTER_GROUPS = [
  {
    id: "directory",
    label: "Directory",
    links: [
      { href: "/about", label: "About Us", Icon: Users },
      { href: "/services", label: "Our Services", Icon: Settings },
      {
        href: "/capabilities",
        label: "Capabilities Dashboard",
        Icon: LayoutDashboard,
      },
      { href: "/partnerships", label: "Partnerships", Icon: Handshake },
      { href: "/faq", label: "FAQ", Icon: MessageCircleQuestion },
      { href: "/contact", label: "Contact", Icon: Mail },
    ],
  },
  {
    id: "b2g",
    label: "B2G Portal",
    links: [
      { href: "/contracts", label: "Active Contracts", Icon: FileText },
      { href: "/tracker", label: "Hurricane Tracker", Icon: Radar },
      { href: "/quiz", label: "Eligibility Quiz", Icon: ClipboardCheck },
      { href: "/calendar", label: "Live Booking", Icon: CalendarCheck },
      { href: "/careers", label: "Careers Portal", Icon: UserPlus },
      { href: "/news", label: "News & Insights", Icon: Newspaper },
      { href: "/resources", label: "Resources Center", Icon: BookOpen },
    ],
  },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>("directory");

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
  const uei =
    settings?.uei && settings.uei !== "22VP2" ? settings.uei : "QW6RHJACHA56";
  const cage =
    settings?.cageCode &&
    settings.cageCode !== "9H2E1" &&
    settings.cageCode !== "8XYZ1"
      ? settings.cageCode
      : "22VP2";
  const naics = settings?.primaryNaics || "541611";

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* brand */}
        <Link href="/" className="footer-brand-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="The Inferno Group"
            loading="lazy"
            decoding="async"
            className="footer-mark"
          />
          <span className="footer-wordmark">
            The <span>Inferno</span> Group
          </span>
        </Link>
        <p className="footer-blurb">
          Full-scale GovCon consulting, strategic agency growth positioning, and
          emergency management operations.
        </p>

        {/* link groups */}
        {FOOTER_GROUPS.map((group) => {
          const open = openGroup === group.id;
          return (
            <section key={group.id} className="footer-group">
              <button
                type="button"
                className="footer-group__head"
                aria-expanded={open}
                aria-controls={`footer-${group.id}`}
                onClick={() => setOpenGroup(open ? null : group.id)}
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={`footer-chevron${open ? " is-open" : ""}`}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
              <ul
                id={`footer-${group.id}`}
                className="footer-group__list"
                data-state={open ? "open" : "closed"}
              >
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-row">
                      <link.Icon
                        className="footer-row__icon"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      <span className="footer-row__label">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {/* federal credentials */}
        <h4 className="footer-heading">Federal Credentials</h4>
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="footer-stat__label">UEI</span>
            <span className="footer-stat__value">{uei}</span>
          </div>
          <div className="footer-stat">
            <span className="footer-stat__label">Cage Code</span>
            <span className="footer-stat__value">{cage}</span>
          </div>
          <div className="footer-stat">
            <span className="footer-stat__label">Primary NAICS</span>
            <span className="footer-stat__value">{naics}</span>
          </div>
        </div>

        <div className="footer-certs">
          <article className="footer-cert">
            <span className="footer-cert__icon">
              <ShieldCheck strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <h5>HUBZone Certified</h5>
              <p>
                U.S. Small Business Administration. Supporting regional
                socioeconomic contracting objectives and economic development in
                historically underutilized communities.
              </p>
            </div>
          </article>
          <article className="footer-cert">
            <span className="footer-cert__icon">
              <ShieldCheck strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <h5>Veteran-Owned Small Business (VOSB)</h5>
              <p>
                Veteran-led. Mission-focused. Positioned to support
                public-sector and private-sector supplier diversity objectives.
              </p>
            </div>
          </article>
        </div>

        {/* legal */}
        <div className="footer-legal">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()}{" "}
            {settings?.companyName || "The Inferno Group LLC"}. All rights
            reserved.
          </p>
          <ul className="footer-legal__links">
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Use</Link>
            </li>
            <li>
              <Link href="/conduct">Standards of Conduct</Link>
            </li>
            <li>
              <Link href="/accessibility">Accessibility</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
