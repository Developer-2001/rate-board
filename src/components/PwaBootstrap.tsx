"use client";

import { useEffect } from "react";

export default function PwaBootstrap() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      window.location.protocol !== "https:" && window.location.hostname !== "localhost"
    ) {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("Failed to register service worker.", error);
      });
    });
  }, []);

  return null;
}
