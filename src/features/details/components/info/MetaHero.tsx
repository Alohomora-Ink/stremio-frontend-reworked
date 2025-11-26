"use client";

import { Bell, BellOff, Film, Heart, Library, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/image";
import { useMetaUserState } from "../../hooks/use-meta-user-state";
import type { MetaItem } from "@/stremio-core-ts-wrapper/src/types/models/meta-item";

interface Props {
  meta: MetaItem;
}

export function MetaHero({ meta }: Props) {
  const {
    inLibrary,
    handleToggleLibrary,
    toggleNotifications,
    notificationsEnabled
  } = useMetaUserState(meta);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="flex flex-col items-start gap-8">
      {/* Title / Logo */}
      <div className="relative w-full">
        {meta.logo ? (
          <div className="relative h-48 w-full max-w-[400px] origin-left">
            <SmartImage
              src={meta.logo}
              alt={meta.name}
              className="h-full w-full object-contain object-left drop-shadow-2xl"
            />
          </div>
        ) : (
          <h1 className="text-6xl leading-[1.1] font-black tracking-tighter text-white drop-shadow-xl">
            {meta.name}
          </h1>
        )}
      </div>

      {/* Metadata Tags */}
      <div className="flex items-center gap-4 text-sm font-medium">
        {meta.releaseInfo && (
          <span className="rounded-md bg-white/10 px-2 py-1 text-white backdrop-blur-md">
            {meta.releaseInfo.substring(0, 4)}
          </span>
        )}
        {meta.runtime && <span className="text-zinc-400">{meta.runtime}</span>}
        {meta.imdbRating && (
          <div className="flex items-center gap-1 text-yellow-500">
            <span className="text-lg">★</span>
            <span>{meta.imdbRating}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {/* Library Button */}
          <Button
            variant="icon"
            onClick={handleToggleLibrary}
            className={
              inLibrary
                ? "border-green-500/50 bg-green-500/20 text-green-400"
                : ""
            }
            title={inLibrary ? "Remove from Library" : "Add to Library"}
          >
            <Library className="h-5 w-5" />
          </Button>

          {/* Like Button (Dummy) */}
          <Button
            variant="icon"
            onClick={() => setIsLiked(!isLiked)}
            className={
              isLiked ? "border-pink-500/50 bg-pink-500/20 text-pink-400" : ""
            }
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </Button>

          {/* Notifications */}
          <Button
            variant="icon"
            onClick={toggleNotifications}
            disabled={!inLibrary}
            className={
              notificationsEnabled
                ? "border-purple-500/50 bg-purple-500/20 text-purple-400"
                : ""
            }
          >
            {notificationsEnabled ? (
              <Bell className="h-5 w-5" />
            ) : (
              <BellOff className="h-5 w-5" />
            )}
          </Button>

          <Button variant="icon">
            <Share2 className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            className="w-auto px-6"
            disabled={!meta.trailers?.length}
          >
            <Film className="mr-2 h-5 w-5" />
            <span>Trailer</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
