"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function CapacitorBootstrap() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Ensure the WebView does NOT go under the status bar
      StatusBar.setOverlaysWebView({ overlay: false }).catch((err) =>
        console.error("Failed to set StatusBar overlay", err)
      );

      // Set status bar style to dark (suitable for light backgrounds) or light (suitable for dark backgrounds)
      // Since the app seems to be dark-themed, Style.Dark is often used for light text on dark background
      // Wait, Style.Dark means dark ICONS (for light status bar). Style.Light means light ICONS (for dark status bar).
      // The app screenshot shows a dark background. So we want light icons.
      StatusBar.setStyle({ style: Style.Light }).catch((err) =>
        console.error("Failed to set StatusBar style", err)
      );
    }
  }, []);

  return null;
}
