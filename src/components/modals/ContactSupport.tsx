"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/context/ThemeContext";

interface ContactSupportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Icon({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function PhoneIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Icon className={className} style={style}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.08 4.18 2 2 0 014.06 2h3a2 2 0 012 1.72c.12.9.33 1.77.62 2.61a2 2 0 01-.45 2.11L8 9.91a16 16 0 006.09 6.09l1.47-1.23a2 2 0 012.11-.45c.84.29 1.71.5 2.61.62A2 2 0 0122 16.92z" />
    </Icon>
  );
}

function MailIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Icon className={className} style={style}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 7l8 6 8-6" />
    </Icon>
  );
}

function CopyIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Icon className={className} style={style}>
      <rect x="9" y="9" width="10" height="10" rx="2" />
      <path d="M5 15V7a2 2 0 012-2h8" />
    </Icon>
  );
}

function CheckIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Icon className={className} style={style}>
      <path d="M5 12l4 4L19 6" />
    </Icon>
  );
}

function CloseIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Icon className={className} style={style}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </Icon>
  );
}

function SupportIcon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Icon className={className} style={style}>
      <path d="M4 12a8 8 0 0116 0" />
      <path d="M4 13v3a2 2 0 002 2h1v-6H6a2 2 0 00-2 2z" />
      <path d="M20 13v3a2 2 0 01-2 2h-1v-6h1a2 2 0 012 2z" />
      <path d="M12 19v1" />
    </Icon>
  );
}

export default function ContactSupport({
  open,
  onOpenChange,
}: ContactSupportProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { theme } = useTheme();

  if (!open) {
    return null;
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy text.", error);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 backdrop-blur-sm">
      <div
        className={`relative max-h-[90vh] w-full max-w-md rounded-2xl border ${theme.panelBorder} ${theme.surface} shadow-2xl`}
        style={{ color: theme.text }}
      >
        <button
          type="button"
          className={`group absolute right-4 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${theme.topButton} ${theme.topButtonHover}`}
          onClick={() => onOpenChange(false)}
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="px-4 pb-6 pt-4 text-center sm:px-6">
          <div
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border shadow-lg"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            <SupportIcon
              className="h-10 w-10"
              style={{ color: theme.accent }}
            />
          </div>
          <h2
            className="mb-2 text-xl font-bold sm:text-2xl"
            style={{ color: theme.text }}
          >
            Contact Support
          </h2>
          <p className="text-sm sm:text-base" style={{ color: theme.textDim }}>
            We&apos;re here to help you anytime!
          </p>
        </div>

        <div className="space-y-3 px-4 pb-6 sm:px-6 sm:pb-8">
          <button
            type="button"
            onClick={() => copyToClipboard("7498242199", "phone")}
            className={`flex w-full items-center justify-between rounded-xl border ${theme.panelBorder} bg-white/50 p-4 text-left transition-all duration-200 hover:bg-white/80`}
          >
            <div className="flex min-w-0 flex-1 items-center space-x-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border shadow-sm"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border,
                }}
              >
                <PhoneIcon
                  className="h-7 w-7"
                  style={{ color: theme.accent }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs font-medium sm:text-sm"
                  style={{ color: theme.textDim }}
                >
                  Phone
                </p>
                <p
                  className="break-all text-base font-semibold sm:text-lg"
                  style={{ color: theme.text }}
                >
                  7498242199
                </p>
              </div>
            </div>
            <div className="ml-2 flex shrink-0 items-center space-x-2">
              {copiedField === "phone" ? (
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckIcon className="h-4 w-4" />
                  <span className="hidden text-xs font-medium sm:inline">
                    Copied!
                  </span>
                </div>
              ) : (
                <CopyIcon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-white" />
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard("info@parasinfotech.co.in", "email")}
            className={`flex w-full items-center justify-between rounded-xl border ${theme.panelBorder} bg-white/50 p-4 text-left transition-all duration-200 hover:bg-white/80`}
          >
            <div className="flex min-w-0 flex-1 items-center space-x-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border shadow-sm"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.border,
                }}
              >
                <MailIcon className="h-7 w-7" style={{ color: theme.accent }} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs font-medium sm:text-sm"
                  style={{ color: theme.textDim }}
                >
                  Email
                </p>
                <p
                  className="break-all text-base font-semibold sm:text-lg"
                  style={{ color: theme.text }}
                >
                  info@parasinfotech.co.in
                </p>
              </div>
            </div>
            <div className="ml-2 flex shrink-0 items-center space-x-2">
              {copiedField === "email" ? (
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckIcon className="h-4 w-4" />
                  <span className="hidden text-xs font-medium sm:inline">
                    Copied!
                  </span>
                </div>
              ) : (
                <CopyIcon className="h-4 w-4 text-zinc-400" />
              )}
            </div>
          </button>

          <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
            <a
              href="tel:7498242199"
              className={`flex flex-1 items-center justify-center space-x-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${theme.topButton} ${theme.topButtonHover} sm:text-base`}
            >
              <PhoneIcon className="h-4 w-4" />
              <span>Call Now</span>
            </a>
            <a
              href="mailto:info@parasinfotech.co.in"
              className={`flex flex-1 items-center justify-center space-x-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 sm:text-base`}
              style={{
                backgroundColor: theme.accent,
                color: theme.id === "pearl" ? "#fff" : theme.bg,
                borderColor: `${theme.accent}33`,
              }}
            >
              <MailIcon className="h-4 w-4" />
              <span>Email</span>
            </a>
          </div>
        </div>

        <div
          className={`rounded-b-2xl border-t px-4 py-4 text-center sm:px-6`}
          style={{
            backgroundColor: `${theme.accent}08`,
            borderColor: theme.panelBorder,
          }}
        >
          <p className="text-xs sm:text-sm" style={{ color: theme.textDim }}>
            We&apos;ll get back to you as soon as possible
          </p>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(modal, document.body);
}
