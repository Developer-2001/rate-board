"use client";

import useDeviceId from "@/hooks/auth/useDeviceId";

export default function DeviceIdExample() {
  const { deviceId, loading } = useDeviceId();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-stone-200">
      <p>Device ID: {loading ? "Loading..." : deviceId || "-"}</p>
    </div>
  );
}
