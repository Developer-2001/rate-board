"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  heading: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, heading, message }) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md scale-100 flex-col items-center rounded-2xl border border-zinc-400/20 bg-[#101012] p-8 text-center text-zinc-100 shadow-2xl transition-transform"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="rounded-full border border-zinc-500/30 bg-zinc-950/60 px-4 py-2 text-2xl font-bold text-white">
          {heading}
        </h2>
        <p className="mt-4 text-zinc-300">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-lg border border-zinc-300/20 bg-zinc-200 px-6 py-2 font-medium text-zinc-950 transition hover:bg-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
