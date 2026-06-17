"use client";

import type { RateBoardTheme, RateBoardThemeId } from "@/utils/rateBoardTheme";
import { LogOut, Settings2, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import type { DisplayRateItem } from "@/types/rateBoard";
import { getMetalDisplay } from "@/utils/rateFormatter";

type RateBoardSettingsDrawerProps = {
  open: boolean;
  themes: RateBoardTheme[];
  selectedThemeId: RateBoardThemeId;
  onClose: () => void;
  onThemeChange: (themeId: RateBoardThemeId) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  goldUnit: "Gm" | "10Gm";
  onGoldUnitChange: (unit: "Gm" | "10Gm") => void;
  silverUnit: "Gm" | "Kg";
  onSilverUnitChange: (unit: "Gm" | "Kg") => void;
  metalTextScale: number;
  onMetalTextScaleChange: (scale: number) => void;
  rateFormat: "formatted" | "plain";
  onRateFormatChange: (format: "formatted" | "plain") => void;
  rates: DisplayRateItem[];
  metalOverrides: Record<string, { title: string; suffix: string }>;
  onOverrideChange: (
    id: string,
    field: "title" | "suffix",
    value: string,
    defaultTitle: string,
    defaultSuffix: string,
  ) => void;
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

const OLD_THEME_IDS: RateBoardThemeId[] = ["oldSoftware"];

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
  themes,
  selectedThemeId,
  onClose,
  onThemeChange,
  onLogout,
  isLoggingOut,
  goldUnit,
  onGoldUnitChange,
  silverUnit,
  onSilverUnitChange,
  metalTextScale,
  onMetalTextScaleChange,
  rateFormat,
  onRateFormatChange,
  rates,
  metalOverrides,
  onOverrideChange,
}: RateBoardSettingsDrawerProps) {
  const { theme: currentTheme } = useTheme();
  const oldThemes = themes.filter((t) => OLD_THEME_IDS.includes(t.id));
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
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } ${currentTheme.surface}`}
        style={{
          color: currentTheme.text,
          borderColor: currentTheme.panelBorder,
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div
          className={`flex items-center justify-between border-b px-2 py-2`}
          style={{ borderColor: currentTheme.panelBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="rounded-2xl p-1"
              style={{ backgroundColor: `${currentTheme.accent}15` }}
            >
              <Settings2
                className="h-5 w-5"
                style={{ color: currentTheme.accent }}
              />
            </div>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: currentTheme.text }}
              >
                Display Settings
              </h2>
              <p className="text-sm" style={{ color: currentTheme.textDim }}>
                Customize this rate board
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl cursor-pointer border p-2 transition ${currentTheme.topButton} ${currentTheme.topButtonHover}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-hide">
          <section className="mt-2">
            {/* Units Settings */}
            <div className="mb-6">
              <h3
                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: currentTheme.textDim }}
              >
                UNITS
              </h3>

              <div className="mb-4">
                <p
                  className="mb-2 text-sm"
                  style={{ color: currentTheme.text }}
                >
                  Gold
                </p>
                <div
                  className="flex overflow-hidden rounded-xl border"
                  style={{ borderColor: currentTheme.border }}
                >
                  <button
                    type="button"
                    onClick={() => onGoldUnitChange("Gm")}
                    className="flex-1 py-2.5 text-sm font-semibold transition border-r"
                    style={{
                      borderColor: currentTheme.border,
                      background:
                        goldUnit === "Gm"
                          ? `${currentTheme.accent}15`
                          : "transparent",
                      color:
                        goldUnit === "Gm"
                          ? currentTheme.accent
                          : currentTheme.textDim,
                    }}
                  >
                    Per Gm
                  </button>
                  <button
                    type="button"
                    onClick={() => onGoldUnitChange("10Gm")}
                    className="flex-1 py-2.5 text-sm font-semibold transition"
                    style={{
                      background:
                        goldUnit === "10Gm"
                          ? `${currentTheme.accent}15`
                          : "transparent",
                      color:
                        goldUnit === "10Gm"
                          ? currentTheme.accent
                          : currentTheme.textDim,
                    }}
                  >
                    Per 10 Gm
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <p
                  className="mb-2 text-sm"
                  style={{ color: currentTheme.text }}
                >
                  Silver
                </p>
                <div
                  className="flex overflow-hidden rounded-xl border"
                  style={{ borderColor: currentTheme.border }}
                >
                  <button
                    type="button"
                    onClick={() => onSilverUnitChange("Gm")}
                    className="flex-1 py-2.5 text-sm font-semibold transition border-r"
                    style={{
                      borderColor: currentTheme.border,
                      background:
                        silverUnit === "Gm"
                          ? `${currentTheme.accent}15`
                          : "transparent",
                      color:
                        silverUnit === "Gm"
                          ? currentTheme.accent
                          : currentTheme.textDim,
                    }}
                  >
                    Per Gm
                  </button>
                  <button
                    type="button"
                    onClick={() => onSilverUnitChange("Kg")}
                    className="flex-1 py-2.5 text-sm font-semibold transition"
                    style={{
                      background:
                        silverUnit === "Kg"
                          ? `${currentTheme.accent}15`
                          : "transparent",
                      color:
                        silverUnit === "Kg"
                          ? currentTheme.accent
                          : currentTheme.textDim,
                    }}
                  >
                    Per Kg
                  </button>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="mb-6">
              <h3
                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: currentTheme.textDim }}
              >
                Display
              </h3>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm" style={{ color: currentTheme.text }}>
                    Metal text size
                  </p>
                  <span
                    className="rounded-lg px-2 py-1 text-xs font-semibold tabular-nums"
                    style={{
                      background: `${currentTheme.accent}15`,
                      color: currentTheme.accent,
                    }}
                  >
                    {metalTextScale}%
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={120}
                  step={5}
                  value={metalTextScale}
                  onChange={(event) =>
                    onMetalTextScaleChange(Number(event.target.value))
                  }
                  className="w-full accent-current"
                  style={{ color: currentTheme.accent }}
                />
                <div
                  className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: currentTheme.textDim }}
                >
                  <span>Fit</span>
                  <span>Large</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm" style={{ color: currentTheme.text }}>
                  Rate format
                </p>
                <div
                  className="flex overflow-hidden rounded-xl border"
                  style={{ borderColor: currentTheme.border }}
                >
                  <button
                    type="button"
                    onClick={() => onRateFormatChange("formatted")}
                    className="flex-1 border-r py-2.5 text-sm font-semibold transition"
                    style={{
                      borderColor: currentTheme.border,
                      background:
                        rateFormat === "formatted"
                          ? `${currentTheme.accent}15`
                          : "transparent",
                      color:
                        rateFormat === "formatted"
                          ? currentTheme.accent
                          : currentTheme.textDim,
                    }}
                  >
                    1,00,000
                  </button>
                  <button
                    type="button"
                    onClick={() => onRateFormatChange("plain")}
                    className="flex-1 py-2.5 text-sm font-semibold transition"
                    style={{
                      background:
                        rateFormat === "plain"
                          ? `${currentTheme.accent}15`
                          : "transparent",
                      color:
                        rateFormat === "plain"
                          ? currentTheme.accent
                          : currentTheme.textDim,
                    }}
                  >
                    100000
                  </button>
                </div>
              </div>
            </div>

            {/* Display Names Settings */}
            <div className="mb-6">
              <h3
                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: currentTheme.textDim }}
              >
                Custom Names
              </h3>

              <div className="mb-4">
                <p
                  className="mb-2 text-sm"
                  style={{ color: currentTheme.text }}
                >
                  Gold
                </p>
                <div className="flex flex-col gap-2">
                  {rates
                    .filter((r) => r.metal === "Gold")
                    .map((rate) => {
                      const defaultDisplay = getMetalDisplay(
                        rate.label,
                        rate.metal,
                      );
                      const titleValue =
                        metalOverrides[rate.id]?.title ?? defaultDisplay.title;
                      const suffixValue =
                        metalOverrides[rate.id]?.suffix ??
                        defaultDisplay.suffix;

                      return (
                        <div key={rate.id} className="flex gap-2">
                          <input
                            type="text"
                            value={titleValue}
                            onChange={(e) =>
                              onOverrideChange(
                                rate.id,
                                "title",
                                e.target.value,
                                defaultDisplay.title,
                                defaultDisplay.suffix,
                              )
                            }
                            className="flex-1 uppercase rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none"
                            style={{
                              background: currentTheme.cardBg,
                              borderColor: currentTheme.border,
                              color: currentTheme.text,
                            }}
                            placeholder="Enter label"
                          />
                          <input
                            type="text"
                            value={suffixValue}
                            onChange={(e) =>
                              onOverrideChange(
                                rate.id,
                                "suffix",
                                e.target.value,
                                defaultDisplay.title,
                                defaultDisplay.suffix,
                              )
                            }
                            className="flex-1 uppercase rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none"
                            style={{
                              background: currentTheme.cardBg,
                              borderColor: currentTheme.border,
                              color: currentTheme.text,
                            }}
                            placeholder="Enter suffix"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="mb-2">
                <p
                  className="mb-2 text-sm"
                  style={{ color: currentTheme.text }}
                >
                  Silver
                </p>
                <div className="flex flex-col gap-2">
                  {rates
                    .filter((r) => r.metal === "Silver")
                    .map((rate) => {
                      const defaultDisplay = getMetalDisplay(
                        rate.label,
                        rate.metal,
                      );
                      const titleValue =
                        metalOverrides[rate.id]?.title ?? defaultDisplay.title;
                      const suffixValue =
                        metalOverrides[rate.id]?.suffix ??
                        defaultDisplay.suffix;

                      return (
                        <div key={rate.id} className="flex gap-2">
                          <input
                            type="text"
                            value={titleValue}
                            onChange={(e) =>
                              onOverrideChange(
                                rate.id,
                                "title",
                                e.target.value,
                                defaultDisplay.title,
                                defaultDisplay.suffix,
                              )
                            }
                            className="flex-1 uppercase rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none"
                            style={{
                              background: currentTheme.cardBg,
                              borderColor: currentTheme.border,
                              color: currentTheme.text,
                            }}
                            placeholder="Enter label"
                          />
                          <input
                            type="text"
                            value={suffixValue}
                            onChange={(e) =>
                              onOverrideChange(
                                rate.id,
                                "suffix",
                                e.target.value,
                                defaultDisplay.title,
                                defaultDisplay.suffix,
                              )
                            }
                            className="flex-1 uppercase rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none"
                            style={{
                              background: currentTheme.cardBg,
                              borderColor: currentTheme.border,
                              color: currentTheme.text,
                            }}
                            placeholder="Enter suffix"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Old Theme */}
            <div className="mb-4">
              <h3
                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: currentTheme.textDim }}
              >
                Old Theme
              </h3>
              <div className="grid gap-3 grid-cols-2">
                {oldThemes.map((theme) => {
                  const isSelected = theme.id === selectedThemeId;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => onThemeChange(theme.id)}
                      className="relative cursor-pointer rounded-3xl border p-4 text-left transition hover:scale-[1.01]"
                      style={{
                        background: theme.cardBg,
                        borderColor: isSelected ? theme.accent : "#d1d5db",
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

            {/* White Themes */}
            <div className="mb-4">
              <h3
                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: currentTheme.textDim }}
              >
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
              <h3
                className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: currentTheme.textDim }}
              >
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

        <div
          className="border-t px-4 py-3"
          style={{ borderColor: currentTheme.panelBorder }}
        >
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className={`flex w-full items-center cursor-pointer justify-center gap-3 rounded-2xl border border-rose-400/30 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition ${
              isLoggingOut
                ? "cursor-wait bg-rose-500/20 text-rose-200"
                : "bg-rose-500/10 text-rose-700 hover:bg-rose-500/20"
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
