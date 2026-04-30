"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import ContactSupport from "./modals/ContactSupport";

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v5" strokeLinecap="round" />
      <path d="M12 7.5h.01" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [contactSupportModalOpen, setContactSupportModalOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header
      className={`flex w-full items-center justify-between border-b ${theme.panelBorder} ${theme.surface} px-4 py-3 shadow-md backdrop-blur-sm`}
      style={{ color: theme.text }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-2xl border font-bold shadow-sm"
          style={{ 
            backgroundColor: theme.accent, 
            color: theme.id === "pearl" ? "#fff" : theme.bg,
            borderColor: `${theme.accent}33`
          }}
        >
          RB
        </div>
        <div>
          <h1 className="text-md font-bold" style={{ color: theme.text }}>Rate Board Access</h1>
          <p className="hidden text-xs leading-tight md:block" style={{ color: theme.textDim }}>
            Corporate authentication console
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-3 text-sm md:flex">
        <Link
          href="https://www.parasinfotech.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors"
          style={{ color: theme.textDim }}
        >
          Paras Infotech
        </Link>
      </div>

      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => setContactSupportModalOpen(true)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors"
          style={{ color: theme.textDim }}
        >
          <InfoIcon className="h-4 w-4" />
          <span className="hidden text-sm font-medium md:block">Contact Support</span>
        </button>
      </div>

      <ContactSupport
        open={contactSupportModalOpen}
        onOpenChange={setContactSupportModalOpen}
      />
    </header>
  );
}
