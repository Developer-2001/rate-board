"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Expand,
  Minimize,
  Settings2,
} from "lucide-react";
import Alert from "@/components/modals/Alert";
import RateBoardSettingsDrawer from "@/components/RateBoardSettingsDrawer";
import RateBoardSkeleton from "@/components/RateBoardSkeleton";
import { useClient } from "@/context/ClientContext";
import useAuthBootstrap from "@/hooks/auth/useAuthBootstrap";
import useFingerprint from "@/hooks/auth/useFingerprint";
import useRateBoard from "@/hooks/useRateBoard";
import {
  DEFAULT_RATE_BOARD_THEME_ID,
  getStoredRateBoardThemeId,
  RATE_BOARD_THEMES,
  RATE_BOARD_THEME_STORAGE_KEY,
  type RateBoardThemeId,
} from "@/utils/rateBoardTheme";

const AUTO_RELOAD_FAILURE_COUNT = 4;

function formatBoardDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatBoardDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);
}

function formatBoardTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatBoardSeconds(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatRate(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function HomePage() {
  const router = useRouter();
  const fingerPrintId = useFingerprint();
  const { clientData, clearClientSession } = useClient();
  const { isBootstrapping } = useAuthBootstrap({
    fingerPrintId,
    router,
    mode: "home",
  });
  const [now, setNow] = useState(() => new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [themeId, setThemeId] = useState<RateBoardThemeId>(
    DEFAULT_RATE_BOARD_THEME_ID
  );
  const { board, rates, loading, error, hasFreshUpdate, consecutiveFailures } =
    useRateBoard(clientData?.ClientId ?? null);

  const theme = RATE_BOARD_THEMES[themeId];
  const themeOptions = Object.values(RATE_BOARD_THEMES);

  useEffect(() => {
    queueMicrotask(() => {
      setThemeId(getStoredRateBoardThemeId());
    });
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (consecutiveFailures < AUTO_RELOAD_FAILURE_COUNT) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      window.location.reload();
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [consecutiveFailures]);

  useEffect(() => {
    if (!error) {
      queueMicrotask(() => {
        setAlertMessage(null);
      });
      return;
    }

    const message =
      consecutiveFailures >= AUTO_RELOAD_FAILURE_COUNT
        ? `${error} Reloading display automatically...`
        : error;

    queueMicrotask(() => {
      setAlertMessage(message);
    });
  }, [consecutiveFailures, error]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "f") {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          return;
        }

        await document.documentElement.requestFullscreen();
      }

      if (event.key === "Escape") {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const groupedRates = useMemo(() => {
    return {
      gold: rates.filter((item) => item.metal === "Gold"),
      silver: rates.filter((item) => item.metal === "Silver"),
    };
  }, [rates]);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  };

  const handleThemeChange = (nextThemeId: RateBoardThemeId) => {
    setThemeId(nextThemeId);
    window.localStorage.setItem(RATE_BOARD_THEME_STORAGE_KEY, nextThemeId);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (logoutError) {
      console.error("Logout route failed, clearing local session only.", logoutError);
    } finally {
      clearClientSession();
      setIsSettingsOpen(false);
      setIsLoggingOut(false);
      router.replace("/corporateId");
    }
  };

  if (isBootstrapping) {
    return (
      <div className={`flex min-h-screen flex-col ${theme.appBg} text-stone-100`}>
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="rounded-2xl border border-amber-500/20 bg-stone-900 px-8 py-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-400" />
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
              Verifying session
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!clientData) {
    return <RateBoardSkeleton themeId={themeId} />;
  }

  if (loading && rates.length === 0) {
    return (
      <>
        <RateBoardSkeleton themeId={themeId} />
        {alertMessage && (
          <Alert
            title="error"
            message={alertMessage}
            onClose={() => setAlertMessage(null)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={`min-h-screen ${theme.appBg} text-stone-100`}>
        <main className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1800px]">
          <section
            className={`relative flex w-full flex-col border p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-6 lg:p-6 ${theme.panelBorder} ${theme.surface}`}
          >
            <div className="absolute right-1 top-1 z-10 flex gap-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition ${theme.topButton} ${theme.topButtonHover}`}
              >
                <Settings2 width={14} height={14} />
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition ${theme.topButton} ${theme.topButtonHover}`}
              >
                {isFullscreen ? (
                  <Minimize width={14} height={14} />
                ) : (
                  <Expand width={14} height={14} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 sm:grid-cols-3 lg:grid-cols-[260px_1fr_280px] lg:items-start lg:pt-2">
              <div>
                <p className="text-sm font-light tracking-tight text-white sm:text-xl xl:text-3xl">
                  {formatBoardDate(now)}
                </p>
                <p className={`text-xs font-light sm:text-lg xl:text-3xl ${theme.mutedText}`}>
                  {formatBoardDay(now)}
                </p>
              </div>

              <div className="text-center">
               
                <h1 className="text-sm font-semibold uppercase tracking-widest text-white sm:text-2xl xl:text-5xl">
                  Today&apos;s Rate
                </h1>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-sm font-light text-white sm:text-xl xl:text-3xl">
                  {formatBoardTime(now)}
                </p>
                <p className={`text-xs font-light tracking-[0.08em] sm:text-lg xl:text-3xl ${theme.mutedText}`}>
                  {formatBoardSeconds(now)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span
                className={`h-4 w-4 rounded-full ${
                  hasFreshUpdate
                    ? "animate-pulse bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]"
                    : "bg-emerald-500/80 shadow-[0_0_16px_rgba(16,185,129,0.55)]"
                }`}
              />
              <span
                className={`text-base font-semibold uppercase tracking-[0.32em] xl:text-sm ${theme.liveText}`}
              >
                Live
              </span>
            </div>

            <div
              className={`mt-2 flex-1 overflow-hidden rounded-4xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${theme.panelBorder} ${theme.tableShell}`}
            >
              <div
                className={`grid grid-cols-[1.3fr_1fr_1fr] border-b text-center text-md font-semibold uppercase tracking-[0.24em] sm:text-3xl xl:text-4xl ${theme.panelBorder} ${theme.tableHeader} ${theme.tableHeaderText}`}
              >
                <div className="border-r border-black/10 px-4 py-4">Metal</div>
                <div className="border-r border-black/10 px-4 py-4">Sale</div>
                <div className="px-4 py-4">Purchase</div>
              </div>

              <div className="divide-y divide-white/10">
                {groupedRates.gold.map((item) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-[1.3fr_1fr_1fr] ${theme.goldRow}`}
                  >
                    <div className="border-r border-white/10 px-4 py-4 text-center text-md font-medium uppercase sm:text-4xl xl:text-4xl">
                      {item.label}
                    </div>
                    <div
                      className={`border-r border-white/10 px-4 py-4 text-center text-md font-semibold sm:text-4xl xl:text-4xl ${theme.primaryValue}`}
                    >
                      {formatRate(item.saleRate)}
                    </div>
                    <div
                      className={`px-4 py-4 text-center text-md font-semibold sm:text-4xl xl:text-4xl ${theme.secondaryValue}`}
                    >
                      {formatRate(item.purchaseRate)}
                    </div>
                  </div>
                ))}

                {groupedRates.silver.map((item) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-[1.3fr_1fr_1fr] ${theme.silverRow}`}
                  >
                    <div className="border-r border-white/10 px-4 py-4 text-center text-md font-medium uppercase sm:text-4xl xl:text-4xl">
                      {item.label}
                    </div>
                    <div
                      className={`border-r border-white/10 px-4 py-4 text-center text-md font-semibold sm:text-4xl xl:text-4xl ${theme.primaryValue}`}
                    >
                      {formatRate(item.saleRate)}
                    </div>
                    <div
                      className={`px-4 py-4 text-center text-md font-semibold sm:text-4xl xl:text-4xl ${theme.secondaryValue}`}
                    >
                      {formatRate(item.purchaseRate)}
                    </div>
                  </div>
                ))}

                {!loading && rates.length === 0 && (
                  <div className={`px-6 py-12 text-center text-xl xl:text-3xl ${theme.mutedText}`}>
                    No gold or silver rates with non-zero sale and purchase values
                    are available.
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      <RateBoardSettingsDrawer
        open={isSettingsOpen}
        clientData={clientData}
        firmName={board?.firm_name}
        themes={themeOptions}
        selectedThemeId={themeId}
        onClose={() => setIsSettingsOpen(false)}
        onThemeChange={handleThemeChange}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {alertMessage && (
        <Alert
          title="error"
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
}
