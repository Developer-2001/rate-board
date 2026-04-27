"use client";

import { getPlatform } from "@/lib/device/platform";

export function isElectronApp() {
  return getPlatform() === "electron";
}

export function isNativeApp() {
  return getPlatform() === "android";
}

export function getDesktopApi() {
  if (!isElectronApp() || !window.desktopApi) {
    throw new Error("Electron desktop bridge is not available.");
  }

  return window.desktopApi;
}
