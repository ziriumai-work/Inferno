import Link from "next/link";

export default function NotFound() {
  return (
    <div 
      className="page-view flex flex-col justify-center items-center min-h-[75vh] text-center py-16 px-8"
    >
      <div 
        className="glow-card max-w-[520px] w-full py-14 px-10 rounded-[24px] border border-[var(--border)] bg-[var(--glass)] backdrop-blur-xl flex flex-col items-center gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
      >
        <span 
          className="service-badge py-1 px-3 text-[0.7rem] bg-[var(--primary-glow)] text-[var(--primary)] rounded font-[750] uppercase tracking-wider"
        >
          Error Code 404
        </span>

        <h1 
          className="font-[family-name:var(--font-space-grotesk)] text-[clamp(3.5rem,8vw,5.5rem)] font-black leading-none m-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent"
        >
          404
        </h1>

        <h3 
          className="font-[family-name:var(--font-space-grotesk)] text-[1.5rem] font-[750] text-[var(--text-bright)] m-0"
        >
          Mission Objective Offline
        </h3>

        <p 
          className="text-[var(--text-muted)] text-sm leading-[1.6] mt-0 mb-4 max-w-[420px]"
        >
          The coordinates you requested do not match our database registry. The page may have been relocated, or this route has not yet been registered.
        </p>

        <div className="flex flex-wrap gap-4 w-full justify-center">
          <Link 
            href="/" 
            className="btn btn-primary no-underline flex-[1_1_200px] justify-center text-[0.85rem] py-3 px-6 border border-transparent"
          >
            Return to Command
          </Link>
          <Link 
            href="/contact" 
            className="btn btn-secondary no-underline flex-[1_1_200px] justify-center text-[0.85rem] py-3 px-6"
          >
            Contact Ops Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
