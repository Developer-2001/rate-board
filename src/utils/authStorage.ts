"use client";

import CryptoJS from "crypto-js";
import { AuthSnapshot, ClientData } from "@/types/auth";

const STORAGE_KEYS = {
  corporateId: "rate-board.auth.corporateId",
  clientId: "rate-board.auth.clientId",
  clientData: "rate-board.auth.clientData",
  isVerified: "rate-board.auth.isVerified",
  fingerId: "fingerId",
} as const;

function getSecretKey() {
  return process.env.NEXT_PUBLIC_SECRET_KEY;
}

function encryptValue(value: unknown) {
  const secretKey = getSecretKey();
  if (!secretKey) {
    throw new Error("Client-side secret key is not configured.");
  }

  return CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();
}

function decryptValue<T>(value: string | null): T | null {
  const secretKey = getSecretKey();
  if (!secretKey || !value) {
    return null;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(value, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      return null;
    }

    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.warn("Failed to decrypt auth storage item.", error);
    return null;
  }
}

function setEncryptedItem(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(key, encryptValue(value));
}

function getEncryptedItem<T>(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return decryptValue<T>(localStorage.getItem(key));
}

function removeItem(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(key);
}

export function storeCorporateId(corporateId: string) {
  setEncryptedItem(STORAGE_KEYS.corporateId, corporateId);
}

export function storeClientData(corporateId: string, clientData: ClientData) {
  setEncryptedItem(STORAGE_KEYS.corporateId, corporateId);
  setEncryptedItem(STORAGE_KEYS.clientId, clientData.ClientId);
  setEncryptedItem(STORAGE_KEYS.clientData, clientData);
}

export function storeVerificationStatus(isVerified: boolean) {
  setEncryptedItem(STORAGE_KEYS.isVerified, isVerified);
}

export function clearAuthStorage() {
  removeItem(STORAGE_KEYS.corporateId);
  removeItem(STORAGE_KEYS.clientId);
  removeItem(STORAGE_KEYS.clientData);
  removeItem(STORAGE_KEYS.isVerified);
}

export function readAuthStorage(): AuthSnapshot {
  if (typeof window === "undefined") {
    return {
      corporateId: null,
      clientId: null,
      clientData: null,
      isVerified: false,
      fingerId: null,
    };
  }

  const corporateId = getEncryptedItem<string>(STORAGE_KEYS.corporateId);
  const clientId = getEncryptedItem<string>(STORAGE_KEYS.clientId);
  const clientData = getEncryptedItem<ClientData>(STORAGE_KEYS.clientData);
  const isVerified = getEncryptedItem<boolean>(STORAGE_KEYS.isVerified) ?? false;
  const fingerId = localStorage.getItem(STORAGE_KEYS.fingerId);

  return {
    corporateId,
    clientId,
    clientData,
    isVerified,
    fingerId,
  };
}

export function hasCompleteAuthSession(snapshot: AuthSnapshot) {
  return Boolean(
    snapshot.corporateId &&
      snapshot.clientId &&
      snapshot.clientData &&
      snapshot.clientData.ClientId === snapshot.clientId &&
      snapshot.isVerified &&
      snapshot.fingerId
  );
}

export function hasRecoverableAuthSession(snapshot: AuthSnapshot) {
  return Boolean(snapshot.corporateId || snapshot.clientId || snapshot.clientData);
}
