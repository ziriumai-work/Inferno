"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCtaDropdownOpen, setIsCtaDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
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

  if (pathname?.startsWith("/admin")) {
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Capabilities", href: "/capabilities" },
    { name: "Hurricane Tracker", href: "/tracker" },
    { name: "Partnerships", href: "/partnerships" },
  ];

  const isHomePage = pathname === "/";

  return (
    <nav 
      id="navbar" 
      className={`${isScrolled ? "scrolled" : isHomePage ? "hero-nav-transparent" : ""}`}
    >
      <Link href="/" className="nav-logo" aria-label="The Inferno Group home" onClick={closeMenu}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpeg" alt="The Inferno Group Logo" />
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
                onClick={closeMenu}
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
            <Link href="/contracts" className="nav-dropdown-item" onClick={closeMenu}>
              Active Contracts
            </Link>
            <Link href="/quiz" className="nav-dropdown-item" onClick={closeMenu}>
              Eligibility Quiz
            </Link>
            <Link href="/careers" className="nav-dropdown-item" onClick={closeMenu}>
              Careers
            </Link>
            <Link href="/news" className="nav-dropdown-item" onClick={closeMenu}>
              News &amp; Insights
            </Link>
            <Link href="/resources" className="nav-dropdown-item" onClick={closeMenu}>
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
          <div className={`nav-cta-dropdown-menu mobile-cta-menu ${isCtaDropdownOpen ? "open" : ""}`}>
            <Link href="/contact" className="nav-dropdown-item" onClick={closeMenu}>
              <div className="font-semibold">Contact Us</div>
              <div className="text-xs text-[var(--text-muted)] mt-[2px]">Send inquiry or message</div>
            </Link>
            <Link href="/calendar" className="nav-dropdown-item" onClick={closeMenu}>
              <div className="font-semibold">Live Booking</div>
              <div className="text-xs text-[var(--text-muted)] mt-[2px]">Schedule a consultation slot</div>
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
        <div className={`nav-cta-dropdown-menu ${isCtaDropdownOpen ? "open" : ""}`}>
          <Link href="/contact" className="nav-dropdown-item" onClick={closeMenu}>
            <div className="font-semibold text-[var(--text-bright)]">Contact Us</div>
            <div className="text-xs text-[var(--text-muted)] mt-[2px]">Send inquiry or message</div>
          </Link>
          <Link href="/calendar" className="nav-dropdown-item" onClick={closeMenu}>
            <div className="font-semibold text-[var(--text-bright)]">Live Booking</div>
            <div className="text-xs text-[var(--text-muted)] mt-[2px]">Schedule a consultation slot</div>
          </Link>
        </div>
      </div>
    </nav>
  );

}
