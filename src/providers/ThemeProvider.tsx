"use client";
import { createContext, useContext } from "react";

import { DefaultLiquidTheme } from "../theme/instructors/DefaultLiquidTheme";

import type { ReactNode } from "react";
import type { UITheme } from "../theme/types";

const ThemeContext = createContext<UITheme>(DefaultLiquidTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={DefaultLiquidTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
