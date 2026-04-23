"use client";

import { CapacitorHttp } from "@capacitor/core";
import { AuthApiError } from "@/utils/authApi";
import { getDesktopApi, isElectronApp, isNativeApp } from "@/utils/platform";

const RATE_BOARD_API_URL =
  "https://report-api-742717265610.asia-south1.run.app/api/Report/rate";

export async function fetchRateBoard(clientId: string) {
  if (isElectronApp()) {
    const response = await getDesktopApi().rateBoard.fetch(clientId);
    return response.data;
  }

  if (isNativeApp()) {
    const response = await CapacitorHttp.request({
      url: `${RATE_BOARD_API_URL}/Rate-${encodeURIComponent(clientId.trim())}`,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new AuthApiError("Failed to fetch rate board data.", response.status);
    }

    if (typeof response.data === "string") {
      return JSON.parse(response.data);
    }

    return response.data;
  }

  const response = await fetch(`/api/rate-board/${encodeURIComponent(clientId.trim())}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new AuthApiError(
      payload?.message || "Failed to fetch rate board data.",
      response.status
    );
  }

  const payload = (await response.json()) as {
    data: unknown;
  };

  return payload.data;
}
