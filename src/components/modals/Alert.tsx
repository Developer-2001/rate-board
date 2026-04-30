import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface AlertProps {
  title: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

const variantClasses = {
  success: "border-emerald-400/30 bg-[#101012] text-zinc-100",
  error: "border-rose-400/35 bg-[#101012] text-zinc-100",
  warning: "border-amber-300/35 bg-[#101012] text-zinc-100",
  info: "border-zinc-300/30 bg-[#101012] text-zinc-100",
};

const titleClasses = {
  success: "text-emerald-300",
  error: "text-rose-300",
  warning: "text-amber-200",
  info: "text-zinc-200",
};

const icons = {
  success: (
    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#bbf7d0" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#22c55e"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#fecaca" />
      <path
        d="M15 9l-6 6M9 9l6 6"
        stroke="#ef4444"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#fef9c3" />
      <path
        d="M12 8v4m0 4h.01"
        stroke="#eab308"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#bae6fd" />
      <path
        d="M12 8h.01M12 12v4"
        stroke="#0ea5e9"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const Alert: React.FC<AlertProps> = ({ title, message, onClose }) => {
  const { theme } = useTheme();

  const dynamicVariantClasses = {
    success: `border-emerald-400/30 ${theme.surface}`,
    error: `border-rose-400/35 ${theme.surface}`,
    warning: `border-amber-300/35 ${theme.surface}`,
    info: `border-zinc-300/30 ${theme.surface}`,
  };

  const dynamicTitleClasses = {
    success: "text-emerald-500",
    error: "text-rose-500",
    warning: "text-amber-500",
    info: theme.accent,
  };
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <div
      className={`fixed right-4 z-[9999] rounded-lg border p-4 text-lg shadow-2xl animate-slideIn ${dynamicVariantClasses[title]} ${onClose ? "cursor-pointer" : ""}`}
      onClick={onClose}
      role="alert"
      style={{
        minWidth: 320,
        maxWidth: 400,
        top: "calc(1.5rem + env(safe-area-inset-top))",
        color: theme.text,
      }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">{icons[title]}</div>
        <div className="flex-1">
          <h4 
            className={`mb-1 text-base font-bold capitalize`}
            style={{ color: dynamicTitleClasses[title] }}
          >{title}</h4>
          <p className="text-sm" style={{ color: theme.textDim }}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
