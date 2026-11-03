export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className="relative flex flex-col justify-center items-center min-h-[calc(100vh-220px)] w-full py-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Ambient background brand halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] bg-[radial-gradient(circle,rgba(225,77,24,0.08)_0%,rgba(26,86,196,0.05)_50%,transparent_70%)] pointer-events-none rounded-full blur-2xl" />

      {/* Centered Glassmorphism Status Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-3xl bg-white/80 border border-[var(--border)] shadow-[0_20px_50px_rgba(13,27,61,0.08)] backdrop-blur-xl p-8 sm:p-9 flex flex-col items-center text-center transition-all">
        {/* Ops Security Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(225,77,24,0.06)] border border-[rgba(225,77,24,0.2)] mb-7">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[0.68rem] font-bold tracking-widest uppercase text-[var(--primary)] font-[family-name:var(--font-jetbrains-mono)]">
            SECURE PORTAL SYNC
          </span>
        </div>

        {/* Brand Radar Orbit Animation */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Outer primary spinner ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--primary)] border-r-[var(--primary)]/60 animate-spin" />

          {/* Reverse counter-rotating secondary ring */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[var(--secondary)] border-l-[var(--secondary)]/60 animate-[spin_2s_linear_infinite_reverse]" />

          {/* Soft pulsing inner glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[rgba(225,77,24,0.12)] to-[rgba(26,86,196,0.12)] animate-pulse" />

          {/* Centered Brand Emblem */}
          <div className="relative z-10 w-11 h-11 rounded-2xl bg-white shadow-md border border-[var(--border)] flex items-center justify-center p-1.5 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Inferno Brand"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Headline & Details */}
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg sm:text-xl font-bold text-[var(--text-bright)] tracking-tight mb-2">
          Establishing Secure Connection
        </h3>
        <p className="text-xs sm:text-[0.82rem] text-[var(--text-muted)] leading-relaxed max-w-[320px] mb-6">
          Synchronizing emergency management dispatch matrices, FEMA data feeds, and compliance parameters...
        </p>

        {/* Shimmering Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-6 border border-slate-200/80">
          <div className="h-full bg-gradient-to-r from-[var(--primary)] via-amber-500 to-[var(--secondary)] rounded-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Skeleton Telemetry Pills */}
        <div className="w-full space-y-2 pt-2 border-t border-[var(--border)]/70">
          <div className="flex items-center justify-between text-[0.7rem] text-[var(--text-muted)] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
              Contract Pipeline
            </span>
            <span className="text-[var(--text-bright)] font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between text-[0.7rem] text-[var(--text-muted)] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] animate-pulse" />
              NOAA Radar Tracker
            </span>
            <span className="text-[var(--text-bright)] font-semibold">Standby</span>
          </div>
        </div>
      </div>
    </div>
  );
}
