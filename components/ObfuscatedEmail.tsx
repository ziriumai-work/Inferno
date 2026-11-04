"use client";

import React, { useState } from "react";

interface ObfuscatedEmailProps {
  email?: string;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

// Encode email into HTML entity codes for crawler protection
function encodeEntities(str: string): string {
  return str
    .split("")
    .map((c) => `&#${c.charCodeAt(0)};`)
    .join("");
}

export default function ObfuscatedEmail({
  email = "InfernoCares@theinfernogroup.com",
  label,
  className = "text-[var(--primary)] font-bold hover:underline",
  showIcon = false,
}: ObfuscatedEmailProps) {
  const [revealed, setRevealed] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setRevealed(true);
    window.location.href = `mailto:${email}`;
  };

  return (
    <a
      href={revealed ? `mailto:${email}` : "#"}
      onClick={handleClick}
      className={className}
      aria-label={`Email ${email.replace("@", " at ").replace(/\./g, " dot ")}`}
      title="Click to reveal and send email"
    >
      {showIcon && (
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="inline mr-1 align-text-bottom"
          aria-hidden="true"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      )}
      {label ? (
        label
      ) : revealed ? (
        email
      ) : (
        <span
          dangerouslySetInnerHTML={{ __html: encodeEntities(email) }}
        />
      )}
    </a>
  );
}

