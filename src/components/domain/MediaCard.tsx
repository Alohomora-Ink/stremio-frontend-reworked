"use client";

import { memo } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MetaItem } from "@/stremio-core-ts-wrapper/src/types/models/meta-item";
import type { ContinueWatchingItem } from "@/stremio-core-ts-wrapper/src/types/models/continue-watching";

interface MediaCardProps {
  item: MetaItem | ContinueWatchingItem;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MediaCard = memo(
  ({ item, isActive, onClick, className }: MediaCardProps) => {
    const title = item.name;
    const poster = item.poster;
    const type = item.type;

    const releaseInfo = "releaseInfo" in item ? item.releaseInfo : undefined;
    const progress = "progress" in item ? item.progress : undefined;

    const itemId = item._id || item.id;

    return (
      <div
        data-item-id={itemId}
        className={cn(
          // WRAPPER handles the layout, movement, and border
          "duration-normal relative rounded-2xl transition-all ease-out",

          // 1. Move the whole package up on hover (Wrapper + Border + Card)
          "hover:-translate-y-4",

          // 2. Handle State
          isActive
            ? // Active: Scaled up, constant Blue Glow, Blue Ring
              "z-10 scale-105 shadow-[0_0_30px_var(--color-brand-primary)] ring-2 ring-(--color-brand-primary)"
            : // Inactive: Hover Glow only, click press effect
              "ring-0 hover:shadow-[0_0_30px_var(--color-brand-primary)] active:scale-95",

          className
        )}
      >
        <Card
          title={title}
          image={poster}
          subtitle={releaseInfo || type}
          progress={progress}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          // IMPORTANT: We disable the Card's INTERNAL hover effects
          // because the Wrapper is now handling the movement.
          // If we don't do this, the card might move twice or look glitchy.
          className="hover:translate-y-0 hover:scale-100 hover:shadow-none"
        />
      </div>
    );
  }
);

MediaCard.displayName = "MediaCard";
