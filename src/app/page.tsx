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
import useRateBoard, {
  RATE_BOARD_POLL_INTERVAL_MS,
} from "@/hooks/useRateBoard";
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

function formatBoardTimeWithSeconds(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
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

function getMetalDisplay(label: string, metal: "Gold" | "Silver") {
  if (metal === "Gold") {
    const karat = label
      .replace(/gold/gi, "")
      .trim()
      .replace(/\s+/g, " ");

    return {
      title: karat || label,
      suffix: "GOLD",
    };
  }

  const silverLabel = label
    .replace(/silver/gi, "")
    .trim()
    .replace(/\s+/g, " ");

  return {
    title: "SILVER",
    suffix: silverLabel || "PURE",
  };
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
    background: theme.bg,
    color: theme.text,
    fontFamily: theme.fontBody,
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
      }, 2000);
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
        className="relative h-screen overflow-hidden"
        style={boardRootStyle}
      >
        <div
          className="pointer-events-none absolute -right-[10%] -top-[20%] h-[60%] w-[60%] rounded-full"
          style={{
            background: `radial-gradient(circle, ${theme.accent}14 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex h-full flex-col">
          <main className="mx-auto flex min-h-0 w-full max-w-[1920px] flex-1">
            <section
              className="relative flex min-h-0 w-full flex-col overflow-hidden px-[clamp(1rem,4.6vw,3rem)] py-[clamp(1rem,6.6vh,2.5rem)]"
            >
              <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-start gap-3">
                <div
                  className="min-w-0"
                  style={{ minWidth: "clamp(7rem, 15vw, 15rem)" }}
                >
                  <p
                    suppressHydrationWarning
                    className="text-[clamp(0.68rem,1.28vw,1.45rem)] font-medium uppercase leading-none tracking-[0.15em]"
                    style={{
                      color: theme.text,
                      fontFamily: theme.fontBody,
                    }}
                  >
                    {formatBoardDate(now)}
                  </p>
                  <p
                    suppressHydrationWarning
                    className="mt-0.5 text-[clamp(0.58rem,1.1vw,1.2rem)] uppercase tracking-[0.2em]"
                    style={{ color: theme.textDim }}
                  >
                    {formatBoardDay(now)}
                  </p>
                </div>

                <div className="min-w-0 px-2 text-center">
                  <p
                    className="text-[clamp(0.55rem,1.05vw,1.05rem)] font-semibold uppercase tracking-[0.35em]"
                    style={{ color: theme.accent }}
                  >
                    {boardTitle}
                  </p>
                  <h1
                    className="mt-0.5 whitespace-nowrap text-[clamp(1.4rem,3.35vw,4.25rem)] font-bold uppercase leading-none tracking-[0.04em]"
                    style={{
                      color: theme.text,
                      fontFamily: theme.fontHead,
                    }}
                  >
                    Today&apos;s Rate
                  </h1>
                  <div className="mt-2 flex items-center justify-center gap-3">
                     <span
                        className={`relative z-1 h-[clamp(0.38rem,0.75vw,0.55rem)] w-[clamp(0.38rem,0.75vw,0.55rem)] rounded-full ${
                          hasFreshUpdate
                            ? "animate-pulse"
                            : "animate-[ratePulse_2s_ease-in-out_infinite]"
                        }`}
                        style={{
                          background: theme.liveDot || "#e04040",
                          boxShadow: `0 0 8px ${theme.liveDot || "#e04040"}aa`,
                        }}
                      />
                      <span
                        className="relative z-1 text-[clamp(0.48rem,0.95vw,0.9rem)] font-semibold uppercase tracking-[0.3em]"
                      >
                        Live
                      </span>
                  </div>
                </div>

                <div className="min-w-0 text-right">
                  <p
                    suppressHydrationWarning
                    className="text-[clamp(0.68rem,1.28vw,1.45rem)] font-medium uppercase leading-none tracking-[0.15em]"
                    style={{
                      color: theme.text,
                      fontFamily: theme.fontBody,
                    }}
                  >
                    {formatBoardTime(now)}
                  </p>
                  <p
                    suppressHydrationWarning
                    className="mt-[clamp(0.18rem,0.55vh,0.45rem)] pr-[0.12em] text-[clamp(0.72rem,1.35vw,1.45rem)] leading-none tracking-[0.15em] tabular-nums"
                    style={{
                      color: theme.textDim,
                      fontFamily: theme.fontBody,
                    }}
                  >
                    {formatBoardTimeWithSeconds(now)}
                  </p>
                </div>
              </header>

              <div
                className="my-[clamp(0.9rem,2.8vh,2rem)] h-px shrink-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.accent}66, transparent)`,
                }}
              />

              <div className="flex min-h-0 flex-1 flex-col">
                <div
                  className="grid shrink-0 grid-cols-[1.4fr_1fr_1fr] items-center rounded-[clamp(0.35rem,0.8vw,0.5rem)] px-[clamp(1rem,2.3vw,1.5rem)] py-[clamp(0.62rem,1.75vh,0.85rem)]"
                  style={{ background: theme.headerBg }}
                >
                  <div
                    className="text-left text-[clamp(0.58rem,1vw,1rem)] font-semibold uppercase tracking-[0.25em]"
                    style={{ color: theme.accent }}
                  >
                    Metal
                  </div>
                  <div
                    className="text-right text-[clamp(0.58rem,1vw,1rem)] font-semibold uppercase tracking-[0.25em]"
                    style={{ color: theme.accent }}
                  >
                    Sale
                  </div>
                  <div
                    className="text-right text-[clamp(0.58rem,1vw,1rem)] font-semibold uppercase tracking-[0.25em]"
                    style={{ color: theme.accent }}
                  >
                    Purchase
                  </div>
                </div>

                {rates.length > 0 ? (
                  <div
                    className="mt-1 flex min-h-0 flex-1 flex-col gap-[clamp(0.08rem,0.35vh,0.18rem)] overflow-hidden"
                  >
                    {rates.map((item, index) => {
                      const metalDisplay = getMetalDisplay(item.label, item.metal);
                      const isSilver = item.metal === "Silver";
                      const startsSilver =
                        isSilver && rates[index - 1]?.metal !== "Silver";

                      return (
                        <div
                          key={item.id}
                          className="grid min-h-0 grid-cols-[1.4fr_1fr_1fr] items-center rounded-[clamp(0.25rem,0.6vw,0.4rem)] px-[clamp(1rem,2.3vw,1.5rem)] py-[clamp(0.7rem,min(calc(48vh/var(--rows)),2.3vw),1.15rem)]"
                          style={{
                            background: index % 2 === 0 ? theme.rowAlt : "transparent",
                            marginTop: startsSilver
                              ? "clamp(0.3rem, 1.2vh, 0.65rem)"
                              : undefined,
                            boxShadow: startsSilver
                              ? `0 -1px 0 ${theme.border}`
                              : undefined,
                          }}
                        >
                          <div
                            className="min-w-0 truncate pr-4 text-left leading-none"
                            title={item.label}
                          >
                            <span
                              className="align-baseline text-[clamp(1.12rem,min(calc(44vh/var(--rows)),2.4vw),2.65rem)] font-bold uppercase tracking-[0.02em]"
                              style={{
                                color: theme.text,
                                fontFamily: theme.fontBody,
                              }}
                            >
                              {metalDisplay.title}
                            </span>
                            <span
                              className="ml-2 align-baseline text-[clamp(0.62rem,1.15vw,1.15rem)] font-normal uppercase tracking-[0.06em]"
                              style={{
                                color: isSilver
                                  ? theme.textDim
                                  : theme.goldLabel || theme.textDim,
                                fontFamily: theme.fontBody,
                              }}
                            >
                              {metalDisplay.suffix}
                            </span>
                          </div>
                          <div
                            className="text-right text-[clamp(1.12rem,min(calc(44vh/var(--rows)),2.35vw),2.65rem)] font-semibold leading-none tabular-nums"
                            style={{
                              color: theme.text,
                            }}
                          >
                            ₹{formatRate(item.saleRate)}
                          </div>
                          <div
                            className="text-right text-[clamp(1.12rem,min(calc(44vh/var(--rows)),2.35vw),2.65rem)] font-semibold leading-none tabular-nums"
                            style={{
                              color: theme.text,
                            }}
                          >
                            ₹{formatRate(item.purchaseRate)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="flex min-h-0 flex-1 items-center justify-center rounded-md px-6 text-center"
                    style={{
                      background: theme.rowAlt,
                      color: theme.textDim,
                    }}
                  >
                    <p className="text-xl font-semibold">
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
