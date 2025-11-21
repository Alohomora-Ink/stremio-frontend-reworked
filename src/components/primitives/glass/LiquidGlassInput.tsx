"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface LiquidGlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
}

export const LiquidGlassInput = forwardRef<
  HTMLInputElement,
  LiquidGlassInputProps
>(({ className, icon, label, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="ml-1 text-xs font-bold tracking-wider text-blue-200/60 uppercase">
          {label}
        </label>
      )}
      <div className="group relative flex items-center">
        {/* The "Slot" Container */}
        <div className="absolute inset-0 rounded-xl bg-black/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ring-1 ring-white/5 transition-all duration-300 group-focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] group-focus-within:ring-blue-500/50" />

        {/* Icon Slot */}
        {icon && (
          <div className="pointer-events-none absolute left-3 z-10 text-zinc-500 transition-colors group-focus-within:text-blue-400">
            {icon}
          </div>
        )}

        {/* The Input */}
        <input
          ref={ref}
          className={cn(
            "relative z-10 h-12 w-full bg-transparent px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none",
            icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
});

LiquidGlassInput.displayName = "LiquidGlassInput";
