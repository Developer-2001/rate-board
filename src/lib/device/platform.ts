import { Capacitor } from "@capacitor/core";

export type DevicePlatform = "web" | "electron" | "android";

export function getPlatform(): DevicePlatform {
  if (typeof window === "undefined") {
    return "web";
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  if (window.electron || userAgent.includes(" electron/")) {
    return "electron";
  }

  if (Capacitor.getPlatform() === "android") {
    return "android";
  }

  return "web";
}
