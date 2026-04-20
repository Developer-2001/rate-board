// hooks/useFingerprint.ts
import { generateDeviceFingerprint } from "@/utils/fingerprint";
import { useEffect, useState } from "react";

export function isMobileOrTablet(): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false; // for SSR/Next.js safety

  // eslint-disable-next-line
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // iOS detection
  if (/iPhone|iPod/.test(userAgent)) return true;
  if (/iPad/.test(userAgent)) return true;

  // Android detection
  if (/Android/.test(userAgent) && !/Windows Phone/.test(userAgent)) {
    return true;
  }

  // Generic tablet detection
  if (/Tablet|iPad/i.test(userAgent)) return true;

  // Fallback using screen size
  if (window.innerWidth <= 1024) return true;

  return false;
}

export default function useFingerprint(): string | null {
  const [fingerId, setFingerId] = useState<string | null>(null);

  useEffect(() => {
    const generateFingerId = async () => {
      if (typeof window === "undefined") return;

      let storedFingerId = localStorage.getItem("fingerId");

      if (!storedFingerId) {
        const { fingerprint } = await generateDeviceFingerprint();
        localStorage.setItem("fingerId", fingerprint);
        storedFingerId = fingerprint;
      }

      setFingerId(storedFingerId);
    };
    //

    generateFingerId();
  }, []);

  return fingerId;
}
