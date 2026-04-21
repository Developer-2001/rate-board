"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientLoginForm from "@/components/auth/ClientLoginForm";
import useAuthBootstrap from "@/hooks/auth/useAuthBootstrap";
import useClientAuthentication from "@/hooks/auth/useClientAuthentication";
import useFingerprint from "@/hooks/auth/useFingerprint";
import Modal from "@/components/modals/statusMsg";
import Header from "@/components/Header";
import TermsAndConditionsModal from "@/components/modals/TermsAndConditionsModal";
import Alert from "@/components/modals/Alert";

export default function CorporateIdPage() {
  const [corporateId, setCorporateId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<"success" | "error" | "warning" | "info">(
    "info"
  );

  const router = useRouter();
  const fingerPrintId = useFingerprint();

  const { isBootstrapping } = useAuthBootstrap({
    fingerPrintId,
    router,
    mode: "login",
    onAccessDenied: () => setShowAccessDenied(true),
    onError: setError,
    onStatusMessage: (nextMessage, nextTitle) => {
      setMessage(nextMessage);
      setTitle(nextTitle);
    },
  });

  useEffect(() => {
    const denied = new URLSearchParams(window.location.search).get("denied");
    if (denied === "1") {
      queueMicrotask(() => {
        setShowAccessDenied(true);
      });
    }
  }, []);

  const handleClientIdLogin = useClientAuthentication(
    corporateId,
    setError,
    router,
    fingerPrintId,
    setIsLoading,
    setShowAccessDenied,
    setMessage,
    setTitle
  );

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <ClientLoginForm
            corporateId={corporateId}
            setCorporateId={setCorporateId}
            error={error}
            onSubmit={handleClientIdLogin}
            isLoading={isLoading}
            loading={isBootstrapping}
            setShowTerms={setShowTerms}
          />
        </div>

        <Modal
          isOpen={showAccessDenied}
          onClose={() => setShowAccessDenied(false)}
          heading="Access is denied"
          message="You are not authorized. Kindly wait until you get authorized."
        />

        <TermsAndConditionsModal
          isOpen={showTerms}
          onClose={() => setShowTerms(false)}
        />

        {message && (
          <Alert
            title={title}
            message={message}
            onClose={() => setMessage(null)}
          />
        )}
      </main>
    </div>
  );
}
