"use client";

import React, { useEffect, useState } from "react";
import RevealOnMount from "@/components/RevealOnMount";
import { dataStore, LegalPage } from "@/utils/dataStore";

export default function PrivacyPage() {
  const [privacy, setPrivacy] = useState<LegalPage | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const refreshPrivacy = () => setPrivacy(dataStore.getLegalPrivacy());
    refreshPrivacy();
    setIsMounted(true);

    window.addEventListener("storage", refreshPrivacy);
    window.addEventListener("cms-update", refreshPrivacy);

    return () => {
      window.removeEventListener("storage", refreshPrivacy);
      window.removeEventListener("cms-update", refreshPrivacy);
    };
  }, []);

  if (!isMounted || !privacy) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Loading Privacy Statement...</h2>
      </div>
    );
  }

  // Simple markdown renderer to make headers look beautiful
  const renderContent = (text: string) => {
    return text.split("\n\n").map((block, idx) => {
      if (block.startsWith("###")) {
        return (
          <h3 
            key={idx} 
            className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-[750] mt-8 mb-3 text-[var(--text-bright)]"
          >
            {block.replace("###", "").trim()}
          </h3>
        );
      }
      return (
        <p key={idx} className="text-[var(--text-muted)] text-[0.95rem] leading-[1.7] mb-4">
          {block}
        </p>
      );
    });
  };

  return (
    <div className="page-view block">
      <section id="privacy-policy" className="max-w-[800px] mx-auto py-16 px-8">
        <RevealOnMount>
          <div className="section-eyebrow">Regulatory Compliance</div>
          <h1 className="section-title">{privacy.title}</h1>
          <p className="section-desc mb-12">
            The Inferno Group LLC data encryption protocols and PII protection standard parameters.
          </p>
        </RevealOnMount>

        <RevealOnMount>
          <div 
            className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
          >
            <div className="flex flex-col gap-4">
              {renderContent(privacy.content)}
            </div>
          </div>
        </RevealOnMount>
      </section>
    </div>
  );
}
