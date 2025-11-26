"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Play,
  Lock
} from "lucide-react";
import { useState } from "react";
import { SmartImage } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import type { MetaVideo } from "@/stremio-core-ts-wrapper/src/types/models/meta-item";
import { formatDate, isReleased } from "@/lib/date-utils";

interface Props {
  episode: MetaVideo;
  isWatched: boolean;
  onMarkWatched: () => void;
  onMarkNew: () => void;
  onPlay: () => void;
}

interface Props {
  episode: MetaVideo;
  isWatched: boolean;
  onMarkWatched: () => void;
  onMarkNew: () => void;
  onPlay: () => void;
}

export function EpisodeItem({
  episode,
  isWatched,
  onMarkWatched,
  onMarkNew,
  onPlay
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = episode.overview || episode.description || "";
  const isLongText = description.length > 80;

  // LOGIC: Check Release Date
  const hasReleaseDate = !!episode.released;
  const isAvailable = isReleased(episode.released);
  const displayDate = formatDate(episode.released);

  return (
    <div
      onClick={isAvailable ? onPlay : undefined} // Whole card click
      className={cn(
        "group relative flex items-start gap-4 overflow-hidden rounded-xl border p-3 transition-all",
        // Conditional Styling based on Availability
        !isAvailable
          ? "cursor-not-allowed border-white/5 bg-white/5 opacity-50"
          : isWatched
            ? "cursor-pointer border-green-500/20 bg-green-500/5 hover:bg-green-500/10"
            : "hover:glass-panel cursor-pointer border-white/5 bg-white/5"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg border border-white/5 bg-black/50 shadow-lg md:w-48">
        <SmartImage
          src={episode.thumbnail}
          alt={`Ep ${episode.episode}`}
          className={cn(
            "h-full w-full object-cover transition-all duration-500",
            isAvailable && "group-hover:scale-105", // Only zoom if available
            isWatched ? "opacity-60" : "opacity-90"
          )}
        />

        {/* Overlays */}
        {isWatched && (
          <div className="absolute inset-0 bg-green-900 opacity-40 mix-blend-color" />
        )}

        {/* Play Icon / Lock Icon */}
        <div
          className={cn(
            "duration-fast absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-opacity",
            isAvailable ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          )}
        >
          {isAvailable ? (
            <div className="scale-90 transform rounded-full bg-white p-2.5 text-black shadow-lg transition-transform group-hover:scale-100">
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 rounded-lg bg-black/60 px-3 py-2 text-zinc-400 backdrop-blur-md">
              <Lock className="h-4 w-4" />
              <span className="text-[9px] font-bold tracking-wider uppercase">
                Unreleased
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col pt-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded border-none px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase",
                  !isAvailable
                    ? "text-zinc-500"
                    : isWatched
                      ? "text-green-400"
                      : "text-brand-primary"
                )}
              >
                EP {episode.episode || episode.number} :{" "}
                {episode.name || `Episode ${episode.episode}`}
              </span>
            </div>

            {/* Title */}
            <h5
              className={cn(
                "line-clamp-2 text-sm leading-snug font-bold text-white transition-colors",
                isAvailable && "group-hover:text-brand-primary"
              )}
            >
              {displayDate && (
                <div className="mb-0.5 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] font-medium text-zinc-500">
                    {displayDate}
                  </span>
                </div>
              )}
            </h5>
          </div>

          {/* Watch Toggle (Hidden if unreleased) */}
          {isAvailable && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent playing when toggling watch status
                isWatched ? onMarkNew() : onMarkWatched();
              }}
              className={cn(
                "shrink-0 rounded-lg border p-2 transition-all",
                isWatched
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-transparent text-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-zinc-200"
              )}
            >
              {isWatched ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Description */}
        <div className="mt-2">
          <motion.div
            animate={{ height: "auto" }}
            className="relative overflow-hidden"
          >
            <p
              className={cn(
                "text-xs leading-relaxed text-zinc-400",
                !isExpanded && "line-clamp-1"
              )}
            >
              {description || "No description available."}
            </p>
          </motion.div>
          {isLongText && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-1 flex items-center gap-1 text-[8px] font-bold text-zinc-500 uppercase transition-colors hover:text-white"
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUp className="h-2 w-2" />
                </>
              ) : (
                <>
                  Read More <ChevronDown className="h-2 w-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
