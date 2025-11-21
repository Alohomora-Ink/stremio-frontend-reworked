"use client";

import { SmartImage } from "@/components/primitives/media/SmartImage";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

import type { MouseEvent } from "react";

interface LiquidGlassCardProps {
  title: string;
  image?: string;
  subtitle?: string;
  className?: string;
  aspectRatio?: "poster" | "video" | "square";
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function LiquidGlassCard({
  title,
  image,
  subtitle,
  className,
  aspectRatio = "poster",
  onClick
}: LiquidGlassCardProps) {
  const theme = useTheme().card;

  const aspectClasses = {
    poster: "aspect-2/3 w-[140px] md:w-[160px]",
    video: "aspect-video w-[240px] md:w-[280px]",
    square: "aspect-square w-[140px] md:w-[160px]"
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        theme.container,
        theme.hoverEffect,
        aspectClasses[aspectRatio],
        className
      )}
    >
      <div className={theme.inner}>
        <SmartImage
          src={image}
          alt={title}
          fallbackText={title}
          className={theme.image}
        />

        <div className="group-hover/card:animate-shine pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/card:opacity-100" />

        <div className={theme.overlay}>
          <div className={theme.textWrapper}>
            <h3 className={theme.title}>{title}</h3>
            {subtitle && <p className={theme.subtitle}>{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
