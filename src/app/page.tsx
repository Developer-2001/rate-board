"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Expand, Minimize, Settings2 } from "lucide-react";
import Alert from "@/components/modals/Alert";
import RateBoardSettingsDrawer from "@/components/RateBoardSettingsDrawer";
import RateBoardSkeleton from "@/components/RateBoardSkeleton";
import { useClient } from "@/context/ClientContext";
import useAuthBootstrap from "@/hooks/auth/useAuthBootstrap";
import useDeviceId from "@/hooks/auth/useDeviceId";
import useRateBoard from "@/hooks/useRateBoard";
import { logout } from "@/utils/authApi";
import {
  CURRENT_RATE_BOARD_THEME_DEFAULT_VERSION,
  DEFAULT_RATE_BOARD_THEME_ID,
  getStoredRateBoardThemeId,
  RATE_BOARD_THEMES,
  RATE_BOARD_THEME_DEFAULT_VERSION_STORAGE_KEY,
  RATE_BOARD_THEME_STORAGE_KEY,
  type RateBoardThemeId,
} from "@/utils/rateBoardTheme";

const AUTO_RELOAD_FAILURE_COUNT = 4;
const ALERT_TIMEOUT_MS = 5000;

function formatBoardDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

function formatBoardDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  })
    .format(date)
    .toUpperCase();
}

function formatBoardTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .toUpperCase();
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
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomePage() {
  const router = useRouter();
  const { deviceId } = useDeviceId();
  const { clientData, clearClientSession } = useClient();
  const { isBootstrapping } = useAuthBootstrap({
    deviceId,
    router,
    mode: "home",
  });
  const [now, setNow] = useState(() => new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [themeId, setThemeId] = useState<RateBoardThemeId>(
    DEFAULT_RATE_BOARD_THEME_ID,
  );
  const { board, rates, loading, error, hasFreshUpdate, consecutiveFailures } =
    useRateBoard(clientData?.ClientId ?? null);

  const theme = RATE_BOARD_THEMES[themeId];
  const themeOptions = Object.values(RATE_BOARD_THEMES);
  const rowCount = Math.max(rates.length, 1);
  const boardTitle = board?.firm_name?.trim() || "Jewellers";
  const boardRootStyle = {
    "--rows": rowCount,
  } as CSSProperties;

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
    if (!alertMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAlertMessage(null);
    }, ALERT_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [alertMessage]);

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

  useEffect(() => {
    let timeoutId = 0;

    const showButtons = () => {
      setShowFloatingButtons(true);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setShowFloatingButtons(false);
      }, 5000);
    };

    showButtons();
    window.addEventListener("mousemove", showButtons);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("mousemove", showButtons);
    };
  }, []);

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
    window.localStorage.setItem(
      RATE_BOARD_THEME_DEFAULT_VERSION_STORAGE_KEY,
      CURRENT_RATE_BOARD_THEME_DEFAULT_VERSION,
    );
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch (logoutError) {
      console.error("Logout failed, clearing local session only.", logoutError);
    } finally {
      clearClientSession();
      setIsSettingsOpen(false);
      setIsLoggingOut(false);
      router.replace("/corporateId");
    }
  };

  if (isBootstrapping) {
    return (
      <div
        className={`flex min-h-screen flex-col ${theme.appBg} text-stone-100`}
      >
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
      <div
        className={`relative h-screen overflow-hidden ${theme.appBg} text-stone-100`}
        style={boardRootStyle}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-90">
            <div className={`absolute inset-0 ${theme.surface}`} />
          </div>
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <main className="mx-auto flex min-h-0 w-full max-w-480 flex-1">
            <section
              className={`relative flex min-h-0 w-full flex-col overflow-hidden rounded-md border px-3 py-3 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:px-4 sm:py-4 lg:px-8 lg:py-3 ${theme.panelBorder} ${theme.surface}`}
            >
              <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-start gap-3 pb-3 sm:gap-4 sm:pb-5 lg:pb-2">
                <div className="min-w-0 self-center">
                  <p
                    suppressHydrationWarning
                    className={`text-[clamp(0.8rem,1.5vw,2rem)] font-extrabold uppercase tracking-[0.14em] ${theme.headingAccent}`}
                  >
                    {formatBoardDate(now)}
                  </p>
                  <p
                    suppressHydrationWarning
                    className={`text-[clamp(0.6rem,1.35vw,1.8rem)] font-semibold uppercase tracking-[0.12em] ${theme.mutedText}`}
                  >
                    {formatBoardDay(now)}
                  </p>
                </div>

                <div className="min-w-0 px-2 text-center">
                  <p
                    className={`${theme.headingAccent} text-[clamp(0.6rem,1.65vw,1.5rem)] italic uppercase tracking-[0.16em]`}
                    style={{ fontFamily: "var(--app-font-display)" }}
                  >
                    {boardTitle}
                  </p>
                  <h1
                    className={`${theme.headingAccent} text-[clamp(0.8rem,7vw,4rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] drop-shadow-[0_0_28px_rgba(251,191,36,0.22)]`}
                    style={{ fontFamily: "var(--app-font-display)" }}
                  >
                    Today&apos;s Rate
                  </h1>
                  <div className="mt-1 flex items-center justify-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        hasFreshUpdate
                          ? "animate-pulse bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]"
                          : "bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.6)]"
                      }`}
                    />
                    <span
                      className={`text-[clamp(0.8rem,1.2vw,1.4rem)] font-extrabold uppercase tracking-[0.35em] ${theme.liveText}`}
                    >
                      Live
                    </span>
                  </div>
                </div>

                <div className="min-w-0 self-center text-right">
                  <p
                    suppressHydrationWarning
                    className={`${theme.headingAccent} text-[clamp(0.8rem,2.35vw,2rem)] font-extrabold tracking-[0.04em]`}
                  >
                    {formatBoardTime(now)}
                  </p>
                  <p
                    suppressHydrationWarning
                    className={`text-[clamp(0.6rem,1.55vw,1.8rem)] font-semibold tracking-[0.12em] ${theme.mutedText}`}
                  >
                    {formatBoardSeconds(now)}
                  </p>
                </div>
              </header>

              <div className="flex min-h-0 flex-1 flex-col">
                <div
                  className={`grid h-[clamp(3.25rem,6vh,5.5rem)] shrink-0 grid-cols-[1.08fr_1fr_1fr] items-center rounded-t-[22px] border px-4 sm:px-6 lg:px-10 ${theme.panelBorder} ${theme.tableHeader}`}
                >
                  <div
                    className={`text-left text-[clamp(0.95rem,1.5vw,2rem)] font-extrabold uppercase tracking-[0.32em] ${theme.tableHeaderText}`}
                  >
                    Metal
                  </div>
                  <div
                    className={`text-center text-[clamp(0.95rem,1.5vw,2rem)] font-extrabold uppercase tracking-[0.32em] ${theme.tableHeaderText}`}
                  >
                    Sale
                  </div>
                  <div
                    className={`text-center text-[clamp(0.95rem,1.5vw,2rem)] font-extrabold uppercase tracking-[0.32em] ${theme.tableHeaderText}`}
                  >
                    Purchase
                  </div>
                </div>

                {rates.length > 0 ? (
                  <div
                    className={`grid min-h-0 flex-1 overflow-hidden rounded-b-[22px] border-x border-b ${theme.panelBorder} ${theme.tableShell}`}
                    style={{
                      gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
                    }}
                  >
                    {rates.map((item, index) => (
                      <div
                        key={item.id}
                        className={`grid min-h-0 grid-cols-[1.08fr_1fr_1fr] items-center px-2 sm:px-6 lg:px-6 ${
                          item.metal === "Gold"
                            ? theme.goldRow
                            : theme.silverRow
                        } ${index === rates.length - 1 ? "" : "border-b border-white/8"}`}
                        style={{
                          boxShadow:
                            index % 2 === 0
                              ? "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.18)"
                              : "inset 0 -1px 0 rgba(0,0,0,0.18)",
                        }}
                      >
                        <div
                          className="truncate pr-4 text-left text-[clamp(1.4rem,min(calc(62vh/var(--rows)),4.8vw),5.4rem)] font-extrabold uppercase leading-none tracking-[0.01em] text-inherit"
                          title={item.label}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-center text-[clamp(1.45rem,min(calc(66vh/var(--rows)),5vw),5.5rem)] font-extrabold leading-none tracking-[-0.03em] tabular-nums ${theme.primaryValue}`}
                        >
                          {formatRate(item.saleRate)}
                        </div>
                        <div
                          className={`text-center text-[clamp(1.45rem,min(calc(66vh/var(--rows)),5vw),5.5rem)] font-extrabold leading-none tracking-[-0.03em] tabular-nums ${theme.secondaryValue}`}
                        >
                          {formatRate(item.purchaseRate)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`flex min-h-0 flex-1 items-center justify-center rounded-b-[22px] border-x border-b px-6 text-center ${theme.panelBorder} ${theme.tableShell}`}
                  >
                    <p className={`text-xl font-semibold ${theme.mutedText}`}>
                      No gold or silver rates with non-zero sale and purchase
                      values are available.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      <div
        className={`fixed right-4 z-20 flex flex-col gap-2 transition-all duration-300 sm:right-6 ${
          showFloatingButtons
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
        style={{
          bottom: "calc(2.5rem + env(safe-area-inset-bottom))",
        }}
      >
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition ${theme.topButton} ${theme.topButtonHover}`}
        >
          <Settings2 width={24} height={24} />
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition ${theme.topButton} ${theme.topButtonHover}`}
        >
          {isFullscreen ? (
            <Minimize width={24} height={24} />
          ) : (
            <Expand width={24} height={24} />
          )}
        </button>
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
