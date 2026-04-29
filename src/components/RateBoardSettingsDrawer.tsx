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

const WHITE_THEME_IDS: RateBoardThemeId[] = [
  "pearl",
  "warmSand",
  "blushRose",
  "sageMist",
  "softLavender",
  "powderBlue",
  "creamTerracotta",
];

const BLACK_THEME_IDS: RateBoardThemeId[] = [
  "graphite",
  "amber",
  "emerald",
  "ruby",
  "arctic",
  "navyRose",
];

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
  const whiteThemes = themes.filter((t) => WHITE_THEME_IDS.includes(t.id));
  const blackThemes = themes.filter((t) => BLACK_THEME_IDS.includes(t.id));
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
            {/* <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">
                Themes
              </p>
              <p className="mt-2 text-sm text-stone-500">
                The selected theme is saved on this device for future visits.
              </p>
            </div> */}

            {/* White Themes */}
            <div className="mb-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
                White Themes
              </h3>
              <div className="grid gap-3 grid-cols-2">
                {whiteThemes.map((theme) => {
                  const isSelected = theme.id === selectedThemeId;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => onThemeChange(theme.id)}
                      className="relative cursor-pointer rounded-3xl border p-4 text-left transition hover:scale-[1.01]"
                      style={{
                        background: theme.cardBg,
                        borderColor: isSelected ? theme.accent : theme.border,
                        boxShadow: isSelected
                          ? `0 0 0 1px ${theme.accent}55`
                          : "none",
                      }}
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
                        className="mt-4 text-sm font-semibold uppercase tracking-[0.24em]"
                        style={{ color: theme.text }}
                      >
                        {theme.name}
                      </p>
                      <p
                        className="mt-2 text-sm leading-6"
                        style={{ color: theme.textDim }}
                      >
                        {theme.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Black Themes */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
                Black Themes
              </h3>
              <div className="grid gap-3 grid-cols-2">
                {blackThemes.map((theme) => {
                  const isSelected = theme.id === selectedThemeId;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => onThemeChange(theme.id)}
                      className="relative cursor-pointer rounded-3xl border p-4 text-left transition hover:scale-[1.01]"
                      style={{
                        background: theme.cardBg,
                        borderColor: isSelected ? theme.accent : theme.border,
                        boxShadow: isSelected
                          ? `0 0 0 1px ${theme.accent}55`
                          : "none",
                      }}
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
                        className="mt-4 text-sm font-semibold uppercase tracking-[0.24em]"
                        style={{ color: theme.text }}
                      >
                        {theme.name}
                      </p>
                      <p
                        className="mt-2 text-sm leading-6"
                        style={{ color: theme.textDim }}
                      >
                        {theme.description}
                      </p>
                    </button>
                  );
                })}
              </div>
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
