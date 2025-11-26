"use client";

import { useAggregatedStreams } from "@/stremio-core-ts-wrapper/src/hooks/use-aggregated-streams";
import { StreamList } from "./StreamList";
import { ArrowLeft, CalendarClock, Film } from "lucide-react";
import { isReleased, formatDate } from "@/lib/date-utils";
import type {
  MetaVideo,
  MetaItem
} from "@/stremio-core-ts-wrapper/src/types/models/meta-item";

interface StreamListContainerProps {
  type: string;
  meta: MetaItem;
  episode?: MetaVideo;
  onBack?: () => void;
}

export function StreamListContainer({
  type,
  meta,
  episode,
  onBack
}: StreamListContainerProps) {
  const targetDate = episode ? episode.released : meta.released;
  const isAvailable = isReleased(targetDate);

  // The hook now does all the smart routing internally
  const { streams, isLoading } = useAggregatedStreams({
    type,
    meta,
    episode
  });

  // ... (Render logic remains the same)
  const handlePlay = (stream: any) => {
    console.log("Play", stream);
  };

  return (
    <div className="flex h-full flex-col bg-[#050505]">
      {/* HEADER */}
      <div className="relative z-50 shrink-0 border-b border-white/5 bg-black/95 px-4 py-4 shadow-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="group flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 text-zinc-400 group-hover:text-white" />
            </button>
          )}

          <div className="min-w-0 flex-1">
            {episode ? (
              <div className="flex flex-col">
                <span className="text-brand-primary text-[10px] font-bold tracking-wider uppercase">
                  S{episode.season} : E{episode.episode}
                </span>
                <h3 className="line-clamp-1 text-sm font-bold text-white">
                  {episode.name || `Episode ${episode.episode}`}
                </h3>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Film className="text-brand-secondary h-3 w-3" />
                  <h3 className="line-clamp-1 text-sm font-bold text-white">
                    {meta.name}
                  </h3>
                </div>
                {meta.released && (
                  <span className="text-[10px] text-zinc-500">
                    {formatDate(meta.released)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">
          {!isAvailable ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-zinc-600">
                <CalendarClock className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Not Released Yet
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  This content is expected to arrive on <br />
                  <span className="font-medium text-white">
                    {formatDate(targetDate)}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <StreamList
              streams={streams}
              isLoading={isLoading}
              onStreamClick={handlePlay}
            />
          )}
        </div>
      </div>
    </div>
  );
}
