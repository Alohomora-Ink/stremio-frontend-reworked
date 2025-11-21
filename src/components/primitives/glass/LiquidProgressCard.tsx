"use client";

import { LiquidGlassCard } from "./LiquidGlassCard";
import { cn } from "@/lib/utils";

interface LiquidProgressCardProps
  extends React.ComponentProps<typeof LiquidGlassCard> {
  progress: number;
}

export function LiquidProgressCard({
  progress,
  className,
  onClick,
  ...props
}: LiquidProgressCardProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  return (
    <div
      className={cn(
        "group/progress relative cursor-pointer",
        "rounded-2xl",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-4 hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <LiquidGlassCard
        {...props}
        className="mb-0 transition-none! hover:translate-y-0! hover:scale-100!"
      />
      <div className="absolute right-3 bottom-3 left-3 z-20 h-1.5 overflow-hidden rounded-full bg-black/60 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
        <div
          className="h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
          style={{ width: `${safeProgress}%` }}
        >
          <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/40 blur-xs" />
        </div>
      </div>
    </div>
  );
}
