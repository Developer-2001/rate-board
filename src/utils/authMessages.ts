"use client";

import type { ClientData } from "@/types/auth";

export function getExpiryWarningMessage(clientData: ClientData) {
  const now = new Date();
  const licenseDate = new Date(clientData.LicenseSupportDate);
  const fifteenDaysFromNow = new Date(now);
  fifteenDaysFromNow.setDate(now.getDate() + 15);

  if (licenseDate > fifteenDaysFromNow || licenseDate <= now) {
    return null;
  }

  const daysUntilExpiry = Math.ceil(
    (licenseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const actualExpiryDate = new Date(licenseDate);
  actualExpiryDate.setDate(licenseDate.getDate() + 1);

  return `Your subscription will expire on ${actualExpiryDate.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  )} (${daysUntilExpiry} days remaining)`;
}

export function validateClientLicense(clientData: ClientData) {
  if (!clientData.ClientId) {
    return "The id does not exists";
  }

  if (!clientData.ServerIp) {
    return "Service not updated. Contact Support";
  }

  const now = new Date();
  const licenseDate = new Date(clientData.LicenseSupportDate);
  const expirationLimit = new Date(licenseDate);
  expirationLimit.setDate(expirationLimit.getDate() + 1);

  if (now >= expirationLimit) {
    return "License Expired. Contact Support";
  }

  return null;
}
