"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import { dataStore, ServiceItem } from "@/utils/dataStore";

export default function ServicesPage() {
  const [servicesData, setServicesData] = useState<ServiceItem[]>([]);
  const [activeServiceId, setActiveServiceId] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | "emergency" | "small-business">("all");
  const [isMounted, setIsMounted] = useState(false);

  const displayedServices = useMemo(() => {
    return servicesData.filter((service) => {
      if (filterCategory === "small-business") {
        return (
          service.id === "strategic-consulting-and-operational-excellence" ||
          service.id === "program-and-project-management" ||
          service.id === "contact-center-operations"
        );
      }
      if (filterCategory === "emergency") {
        return (
          service.id === "emergency-management-and-disaster-recovery" ||
          service.id === "planning-and-preparedness" ||
          service.id === "training-exercises-and-workforce-development" ||
          service.id === "facilities-logistics-and-specialty-services"
        );
      }
      return true;
    });
  }, [servicesData, filterCategory]);

  useEffect(() => {
    const refreshServices = () => {
      const list = dataStore.getServices().filter((s) => s.status === "published");
      setServicesData(list);
      if (list.length > 0) {
        setActiveServiceId((prev) => prev || list[0].id);
      }
    };

    refreshServices();
    
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    const handleScroll = () => {
      const list = dataStore.getServices().filter((s) => s.status === "published");
      if (list.length === 0) return;
      let currentId = list[0].id;
      let minDistance = Infinity;
      const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;
      const targetOffset = isMobile ? 160 : 200;

      list.forEach((service) => {
        const el = document.getElementById(service.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - targetOffset);
          if (distance < minDistance) {
            minDistance = distance;
            currentId = service.id;
          }
        }
      });

      setActiveServiceId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("storage", refreshServices);
    window.addEventListener("cms-update", refreshServices);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", refreshServices);
      window.removeEventListener("cms-update", refreshServices);
      clearTimeout(timer);
    };
  }, []);

  // Auto-scroll horizontal pill navigation on mobile to keep active tab centered
  useEffect(() => {
    if (!activeServiceId || typeof window === "undefined") return;
    if (window.innerWidth <= 1024) {
      const activeBtn = document.querySelector(
        `.services-menu-item[data-id="${activeServiceId}"]`
      ) as HTMLElement;
      const menuContainer = document.querySelector(".services-menu") as HTMLElement;
      if (activeBtn && menuContainer) {
        const btnLeft = activeBtn.offsetLeft;
        const btnWidth = activeBtn.offsetWidth;
        const containerWidth = menuContainer.offsetWidth;
        menuContainer.scrollTo({
          left: btnLeft - containerWidth / 2 + btnWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeServiceId]);

  const handleFilterChange = (category: "all" | "emergency" | "small-business") => {
    setFilterCategory(category);
    const filtered = servicesData.filter((service) => {
      if (category === "small-business") {
        return (
          service.id === "strategic-consulting-and-operational-excellence" ||
          service.id === "program-and-project-management" ||
          service.id === "contact-center-operations"
        );
      }
      if (category === "emergency") {
        return (
          service.id === "emergency-management-and-disaster-recovery" ||
          service.id === "planning-and-preparedness" ||
          service.id === "training-exercises-and-workforce-development" ||
          service.id === "facilities-logistics-and-specialty-services"
        );
      }
      return true;
    });
    if (filtered.length > 0) {
      setActiveServiceId(filtered[0].id);
    }
  };

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;
      const offset = isMobile ? 135 : 110;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveServiceId(id);
    }
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="page-view block">
      <section id="services">
        <RevealOnMount className={`reveal ${isMounted ? "active" : ""}`}>
          <div className="section-eyebrow">Services Directory</div>
          <h1 className="section-title">Government &amp; Commercial Solutions</h1>
          <p className="section-desc">
            Full-lifecycle emergency management and federal grant compliance, paired with strategic growth and revenue advisory for independent and small businesses.
          </p>

          {/* Solutions Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 mb-4">
            <button
              type="button"
              onClick={() => handleFilterChange("all")}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-[0.72rem] sm:text-xs font-bold transition-all min-h-[38px] ${
                filterCategory === "all"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "bg-[var(--glass)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-bright)]"
              }`}
            >
              All Capabilities ({servicesData.length})
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("small-business")}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-[0.72rem] sm:text-xs font-bold transition-all min-h-[38px] ${
                filterCategory === "small-business"
                  ? "bg-[var(--secondary)] text-white shadow-sm"
                  : "bg-[var(--glass)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-bright)]"
              }`}
            >
              Small Business &amp; Commercial Advisory
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("emergency")}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-[0.72rem] sm:text-xs font-bold transition-all min-h-[38px] ${
                filterCategory === "emergency"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "bg-[var(--glass)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-bright)]"
              }`}
            >
              Emergency Management &amp; Recovery
            </button>
          </div>
        </RevealOnMount>

        {displayedServices.length > 0 ? (
          <div className="services-container">
            {/* Sticky Sidebar / Mobile Horizontal Pill Bar */}
            <div className="services-sidebar">
              <ul className="services-menu">
                {displayedServices.map((service) => (
                  <li key={service.id} className="shrink-0">
                    <a
                      href={`#${service.id}`}
                      data-id={service.id}
                      onClick={(e) => handleMenuClick(e, service.id)}
                      className={`services-menu-item ${activeServiceId === service.id ? "active" : ""}`}
                    >
                      <span>{service.num}</span> {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Details Cards */}
            <div className="services-content-list">
              {displayedServices.map((service) => (
                <div
                  key={service.id}
                  className={`service-detail-section glow-card reveal ${isMounted ? "active" : ""}`}
                  id={service.id}
                  onMouseMove={handleCardMouseMove}
                >
                  <div className="card-content">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="service-badge">{service.badge}</span>
                      {service.id === "strategic-consulting-and-operational-excellence" && (
                        <span className="text-[0.68rem] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[rgba(26,86,196,0.1)] text-[var(--secondary)] border border-[rgba(26,86,196,0.25)]">
                          High Demand &middot; Small Business Advisory
                        </span>
                      )}
                    </div>
                    <h3 className="service-card-title break-words">{service.title}</h3>
                    {service.headline && (
                      <p className="text-[var(--primary)] text-[0.92rem] sm:text-[0.95rem] font-semibold mb-3 leading-snug">
                        {service.headline}
                      </p>
                    )}
                    <p className="service-card-desc">{service.desc}</p>
                    
                    <div className="service-sublist-title mt-6">What We Include</div>
                    <ul className="service-sublist mb-6">
                      {service.caps.map((cap, index) => (
                        <li key={index} className="break-words">
                          <svg viewBox="0 0 24 24" className="shrink-0">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>

                    {service.idealFor && service.idealFor.length > 0 && (
                      <div className="mt-6 border-t border-dashed border-[var(--border)] pt-5">
                        <div className="service-sublist-title mb-3">Ideal For</div>
                        <div className="flex flex-wrap gap-2">
                          {service.idealFor.map((item, idx) => (
                            <span 
                              key={idx} 
                              className="bg-[rgba(225,77,24,0.06)] border border-[rgba(225,77,24,0.15)] text-[var(--text-main)] px-2.5 sm:px-3 py-[0.3rem] rounded-full text-[0.72rem] sm:text-[0.78rem] font-semibold"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="mt-8 border-t border-[var(--border)] pt-5 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                      <Link 
                        href={`/services/${service.id}`} 
                        className="btn btn-secondary py-2.5 px-5 text-xs sm:text-[0.85rem] no-underline inline-flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        View Full Profile
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                      <Link 
                        href={`/contact?service=${service.id}`} 
                        className="btn btn-primary py-2.5 px-5 text-xs sm:text-[0.85rem] no-underline text-center justify-center min-h-[44px]"
                      >
                        Initiate Handshake
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-12 sm:p-16 text-[var(--text-muted)] bg-[var(--panel-dark)] border border-[var(--border)] rounded-2xl mt-8">
            No services currently match the selected classification.
          </div>
        )}
      </section>
    </div>
  );
}
