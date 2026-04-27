"use client";

import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/device/getDeviceId";

const LEGACY_FINGERPRINT_STORAGE_KEY = "fingerId";

function debugLog(message: string, payload?: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[device]", message, payload ?? "");
  }
}

export default function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveDeviceId = async () => {
      try {
        const nextDeviceId = await getDeviceId();

        try {
          window.localStorage.setItem(LEGACY_FINGERPRINT_STORAGE_KEY, nextDeviceId);
        } catch (error) {
          debugLog("Failed to mirror device ID into legacy localStorage key.", error);
        }

        if (isMounted) {
          setDeviceId(nextDeviceId);
        }
      } catch (error) {
        debugLog("Failed to resolve device ID.", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    resolveDeviceId();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    deviceId,
    loading,
  };
}
