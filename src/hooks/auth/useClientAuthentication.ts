import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCallback } from "react";
import { useClient } from "@/context/ClientContext";
import { AuthApiError } from "@/utils/authApi";
import { runAuthenticationFlow } from "@/utils/clientAuthFlow";

export default function useClientAuthentication(
  corporateId: string,
  setError: (value: string) => void,
  router: AppRouterInstance,
  deviceId: string | null,
  setIsLoading: (value: boolean) => void,
  setShowAccessDenied: (value: boolean) => void,
  setMessage?: (value: string | null) => void,
  setTitle?: (value: "success" | "error" | "warning" | "info") => void
) {
  const { setClientSession, setCorporateIdentity, setVerificationState } = useClient();

  return useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");

      const trimmedCorporateId = corporateId.trim();
      if (!trimmedCorporateId) {
        setError("Corporate ID is required.");
        return;
      }

      if (!deviceId) {
        setError("Device ID is not ready yet. Please try again.");
        return;
      }

      setIsLoading(true);
      setCorporateIdentity(trimmedCorporateId);

      try {
        const result = await runAuthenticationFlow(trimmedCorporateId, deviceId);

        setClientSession(trimmedCorporateId, result.clientData);
        setVerificationState(result.status === "approved");

        if (result.warningMessage && setMessage && setTitle) {
          setTitle("warning");
          setMessage(result.warningMessage);
        }

        if (result.status === "approved") {
          router.push("/");
          return;
        }

        if (result.status === "denied") {
          setShowAccessDenied(true);
          return;
        }

        router.push("/register");
      } catch (error) {
        console.error(error);

        if (error instanceof AuthApiError) {
          setError(error.message);
          return;
        }

        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [
      corporateId,
      deviceId,
      router,
      setClientSession,
      setCorporateIdentity,
      setError,
      setIsLoading,
      setMessage,
      setShowAccessDenied,
      setTitle,
      setVerificationState,
    ]
  );
}
