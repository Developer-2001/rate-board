"use client";

import { Capacitor } from "@capacitor/core";

export function isElectronApp() {
  return typeof window !== "undefined" && Boolean(window.desktopApi);
}

export function isNativeApp() {
  return typeof window !== "undefined" && Capacitor.isNativePlatform();
}

export function getDesktopApi() {
  if (!isElectronApp() || !window.desktopApi) {
    throw new Error("Electron desktop bridge is not available.");
  }

  return window.desktopApi;
}
