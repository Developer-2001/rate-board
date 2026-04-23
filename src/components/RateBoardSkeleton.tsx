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
    <div
      className={`relative flex min-h-screen flex-col overflow-hidden ${theme.appBg} text-stone-100`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-90">
          <div className={`absolute inset-0 ${theme.surface}`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%)]" />
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.16),transparent_68%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_72%)]" />
        </div>
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center p-6">
        <section
          className={`w-full max-w-xl rounded-[28px] border px-8 py-10 text-center shadow-[0_40px_120px_rgba(0,0,0,0.45)] ${theme.panelBorder} ${theme.surface}`}
        >
          <div className="mx-auto flex w-fit items-center justify-center rounded-full border border-white/10 bg-black/15 px-4 py-1">
            <span
              className={`h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.75)]`}
            />
            <span
              className={`ml-3 text-xs font-extrabold uppercase tracking-[0.38em] ${theme.liveText}`}
            >
              Loading Board
            </span>
          </div>

          <div className="mx-auto mt-6 h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-current text-inherit" />

          <h2
            className={`mt-6 text-3xl font-extrabold uppercase tracking-[0.18em] ${theme.headingAccent}`}
          >
            Getting Rates
          </h2>

          <p className={`mt-3 text-sm font-medium uppercase tracking-[0.28em] ${theme.mutedText}`}>
            Please wait while we prepare the live rate board
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`h-2.5 w-2.5 animate-bounce rounded-full ${theme.headingAccent.replace("text-", "bg-")}`} />
            <span
              className={`h-2.5 w-2.5 animate-bounce rounded-full ${theme.headingAccent.replace("text-", "bg-")}`}
              style={{ animationDelay: "150ms" }}
            />
            <span
              className={`h-2.5 w-2.5 animate-bounce rounded-full ${theme.headingAccent.replace("text-", "bg-")}`}
              style={{ animationDelay: "300ms" }}
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-full bg-white/8">
            <div
              className={`h-2 rounded-full ${theme.tableHeader} animate-pulse`}
              style={{ width: "68%" }}
            />
          </div>

          <div className={`mt-6 text-xs font-semibold uppercase tracking-[0.3em] ${theme.mutedText}`}>
            Selected Theme: {theme.name}
          </div>
        </section>
      </main>
    </div>
  );
}
