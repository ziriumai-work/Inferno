"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console
    console.error("Segment Error Boundary caught exception:", error);
  }, [error]);

  return (
    <div 
      className="page-view flex flex-col justify-center items-center min-h-[75vh] text-center py-16 px-8"
    >
      <div 
        className="glow-card max-w-[520px] w-full py-14 px-10 rounded-[24px] border border-red-500/15 bg-[var(--glass)] backdrop-blur-xl flex flex-col items-center gap-6 shadow-[0_20px_40px_rgba(239,68,68,0.02)]"
      >
        <span 
          className="service-badge py-1 px-3 text-[0.7rem] bg-red-500/10 text-red-500 rounded font-[750] uppercase tracking-wider border border-red-500/20"
        >
          System Disrupted
        </span>

        <h1 
          className="font-[family-name:var(--font-space-grotesk)] text-[clamp(2rem,5vw,2.5rem)] font-black leading-tight m-0 text-[var(--text-bright)]"
        >
          Operations Interrupted
        </h1>

        <p 
          className="text-[var(--text-muted)] text-sm leading-[1.6] m-0 max-w-[420px]"
        >
          An unexpected exception has occurred in this operational segment. CAS parameters have been halted to safeguard grant alignment structures.
        </p>

        {/* Technical details logs section */}
        <div 
          className="w-full text-left bg-black/[0.02] border border-[var(--border)] rounded-lg p-4 text-xs font-mono text-[var(--text-muted)] max-h-[120px] overflow-y-auto break-all"
        >
          <div className="text-red-500 font-bold mb-1">EXCEPTION_LOG:</div>
          {error.message || "Unknown segment exception."}
          {error.digest && (
            <div className="mt-2 text-[0.7rem]">
              Digest ID: <span className="text-[var(--text-bright)]">{error.digest}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 w-full justify-center">
          <button 
            onClick={reset}
            className="btn btn-primary flex-[1_1_200px] justify-center text-[0.85rem] py-3 px-6 border border-transparent" 
          >
            Attempt Segment Recovery
          </button>
          <Link 
            href="/" 
            className="btn btn-secondary no-underline flex-[1_1_200px] justify-center text-[0.85rem] py-3 px-6" 
          >
            Abort to Command
          </Link>
        </div>
      </div>
    </div>
  );
}
