"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  CURRENT_RATE_BOARD_THEME_DEFAULT_VERSION,
  getStoredRateBoardThemeId,
  RATE_BOARD_THEMES,
  RATE_BOARD_THEME_DEFAULT_VERSION_STORAGE_KEY,
  RATE_BOARD_THEME_STORAGE_KEY,
  RateBoardTheme,
  RateBoardThemeId,
} from "@/utils/rateBoardTheme";

type ThemeContextType = {
  themeId: RateBoardThemeId;
  theme: RateBoardTheme;
  setThemeId: (id: RateBoardThemeId) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeId, setThemeIdState] = useState<RateBoardThemeId>(
    getStoredRateBoardThemeId,
  );

  const setThemeId = useCallback((nextThemeId: RateBoardThemeId) => {
    setThemeIdState(nextThemeId);
    window.localStorage.setItem(RATE_BOARD_THEME_STORAGE_KEY, nextThemeId);
    window.localStorage.setItem(
      RATE_BOARD_THEME_DEFAULT_VERSION_STORAGE_KEY,
      CURRENT_RATE_BOARD_THEME_DEFAULT_VERSION,
    );
  }, []);

  const theme = useMemo(() => RATE_BOARD_THEMES[themeId], [themeId]);

  return (
    <ThemeContext.Provider value={{ themeId, theme, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
