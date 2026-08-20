export default function Loading() {
  return (
    <div 
      className="page-view flex flex-col justify-center items-center min-h-[70vh] text-center py-16 px-8"
    >
      <div 
        className="flex flex-col items-center gap-6"
      >
        {/* Premium Double Ring Spinner */}
        <div className="relative w-[80px] h-[80px]">
          <div 
            className="absolute inset-0 rounded-full border-3 border-transparent border-t-[var(--primary)] border-r-[var(--primary)] animate-[spin_1s_linear_infinite]"
          />
          <div 
            className="absolute inset-[8px] rounded-full border-3 border-transparent border-b-[var(--secondary)] border-l-[var(--secondary)] animate-[spin-reverse_1.2s_linear_infinite]"
          />
          {/* Glowing dot in center */}
          <div 
            className="absolute top-1/2 left-1/2 w-[12px] h-[12px] rounded-full bg-[var(--primary)] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_var(--primary)]"
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <h4 
            className="font-[family-name:var(--font-space-grotesk)] text-[1.25rem] font-[750] text-[var(--text-bright)] m-0 tracking-[0.5px]"
          >
            Establishing Secure Connection
          </h4>
          <p 
            className="text-[var(--text-muted)] text-[0.85rem] m-0 max-w-[280px] leading-[1.4]"
          >
            Acquiring operations parameters and syncing grant compliance databases...
          </p>
        </div>
      </div>

      {/* Spinner animation keyframes embedded inside styles to avoid layout shift */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
