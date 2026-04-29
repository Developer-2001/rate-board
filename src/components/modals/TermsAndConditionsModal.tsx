// src/components/TermsAndConditionsModal.tsx
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TermsAndConditionsModal({ isOpen, onClose }: Props) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-11/12 overflow-y-auto rounded-2xl border border-zinc-400/20 bg-[#101012] p-6 text-zinc-100 shadow-2xl transition-all duration-300 md:w-3/4 lg:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            Terms and Conditions
          </h2>
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-500/30 bg-zinc-900/80 p-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
          <p>
            1. Acceptance of Terms: By accessing and using this
            administration portal, you accept and agree to be bound by the terms
            and provisions of this agreement.
          </p>
          <p>
            2. User Conduct: You agree to use this portal only for lawful
            purposes. Unauthorized access to data or systems is strictly
            prohibited.
          </p>
          <p>
            3. Intellectual Property: All content and materials on this
            portal, including text, graphics, and logos, are the property of
            Jewellplus and are protected by intellectual property laws.
          </p>
          <p>
            4. Limitation of Liability: Jewellplus is not liable for any
            direct, indirect, or incidental damages arising from the use or
            inability to use the portal.
          </p>
          <p>
            5. Privacy: Your use of the portal is also subject to our
            Privacy Policy, which is incorporated into these terms by reference.
          </p>
          <p>
            6. Governing Law: This agreement is governed by and construed in
            accordance with the laws of India.
          </p>
          <p>
            7. Changes to Terms: Jewellplus reserves the right to modify
            these terms at any time. Your continued use of the portal after any
            such changes constitutes your acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  );
}
