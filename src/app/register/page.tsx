"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/statusMsg";
import useDeviceId from "@/hooks/auth/useDeviceId";
import { detectAndLogDevice } from "@/utils/identifyDevice";
import { registerDevice } from "@/utils/authApi";
import { useClient } from "@/context/ClientContext";

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

  const router = useRouter();
  const { deviceId, loading: isDeviceIdLoading } = useDeviceId();
  const { clientData, isHydrated, isVerified } = useClient();
  const deviceIdentify = detectAndLogDevice();
  const safeDeviceName = trimForBackend(deviceIdentify.name || "Android Device", 24);

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
        error instanceof Error ? error.message : "Failed to submit. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const classNameButton = `flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-700 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-stone-950 shadow-[0_16px_40px_rgba(251,191,36,0.2)] transition-all ${
    isLoading
      ? "cursor-wait opacity-70"
      : "hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(251,191,36,0.28)]"
  }`;

  const themedInputClass = `w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base text-white outline-none transition-all duration-300 placeholder:text-stone-500 focus:border-amber-400/60 focus:bg-white/8 focus:ring-2 focus:ring-amber-400/20 ${
    isLoading ? "cursor-not-allowed opacity-70" : "hover:border-white/20"
  }`;
  const isDeviceReady = Boolean(deviceId);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div
        className="flex min-h-screen items-center justify-center bg-stone-950 px-4 py-8 text-stone-100 sm:px-6 lg:px-8"
        style={{
          paddingTop: "calc(2rem + env(safe-area-inset-top))",
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
        }}
      >
        <section className="w-full max-w-6xl rounded-4xl border border-amber-500/20 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),rgba(28,25,23,0.98)_55%)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                Rate Board
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Device registration
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
                This device is not registered yet. Send the registration request so
                the store can approve this screen for live gold, silver, and
                platinum rates.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                    Client ID
                  </p>
                  <p className="mt-2 text-xl font-medium text-white">
                    {clientData?.ClientId || "-"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                    System Name
                  </p>
                  <p className="mt-2 text-xl font-medium text-white">
                    {clientData?.SysName || "-"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                    Browser
                  </p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {deviceInfo.browser || "-"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                    Location
                  </p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {deviceInfo.location || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
              <form onSubmit={handleRegister}>
                <div className="mb-5">
                  <label
                    htmlFor="deviceName"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-stone-400"
                  >
                    Device Name
                  </label>
                  <input
                    type="text"
                    id="deviceName"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="Enter device name"
                    required
                    className={themedInputClass}
                    autoComplete="off"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="counter"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-stone-400"
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
                    className={themedInputClass}
                    autoComplete="off"
                  />
                </div>

                <div className="mb-6 rounded-2xl border border-white/10 bg-stone-950/40 p-4 text-sm text-stone-300">
                  <p>
                    Device Type:{" "}
                    <span className="font-medium text-white">{safeDeviceName}</span>
                  </p>
                  <p className="mt-2">
                    Device OS:{" "}
                    <span className="font-medium text-white">
                      {deviceInfo.os || "-"}
                    </span>
                  </p>
                  {!isDeviceReady && (
                    <p className="mt-2 text-amber-300">
                      {isDeviceIdLoading ? "Preparing device ID..." : "Waiting for device ID..."}
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
                      <span className="flex items-center gap-2 text-stone-950">
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
