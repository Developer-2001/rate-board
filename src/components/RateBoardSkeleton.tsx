"use client";

import {
  DEFAULT_RATE_BOARD_THEME_ID,
  RATE_BOARD_THEMES,
  type RateBoardThemeId,
} from "@/utils/rateBoardTheme";

type RateBoardSkeletonProps = {
  themeId?: RateBoardThemeId;
};

export default function RateBoardSkeleton({
  themeId = DEFAULT_RATE_BOARD_THEME_ID,
}: RateBoardSkeletonProps) {
  const theme = RATE_BOARD_THEMES[themeId];

  return (
    <div className={`min-h-screen ${theme.appBg} text-stone-100`}>
      <main className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1800px]">
        <section
          className={`relative flex w-full flex-col border p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-6 lg:p-6 ${theme.panelBorder} ${theme.surface}`}
        >
          <div className="absolute right-1 top-1 z-10">
            <div
              className={`h-7 w-7 animate-pulse rounded-lg border ${theme.topButton}`}
            />
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

          <div
            className={`mt-2 flex-1 overflow-hidden rounded-4xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${theme.panelBorder} ${theme.tableShell}`}
          >
            <div
              className={`grid grid-cols-[1.3fr_1fr_1fr] border-b px-4 py-4 ${theme.panelBorder} ${theme.tableHeader}`}
            >
              <div className="h-4 w-16 animate-pulse rounded bg-stone-950/20 sm:h-7 sm:w-24" />
              <div className="mx-auto h-4 w-14 animate-pulse rounded bg-stone-950/20 sm:h-7 sm:w-20" />
              <div className="ml-auto h-4 w-20 animate-pulse rounded bg-stone-950/20 sm:h-7 sm:w-28" />
            </div>

            <div className="divide-y divide-white/10">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[1.3fr_1fr_1fr] px-4 py-4 ${
                    index < 4
                      ? theme.goldRow
                      : theme.silverRow
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
