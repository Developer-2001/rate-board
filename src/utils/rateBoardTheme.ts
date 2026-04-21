export type RateBoardThemeId =
  | "amber"
  | "emerald"
  | "sapphire"
  | "ruby"
  | "graphite"
  | "arctic";

export type RateBoardTheme = {
  id: RateBoardThemeId;
  name: string;
  description: string;
  appBg: string;
  surface: string;
  panelBorder: string;
  topButton: string;
  topButtonHover: string;
  headingAccent: string;
  liveText: string;
  tableShell: string;
  tableHeader: string;
  tableHeaderText: string;
  goldRow: string;
  silverRow: string;
  primaryValue: string;
  secondaryValue: string;
  mutedText: string;
  preview: [string, string, string];
};

export const RATE_BOARD_THEME_STORAGE_KEY = "rate-board.ui.theme";
export const DEFAULT_RATE_BOARD_THEME_ID: RateBoardThemeId = "amber";

export const RATE_BOARD_THEMES: Record<RateBoardThemeId, RateBoardTheme> = {
  amber: {
    id: "amber",
    name: "Amber Ledger",
    description: "Warm gold display for classic jewellery boards.",
    appBg: "bg-stone-950",
    surface:
      "border-amber-500/20 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),rgba(28,25,23,0.99)_55%)]",
    panelBorder: "border-amber-500/20",
    topButton: "border-white/10 bg-stone-900/80 text-amber-300",
    topButtonHover: "hover:border-amber-300/40 hover:text-amber-200",
    headingAccent: "text-amber-300",
    liveText: "text-emerald-300",
    tableShell:
      "border-amber-500/20 bg-[linear-gradient(180deg,rgba(35,29,23,0.92),rgba(24,21,19,0.98))]",
    tableHeader: "bg-linear-to-r from-amber-500 via-amber-400 to-amber-600",
    tableHeaderText: "text-stone-950",
    goldRow:
      "bg-[linear-gradient(90deg,rgba(68,57,40,0.92),rgba(49,40,31,0.88))] text-amber-50",
    silverRow:
      "bg-[linear-gradient(90deg,rgba(47,47,50,0.95),rgba(34,34,37,0.9))] text-stone-100",
    primaryValue: "text-amber-300",
    secondaryValue: "text-white",
    mutedText: "text-stone-300",
    preview: ["#f59e0b", "#5b4631", "#2f2f32"],
  },
  emerald: {
    id: "emerald",
    name: "Emerald Hall",
    description: "Green luxury palette with soft brass highlights.",
    appBg: "bg-[#07130f]",
    surface:
      "border-emerald-400/20 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.16),rgba(7,19,15,0.99)_55%)]",
    panelBorder: "border-emerald-400/20",
    topButton: "border-white/10 bg-emerald-950/70 text-emerald-200",
    topButtonHover: "hover:border-emerald-300/40 hover:text-emerald-100",
    headingAccent: "text-emerald-300",
    liveText: "text-emerald-300",
    tableShell:
      "border-emerald-400/20 bg-[linear-gradient(180deg,rgba(13,33,27,0.94),rgba(7,19,15,0.98))]",
    tableHeader: "bg-linear-to-r from-emerald-500 via-teal-400 to-lime-400",
    tableHeaderText: "text-slate-950",
    goldRow:
      "bg-[linear-gradient(90deg,rgba(26,53,43,0.95),rgba(17,36,30,0.9))] text-emerald-50",
    silverRow:
      "bg-[linear-gradient(90deg,rgba(38,48,44,0.95),rgba(19,28,26,0.92))] text-stone-100",
    primaryValue: "text-lime-200",
    secondaryValue: "text-white",
    mutedText: "text-emerald-100/80",
    preview: ["#10b981", "#0f3d31", "#293633"],
  },
  sapphire: {
    id: "sapphire",
    name: "Sapphire Board",
    description: "Cool blue signage for modern showroom screens.",
    appBg: "bg-[#07101d]",
    surface:
      "border-sky-400/20 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),rgba(7,16,29,0.99)_55%)]",
    panelBorder: "border-sky-400/20",
    topButton: "border-white/10 bg-sky-950/70 text-sky-200",
    topButtonHover: "hover:border-sky-300/40 hover:text-sky-100",
    headingAccent: "text-sky-300",
    liveText: "text-cyan-300",
    tableShell:
      "border-sky-400/20 bg-[linear-gradient(180deg,rgba(9,24,40,0.94),rgba(7,16,29,0.98))]",
    tableHeader: "bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500",
    tableHeaderText: "text-white",
    goldRow:
      "bg-[linear-gradient(90deg,rgba(16,44,70,0.95),rgba(10,30,48,0.92))] text-sky-50",
    silverRow:
      "bg-[linear-gradient(90deg,rgba(27,39,58,0.95),rgba(15,23,38,0.92))] text-slate-100",
    primaryValue: "text-cyan-200",
    secondaryValue: "text-white",
    mutedText: "text-sky-100/80",
    preview: ["#0ea5e9", "#123c60", "#253249"],
  },
  ruby: {
    id: "ruby",
    name: "Ruby Chamber",
    description: "Deep red board with warm metallic contrast.",
    appBg: "bg-[#19080b]",
    surface:
      "border-rose-400/20 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.14),rgba(25,8,11,0.99)_55%)]",
    panelBorder: "border-rose-400/20",
    topButton: "border-white/10 bg-rose-950/70 text-rose-200",
    topButtonHover: "hover:border-rose-300/40 hover:text-rose-100",
    headingAccent: "text-rose-300",
    liveText: "text-emerald-300",
    tableShell:
      "border-rose-400/20 bg-[linear-gradient(180deg,rgba(41,12,18,0.94),rgba(25,8,11,0.98))]",
    tableHeader: "bg-linear-to-r from-rose-500 via-pink-500 to-orange-400",
    tableHeaderText: "text-white",
    goldRow:
      "bg-[linear-gradient(90deg,rgba(74,25,33,0.95),rgba(50,17,23,0.92))] text-rose-50",
    silverRow:
      "bg-[linear-gradient(90deg,rgba(50,36,40,0.95),rgba(34,24,27,0.92))] text-stone-100",
    primaryValue: "text-orange-200",
    secondaryValue: "text-white",
    mutedText: "text-rose-100/75",
    preview: ["#f43f5e", "#5a1d27", "#403035"],
  },
  graphite: {
    id: "graphite",
    name: "Graphite Pro",
    description: "Neutral premium contrast for long-form display use.",
    appBg: "bg-[#0a0a0b]",
    surface:
      "border-zinc-400/20 bg-[radial-gradient(circle_at_top,rgba(161,161,170,0.12),rgba(10,10,11,0.99)_55%)]",
    panelBorder: "border-zinc-400/20",
    topButton: "border-white/10 bg-zinc-900/80 text-zinc-200",
    topButtonHover: "hover:border-zinc-300/40 hover:text-zinc-50",
    headingAccent: "text-zinc-300",
    liveText: "text-emerald-300",
    tableShell:
      "border-zinc-400/20 bg-[linear-gradient(180deg,rgba(28,28,31,0.94),rgba(15,15,17,0.98))]",
    tableHeader: "bg-linear-to-r from-zinc-300 via-stone-200 to-zinc-400",
    tableHeaderText: "text-stone-950",
    goldRow:
      "bg-[linear-gradient(90deg,rgba(54,54,58,0.95),rgba(35,35,39,0.92))] text-zinc-50",
    silverRow:
      "bg-[linear-gradient(90deg,rgba(32,36,42,0.95),rgba(22,25,29,0.92))] text-slate-100",
    primaryValue: "text-zinc-200",
    secondaryValue: "text-white",
    mutedText: "text-zinc-300/75",
    preview: ["#d4d4d8", "#3f3f46", "#24262c"],
  },
  arctic: {
    id: "arctic",
    name: "Arctic Mint",
    description: "Bright ice tones with clean premium separation.",
    appBg: "bg-[#061315]",
    surface:
      "border-cyan-300/20 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.16),rgba(6,19,21,0.99)_55%)]",
    panelBorder: "border-cyan-300/20",
    topButton: "border-white/10 bg-cyan-950/70 text-cyan-200",
    topButtonHover: "hover:border-cyan-300/40 hover:text-cyan-100",
    headingAccent: "text-cyan-300",
    liveText: "text-emerald-300",
    tableShell:
      "border-cyan-300/20 bg-[linear-gradient(180deg,rgba(8,28,31,0.94),rgba(6,19,21,0.98))]",
    tableHeader: "bg-linear-to-r from-cyan-300 via-teal-200 to-sky-300",
    tableHeaderText: "text-slate-950",
    goldRow:
      "bg-[linear-gradient(90deg,rgba(18,53,58,0.95),rgba(11,33,37,0.92))] text-cyan-50",
    silverRow:
      "bg-[linear-gradient(90deg,rgba(33,48,53,0.95),rgba(19,29,32,0.92))] text-slate-100",
    primaryValue: "text-teal-100",
    secondaryValue: "text-white",
    mutedText: "text-cyan-100/80",
    preview: ["#67e8f9", "#15434a", "#324a51"],
  },
};

export function getStoredRateBoardThemeId() {
  if (typeof window === "undefined") {
    return DEFAULT_RATE_BOARD_THEME_ID;
  }

  const storedTheme = window.localStorage.getItem(RATE_BOARD_THEME_STORAGE_KEY);
  if (storedTheme && storedTheme in RATE_BOARD_THEMES) {
    return storedTheme as RateBoardThemeId;
  }

  return DEFAULT_RATE_BOARD_THEME_ID;
}
