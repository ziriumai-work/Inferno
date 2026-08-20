"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import RevealOnMount from "@/components/RevealOnMount";
import { dataStore, ServiceItem } from "@/utils/dataStore";

export default function ServicesPage() {
  const [servicesData, setServicesData] = useState<ServiceItem[]>([]);
  const [activeServiceId, setActiveServiceId] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const list = dataStore.getServices().filter((s) => s.status === "published");
    setServicesData(list);
    if (list.length > 0) {
      setActiveServiceId(list[0].id);
    }
    
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    const handleScroll = () => {
      if (list.length === 0) return;
      let currentId = list[0].id;
      let minDistance = Infinity;

      list.forEach((service) => {
        const el = document.getElementById(service.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - 200);
          if (distance < minDistance) {
            minDistance = distance;
            currentId = service.id;
          }
        }
      });

      setActiveServiceId(currentId);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // Accounts for navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
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
          <h2 className="section-title">Government &amp; Strategic Solutions</h2>
          <p className="section-desc">
            We handle public policy execution, strict procurement parameters, and large-scale emergency program compliance so you can focus on core mission delivery.
          </p>
        </RevealOnMount>

        {servicesData.length > 0 ? (
          <div className="services-container">
            {/* Sticky Sidebar Index */}
            <div className="services-sidebar">
              <ul className="services-menu">
                {servicesData.map((service) => (
                  <li key={service.id}>
                    <a
                      href={`#${service.id}`}
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
              {servicesData.map((service) => (
                <div
                  key={service.id}
                  className={`service-detail-section glow-card reveal ${isMounted ? "active" : ""}`}
                  id={service.id}
                  onMouseMove={handleCardMouseMove}
                >
                  <div className="card-content">
                    <span className="service-badge">{service.badge}</span>
                    <h3 className="service-card-title">{service.title}</h3>
                    {service.headline && (
                      <p className="text-[var(--primary)] text-[0.95rem] font-semibold mb-3">
                        {service.headline}
                      </p>
                    )}
                    <p className="service-card-desc">{service.desc}</p>
                    
                    <div className="service-sublist-title mt-6">What We Include</div>
                    <ul className="service-sublist mb-6">
                      {service.caps.map((cap, index) => (
                        <li key={index}>
                          <svg viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {cap}
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
                              className="bg-[rgba(225,77,24,0.06)] border border-[rgba(225,77,24,0.15)] text-[var(--text-main)] px-3 py-[0.3rem] rounded-full text-[0.78rem] font-semibold"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Profile Page Link */}
                    <div className="mt-8 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                      <Link 
                        href={`/services/${service.id}`} 
                        className="btn btn-secondary py-2 px-5 text-[0.85rem] no-underline inline-flex items-center justify-center gap-2"
                      >
                        View Full Profile
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                      <Link 
                        href={`/contact?service=${service.id}`} 
                        className="btn btn-primary py-2 px-5 text-[0.85rem] no-underline text-center justify-center"
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
          <div className="text-center p-16 text-[var(--text-muted)] bg-[var(--panel-dark)] border border-[var(--border)] rounded-2xl mt-8">
            No services currently published in directory.
          </div>
        )}
      </section>
    </div>
  );
}
