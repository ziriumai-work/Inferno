"use client";

import React, { useEffect, useState } from "react";
import RevealOnMount from "@/components/RevealOnMount";
import { dataStore, LegalPage } from "@/utils/dataStore";

export default function ConductPage() {
  const [conduct, setConduct] = useState<LegalPage | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const refreshConduct = () => setConduct(dataStore.getLegalConduct());
    refreshConduct();
    setIsMounted(true);

    window.addEventListener("storage", refreshConduct);
    window.addEventListener("cms-update", refreshConduct);

    return () => {
      window.removeEventListener("storage", refreshConduct);
      window.removeEventListener("cms-update", refreshConduct);
    };
  }, []);

  if (!isMounted || !conduct) {
    return (
      <div className="page-view block text-center py-24 px-8">
        <h2>Loading Standards of Conduct...</h2>
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
      <section id="standards-of-conduct" className="max-w-[800px] mx-auto py-16 px-8">
        <RevealOnMount>
          <div className="section-eyebrow">Ethical Guidelines</div>
          <h1 className="section-title">{conduct.title}</h1>
          <p className="section-desc mb-12">
            The Inferno Group LLC guidelines regarding anti-kickback provisions, conflicts of interest, and procurement integrity.
          </p>
        </RevealOnMount>

        <RevealOnMount>
          <div 
            className="glow-card bg-[var(--glass)] border border-[var(--border)] rounded-[20px] p-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
          >
            <div className="flex flex-col gap-4">
              {renderContent(conduct.content)}
            </div>
          </div>
        </RevealOnMount>
      </section>
    </div>
  );
}
