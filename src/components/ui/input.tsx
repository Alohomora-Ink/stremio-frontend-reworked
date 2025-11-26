"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-label ml-1">{label}</label>}
        <div className="group relative flex items-center">
          {/* Background Slot */}
          <div className="duration-normal group-focus-within:ring-brand-primary/50 absolute inset-0 rounded-xl bg-black/40 shadow-inner ring-1 ring-white/5 transition-all" />

          {/* Icon */}
          {icon && (
            <div className="group-focus-within:text-brand-primary pointer-events-none absolute left-3 z-10 text-zinc-500 transition-colors">
              {icon}
            </div>
          )}

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
  }
);
Input.displayName = "Input";
