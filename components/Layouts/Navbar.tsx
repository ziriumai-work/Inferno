"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dataStore, SiteSettings } from "@/utils/dataStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCtaDropdownOpen, setIsCtaDropdownOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const pathname = usePathname();

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

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 40;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    const previousOverflowY = document.body.style.overflowY;
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    }
    return () => {
      document.body.style.overflowY = previousOverflowY;
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    setIsCtaDropdownOpen(false);
  }, [pathname]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsDropdownOpen(false);
        setIsCtaDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/infernollc/admin")) {
    return null;
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsDropdownOpen(false);
      setIsCtaDropdownOpen(false);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    setIsCtaDropdownOpen(false);
  };

  const handleNavClick = (href: string) => {
    closeMenu();
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Capabilities", href: "/capabilities" },
    { name: "Hurricane Tracker", href: "/tracker" },
    { name: "Partnerships", href: "/partnerships" },
  ];

  return (
    <>
      {settings?.emergencyBannerActive && (
        <div className="fixed top-0 left-0 right-0 z-[1002] bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-lg">
          <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
          <span>{settings.emergencyBannerMessage}</span>
          {settings.emergencyHotline && (
            <a
              href={`tel:${settings.emergencyHotline}`}
              className="underline font-mono ml-2 text-amber-200 hover:text-white"
            >
              Hotline: {settings.emergencyHotline}
            </a>
          )}
        </div>
      )}
      <nav
        id="navbar"
        style={{
          top: settings?.emergencyBannerActive ? "36px" : "0px",
        }}
        className={`${isScrolled ? "scrolled" : "hero-nav-transparent"}`}
      >
      <Link
        href="/"
        className="nav-logo"
        aria-label="The Inferno Group home"
        onClick={() => handleNavClick("/")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="The Inferno Group Logo" />
        <span className="flex flex-col">
          <span className="text-[1rem] sm:text-[1.2rem] font-bold tracking-tight text-[var(--text-bright)] leading-tight">
            THE INFERNO GROUP
          </span>
          <span className="text-[0.56rem] sm:text-[0.62rem] uppercase tracking-wider text-[var(--text-muted)] font-mono font-semibold block">
            Government &amp; Commercial Consulting
          </span>
        </span>
      </Link>

      <button
        className={`hamburger ${isOpen ? "open" : ""}`}
        id="menu-btn"
        aria-label="Toggle menu"
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links ${isOpen ? "open" : ""}`} id="nav-menu">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.name}
              </Link>
            </li>
          );
        })}

        <li
          className="nav-dropdown"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button
            className="nav-dropdown-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-label="B2G Portal menu"
          >
            <span>B2G Portal</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`chevron-icon transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className={`nav-dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
            <Link
              href="/contracts"
              className="nav-dropdown-item"
              onClick={closeMenu}
            >
              Active Contracts
            </Link>
            <Link
              href="/quiz"
              className="nav-dropdown-item"
              onClick={closeMenu}
            >
              Eligibility Quiz
            </Link>
            <Link
              href="/careers"
              className="nav-dropdown-item"
              onClick={closeMenu}
            >
              Careers
            </Link>
            <Link
              href="/news"
              className="nav-dropdown-item"
              onClick={closeMenu}
            >
              News &amp; Insights
            </Link>
            <Link
              href="/resources"
              className="nav-dropdown-item"
              onClick={closeMenu}
            >
              Resources Center
            </Link>
          </div>
        </li>

        <li>
          <Link
            href="/faq"
            className={`nav-item ${pathname === "/faq" ? "active" : ""}`}
            onClick={closeMenu}
          >
            FAQ
          </Link>
        </li>

        {/* Mobile-only Direct CTAs & Credentials Badge */}
        <li className="mobile-only-cta w-full flex flex-col items-stretch gap-2.5 mt-4 px-3">
          <Link
            href="/contact"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#ff6b35] text-white font-semibold text-sm shadow-md active:scale-[0.98] transition-transform min-h-[46px]"
            onClick={closeMenu}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>Contact Operations Desk</span>
          </Link>
          <Link
            href="/calendar"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--navy)] text-white font-semibold text-sm border border-[var(--border)] shadow-sm active:scale-[0.98] transition-transform min-h-[46px]"
            onClick={closeMenu}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Book Consultation Slot</span>
          </Link>

          {/* Credentials footer note in mobile drawer */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] text-center">
            <div className="text-[11px] font-mono font-semibold tracking-wider text-[var(--secondary)] uppercase">
              HUBZone &amp; VOSB Certified
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
              UEI: QW6RHJACHA56 • CAGE: 22VP2
            </div>
          </div>
        </li>
      </ul>

      {/* Desktop-only CTA Dropdown */}
      <div
        className="desktop-only-cta nav-cta-dropdown"
        onMouseEnter={() => setIsCtaDropdownOpen(true)}
        onMouseLeave={() => setIsCtaDropdownOpen(false)}
      >
        <button
          className="nav-cta nav-cta-trigger"
          onClick={() => setIsCtaDropdownOpen(!isCtaDropdownOpen)}
          aria-expanded={isCtaDropdownOpen}
        >
          <span>Contact/Booking</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chevron-icon"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div
          className={`nav-cta-dropdown-menu ${isCtaDropdownOpen ? "open" : ""}`}
        >
          <Link
            href="/contact"
            className="nav-dropdown-item"
            onClick={closeMenu}
          >
            <div className="font-semibold text-[var(--text-bright)]">
              Contact Us
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-[2px]">
              Send inquiry or message
            </div>
          </Link>
          <Link
            href="/calendar"
            className="nav-dropdown-item"
            onClick={closeMenu}
          >
            <div className="font-semibold text-[var(--text-bright)]">
              Live Booking
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-[2px]">
              Schedule a consultation slot
            </div>
          </Link>
        </div>
      </div>
    </nav>
    </>
  );
}
