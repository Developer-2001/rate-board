import React from "react";

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
  const inputClass = `w-full rounded-2xl border border-zinc-500/20 bg-zinc-950/50 px-4 py-3 text-base text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-zinc-300/60 focus:bg-zinc-950/70 focus:ring-2 focus:ring-zinc-300/15 ${
    isLoading ? "cursor-not-allowed opacity-70" : "hover:border-white/20"
  }`;

  const buttonClass = `flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-zinc-300/20 bg-zinc-200 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-zinc-950 shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition-all duration-300 ${
    isLoading || loading
      ? "cursor-wait opacity-70"
      : "hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_45px_rgba(0,0,0,0.32)]"
  }`;

  return (
    <section className="relative w-full rounded-4xl border border-zinc-400/20 bg-[#101012] p-6 text-stone-100 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-4xl bg-stone-950/70 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-zinc-500/30 border-t-zinc-200" />
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-300">
              Preparing session
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.95fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-300">
            Rate Board
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Corporate authentication
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
            Connect this display to the correct jewellery store account before we
            start streaming your live rate board data.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                Secure Storage
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                Encrypted local session
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                Device Check
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                Fingerprint verification
              </p>
            </div>
          </div>
        </div>

        <div className="relative rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
          <form className="flex flex-col space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="corporateId"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400"
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
                onChange={(e) => {
                  const val = e.target.value.replace(/^\s+|\s+$/g, "");
                  setCorporateId(val);
                }}
                required
                className={inputClass}
                disabled={isLoading || loading}
              />
              {error && <p className="mt-2 text-sm font-medium text-rose-300">{error}</p>}
            </div>

            <button
              type="submit"
              className={buttonClass}
              disabled={isLoading || loading}
            >
              {isLoading ? "Processing..." : "Proceed"}
            </button>
          </form>

          <p className="mt-6 text-xs leading-6 text-stone-400">
            By proceeding, you agree to our{" "}
            <button
              type="button"
              className="text-zinc-200 underline underline-offset-4 transition-colors hover:text-white"
              onClick={() => setShowTerms(true)}
            >
              terms
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-zinc-200 underline underline-offset-4 transition-colors hover:text-white"
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
