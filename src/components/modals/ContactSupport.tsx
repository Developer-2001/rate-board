"use client";

import type { ReactNode } from "react";
import { useState } from "react";

interface ContactSupportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Icon({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
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
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.08 4.18 2 2 0 014.06 2h3a2 2 0 012 1.72c.12.9.33 1.77.62 2.61a2 2 0 01-.45 2.11L8 9.91a16 16 0 006.09 6.09l1.47-1.23a2 2 0 012.11-.45c.84.29 1.71.5 2.61.62A2 2 0 0122 16.92z" />
    </Icon>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 7l8 6 8-6" />
    </Icon>
  );
}

function CopyIcon({ className = "" }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect x="9" y="9" width="10" height="10" rx="2" />
      <path d="M5 15V7a2 2 0 012-2h8" />
    </Icon>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M5 12l4 4L19 6" />
    </Icon>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </Icon>
  );
}

function SupportIcon({ className = "" }: { className?: string }) {
  return (
    <Icon className={className}>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/95 shadow-2xl">
        <button
          type="button"
          className="group absolute right-4 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-700/80 transition-all duration-200 hover:bg-slate-600/80"
          onClick={() => onOpenChange(false)}
        >
          <CloseIcon className="h-5 w-5 text-slate-300 group-hover:text-white" />
        </button>

        <div className="px-4 pb-6 pt-4 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-600/50 bg-gradient-to-br from-blue-500/30 to-purple-600/30 shadow-lg">
            <SupportIcon className="h-10 w-10 text-blue-300" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-100 sm:text-2xl">
            Contact Support
          </h2>
          <p className="text-sm text-slate-300 sm:text-base">
            We&apos;re here to help you anytime!
          </p>
        </div>

        <div className="space-y-3 px-4 pb-6 sm:px-6 sm:pb-8">
          <button
            type="button"
            onClick={() => copyToClipboard("7498242199", "phone")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-600/50 bg-slate-700/50 p-4 text-left transition-all duration-200 hover:border-slate-500/60 hover:bg-slate-600/60"
          >
            <div className="flex min-w-0 flex-1 items-center space-x-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-blue-400/30 bg-gradient-to-br from-blue-500/40 to-blue-600/40 shadow-lg">
                <PhoneIcon className="h-7 w-7 text-blue-200" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-400 sm:text-sm">Phone</p>
                <p className="break-all text-base font-semibold text-slate-100 sm:text-lg">
                  7498242199
                </p>
              </div>
            </div>
            <div className="ml-2 flex flex-shrink-0 items-center space-x-2">
              {copiedField === "phone" ? (
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckIcon className="h-4 w-4" />
                  <span className="hidden text-xs font-medium sm:inline">Copied!</span>
                </div>
              ) : (
                <CopyIcon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-300" />
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard("info@parasinfotech.co.in", "email")}
            className="flex w-full items-center justify-between rounded-xl border border-slate-600/50 bg-slate-700/50 p-4 text-left transition-all duration-200 hover:border-slate-500/60 hover:bg-slate-600/60"
          >
            <div className="flex min-w-0 flex-1 items-center space-x-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-purple-400/30 bg-gradient-to-br from-purple-500/40 to-purple-600/40 shadow-lg">
                <MailIcon className="h-7 w-7 text-purple-200" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-400 sm:text-sm">Email</p>
                <p className="break-all text-base font-semibold text-slate-100 sm:text-lg">
                  info@parasinfotech.co.in
                </p>
              </div>
            </div>
            <div className="ml-2 flex flex-shrink-0 items-center space-x-2">
              {copiedField === "email" ? (
                <div className="flex items-center space-x-1 text-green-400">
                  <CheckIcon className="h-4 w-4" />
                  <span className="hidden text-xs font-medium sm:inline">Copied!</span>
                </div>
              ) : (
                <CopyIcon className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </button>

          <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
            <a
              href="tel:7498242199"
              className="flex flex-1 items-center justify-center space-x-2 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-blue-500 hover:to-blue-600 sm:text-base"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>Call Now</span>
            </a>
            <a
              href="mailto:info@parasinfotech.co.in"
              className="flex flex-1 items-center justify-center space-x-2 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-purple-500 hover:to-purple-600 sm:text-base"
            >
              <MailIcon className="h-4 w-4" />
              <span>Email</span>
            </a>
          </div>
        </div>

        <div className="rounded-b-2xl border-t border-slate-600/50 bg-slate-700/30 px-4 py-4 text-center sm:px-6">
          <p className="text-xs text-slate-300 sm:text-sm">
            We&apos;ll get back to you as soon as possible
          </p>
        </div>
      </div>
    </div>
  );
}
