"use client";

export default function RateBoardSkeleton() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <main className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-450">
        <section className="relative flex w-full flex-col border border-amber-500/20 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),rgba(28,25,23,0.99)_55%)] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-6 lg:p-6">
          <div className="absolute right-1 top-1 z-10">
            <div className="h-7 w-7 animate-pulse rounded-lg border border-white/10 bg-stone-900/80" />
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 sm:grid-cols-3 lg:grid-cols-[260px_1fr_280px] lg:items-start lg:pt-2">
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-white/10 sm:h-7 sm:w-28 xl:h-8" />
              <div className="h-3 w-16 animate-pulse rounded bg-white/10 sm:h-6 sm:w-24 xl:h-8" />
            </div>

            <div className="flex flex-col items-center">
              <div className="mt-1 h-5 w-28 animate-pulse rounded bg-white/10 sm:h-8 sm:w-44 xl:h-12" />
            </div>

            <div className="ml-auto space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-white/10 sm:h-7 sm:w-28 xl:h-8" />
              <div className="h-3 w-16 animate-pulse rounded bg-white/10 sm:h-6 sm:w-24 xl:h-8" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-4 w-4 animate-pulse rounded-full bg-emerald-400/40" />
            <div className="h-4 w-14 animate-pulse rounded bg-white/10" />
          </div>

          <div className="mt-2 flex-1 overflow-hidden rounded-4xl border border-amber-500/20 bg-[linear-gradient(180deg,rgba(35,29,23,0.92),rgba(24,21,19,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-amber-500/20 bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 px-4 py-4">
              <div className="h-4 w-16 animate-pulse rounded bg-stone-950/20 sm:h-7 sm:w-24" />
              <div className="mx-auto h-4 w-14 animate-pulse rounded bg-stone-950/20 sm:h-7 sm:w-20" />
              <div className="ml-auto h-4 w-20 animate-pulse rounded bg-stone-950/20 sm:h-7 sm:w-28" />
            </div>

            <div className="divide-y divide-amber-500/10">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[1.3fr_1fr_1fr] px-4 py-4 ${
                    index < 4
                      ? "bg-[linear-gradient(90deg,rgba(68,57,40,0.92),rgba(49,40,31,0.88))]"
                      : "bg-[linear-gradient(90deg,rgba(47,47,50,0.95),rgba(34,34,37,0.9))]"
                  }`}
                >
                  <div className="mx-auto h-4 w-24 animate-pulse rounded bg-white/10 sm:h-8 sm:w-40 xl:h-10" />
                  <div className="mx-auto h-4 w-20 animate-pulse rounded bg-white/10 sm:h-8 sm:w-28 xl:h-10" />
                  <div className="mx-auto h-4 w-20 animate-pulse rounded bg-white/10 sm:h-8 sm:w-28 xl:h-10" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
