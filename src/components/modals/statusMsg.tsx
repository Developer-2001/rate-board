"use client";

import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  heading: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, heading, message }) => {
  const { theme } = useTheme();
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative flex w-full max-w-md scale-100 flex-col items-center rounded-2xl border ${theme.panelBorder} ${theme.surface} p-8 text-center shadow-2xl transition-transform`}
        onClick={(event) => event.stopPropagation()}
        style={{ color: theme.text, fontFamily: theme.fontBody }}
      >
        <h2 
          className="rounded-full border px-4 py-2 text-2xl font-bold"
          style={{ backgroundColor: `${theme.accent}15`, borderColor: theme.border, color: theme.text }}
        >
          {heading}
        </h2>
        <p className="mt-4" style={{ color: theme.textDim }}>{message}</p>
        <button
          type="button"
          onClick={onClose}
          className={`mt-6 rounded-lg border px-6 py-2 font-medium transition ${theme.topButton} ${theme.topButtonHover}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
