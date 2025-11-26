"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { SmartImage } from "./image";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  image?: string;
  subtitle?: string;
  aspectRatio?: "poster" | "video" | "square";
  progress?: number; // Optional: if provided, renders the progress bar
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      title,
      image,
      subtitle,
      aspectRatio = "poster",
      progress,
      onClick,
      ...props
    },
    ref
  ) => {
    // Map aspect ratios to Tailwind classes
    const aspectClasses = {
      poster: "aspect-2/3 w-[140px] md:w-[160px]",
      video: "aspect-video w-[240px] md:w-[280px]",
      square: "aspect-square w-[140px] md:w-[160px]"
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          // Layout & Base Styles
          "group/card relative shrink-0 cursor-pointer overflow-hidden rounded-2xl p-1.5",
          // The "Theme" Hooks (defined in theme.css)
          "glass-panel duration-normal transition-all ease-out",
          // Hover Effects
          "hover:-translate-y-4 hover:scale-105 hover:shadow-[0_0_30px_var(--color-brand-primary)]",
          // Aspect Ratio
          aspectClasses[aspectRatio],
          className
        )}
        {...props}
      >
        {/* Inner Content Container */}
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-zinc-900 shadow-inner">
          <SmartImage
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
          />

          {/* Shine Effect (Pure CSS animation) */}
          <div className="group-hover/card:animate-shine absolute inset-0 z-10 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

          {/* Text Overlay */}
          <div className="duration-normal absolute inset-0 z-20 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/40 to-transparent p-3 opacity-0 transition-opacity group-hover/card:opacity-100">
            <h3 className="duration-normal line-clamp-2 translate-y-2 text-sm leading-tight font-bold text-white drop-shadow-md transition-transform group-hover/card:translate-y-0">
              {title}
            </h3>
            {subtitle && (
              <p className="duration-normal mt-1 translate-y-2 text-[10px] font-medium text-blue-200 transition-transform delay-75 group-hover/card:translate-y-0">
                {subtitle}
              </p>
            )}
          </div>

          {/* Progress Bar (Conditional) */}
          {typeof progress === "number" && (
            <div className="absolute right-0 bottom-0 left-0 z-30 h-1 bg-black/50">
              <div
                className="bg-brand-primary h-full shadow-[0_0_10px_var(--color-brand-primary)]"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);
Card.displayName = "Card";
