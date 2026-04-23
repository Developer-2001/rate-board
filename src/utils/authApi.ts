import { CapacitorHttp } from "@capacitor/core";
import { ClientData } from "@/types/auth";
import { getExpiryWarningMessage, validateClientLicense } from "@/utils/authMessages";
import { getDesktopApi, isElectronApp, isNativeApp } from "@/utils/platform";
import { readBearerToken, storeBearerToken } from "@/utils/authStorage";

type ApiSuccess<T> = T;

type CorporateIdResponse = ApiSuccess<{
  data: ClientData;
  message: string;
  warningMessage: string | null;
}>;

type VerifyResponse = ApiSuccess<{
  data?: {
    Device?: string;
  };
  message: string;
}>;

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

function getBaseApiUrl() {
  const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  if (!baseApiUrl) {
    throw new AuthApiError("Base API URL is missing in environment variables.", 500);
  }

  return baseApiUrl;
}

function getNativePayload<T>(payload: unknown): T {
  if (typeof payload === "string") {
    return JSON.parse(payload) as T;
  }

  return payload as T;
}

async function parseFetchResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = (await response.json().catch(() => null)) as T & {
    message?: string;
  };

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? payload.message || fallbackMessage
        : fallbackMessage;

    throw new AuthApiError(message, response.status);
  }

  return payload;
}

function getNativeErrorMessage(payload: unknown, fallbackMessage: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const { message } = payload as { message?: string };
    return message || fallbackMessage;
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  return fallbackMessage;
}

async function requestNativeText(url: string, options: {
  method: "POST" | "GET";
  headers?: Record<string, string>;
  data?: unknown;
}) {
  const response = await CapacitorHttp.request({
    url,
    method: options.method,
    headers: options.headers,
    data: options.data,
  });

  if (response.status < 200 || response.status >= 300) {
    throw new AuthApiError(
      getNativeErrorMessage(response.data, "Authentication request failed."),
      response.status
    );
  }

  if (typeof response.data === "string") {
    return response.data.trim();
  }

  return JSON.stringify(response.data).trim();
}

async function requestNativeJson<T>(url: string, options: {
  method: "POST" | "GET";
  headers?: Record<string, string>;
  data?: unknown;
}, fallbackMessage: string) {
  const response = await CapacitorHttp.request({
    url,
    method: options.method,
    headers: options.headers,
    data: options.data,
  });

  if (response.status < 200 || response.status >= 300) {
    throw new AuthApiError(getNativeErrorMessage(response.data, fallbackMessage), response.status);
  }

  return getNativePayload<T>(response.data);
}

async function getStoredOrFreshToken() {
  const existingToken = readBearerToken();
  if (existingToken) {
    return existingToken;
  }

  const nextToken = await fetchBearerToken();
  if (!nextToken) {
    throw new AuthApiError("Failed to fetch bearer token.", 502);
  }

  return nextToken;
}

function buildCorporatePayload(clientData: ClientData): CorporateIdResponse {
  const validationMessage = validateClientLicense(clientData);

  if (validationMessage) {
    if (validationMessage === "License Expired. Contact Support") {
      throw new AuthApiError(validationMessage, 401);
    }

    if (validationMessage === "Service not updated. Contact Support") {
      throw new AuthApiError(validationMessage, 503);
    }

    throw new AuthApiError(validationMessage, 400);
  }

  return {
    data: clientData,
    message: "Data retrieved successfully.",
    warningMessage: getExpiryWarningMessage(clientData),
  };
}

export async function fetchBearerToken() {
  if (isElectronApp()) {
    await getDesktopApi().auth.fetchBearerToken();
    return null;
  }

  if (!isNativeApp()) {
    const response = await fetch("/api/auth/token", {
      method: "POST",
      credentials: "same-origin",
    });

    await parseFetchResponse<{ success: boolean; message?: string }>(
      response,
      "Failed to fetch bearer token."
    );
    return null;
  }

  const bearerToken = await requestNativeText(`${getBaseApiUrl()}/sysfunction/gettokenmob`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    data: { userid: "abc", password: "xyz" },
  });

  storeBearerToken(bearerToken);
  return bearerToken;
}

export async function fetchCorporateClientData(corporateId: string) {
  if (isElectronApp()) {
    return getDesktopApi().auth.fetchCorporateClientData(corporateId);
  }

  if (!isNativeApp()) {
    const response = await fetch("/api/auth/corporateId", {
      method: "POST",
      headers: DEFAULT_HEADERS,
      credentials: "same-origin",
      body: JSON.stringify({ cId: corporateId }),
    });

    return parseFetchResponse<CorporateIdResponse>(
      response,
      "Failed to retrieve data from the server."
    );
  }

  const token = await getStoredOrFreshToken();
  const payload = await requestNativeJson<ClientData>(
    `${getBaseApiUrl()}/login/corporateid/${encodeURIComponent(corporateId.trim())}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...DEFAULT_HEADERS,
      },
    },
    "Failed to retrieve data from the server."
  );

  return buildCorporatePayload(payload);
}

export async function verifyDevice(params: {
  clientId: string;
  SysName: string;
  fingerPrintId: string;
}) {
  if (isElectronApp()) {
    return getDesktopApi().auth.verifyDevice(params);
  }

  if (!isNativeApp()) {
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: DEFAULT_HEADERS,
      credentials: "same-origin",
      body: JSON.stringify(params),
    });

    return parseFetchResponse<VerifyResponse>(response, "Failed to fetch device data.");
  }

  const token = await getStoredOrFreshToken();
  const payload = await requestNativeJson<VerifyResponse["data"]>(
    `${getBaseApiUrl()}/login/device/${encodeURIComponent(
      params.clientId
    )}/${encodeURIComponent(params.SysName)}/${encodeURIComponent(params.fingerPrintId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...DEFAULT_HEADERS,
      },
    },
    "Failed to fetch device data."
  );

  return {
    data: payload,
    message: "Device data retrieved successfully.",
  };
}

export async function registerDevice(payload: Record<string, unknown>) {
  if (isElectronApp()) {
    return getDesktopApi().auth.registerDevice(payload);
  }

  if (!isNativeApp()) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: DEFAULT_HEADERS,
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });

    return parseFetchResponse<{ success: boolean; message: string }>(
      response,
      "Failed to register device."
    );
  }

  const token = await getStoredOrFreshToken();
  await requestNativeText(`${getBaseApiUrl()}/login/register_device`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...DEFAULT_HEADERS,
    },
    data: { ...payload, device_type: "R" },
  });

  return {
    success: true,
    message: "Registered successfully.",
  };
}

export async function logout() {
  if (isElectronApp()) {
    await getDesktopApi().auth.logout();
    return;
  }

  if (!isNativeApp()) {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });

    await parseFetchResponse<{ success: boolean; message: string }>(
      response,
      "Logout failed."
    );
    return;
  }

  storeBearerToken("");
}
