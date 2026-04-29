export type RateBoardThemeId =
  | "amber"
  | "emerald"
  | "ruby"
  | "graphite"
  | "pearl"
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
export const RATE_BOARD_THEME_DEFAULT_VERSION_STORAGE_KEY =
  "rate-board.ui.theme-default-version";
export const CURRENT_RATE_BOARD_THEME_DEFAULT_VERSION = "graphite-pro-v1";
export const DEFAULT_RATE_BOARD_THEME_ID: RateBoardThemeId = "graphite";

export const RATE_BOARD_THEMES: Record<RateBoardThemeId, RateBoardTheme> = {
  graphite: {
    id: "graphite",
    name: "Graphite Pro",
    description: "Support-card inspired dark graphite with clean contrast.",
    appBg: "bg-[#0a0a0b]",
    surface: "border-zinc-500/20 bg-[#101012]",
    panelBorder: "border-zinc-500/20",
    topButton: "border-white/10 bg-zinc-900/80 text-zinc-200",
    topButtonHover: "hover:border-zinc-300/40 hover:text-zinc-50",
    headingAccent: "text-zinc-100",
    liveText: "text-emerald-300",
    tableShell: "border-zinc-500/20 bg-zinc-950/50",
    tableHeader: "bg-zinc-200",
    tableHeaderText: "text-stone-950",
    goldRow: "bg-zinc-900 text-zinc-50",
    silverRow: "bg-[#111113] text-zinc-100",
    primaryValue: "text-zinc-100",
    secondaryValue: "text-white",
    mutedText: "text-zinc-300",
    preview: ["#e4e4e7", "#18181b", "#09090b"],
  },
  pearl: {
    id: "pearl",
    name: "Pearl Pro",
    description: "Bright inverse of Graphite Pro with crisp dark type.",
    appBg: "bg-[#f5f5f6]",
    surface: "border-zinc-950/20 bg-[#f9f9fa]",
    panelBorder: "border-zinc-950/20",
    topButton: "border-zinc-950/10 bg-white/85 text-zinc-900",
    topButtonHover: "hover:border-zinc-950/35 hover:text-black",
    headingAccent: "text-zinc-950",
    liveText: "text-emerald-700",
    tableShell: "border-zinc-950/20 bg-white/80",
    tableHeader: "bg-zinc-100",
    tableHeaderText: "text-slate-950",
    goldRow: "bg-zinc-100 text-zinc-950",
    silverRow: "bg-[#eeeeef] text-zinc-900",
    primaryValue: "text-zinc-950",
    secondaryValue: "text-black",
    mutedText: "text-zinc-600",
    preview: ["#09090b", "#f4f4f5", "#ffffff"],
  },
  amber: {
    id: "amber",
    name: "Amber Ledger",
    description: "Warm gold display for classic jewellery boards.",
    appBg: "bg-stone-950",
    surface: "border-amber-500/20 bg-[#1c1917]",
    panelBorder: "border-amber-500/20",
    topButton: "border-white/10 bg-stone-900/80 text-amber-300",
    topButtonHover: "hover:border-amber-300/40 hover:text-amber-200",
    headingAccent: "text-amber-300",
    liveText: "text-emerald-300",
    tableShell: "border-amber-500/20 bg-[#181513]",
    tableHeader: "bg-amber-400",
    tableHeaderText: "text-stone-950",
    goldRow: "bg-[#443928] text-amber-50",
    silverRow: "bg-[#2f2f32] text-stone-100",
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
    surface: "border-emerald-400/20 bg-[#07130f]",
    panelBorder: "border-emerald-400/20",
    topButton: "border-white/10 bg-emerald-950/70 text-emerald-200",
    topButtonHover: "hover:border-emerald-300/40 hover:text-emerald-100",
    headingAccent: "text-emerald-300",
    liveText: "text-emerald-300",
    tableShell: "border-emerald-400/20 bg-[#0d211b]",
    tableHeader: "bg-emerald-400",
    tableHeaderText: "text-slate-950",
    goldRow: "bg-[#1a352b] text-emerald-50",
    silverRow: "bg-[#26302c] text-stone-100",
    primaryValue: "text-lime-200",
    secondaryValue: "text-white",
    mutedText: "text-emerald-100/80",
    preview: ["#10b981", "#0f3d31", "#293633"],
  },
  ruby: {
    id: "ruby",
    name: "Ruby Chamber",
    description: "Deep red board with warm metallic contrast.",
    appBg: "bg-[#19080b]",
    surface: "border-rose-400/20 bg-[#19080b]",
    panelBorder: "border-rose-400/20",
    topButton: "border-white/10 bg-rose-950/70 text-rose-200",
    topButtonHover: "hover:border-rose-300/40 hover:text-rose-100",
    headingAccent: "text-rose-300",
    liveText: "text-emerald-300",
    tableShell: "border-rose-400/20 bg-[#290c12]",
    tableHeader: "bg-rose-500",
    tableHeaderText: "text-white",
    goldRow: "bg-[#4a1921] text-rose-50",
    silverRow: "bg-[#322428] text-stone-100",
    primaryValue: "text-orange-200",
    secondaryValue: "text-white",
    mutedText: "text-rose-100/75",
    preview: ["#f43f5e", "#5a1d27", "#403035"],
  },
  arctic: {
    id: "arctic",
    name: "Arctic Mint",
    description: "Bright ice tones with clean premium separation.",
    appBg: "bg-[#061315]",
    surface: "border-cyan-300/20 bg-[#061315]",
    panelBorder: "border-cyan-300/20",
    topButton: "border-white/10 bg-cyan-950/70 text-cyan-200",
    topButtonHover: "hover:border-cyan-300/40 hover:text-cyan-100",
    headingAccent: "text-cyan-300",
    liveText: "text-emerald-300",
    tableShell: "border-cyan-300/20 bg-[#081c1f]",
    tableHeader: "bg-cyan-300",
    tableHeaderText: "text-slate-950",
    goldRow: "bg-[#12353a] text-cyan-50",
    silverRow: "bg-[#213035] text-slate-100",
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

  const defaultVersion = window.localStorage.getItem(
    RATE_BOARD_THEME_DEFAULT_VERSION_STORAGE_KEY,
  );
  if (defaultVersion !== CURRENT_RATE_BOARD_THEME_DEFAULT_VERSION) {
    window.localStorage.setItem(
      RATE_BOARD_THEME_STORAGE_KEY,
      DEFAULT_RATE_BOARD_THEME_ID,
    );
    window.localStorage.setItem(
      RATE_BOARD_THEME_DEFAULT_VERSION_STORAGE_KEY,
      CURRENT_RATE_BOARD_THEME_DEFAULT_VERSION,
    );
    return DEFAULT_RATE_BOARD_THEME_ID;
  }

  const storedTheme = window.localStorage.getItem(RATE_BOARD_THEME_STORAGE_KEY);
  if (storedTheme && storedTheme in RATE_BOARD_THEMES) {
    return storedTheme as RateBoardThemeId;
  }

  return DEFAULT_RATE_BOARD_THEME_ID;
}
