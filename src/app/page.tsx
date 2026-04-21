"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useFingerprint from "@/hooks/auth/useFingerprint";
import useAuthBootstrap from "@/hooks/auth/useAuthBootstrap";
import useRateBoard from "@/hooks/useRateBoard";
import { useClient } from "@/context/ClientContext";
import { Expand, Minimize } from "lucide-react";

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
  const { clientData } = useClient();
  const { isBootstrapping } = useAuthBootstrap({
    fingerPrintId,
    router,
    mode: "home",
  });
  const [now, setNow] = useState(() => new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { rates, loading, error, hasFreshUpdate, consecutiveFailures } =
    useRateBoard(clientData?.ClientId ?? null);

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
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "f") {
        return;
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
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

  if (isBootstrapping || !clientData) {
    return (
      <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
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

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 ">
      <main className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-450">
        <section className="relative flex w-full flex-col rounded-sm, border border-amber-500/20 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),rgba(28,25,23,0.99)_55%)] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-6 lg:p-6">
          <div className="absolute right-1 top-1 z-10 ">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-lg border border-white/10 cursor-pointer bg-stone-900/80 px-2 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300 transition hover:border-amber-300/40 hover:text-amber-200"
            >
              {isFullscreen ? (
                <Minimize width={14} height={14} />
              ) : (
                <Expand width={14} height={14} />
              )}
            </button>
          </div>

          <div className="grid gap-6 pt-10 sm:grid-cols-3 lg:grid-cols-[260px_1fr_280px] lg:items-start lg:pt-2">
            <div>
              <p className="text-4xl font-light tracking-tight text-white sm:text-xl xl:text-3xl">
                {formatBoardDate(now)}
              </p>
              <p className="text-3xl font-light text-stone-300 sm:text-lg xl:text-3xl">
                {formatBoardDay(now)}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.55em] text-amber-300">
                Rate Board
              </p>
              <h1 className="mt-1 text-5xl font-semibold uppercase tracking-widest text-white sm:text-2xl xl:text-5xl">
                Today&apos;s Rate
              </h1>
              {/* <p className="mt-2 text-lg uppercase tracking-[0.35em] text-stone-400 sm:text-xl xl:text-xl">
                {board?.firm_name}
              </p> */}
            </div>

            <div className="flex flex-col items-end">
              <p className="text-4xl font-light text-white sm:text-xl xl:text-3xl">
                {formatBoardTime(now)}
              </p>
              <p className="text-3xl font-light tracking-[0.08em] text-stone-300 sm:text-lg xl:text-3xl">
                {formatBoardSeconds(now)}
              </p>
              {/* <p className="mt-4 text-right text-sm uppercase tracking-[0.24em] text-stone-500 xl:text-base">
                Feed {board?.dt || "--"}
              </p>
              <p className="mt-1 text-right text-sm uppercase tracking-[0.24em] text-amber-300 xl:text-base">
                {hasFreshUpdate ? "Rates Updated" : "Monitoring Live"}
              </p> */}
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-5 py-4 text-lg text-rose-100">
              {error}
              {consecutiveFailures >= AUTO_RELOAD_FAILURE_COUNT && (
                <span className="ml-2 text-rose-200">
                  Reloading display automatically...
                </span>
              )}
            </div>
          )}

          <div className=" flex items-center justify-center gap-3">
            <span
              className={`h-4 w-4 rounded-full ${
                hasFreshUpdate
                  ? "animate-pulse bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]"
                  : "bg-emerald-500/80 shadow-[0_0_16px_rgba(16,185,129,0.55)]"
              }`}
            />
            <span className="text-base font-semibold uppercase tracking-[0.32em] text-emerald-300 xl:text-md">
              Live
            </span>
          </div>

          <div className="mt-2 flex-1 overflow-hidden rounded-4xl border border-amber-500/20 bg-[linear-gradient(180deg,rgba(35,29,23,0.92),rgba(24,21,19,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-amber-500/20 bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 text-center text-2xl font-semibold uppercase tracking-[0.24em] text-stone-950 sm:text-3xl xl:text-4xl">
              <div className="border-r border-stone-950/10 px-4 py-4">
                Metal
              </div>
              <div className="border-r border-stone-950/10 px-4 py-4">Sale</div>
              <div className="px-4 py-4">Purchase</div>
            </div>

            <div className="divide-y divide-amber-500/10">
              {groupedRates.gold.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.3fr_1fr_1fr] bg-[linear-gradient(90deg,rgba(68,57,40,0.92),rgba(49,40,31,0.88))] text-amber-50"
                >
                  <div className="border-r border-amber-500/10 text-center px-4 py-4 text-2xl font-medium uppercase   sm:text-4xl xl:text-4xl">
                    {item.label}
                  </div>
                  <div className="border-r border-amber-500/10 px-4 py-4 text-center text-2xl font-semibold text-amber-300   sm:text-4xl xl:text-4xl">
                    {formatRate(item.saleRate)}
                  </div>
                  <div className="px-4 py-4 text-center text-2xl font-semibold text-white   sm:text-4xl xl:text-4xl">
                    {formatRate(item.purchaseRate)}
                  </div>
                </div>
              ))}

              {groupedRates.silver.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.3fr_1fr_1fr] bg-[linear-gradient(90deg,rgba(47,47,50,0.95),rgba(34,34,37,0.9))] text-stone-100"
                >
                  <div className="border-r border-white/10 text-center px-4 py-4 text-2xl font-medium uppercase   sm:text-4xl xl:text-4xl">
                    {item.label}
                  </div>
                  <div className="border-r border-white/10 px-4 py-4 text-center text-2xl font-semibold text-stone-200   sm:text-4xl xl:text-4xl">
                    {formatRate(item.saleRate)}
                  </div>
                  <div className="px-4 py-4 text-center text-2xl font-semibold text-white   sm:text-4xl xl:text-4xl">
                    {formatRate(item.purchaseRate)}
                  </div>
                </div>
              ))}

              {!loading && rates.length === 0 && (
                <div className="px-6 py-12 text-center text-xl text-stone-300 xl:text-3xl">
                  No gold or silver rates with non-zero sale and purchase values
                  are available.
                </div>
              )}
            </div>
          </div>

          {/* <div className="mt-5 flex items-center justify-between gap-4 text-sm uppercase tracking-[0.24em] text-stone-500">
            <p>Press F for fullscreen</p>
            <p>{lastChangedAt ? `Last change ${lastChangedAt.toLocaleTimeString("en-IN")}` : "Waiting for live feed"}</p>
          </div> */}
        </section>
      </main>
    </div>
  );
}
