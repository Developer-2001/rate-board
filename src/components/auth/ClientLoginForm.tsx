import React from "react";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  corporateId: string;
  setCorporateId: (value: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  loading: boolean;
  setShowTerms: (show: boolean) => void;
};

export default function ClientLoginForm({
  corporateId,
  setCorporateId,
  error,
  onSubmit,
  isLoading,
  loading,
  setShowTerms,
}: Props) {
  const { theme } = useTheme();

  const inputClass = `w-full rounded-2xl border ${theme.panelBorder} bg-white/50 px-4 py-3 text-base outline-none transition-all duration-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-${theme.accent}/15 ${
    isLoading ? "cursor-not-allowed opacity-70" : "hover:border-zinc-400/40"
  }`;

  const buttonClass = `flex min-h-[52px] w-full items-center justify-center rounded-2xl border transition-all duration-300 ${theme.topButton} ${theme.topButtonHover} text-sm font-semibold uppercase tracking-[0.25em] shadow-lg ${
    isLoading || loading
      ? "cursor-wait opacity-70"
      : "hover:-translate-y-0.5 hover:shadow-xl"
  }`;

  return (
    <section 
      className={`relative w-full rounded-4xl border ${theme.surface} p-6 shadow-2xl sm:p-8 lg:p-10`}
      style={{ color: theme.text }}
    >
      {loading && (
        <div className={`absolute inset-0 z-10 flex items-center justify-center rounded-4xl bg-white/20 backdrop-blur-sm`}>
          <div className="text-center">
            <div 
              className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" 
              style={{ borderColor: `${theme.accent}33`, borderTopColor: theme.accent }}
            />
            <p className="text-xs uppercase tracking-[0.35em]" style={{ color: theme.textDim }}>
              Preparing session
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.95fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: theme.accent }}>
            Rate Board
          </p>
          <h2 className="text-3xl font-semibold sm:text-4xl" style={{ color: theme.text }}>
            Corporate authentication
          </h2>
          <p className="mt-3 text-sm leading-7 sm:text-base" style={{ color: theme.textDim }}>
            Connect this display to the correct jewellery store account before we
            start streaming your live rate board data.
          </p>

          <div className="mt-8 grid gap-4 grid-cols-2">
            <div className="rounded-2xl border bg-white/5 p-5" style={{ borderColor: `${theme.accent}22` }}>
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: theme.textDim }}>
                Secure Storage
              </p>
              <p className="mt-2 text-lg font-medium" style={{ color: theme.text }}>
                Encrypted local session
              </p>
            </div>
            <div className="rounded-2xl border bg-white/5 p-5" style={{ borderColor: `${theme.accent}22` }}>
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: theme.textDim }}>
                Device Check
              </p>
              <p className="mt-2 text-lg font-medium" style={{ color: theme.text }}>
                Fingerprint verification
              </p>
            </div>
          </div>
        </div>

        <div className="relative rounded-[1.75rem] border bg-white/30 p-5 shadow-sm sm:p-6" style={{ borderColor: `${theme.accent}33` }}>
          <form className="flex flex-col space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="corporateId"
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: theme.textDim }}
              >
                Enter Corporate-ID
              </label>
              <input
                type="text"
                id="corporateId"
                name="corporateId"
                autoComplete="off"
                placeholder="e.g., JWP-12345"
                value={corporateId}
                autoFocus
                onChange={(e) => {
                  const val = e.target.value.replace(/^\s+|\s+$/g, "");
                  setCorporateId(val);
                }}
                required
                className={`${inputClass} text-zinc-900`}
                disabled={isLoading || loading}
              />
              {error && <p className="mt-2 text-sm font-medium text-rose-500">{error}</p>}
            </div>

            <button
              type="submit"
              className={buttonClass}
              disabled={isLoading || loading}
            >
              {isLoading ? "Processing..." : "Proceed"}
            </button>
          </form>

          <p className="mt-6 text-xs leading-6" style={{ color: theme.textDim }}>
            By proceeding, you agree to our{" "}
            <button
              type="button"
              className="font-medium underline underline-offset-4 transition-colors"
              style={{ color: theme.text }}
              onClick={() => setShowTerms(true)}
            >
              terms
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="font-medium underline underline-offset-4 transition-colors"
              style={{ color: theme.text }}
              onClick={() => setShowTerms(true)}
            >
              conditions
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
