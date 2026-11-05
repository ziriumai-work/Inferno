"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dataStore, SiteSettings } from "@/utils/dataStore";

/* ------------------------------------------------------------------
   Rolling letters.

   Each letter is its own span carrying the character twice: once as
   text (to hold the width) and once in data-ch, which the ::before and
   ::after faces read via content:attr(). The spans are aria-hidden, so
   every link also carries the real label in an .sr-only span — that is
   what a screen reader and Google read. Do not remove it.

   The space span counts as an :nth-child, which is what gives the
   natural pause between two words in the stagger.
   ------------------------------------------------------------------ */
function Roll({ label }: { label: string }) {
  return (
    <span className="inline-flex items-start leading-[1.3]" aria-hidden="true">
      {[...label].map((c, i) =>
        c === " " ? (
          <span key={i} className="inline-block w-[.32em]" />
        ) : (
          <span key={i} className="ig-ch" data-ch={c}>
            {c}
          </span>
        )
      )}
    </span>
  );
}

/* Icons: 24x24 grid, 1.7 stroke, currentColor, no fill — one set. */
const ICONS: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3.6 10.4 12 3.8l8.4 6.6" />
      <path d="M5.8 12v7.2a1 1 0 0 0 1 1h10.4a1 1 0 0 0 1-1V12" />
      <path d="M9.8 20.2v-5.1h4.4v5.1" />
    </>
  ),
  about: (
    <>
      <circle cx="9.2" cy="8.6" r="3.2" />
      <path d="M3.6 19.6a5.6 5.6 0 0 1 11.2 0" />
      <path d="M16.3 6.1a3.2 3.2 0 0 1 0 5.9" />
      <path d="M17.7 14.3a5.6 5.6 0 0 1 2.7 5.3" />
    </>
  ),
  services: (
    <>
      <rect x="3.6" y="3.6" width="7" height="7" rx="1.7" />
      <rect x="13.4" y="3.6" width="7" height="7" rx="1.7" />
      <rect x="3.6" y="13.4" width="7" height="7" rx="1.7" />
      <rect x="13.4" y="13.4" width="7" height="7" rx="1.7" />
    </>
  ),
  capabilities: (
    <>
      <path d="M12 2.9 4.9 5.6v5.5c0 4.3 2.9 8.2 7.1 9.9 4.2-1.7 7.1-5.6 7.1-9.9V5.6L12 2.9Z" />
      <path d="m8.9 11.9 2.2 2.2 4-4.4" />
    </>
  ),
  /* swirl inside a dial: a free-standing cyclone collapses at 16px and
     reads as a chain link, almost identical to the partnership rings */
  tracker: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="M13.5 11.2c.4-2 1.6-3.3 3.4-3.6" />
      <path d="M10.5 12.8c-.4 2-1.6 3.3-3.4 3.6" />
    </>
  ),
  partnerships: (
    <>
      <circle cx="8.5" cy="12" r="5" />
      <circle cx="15.5" cy="12" r="5" />
    </>
  ),
  b2g: (
    <>
      <path d="M2.8 9.4 12 4.2l9.2 5.2" />
      <path d="M5.3 10.4v8.2M9.5 10.4v8.2M14.5 10.4v8.2M18.7 10.4v8.2" />
      <path d="M3.2 20.6h17.6" />
    </>
  ),
  faq: (
    <>
      <path d="M20.4 12.3c0 4-3.8 7.2-8.4 7.2-1 0-2-.2-2.9-.5l-4.5 1.4 1.4-3.8a6.8 6.8 0 0 1-2.4-5.1c0-4 3.8-7.2 8.4-7.2s8.4 3.2 8.4 7.2Z" />
      <path d="M10.1 10.3a2 2 0 0 1 3.8.7c0 1.3-1.9 1.7-1.9 2.8" />
      <path d="M12 16.1h.01" />
    </>
  ),
};

function Icon({ name, className }: { name: string; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICONS[name]}
    </svg>
  );
}

const CHEVRON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-3.5 w-3.5 shrink-0"
  >
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

const NAV_LINKS = [
  { name: "Home", href: "/", icon: "home" },
  { name: "About Us", href: "/about", icon: "about" },
  { name: "Services", href: "/services", icon: "services" },
  { name: "Capabilities", href: "/capabilities", icon: "capabilities" },
  { name: "Hurricane Tracker", href: "/tracker", icon: "tracker" },
  { name: "Partnerships", href: "/partnerships", icon: "partnerships" },
];

/* The portal menu keeps this project's real destinations. */
const B2G_ITEMS = [
  { name: "Active Contracts", href: "/contracts" },
  { name: "Eligibility Quiz", href: "/quiz" },
  { name: "Careers", href: "/careers" },
  { name: "News & Insights", href: "/news" },
  { name: "Resources Center", href: "/resources" },
];

const LINK_CLS =
  "ig-link relative inline-flex items-center gap-1.5 min-h-[44px] py-2.5 pl-[var(--ig-slot)] pr-[var(--ig-padx)] font-medium leading-none text-bright no-underline whitespace-nowrap text-[length:var(--ig-link-fs)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)] focus-visible:rounded-lg";

const SLOT_CLS =
  "ig-ic pointer-events-none absolute top-1/2 -translate-y-1/2 overflow-hidden text-primary left-[var(--ig-icon-left)] w-[var(--ig-icon)] h-[var(--ig-icon)]";

const DRAWER_LINK_CLS =
  "flex min-h-[48px] items-center gap-[13px] border-b border-hairline px-1 py-[13px] text-[17px] font-medium no-underline";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isB2GOpen, setIsB2GOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerB2GOpen, setIsDrawerB2GOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const pathname = usePathname();
  const b2gRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const refreshSettings = () => setSettings(dataStore.getSiteSettings());
    refreshSettings();

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "inferno_site_settings_v1") refreshSettings();
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

  /* Solid bar once past the fold; transparent over the hero at the top */
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 40;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll while the drawer is open */
  useEffect(() => {
    const previous = document.body.style.overflowY;
    if (isOpen) document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = previous;
    };
  }, [isOpen]);

  /* Close everything on navigation */
  useEffect(() => {
    setIsOpen(false);
    setIsB2GOpen(false);
    setIsDrawerB2GOpen(false);
  }, [pathname]);

  /* Escape closes, and a click outside closes the portal menu */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsB2GOpen(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (b2gRef.current && !b2gRef.current.contains(e.target as Node)) {
        setIsB2GOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/infernollc/admin")
  ) {
    return null;
  }

  /* Only the homepage has a photo behind the bar to show through. */
  const isOverlay = pathname === "/" && !isScrolled && !isOpen;

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {settings?.emergencyBannerActive && (
        <div className="relative z-[60] flex items-center justify-center gap-2 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 px-4 py-2 text-center text-xs font-bold text-white shadow-lg">
          <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
          <span>{settings.emergencyBannerMessage}</span>
          {settings.emergencyHotline && (
            <a
              href={`tel:${settings.emergencyHotline}`}
              className="ml-2 font-mono text-amber-200 underline hover:text-white"
            >
              Hotline: {settings.emergencyHotline}
            </a>
          )}
        </div>
      )}

      <header
        data-overlay={isOverlay ? "true" : "false"}
        className={`ig-h sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          isOverlay
            ? "bg-transparent border-transparent"
            : "bg-panel border-hairline"
        } ${isScrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.06)]" : ""}`}
      >
        <div className="ig-h__in mx-auto flex items-center max-w-[1560px] h-[68px] min-[1180px]:h-[76px] px-[var(--ig-shell-px)] gap-[var(--ig-gap)]">
          {/* logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 min-h-[44px] no-underline group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="The Inferno Group"
              className="shrink-0 object-contain w-[var(--ig-mark)] h-[var(--ig-mark)] transition-transform duration-500 group-hover:-translate-y-0.5"
            />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="ig-display font-extrabold leading-none text-bright whitespace-nowrap text-[length:var(--ig-logo-fs)]">
                THE INFERNO GROUP
              </span>
              <span className="font-semibold leading-none text-muted whitespace-nowrap text-[length:var(--ig-logo-sub)] tracking-[var(--ig-logo-trk)]">
                GOVERNMENT &amp; COMMERCIAL CONSULTING
              </span>
            </span>
          </Link>

          {/* desktop navigation */}
          <nav
            aria-label="Main"
            className="ml-auto hidden items-center gap-0 min-[1180px]:flex"
          >
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="ig-item relative">
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  className={LINK_CLS}
                >
                  <span className={SLOT_CLS} aria-hidden="true">
                    <Icon name={link.icon} className="block w-full h-full" />
                  </span>
                  <Roll label={link.name} />
                  <span className="sr-only">{link.name}</span>
                </Link>
              </div>
            ))}

            {/* B2G Portal */}
            <div className="ig-item relative" ref={b2gRef}>
              <button
                type="button"
                aria-expanded={isB2GOpen}
                aria-haspopup="true"
                aria-controls="ig-b2g-menu"
                onClick={() => setIsB2GOpen((v) => !v)}
                className={`${LINK_CLS} cursor-pointer border-0 bg-transparent font-[inherit]`}
              >
                <span className={SLOT_CLS} aria-hidden="true">
                  <Icon name="b2g" className="block w-full h-full" />
                </span>
                <Roll label="B2G Portal" />
                <span className="sr-only">B2G Portal</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-muted transition-colors duration-300"
                >
                  <path d="m6 9.5 6 6 6-6" />
                </svg>
              </button>

              <div
                id="ig-b2g-menu"
                data-state={isB2GOpen ? "open" : "closed"}
                className="ig-drop absolute left-1/2 top-[calc(100%+6px)] -ml-[119px] w-[238px] rounded-xl border border-hairline bg-panel p-2 shadow-[0_14px_34px_-18px_rgba(13,27,61,.38)]"
              >
                {B2G_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsB2GOpen(false)}
                    className="block min-h-[44px] rounded-lg px-3 py-2.5 text-sm font-medium leading-snug text-bright no-underline transition-colors hover:bg-panel-hover hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--primary)]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="ig-item relative">
              <Link
                href="/faq"
                aria-current={isCurrent("/faq") ? "page" : undefined}
                className={LINK_CLS}
              >
                <span className={SLOT_CLS} aria-hidden="true">
                  <Icon name="faq" className="block w-full h-full" />
                </span>
                <Roll label="FAQ" />
                <span className="sr-only">FAQ</span>
              </Link>
            </div>
          </nav>

          {/* call to action, desktop */}
          <Link
            href="/contact"
            className="ml-[var(--ig-cta-ml)] hidden h-10 min-w-[44px] items-center gap-[7px] rounded-full bg-primary px-[var(--ig-cta-px)] font-semibold leading-none text-white no-underline whitespace-nowrap transition-colors duration-300 text-[length:var(--ig-link-fs)] hover:bg-[var(--primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--navy)] min-[1180px]:inline-flex"
          >
            Contact/Booking
            {CHEVRON}
          </Link>

          {/* burger */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="ig-mobile-nav"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((v) => !v)}
            className="ig-burger ml-auto flex h-[46px] w-[46px] cursor-pointer flex-col justify-center gap-[5px] rounded-[10px] border-0 bg-transparent px-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)] min-[1180px]:hidden"
          >
            <span className="block h-0.5 w-full rounded-sm bg-[var(--text-bright)]" />
            <span className="block h-0.5 w-full rounded-sm bg-[var(--text-bright)]" />
            <span className="block h-0.5 w-full rounded-sm bg-[var(--text-bright)]" />
          </button>
        </div>

        {/* mobile drawer */}
        <div
          id="ig-mobile-nav"
          data-state={isOpen ? "open" : "closed"}
          className="ig-drawer block border-t border-hairline bg-panel min-[1180px]:hidden"
        >
          <nav aria-label="Mobile" className="px-5 pb-[22px] pt-2.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={`${DRAWER_LINK_CLS} ${
                  isCurrent(link.href) ? "text-primary" : "text-bright"
                }`}
              >
                <Icon
                  name={link.icon}
                  className="h-5 w-5 shrink-0 text-primary"
                />
                {link.name}
              </Link>
            ))}

            {/* Portal links nest under one collapsible row so the
                drawer is not a flat 13-row list. */}
            <button
              type="button"
              aria-expanded={isDrawerB2GOpen}
              aria-controls="ig-drawer-b2g"
              onClick={() => setIsDrawerB2GOpen((v) => !v)}
              className={`${DRAWER_LINK_CLS} w-full cursor-pointer border-0 border-b border-hairline bg-transparent text-left text-bright`}
            >
              <Icon name="b2g" className="h-5 w-5 shrink-0 text-primary" />
              <span className="flex-1">B2G Portal</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${
                  isDrawerB2GOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9.5 6 6 6-6" />
              </svg>
            </button>

            <div
              id="ig-drawer-b2g"
              data-state={isDrawerB2GOpen ? "open" : "closed"}
              className="ig-collapse"
            >
              {B2G_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`${DRAWER_LINK_CLS} pl-9 text-[15px] ${
                    isCurrent(item.href) ? "text-primary" : "text-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <Link
              href="/faq"
              aria-current={isCurrent("/faq") ? "page" : undefined}
              onClick={() => setIsOpen(false)}
              className={`flex min-h-[48px] items-center gap-[13px] px-1 py-[13px] text-[17px] font-medium no-underline ${
                isCurrent("/faq") ? "text-primary" : "text-bright"
              }`}
            >
              <Icon name="faq" className="h-5 w-5 shrink-0 text-primary" />
              FAQ
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-4 flex h-[52px] w-full items-center justify-center rounded-full bg-primary font-semibold text-white no-underline transition-colors duration-300 hover:bg-[var(--primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--navy)]"
            >
              Contact/Booking
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
