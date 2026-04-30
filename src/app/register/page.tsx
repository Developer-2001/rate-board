"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/statusMsg";
import useDeviceId from "@/hooks/auth/useDeviceId";
import { detectAndLogDevice } from "@/utils/identifyDevice";
import { registerDevice } from "@/utils/authApi";
import { useClient } from "@/context/ClientContext";
import { useTheme } from "@/context/ThemeContext";

function trimForBackend(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

function RegisterPage() {
  const [deviceName, setDeviceName] = useState("");
  const [counter, setCounter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    browser: "",
    os: "",
    location: "Unknown",
  });
  const { theme } = useTheme();

  const router = useRouter();
  const { deviceId, loading: isDeviceIdLoading } = useDeviceId();
  const { clientData, isHydrated, isVerified } = useClient();
  const deviceIdentify = detectAndLogDevice();
  const safeDeviceName = trimForBackend(
    deviceIdentify.name || "Android Device",
    24,
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isVerified) {
      router.replace("/");
      return;
    }

    if (!clientData) {
      router.replace("/corporateId");
    }
  }, [clientData, deviceId, isHydrated, isVerified, router]);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const userAgent = navigator.userAgent.toLowerCase();
      let browser = "Unknown";
      let os = "Unknown";

      if (userAgent.includes("edg")) browser = "Edge";
      else if (userAgent.includes("chrome")) browser = "Chrome";
      else if (userAgent.includes("firefox")) browser = "Firefox";
      else if (userAgent.includes("safari")) browser = "Safari";
      else if (userAgent.includes("opera") || userAgent.includes("opr")) {
        browser = "Opera";
      }

      if (userAgent.includes("windows")) os = "Windows";
      else if (userAgent.includes("mac")) os = "MacOS";
      else if (userAgent.includes("android")) os = "Android";
      else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
        os = "iOS";
      } else if (userAgent.includes("linux")) {
        os = "Linux";
      }

      let location = "Unknown";

      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const locationInfo = await response.json();
          location = [locationInfo.city, locationInfo.region]
            .filter(Boolean)
            .join(", ");
        }
      } catch (error) {
        console.warn("Failed to resolve device location.", error);
      }

      setDeviceInfo({
        browser,
        os,
        location: location || "Unknown",
      });
    };

    fetchDeviceInfo();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientData || !deviceId) {
      router.replace("/corporateId");
      return;
    }

    const userRegisterData = {
      clientid: clientData.ClientId,
      sysname: clientData.SysName,
      deviceid: deviceId,
      devicename: safeDeviceName,
      deviceos: deviceInfo.os,
      requestby: trimForBackend(`${deviceName}-${counter}`, 40),
      narration: trimForBackend(`Device Name: ${deviceInfo.location}`, 80),
    };

    setIsLoading(true);

    try {
      await registerDevice(userRegisterData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to submit. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const classNameButton = `flex min-h-[52px] w-full items-center justify-center rounded-2xl border transition-all ${theme.topButton} ${theme.topButtonHover} text-sm font-semibold uppercase tracking-[0.25em] shadow-lg ${
    isLoading
      ? "cursor-wait opacity-70"
      : "hover:-translate-y-0.5 hover:shadow-xl"
  }`;

  const themedInputClass = `w-full rounded-2xl border ${theme.panelBorder} bg-white/50 px-4 py-3 text-base outline-none transition-all duration-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-${theme.accent}/15 ${
    isLoading ? "cursor-not-allowed opacity-70" : "hover:border-zinc-400/40"
  }`;
  const isDeviceReady = Boolean(deviceId);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div
        className={`flex min-h-screen items-center justify-center ${theme.appBg} px-2 py-4 sm:px-4 lg:px-8`}
        style={{ color: theme.text, fontFamily: theme.fontBody }}
      >
        <section
          className={`w-full max-w-6xl rounded-4xl border ${theme.surface} p-6 shadow-2xl sm:p-8 lg:p-10`}
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="max-w-2xl">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.35em]"
                style={{ color: theme.accent }}
              >
                Rate Board
              </p>
              <h2
                className="text-3xl font-semibold sm:text-4xl"
                style={{ color: theme.text }}
              >
                Device registration
              </h2>
              <p
                className="mt-3 text-sm leading-7 sm:text-base"
                style={{ color: theme.textDim }}
              >
                This device is not registered yet. Send the registration request
                so the store can approve this screen for live gold, silver, and
                platinum rates.
              </p>

              <div className="mt-8 grid gap-4 grid-cols-2">
                <div
                  className="rounded-2xl border bg-white/5 p-5"
                  style={{ borderColor: `${theme.accent}22` }}
                >
                  <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: theme.textDim }}
                  >
                    Client ID
                  </p>
                  <p
                    className="mt-2 text-xl font-medium"
                    style={{ color: theme.text }}
                  >
                    {clientData?.ClientId || "-"}
                  </p>
                </div>
                <div
                  className="rounded-2xl border bg-white/5 p-5"
                  style={{ borderColor: `${theme.accent}22` }}
                >
                  <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: theme.textDim }}
                  >
                    System Name
                  </p>
                  <p
                    className="mt-2 text-xl font-medium"
                    style={{ color: theme.text }}
                  >
                    {clientData?.SysName || "-"}
                  </p>
                </div>
                <div
                  className="rounded-2xl border bg-white/5 p-5"
                  style={{ borderColor: `${theme.accent}22` }}
                >
                  <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: theme.textDim }}
                  >
                    Browser
                  </p>
                  <p
                    className="mt-2 text-lg font-medium"
                    style={{ color: theme.text }}
                  >
                    {deviceInfo.browser || "-"}
                  </p>
                </div>
                <div
                  className="rounded-2xl border bg-white/5 p-5"
                  style={{ borderColor: `${theme.accent}22` }}
                >
                  <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: theme.textDim }}
                  >
                    Location
                  </p>
                  <p
                    className="mt-2 text-lg font-medium"
                    style={{ color: theme.text }}
                  >
                    {deviceInfo.location || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-[1.75rem] border bg-white/30 p-5 shadow-sm sm:p-6"
              style={{ borderColor: `${theme.accent}33` }}
            >
              <form onSubmit={handleRegister}>
                <div className="mb-5">
                  <label
                    htmlFor="deviceName"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em]"
                    style={{ color: theme.textDim }}
                  >
                    Device Name
                  </label>
                  <input
                    type="text"
                    id="deviceName"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="Enter device name"
                    autoFocus
                    required
                    className={`${themedInputClass} text-zinc-900`}
                    autoComplete="off"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="counter"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em]"
                    style={{ color: theme.textDim }}
                  >
                    Counter Name
                  </label>
                  <input
                    type="text"
                    id="counter"
                    value={counter}
                    onChange={(e) => setCounter(e.target.value)}
                    placeholder="Enter counter name"
                    required
                    className={`${themedInputClass} text-zinc-900`}
                    autoComplete="off"
                  />
                </div>

                <div
                  className="mb-6 rounded-2xl border bg-black/5 p-4 text-sm"
                  style={{
                    borderColor: `${theme.accent}22`,
                    color: theme.textDim,
                  }}
                >
                  <p>
                    Device Type:{" "}
                    <span className="font-medium" style={{ color: theme.text }}>
                      {safeDeviceName}
                    </span>
                  </p>
                  <p className="mt-2">
                    Device OS:{" "}
                    <span className="font-medium" style={{ color: theme.text }}>
                      {deviceInfo.os || "-"}
                    </span>
                  </p>
                  {!isDeviceReady && (
                    <p className="mt-2 text-zinc-300">
                      {isDeviceIdLoading
                        ? "Preparing device ID..."
                        : "Waiting for device ID..."}
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className={classNameButton}
                    disabled={isLoading || !clientData || !isDeviceReady}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2 text-zinc-950">
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Sending
                      </span>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            router.push("/corporateId");
          }}
          heading="Success"
          message="Request sent successfully. Please wait while your request is being accepted. Once accepted, you will be able to access this application."
        />
      </div>
    </Suspense>
  );
}

export default dynamic(() => Promise.resolve(RegisterPage), { ssr: false });
