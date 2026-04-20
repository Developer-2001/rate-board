import { ClientData } from "@/types/auth";

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

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as T & {
    message?: string;
  };

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? payload.message || "Authentication request failed."
        : "Authentication request failed.";

    throw new AuthApiError(message, response.status);
  }

  return payload;
}

export async function fetchBearerToken() {
  const response = await fetch("/api/auth/token", {
    method: "POST",
    credentials: "same-origin",
  });

  await parseResponse<{ success: boolean; message?: string }>(response);
}

export async function fetchCorporateClientData(corporateId: string) {
  const response = await fetch("/api/auth/corporateId", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ cId: corporateId }),
  });

  return parseResponse<CorporateIdResponse>(response);
}

export async function verifyDevice(params: {
  clientId: string;
  SysName: string;
  fingerPrintId: string;
}) {
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(params),
  });

  return parseResponse<VerifyResponse>(response);
}

export async function registerDevice(payload: Record<string, unknown>) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(payload),
  });

  return parseResponse<{ success: boolean; message: string }>(response);
}
