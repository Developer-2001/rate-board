"use client";

import { useTheme } from "@/context/ThemeContext";
import { RATE_BOARD_THEMES, RateBoardThemeId } from "@/utils/rateBoardTheme";

type RateBoardSkeletonProps = {
  themeId?: RateBoardThemeId;
};

export default function RateBoardSkeleton({ themeId }: RateBoardSkeletonProps) {
  const { theme: globalTheme } = useTheme();
  const theme = themeId ? RATE_BOARD_THEMES[themeId] : globalTheme;

  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-hidden ${theme.appBg}`}
      style={{ color: theme.text, fontFamily: theme.fontBody }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-90">
          <div className={`absolute inset-0 ${theme.surface}`} />
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

          <p
            className={`mt-3 text-sm font-medium uppercase tracking-[0.28em] ${theme.mutedText}`}
          >
            Please wait while we prepare the live rate board
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={`h-2.5 w-2.5 animate-bounce rounded-full ${theme.headingAccent.replace("text-", "bg-")}`}
            />
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

          <div
            className={`mt-6 text-xs font-semibold uppercase tracking-[0.3em] ${theme.mutedText}`}
          >
            Selected Theme: {theme.name}
          </div>
        </section>
      </main>
    </div>
  );
}
