"use client";

import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

interface SkeletonRailProps {
  className?: string;
  variant?: "default" | "error";
}

export function SkeletonRail({
  className,
  variant = "default"
}: SkeletonRailProps) {
  const { skeleton } = useTheme();

  const cardStyle = variant === "error" ? skeleton.errorCard : skeleton.card;
  const textStyle = variant === "error" ? skeleton.errorText : skeleton.text;
  const containerStyle =
    variant === "error"
      ? skeleton.container.replace("animate-pulse", "")
      : skeleton.container;

  return (
    <div className={cn("-ml-24 md:-ml-32", className)}>
      <div className={containerStyle}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2 opacity-80">
            <div className={cn(cardStyle, "flex items-center justify-center")}>
              {variant === "error" ? (
                <AlertCircle className="h-8 w-8 text-red-500/40" />
              ) : (
                <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent opacity-50" />
              )}
            </div>
            <div className={textStyle} />
          </div>
        ))}
      </div>
    </div>
  );
}
