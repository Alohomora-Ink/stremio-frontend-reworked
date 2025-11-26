"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkeletonRailProps {
  className?: string;
  variant?: "default" | "error";
}

export function SkeletonRail({
  className,
  variant = "default"
}: SkeletonRailProps) {
  return (
    <div className={cn("-ml-24 animate-pulse md:-ml-32", className)}>
      <div className="flex gap-6 overflow-hidden pt-12 pr-8 pb-12 pl-24 md:pr-16 md:pl-32">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2 opacity-80">
            {/* Card Skeleton */}
            <div
              className={cn(
                "relative flex aspect-2/3 w-[140px] shrink-0 items-center justify-center rounded-2xl border backdrop-blur-sm md:w-40",
                variant === "error"
                  ? "border-red-500/30 bg-red-500/5 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]"
                  : "border-white/5 bg-white/5"
              )}
            >
              {variant === "error" && (
                <AlertCircle className="h-8 w-8 text-red-500/40" />
              )}
            </div>
            {/* Text Skeleton */}
            <div
              className={cn(
                "mt-4 h-4 w-3/4 rounded-md",
                variant === "error" ? "bg-red-500/20" : "bg-white/10"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
