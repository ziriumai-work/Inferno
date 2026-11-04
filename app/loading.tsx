export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className="flex flex-col items-center justify-center min-h-[60vh] w-full py-16 px-6"
    >
      <div className="w-full max-w-[800px] flex flex-col gap-6 animate-pulse">
        {/* Eyebrow & Title Skeleton */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full w-32" />
          <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-3/4 max-w-[460px]" />
          <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-full max-w-[560px]" />
        </div>

        {/* Card Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="h-44 bg-zinc-100 dark:bg-zinc-900/60 border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
            </div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
          </div>
          <div className="h-44 bg-zinc-100 dark:bg-zinc-900/60 border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
            </div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
