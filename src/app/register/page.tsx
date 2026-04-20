"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Modal from "@/components/modals/statusMsg";
import { detectAndLogDevice } from "@/utils/identifyDevice";
import { registerDevice } from "@/utils/authApi";
import { useClient } from "@/context/ClientContext";
import useFingerprint from "@/hooks/auth/useFingerprint";

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
  const fingerPrintId = useFingerprint();
  const { clientData, isHydrated, isVerified } = useClient();
  const deviceIdentify = detectAndLogDevice();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isVerified) {
      router.replace("/");
      return;
    }

    if (!clientData || !fingerPrintId) {
      router.replace("/corporateId");
    }
  }, [clientData, fingerPrintId, isHydrated, isVerified, router]);

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

    if (!clientData || !fingerPrintId) {
      router.replace("/corporateId");
      return;
    }

    const userRegisterData = {
      clientid: clientData.ClientId,
      sysname: clientData.SysName,
      deviceid: fingerPrintId,
      devicename: deviceIdentify.name,
      deviceos: deviceInfo.os,
      requestby: `${deviceName}-${counter}`,
      narration: `Device Name: ${deviceInfo.location}`,
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

  const classNameInput = `w-full rounded-lg border border-gray-300 px-4 py-2 text-black outline-none transition-all focus:border-pink-500 focus:ring-1 focus:ring-pink-500 ${
    isLoading ? "cursor-not-allowed bg-gray-100" : ""
  }`;
  const classNameButton = `flex min-h-[42px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-pink-400 to-pink-700 py-2.5 font-medium text-white transition-colors ${
    isLoading ? "cursor-wait opacity-70" : "hover:from-pink-500 hover:to-pink-800"
  }`;

  return (
    <>
      <Header />
      <Suspense fallback={<p>Loading...</p>}>
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Device Registration
            </h2>

            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label
                  htmlFor="deviceName"
                  className="mb-1 block px-1 text-md font-medium text-gray-700"
                >
                  Device Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="deviceName"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Enter Device Name"
                  required
                  className={classNameInput}
                  autoComplete="off"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="counter"
                  className="mb-1 block px-1 text-md font-medium text-gray-700"
                >
                  Counter Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="counter"
                  value={counter}
                  onChange={(e) => setCounter(e.target.value)}
                  placeholder="Enter Counter Name"
                  required
                  className={classNameInput}
                  autoComplete="off"
                />
              </div>

              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                <p>
                  Client: <span className="font-medium">{clientData?.ClientId || "-"}</span>
                </p>
                <p>
                  System: <span className="font-medium">{clientData?.SysName || "-"}</span>
                </p>
                <p>
                  Browser: <span className="font-medium">{deviceInfo.browser || "-"}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className={classNameButton}
                  disabled={isLoading || !clientData || !fingerPrintId}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin text-white"
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
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            router.push("/corporateId");
          }}
          heading="Success"
          message="Request sent successfully. Please wait while your request is being accepted. Once accepted, you will be able to access this application."
        />
      </Suspense>
    </>
  );
}

export default dynamic(() => Promise.resolve(RegisterPage), { ssr: false });
