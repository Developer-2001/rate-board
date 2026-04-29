"use client";

import type { ClientData } from "@/types/auth";
import type { RateBoardTheme, RateBoardThemeId } from "@/utils/rateBoardTheme";
import { LogOut, Settings2, X } from "lucide-react";

type RateBoardSettingsDrawerProps = {
  open: boolean;
  clientData: ClientData | null;
  firmName?: string | null;
  themes: RateBoardTheme[];
  selectedThemeId: RateBoardThemeId;
  onClose: () => void;
  onThemeChange: (themeId: RateBoardThemeId) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
};

const themeCardClasses: Record<
  RateBoardThemeId,
  {
    card: string;
    title: string;
    description: string;
    selected: string;
  }
> = {
  amber: {
    card: "border-amber-500/20 bg-[#1c1917] hover:border-amber-300/35",
    title: "text-amber-50",
    description: "text-amber-100/70",
    selected:
      "border-amber-300 bg-[#281f0a] shadow-[0_0_0_1px_rgba(252,211,77,0.22)]",
  },
  emerald: {
    card: "border-emerald-500/20 bg-[#0a1411] hover:border-emerald-300/35",
    title: "text-emerald-50",
    description: "text-emerald-100/70",
    selected:
      "border-emerald-300 bg-[#071c16] shadow-[0_0_0_1px_rgba(110,231,183,0.22)]",
  },
  ruby: {
    card: "border-rose-500/20 bg-[#1f0c10] hover:border-rose-300/35",
    title: "text-rose-50",
    description: "text-rose-100/70",
    selected:
      "border-rose-300 bg-[#2d0b14] shadow-[0_0_0_1px_rgba(253,164,175,0.22)]",
  },
  graphite: {
    card: "border-zinc-500/20 bg-zinc-950/50 hover:border-zinc-400/40 hover:bg-zinc-900/70",
    title: "text-zinc-50",
    description: "text-zinc-300",
    selected:
      "border-zinc-300/50 bg-[#101012] shadow-[0_0_0_1px_rgba(212,212,216,0.18)]",
  },
  pearl: {
    card: "border-zinc-300 bg-zinc-50 hover:border-zinc-500/50 hover:bg-white",
    title: "text-zinc-950",
    description: "text-zinc-600",
    selected:
      "border-zinc-950/50 bg-white shadow-[0_0_0_1px_rgba(24,24,27,0.16)]",
  },
  arctic: {
    card: "border-cyan-400/20 bg-[#0a1618] hover:border-cyan-300/35",
    title: "text-cyan-50",
    description: "text-cyan-100/70",
    selected:
      "border-cyan-300 bg-[#0a1f22] shadow-[0_0_0_1px_rgba(165,243,252,0.22)]",
  },
};

export default function RateBoardSettingsDrawer({
  open,
  clientData,
  firmName,
  themes,
  selectedThemeId,
  onClose,
  onThemeChange,
  onLogout,
  isLoggingOut,
}: RateBoardSettingsDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-400/20 bg-stone-950/95 text-stone-100 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-center justify-between border-b border-zinc-400/20 px-2 py-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/5 text-zinc-300">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Display Settings
              </h2>
              <p className="text-sm text-stone-400">
                Customize this rate board
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-stone-300 transition hover:border-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <section className="rounded-3xl border border-zinc-400/20 bg-[#101012] p-5">
            
            <div className=" space-y-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  Firm Name
                </p>
                <p className="mt-1 text-lg font-medium text-white">
                  {firmName || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  System Name
                </p>
                <p className="mt-1 text-base text-stone-200">
                  {clientData?.SysName || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                  Client ID
                </p>
                <p className="mt-1 text-base text-stone-200">
                  {clientData?.ClientId || "-"}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                Themes
              </p>
              <p className="mt-2 text-sm text-stone-500">
                The selected theme is saved on this device for future visits.
              </p>
            </div>

            <div className="grid gap-3 grid-cols-2">
              {themes.map((theme) => {
                const isSelected = theme.id === selectedThemeId;
                const cardTheme = themeCardClasses[theme.id];

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onThemeChange(theme.id)}
                    className={`relative rounded-3xl cursor-pointer border p-4 text-left transition ${
                      isSelected ? cardTheme.selected : cardTheme.card
                    }`}
                  >
                    <div className="flex gap-2">
                      {theme.preview.map((color) => (
                        <span
                          key={color}
                          className="h-4 w-8 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p
                      className={`mt-4 text-sm font-semibold uppercase tracking-[0.24em] ${cardTheme.title}`}
                    >
                      {theme.name}
                    </p>
                    <p
                      className={`mt-2 text-sm leading-6 ${cardTheme.description}`}
                    >
                      {theme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="border-t border-zinc-400/20 px-4 py-3">
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className={`flex w-full items-center cursor-pointer justify-center gap-3 rounded-2xl border border-rose-400/30 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition ${
              isLoggingOut
                ? "cursor-wait bg-rose-500/20 text-rose-200"
                : "bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
            }`}
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Signing Out" : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
