import fs from "fs";
import { execSync } from "child_process";

const heroBuf = fs.readFileSync("public/hero-bg.jpg");
const heroBase64 = "data:image/jpeg;base64," + heroBuf.toString("base64");
const logoBuf = fs.readFileSync("public/logo.png");
const logoBase64 = "data:image/png;base64," + logoBuf.toString("base64");

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#070c18" stop-opacity="0.94"/>
      <stop offset="55%" stop-color="#070c18" stop-opacity="0.84"/>
      <stop offset="85%" stop-color="#0a1226" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="#0d1b3d" stop-opacity="0.55"/>
    </linearGradient>
    <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e14d18"/>
      <stop offset="100%" stop-color="#ff7b39"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14213d"/>
      <stop offset="100%" stop-color="#0d1b3d"/>
    </linearGradient>
    <clipPath id="logoClip">
      <rect x="70" y="55" width="60" height="60" rx="14"/>
    </clipPath>
  </defs>

  <!-- Background Image with Aspect Ratio Slice -->
  <image href="${heroBase64}" x="0" y="0" width="1200" height="630" preserveAspectRatio="xMidYMid slice"/>

  <!-- Dark Atmospheric Gradient Overlays -->
  <rect x="0" y="0" width="1200" height="630" fill="url(#bgGrad)"/>
  <rect x="0" y="0" width="1200" height="4" fill="url(#flameGrad)"/>

  <!-- Radial Glow Accents -->
  <circle cx="1100" cy="100" r="300" fill="#e14d18" opacity="0.12"/>
  <circle cx="100" cy="550" r="280" fill="#1a56c4" opacity="0.16"/>

  <!-- Header Section -->
  <g id="header">
    <image href="${logoBase64}" x="70" y="55" width="60" height="60" clip-path="url(#logoClip)"/>
    <rect x="70" y="55" width="60" height="60" rx="14" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

    <text x="146" y="80" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Space Grotesk', sans-serif" font-size="24" font-weight="800" letter-spacing="1.2">THE INFERNO GROUP LLC</text>
    <text x="146" y="104" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="500" letter-spacing="0.5">Government Consulting &amp; Emergency Management</text>

    <!-- Top-Right Federal Identifier Chip -->
    <rect x="880" y="60" width="250" height="42" rx="10" fill="#0d1933" stroke="rgba(225, 77, 24, 0.4)" stroke-width="1.2"/>
    <text x="1005" y="86" text-anchor="middle" fill="#e2e8f0" font-family="'JetBrains Mono', Menlo, Consolas, monospace" font-size="13" font-weight="700" letter-spacing="0.8">UEI: QW6RHJACHA56</text>
  </g>

  <!-- Hero Eyebrow Pill -->
  <rect x="70" y="165" width="455" height="34" rx="17" fill="rgba(225, 77, 24, 0.12)" stroke="rgba(225, 77, 24, 0.35)" stroke-width="1.2"/>
  <circle cx="86" cy="182" r="4.5" fill="#e14d18"/>
  <text x="100" y="187" fill="#ff7b39" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" font-weight="700" letter-spacing="1.2">EMERGENCY MANAGEMENT &amp; STRATEGIC ADVISORY</text>

  <!-- Hero Main Headline -->
  <text x="70" y="270" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Space Grotesk', sans-serif" font-size="64" font-weight="900" letter-spacing="-1">Where Crisis</text>
  <text x="70" y="342" fill="url(#flameGrad)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Space Grotesk', sans-serif" font-size="64" font-weight="900" letter-spacing="-1">Meets Command.</text>

  <!-- Subheadline Narrative -->
  <text x="70" y="396" fill="#cbd5e1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" letter-spacing="0.2">Practical consulting, disaster recovery execution, and small business</text>
  <text x="70" y="426" fill="#cbd5e1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" letter-spacing="0.2">growth solutions with high-stakes, measurable federal impact.</text>

  <!-- Socioeconomic & Credential Badges -->
  <g transform="translate(70, 468)">
    <!-- HUBZone Badge -->
    <rect x="0" y="0" width="220" height="42" rx="10" fill="url(#badgeGrad)" stroke="rgba(225, 77, 24, 0.45)" stroke-width="1.2"/>
    <circle cx="20" cy="21" r="5" fill="#e14d18"/>
    <text x="34" y="26" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="700">SBA HUBZone Certified</text>

    <!-- VOSB Badge -->
    <rect x="232" y="0" width="275" height="42" rx="10" fill="url(#badgeGrad)" stroke="rgba(26, 86, 196, 0.5)" stroke-width="1.2"/>
    <circle cx="252" cy="21" r="5" fill="#3b82f6"/>
    <text x="266" y="26" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="700">Veteran-Owned Small Business</text>

    <!-- Rapid Cadre Badge -->
    <rect x="519" y="0" width="240" height="42" rx="10" fill="url(#badgeGrad)" stroke="rgba(16, 185, 129, 0.45)" stroke-width="1.2"/>
    <circle cx="539" cy="21" r="5" fill="#10b981"/>
    <text x="553" y="26" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="700">Rapid Response Cadre</text>

    <!-- CAGE Badge -->
    <rect x="771" y="0" width="145" height="42" rx="10" fill="url(#badgeGrad)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.2"/>
    <text x="843" y="26" text-anchor="middle" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700">CAGE: 22VP2</text>
  </g>

  <!-- Bottom Divider Line -->
  <line x1="70" y1="550" x2="1130" y2="550" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>

  <!-- Footer Info Bar -->
  <text x="70" y="585" fill="#64748b" font-family="'JetBrains Mono', Menlo, Consolas, monospace" font-size="14" font-weight="500">https://www.theinfernogroup.com</text>
  <text x="1130" y="585" text-anchor="end" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="500">Orlando, Florida • Nationwide Deployment</text>
</svg>`;

fs.writeFileSync("/tmp/og-preview.svg", svg);
console.log("Wrote /tmp/og-preview.svg");

// Convert to PNG with sips
execSync("sips -s format png /tmp/og-preview.svg --out public/og-image.png");
execSync("cp public/og-image.png app/opengraph-image.png");
console.log("Successfully generated public/og-image.png and app/opengraph-image.png!");

