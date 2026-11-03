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
          <span className="text-[1.05rem] sm:text-[1.2rem] font-bold tracking-tight text-[var(--text-bright)] leading-tight">
            THE INFERNO GROUP
          </span>
          <span className="text-[0.62rem] uppercase tracking-wider text-[var(--text-muted)] font-mono font-medium hidden sm:inline">
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

        {/* Mobile-only CTA Dropdown */}
        <li
          className="mobile-only-cta nav-cta-dropdown w-full flex flex-col items-center mt-6"
          onMouseEnter={() => setIsCtaDropdownOpen(true)}
          onMouseLeave={() => setIsCtaDropdownOpen(false)}
        >
          <button
            className="nav-cta nav-cta-trigger w-[80%] justify-center"
            onClick={() => setIsCtaDropdownOpen(!isCtaDropdownOpen)}
            aria-expanded={isCtaDropdownOpen}
          >
            <span>Contact/Book</span>
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
            className={`nav-cta-dropdown-menu mobile-cta-menu ${isCtaDropdownOpen ? "open" : ""}`}
          >
            <Link
              href="/contact"
              className="nav-dropdown-item"
              onClick={closeMenu}
            >
              <div className="font-semibold">Contact Us</div>
              <div className="text-xs text-[var(--text-muted)] mt-[2px]">
                Send inquiry or message
              </div>
            </Link>
            <Link
              href="/calendar"
              className="nav-dropdown-item"
              onClick={closeMenu}
            >
              <div className="font-semibold">Live Booking</div>
              <div className="text-xs text-[var(--text-muted)] mt-[2px]">
                Schedule a consultation slot
              </div>
            </Link>
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
