"use client";

import { useEffect, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useClient } from "@/context/ClientContext";
import {
  clearAuthStorage,
  hasCompleteAuthSession,
  hasRecoverableAuthSession,
  readAuthStorage,
} from "@/utils/authStorage";
import { fetchBearerToken } from "@/utils/authApi";
import { runAuthenticationFlow } from "@/utils/clientAuthFlow";

type UseAuthBootstrapOptions = {
  deviceId: string | null;
  router: AppRouterInstance;
  mode: "login" | "home";
  onAccessDenied?: () => void;
  onError?: (message: string) => void;
  onStatusMessage?: (
    message: string | null,
    title: "warning" | "info" | "success" | "error"
  ) => void;
};

export default function useAuthBootstrap({
  deviceId,
  router,
  mode,
  onAccessDenied,
  onError,
  onStatusMessage,
}: UseAuthBootstrapOptions) {
  const {
    corporateId,
    isHydrated,
    clearClientSession,
    hydrateClientState,
    setClientSession,
    setVerificationState,
  } = useClient();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    if (!isHydrated || !deviceId) {
      return;
    }

    let isActive = true;

    const bootstrap = async () => {
      setIsBootstrapping(true);

      try {
        const snapshot = readAuthStorage();

        if (hasCompleteAuthSession(snapshot)) {
          if (mode === "login") {
            router.replace("/");
          }
          return;
        }

        if (!hasRecoverableAuthSession(snapshot)) {
          if (mode === "home") {
            router.replace("/corporateId");
            return;
          }

          await fetchBearerToken();
          return;
        }

        const corporateIdentity = snapshot.corporateId ?? corporateId;
        if (!corporateIdentity) {
          clearClientSession();
          if (mode === "home") {
            router.replace("/corporateId");
          }
          return;
        }

        const result = await runAuthenticationFlow(corporateIdentity, deviceId);

        if (!isActive) {
          return;
        }

        setClientSession(corporateIdentity, result.clientData);
        setVerificationState(result.status === "approved");
        hydrateClientState();

        if (result.warningMessage && onStatusMessage) {
          onStatusMessage(result.warningMessage, "warning");
        }

        if (result.status === "approved") {
          if (mode === "login") {
            router.replace("/");
          }
          return;
        }

        if (result.status === "denied") {
          if (mode === "login" && onAccessDenied) {
            onAccessDenied();
          } else {
            router.replace("/corporateId?denied=1");
          }
          return;
        }

        router.replace("/register");
      } catch (error) {
        console.error("Failed to bootstrap auth state.", error);
        clearAuthStorage();
        hydrateClientState();

        const message =
          error instanceof Error ? error.message : "Failed to restore authentication.";

        if (onError) {
          onError(message);
        }

        if (mode === "home") {
          router.replace("/corporateId");
        }
      } finally {
        if (isActive) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      isActive = false;
    };
  }, [
    clearClientSession,
    corporateId,
    deviceId,
    hydrateClientState,
    isHydrated,
    mode,
    onAccessDenied,
    onError,
    onStatusMessage,
    router,
    setClientSession,
    setVerificationState,
  ]);

  return { isBootstrapping };
}
