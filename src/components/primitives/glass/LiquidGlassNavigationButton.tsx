"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

interface LiquidGlassNavigationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right";
  visible: boolean;
}

export function LiquidGlassNavigationButton({
  direction,
  visible,
  className,
  ...props
}: LiquidGlassNavigationButtonProps) {
  const theme = useTheme().rail.button;

  return (
    <button
      className={cn(
        theme.base,
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
        className
      )}
      {...props}
    >
      {direction === "left" ? (
        <ChevronLeft className={theme.icon} />
      ) : (
        <ChevronRight className={theme.icon} />
      )}
    </button>
  );
}
