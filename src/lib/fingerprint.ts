import { generateDeviceFingerprint } from "@/utils/fingerprint";

const FINGERPRINT_STORAGE_KEY = "fingerId";

let fingerprintPromise: Promise<string> | null = null;

function debugLog(message: string, payload?: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[device]", message, payload ?? "");
  }
}

export async function getFingerprintId(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("getFingerprintId() can only be called in the browser.");
  }

  fingerprintPromise ??= (async () => {
    try {
      const storedFingerprintId = window.localStorage.getItem(FINGERPRINT_STORAGE_KEY);
      if (storedFingerprintId) {
        debugLog("Using stored web fingerprint ID.", storedFingerprintId);
        return storedFingerprintId;
      }
    } catch (error) {
      debugLog("Failed to read stored web fingerprint ID.", error);
    }

    const { fingerprint } = await generateDeviceFingerprint();

    try {
      window.localStorage.setItem(FINGERPRINT_STORAGE_KEY, fingerprint);
    } catch (error) {
      debugLog("Failed to persist web fingerprint ID.", error);
    }

    debugLog("Generated new web fingerprint ID.", fingerprint);
    return fingerprint;
  })();

  return fingerprintPromise;
}
