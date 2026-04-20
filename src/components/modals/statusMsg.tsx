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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md scale-100 flex-col items-center rounded-2xl bg-white p-8 text-center shadow-2xl transition-transform"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="rounded-full border-2 border-gray-500 px-4 py-2 text-2xl font-bold text-red-400">
          {heading}
        </h2>
        <p className="mt-4 text-gray-700">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-lg bg-gray-500 px-6 py-2 text-white transition hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
