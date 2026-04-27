import { Preferences } from "@capacitor/preferences";
import { v4 as uuidv4 } from "uuid";
import { getFingerprintId } from "@/lib/fingerprint";
import { getPlatform, type DevicePlatform } from "@/lib/device/platform";

const CAPACITOR_DEVICE_ID_KEY = "device_id";

type DeviceSource = "fingerprint" | "uuid";

type DeviceInfo = {
  deviceId: string;
  platform: DevicePlatform;
};

let deviceInfoPromise: Promise<DeviceInfo> | null = null;
let capacitorFallbackDeviceId: string | null = null;
let electronFallbackDeviceId: string | null = null;

function debugLog(message: string, payload?: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[device]", message, payload ?? "");
  }
}

function getSource(platform: DevicePlatform): DeviceSource {
  return platform === "web" ? "fingerprint" : "uuid";
}

async function getElectronDeviceId() {
  if (typeof window === "undefined" || !window.electron?.getDeviceId) {
    if (!electronFallbackDeviceId) {
      electronFallbackDeviceId = uuidv4();
    }

    debugLog("Electron bridge unavailable, using in-memory fallback UUID.", electronFallbackDeviceId);
    return electronFallbackDeviceId;
  }

  try {
    const deviceId = await window.electron.getDeviceId();
    debugLog("Resolved Electron device ID from main process.", deviceId);
    return deviceId;
  } catch (error) {
    if (!electronFallbackDeviceId) {
      electronFallbackDeviceId = uuidv4();
    }

    debugLog("Electron store lookup failed, using in-memory fallback UUID.", error);
    return electronFallbackDeviceId;
  }
}

async function getCapacitorDeviceId() {
  try {
    const stored = await Preferences.get({ key: CAPACITOR_DEVICE_ID_KEY });
    if (stored.value) {
      debugLog("Using stored Capacitor device ID.", stored.value);
      return stored.value;
    }
  } catch (error) {
    debugLog("Failed to read Capacitor device ID from Preferences.", error);
  }

  const generatedDeviceId = uuidv4();

  try {
    await Preferences.set({
      key: CAPACITOR_DEVICE_ID_KEY,
      value: generatedDeviceId,
    });

    debugLog("Stored new Capacitor device ID.", generatedDeviceId);
    return generatedDeviceId;
  } catch (error) {
    capacitorFallbackDeviceId ??= generatedDeviceId;
    debugLog("Failed to persist Capacitor device ID, using in-memory fallback UUID.", error);
    return capacitorFallbackDeviceId;
  }
}

async function resolveDeviceInfo(): Promise<DeviceInfo> {
  const platform = getPlatform();

  if (platform === "electron") {
    return {
      deviceId: await getElectronDeviceId(),
      platform,
    };
  }

  if (platform === "android") {
    return {
      deviceId: await getCapacitorDeviceId(),
      platform,
    };
  }

  return {
    deviceId: await getFingerprintId(),
    platform,
  };
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  deviceInfoPromise ??= resolveDeviceInfo();
  return deviceInfoPromise;
}

export async function getDeviceId(): Promise<string> {
  const { deviceId } = await getDeviceInfo();
  return deviceId;
}

export async function registerDevice(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("registerDevice() can only be called in the browser.");
  }

  const { deviceId, platform } = await getDeviceInfo();
  const response = await fetch("/api/device/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      device_id: deviceId,
      platform,
      source: getSource(platform),
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(payload?.message || "Failed to register device.");
  }

  debugLog("Posted device registration metadata.", {
    deviceId,
    platform,
    source: getSource(platform),
  });
}
