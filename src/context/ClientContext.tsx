"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ClientData } from "@/types/auth";
import {
  clearAuthStorage,
  readAuthStorage,
  storeClientData,
  storeCorporateId,
  storeVerificationStatus,
} from "@/utils/authStorage";

type ClientContextType = {
  clientData: ClientData | null;
  clientId: string | null;
  corporateId: string | null;
  isVerified: boolean;
  isHydrated: boolean;
  hydrateClientState: () => void;
  setCorporateIdentity: (corporateId: string) => void;
  setClientSession: (corporateId: string, data: ClientData) => void;
  setVerificationState: (isVerified: boolean) => void;
  clearClientSession: () => void;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [corporateId, setCorporateId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const hydrateClientState = useCallback(() => {
    try {
      const snapshot = readAuthStorage();
      setCorporateId(snapshot.corporateId);
      setClientId(snapshot.clientId);
      setClientData(snapshot.clientData);
      setIsVerified(snapshot.isVerified);
    } catch (error) {
      console.warn("Failed to hydrate auth storage.", error);
      setCorporateId(null);
      setClientId(null);
      setClientData(null);
      setIsVerified(false);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      hydrateClientState();
    });
  }, [hydrateClientState]);

  const setCorporateIdentity = useCallback((nextCorporateId: string) => {
    storeCorporateId(nextCorporateId);
    setCorporateId(nextCorporateId);
  }, []);

  const setClientSession = useCallback((nextCorporateId: string, data: ClientData) => {
    storeClientData(nextCorporateId, data);
    setCorporateId(nextCorporateId);
    setClientId(data.ClientId);
    setClientData(data);
  }, []);

  const setVerificationState = useCallback((nextIsVerified: boolean) => {
    storeVerificationStatus(nextIsVerified);
    setIsVerified(nextIsVerified);
  }, []);

  const clearClientSession = useCallback(() => {
    clearAuthStorage();
    setCorporateId(null);
    setClientId(null);
    setClientData(null);
    setIsVerified(false);
  }, []);

  return (
    <ClientContext.Provider
      value={{
        clientData,
        clientId,
        corporateId,
        isVerified,
        isHydrated,
        hydrateClientState,
        setCorporateIdentity,
        setClientSession,
        setVerificationState,
        clearClientSession,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }

  return context;
};
