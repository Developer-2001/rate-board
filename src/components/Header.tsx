"use client";

import Link from "next/link";
import { useState } from "react";
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

  return (
    <header className="flex w-full items-center justify-between border-b border-stone-200 bg-gray-100 px-4 py-2 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 text-sm font-bold text-white shadow-md">
          JP
        </div>
        <div>
          <h1 className="text-md font-bold text-gray-800">JewellPlus Admin</h1>
          <p className="hidden text-xs leading-tight text-gray-500 md:block">
            Inventory & CRM Management
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-3 text-sm md:flex">
        <Link
          href="https://www.parasinfotech.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 transition-colors hover:text-blue-600"
        >
          Paras Infotech
        </Link>
      </div>

      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => setContactSupportModalOpen(true)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-gray-600 transition-colors hover:text-blue-600"
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
