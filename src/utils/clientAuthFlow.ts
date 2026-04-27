"use client";

import { fetchBearerToken, fetchCorporateClientData, verifyDevice } from "@/utils/authApi";
import { storeClientData, storeVerificationStatus } from "@/utils/authStorage";
import { ClientData } from "@/types/auth";

export type AuthFlowResult =
  | {
      status: "approved";
      clientData: ClientData;
      warningMessage: string | null;
    }
  | {
      status: "denied";
      clientData: ClientData;
      warningMessage: string | null;
    }
  | {
      status: "register";
      clientData: ClientData;
      warningMessage: string | null;
    };

export async function runAuthenticationFlow(
  corporateId: string,
  deviceId: string
): Promise<AuthFlowResult> {
  await fetchBearerToken();

  const corporateResponse = await fetchCorporateClientData(corporateId);
  const clientData = corporateResponse.data;

  storeClientData(corporateId, clientData);

  const verifyResponse = await verifyDevice({
    clientId: clientData.ClientId,
    SysName: clientData.SysName,
    fingerPrintId: deviceId,
  });

  const deviceStatus = verifyResponse.data?.Device ?? "";
  const warningMessage = corporateResponse.warningMessage ?? null;

  if (deviceStatus === "Y") {
    storeVerificationStatus(true);
    return {
      status: "approved",
      clientData,
      warningMessage,
    };
  }

  storeVerificationStatus(false);

  if (deviceStatus === "N") {
    return {
      status: "denied",
      clientData,
      warningMessage,
    };
  }

  return {
    status: "register",
    clientData,
    warningMessage,
  };
}
