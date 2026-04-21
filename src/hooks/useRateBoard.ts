"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DisplayRateItem, RateBoardResponse, RawRateItem } from "@/types/rateBoard";

type UseRateBoardResult = {
  board: RateBoardResponse | null;
  rates: DisplayRateItem[];
  loading: boolean;
  error: string | null;
  hasFreshUpdate: boolean;
  lastChangedAt: Date | null;
  consecutiveFailures: number;
};

const POLL_INTERVAL_MS = 15000;
const FRESH_UPDATE_MS = 6000;

function normalizeMetalName(value: string) {
  if (value === "G") {
    return "Gold" as const;
  }

  return "Silver" as const;
}

function getRateLabel(item: RawRateItem) {
  const metal = normalizeMetalName(item.Metal_name);
  const suffix = item.Name?.trim() || `${item.Caret}K`;
  return `${metal} ${suffix}`.trim().replace(/\s+/g, " ");
}

function toDisplayRates(board: RateBoardResponse | null) {
  if (!board) {
    return [];
  }

  return board.data
    .filter((item) => item.Metal_name === "G" || item.Metal_name === "S")
    .filter((item) => item.Srate > 0 && item.Prate > 0)
    .map((item) => ({
      id: `${item.Metal_name}-${item.Caret}-${item.Name}`,
      metal: normalizeMetalName(item.Metal_name),
      label: getRateLabel(item),
      saleRate: item.Srate,
      purchaseRate: item.Prate,
      caret: item.Caret,
    }))
    .sort((left, right) => {
      if (left.metal !== right.metal) {
        return left.metal === "Gold" ? -1 : 1;
      }

      return right.caret - left.caret;
    });
}

export default function useRateBoard(clientId: string | null): UseRateBoardResult {
  const [board, setBoard] = useState<RateBoardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFreshUpdate, setHasFreshUpdate] = useState(false);
  const [lastChangedAt, setLastChangedAt] = useState<Date | null>(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const previousSignatureRef = useRef<string | null>(null);
  const freshUpdateTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!clientId) {
      previousSignatureRef.current = null;
      queueMicrotask(() => {
        setBoard(null);
        setError("Client session is missing.");
        setLoading(false);
        setHasFreshUpdate(false);
        setLastChangedAt(null);
        setConsecutiveFailures(0);
      });
      return;
    }

    let isActive = true;
    previousSignatureRef.current = null;
    queueMicrotask(() => {
      setHasFreshUpdate(false);
      setLastChangedAt(null);
      setConsecutiveFailures(0);
    });

    const clearFreshUpdateTimer = () => {
      if (freshUpdateTimerRef.current !== null) {
        window.clearTimeout(freshUpdateTimerRef.current);
        freshUpdateTimerRef.current = null;
      }
    };

    const fetchBoard = async (isInitialLoad: boolean) => {
      try {
        if (isInitialLoad && isActive) {
          setLoading(true);
        }

        const response = await fetch(`/api/rate-board/${clientId}`, {
          method: "GET",
          cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || "Failed to fetch rate board data.");
        }

        if (!isActive) {
          return;
        }

        const nextBoard = payload.data as RateBoardResponse;
        const nextSignature = JSON.stringify(nextBoard.data);

        if (previousSignatureRef.current && previousSignatureRef.current !== nextSignature) {
          setHasFreshUpdate(true);
          setLastChangedAt(new Date());
          clearFreshUpdateTimer();
          freshUpdateTimerRef.current = window.setTimeout(() => {
            setHasFreshUpdate(false);
          }, FRESH_UPDATE_MS);
        } else if (!previousSignatureRef.current) {
          setLastChangedAt(new Date());
        }

        previousSignatureRef.current = nextSignature;
        setBoard(nextBoard);
        setError(null);
        setConsecutiveFailures(0);
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load live rates."
        );
        setConsecutiveFailures((current) => current + 1);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchBoard(true);
    const intervalId = window.setInterval(() => {
      fetchBoard(false);
    }, POLL_INTERVAL_MS);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      clearFreshUpdateTimer();
    };
  }, [clientId]);

  const rates = useMemo(() => toDisplayRates(board), [board]);

  return {
    board,
    rates,
    loading,
    error,
    hasFreshUpdate,
    lastChangedAt,
    consecutiveFailures,
  };
}
