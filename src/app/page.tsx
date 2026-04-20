"use client";

import Header from "@/components/Header";
import useFingerprint from "@/hooks/auth/useFingerprint";
import useAuthBootstrap from "@/hooks/auth/useAuthBootstrap";
import { useClient } from "@/context/ClientContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const fingerPrintId = useFingerprint();
  const { clientData } = useClient();
  const { isBootstrapping } = useAuthBootstrap({
    fingerPrintId,
    router,
    mode: "home",
  });

  if (isBootstrapping || !clientData) {
    return (
      <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
        <Header />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="rounded-2xl border border-amber-500/20 bg-stone-900 px-8 py-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-400" />
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
              Verifying session
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      <Header />
      <main className="flex flex-1 items-center justify-center p-6">
        <section className="w-full max-w-4xl rounded-[2rem] border border-amber-500/20 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_rgba(28,25,23,0.98)_55%)] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
            Rate Board
          </p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Authentication successful
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
            Your client session is restored from encrypted local storage. The live
            rate board API can now use a refreshed bearer token whenever we add it
            in the next iteration.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                Client ID
              </p>
              <p className="mt-2 text-xl font-medium text-white">
                {clientData.ClientId}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                System Name
              </p>
              <p className="mt-2 text-xl font-medium text-white">
                {clientData.SysName}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
