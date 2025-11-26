"use client";

import { useMemo, useState } from "react";
import type { ParsedStream } from "@/stremio-core-ts-wrapper/src/types/parsed/parsed-stream";
import {
  StreamFilterBar,
  type SortOption,
  type SortDirection
} from "./StreamFilterBar";
import { StreamItem } from "./StreamItem";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  type ActiveFilters,
  streamMatches,
  getFilterCounts
} from "./filter-logic";

interface StreamListProps {
  streams: ParsedStream[];
  isLoading: boolean;
  onStreamClick: (stream: ParsedStream) => void;
}

export function StreamList({
  streams,
  isLoading,
  onStreamClick
}: StreamListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  // Initialize: Enable 4k, 1080p, 720p by default
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    "4k": true,
    "1080p": true,
    "720p": true
  });

  // 1. Filtering
  const filteredStreams = useMemo(() => {
    return streams.filter((s) => streamMatches(s, activeFilters));
  }, [streams, activeFilters]);

  // 2. Cross-Filter Counts
  const filterCounts = useMemo(() => {
    return getFilterCounts(streams, activeFilters);
  }, [streams, activeFilters]);

  // 3. Sorting
  const sortedStreams = useMemo(() => {
    return [...filteredStreams].sort((a, b) => {
      let valA = 0,
        valB = 0;
      const pA = a._parsed,
        pB = b._parsed;

      if (sortBy === "seeds") {
        valA = pA.seeders;
        valB = pB.seeders;
      } else if (sortBy === "size") {
        valA = pA.size;
        valB = pB.size;
      } else if (sortBy === "quality") {
        valA = pA.score;
        valB = pB.score;
      } else {
        valA = pA.score;
        valB = pB.score;
      }

      return sortDir === "asc" ? valA - valB : valB - valA;
    });
  }, [filteredStreams, sortBy, sortDir]);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading && streams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-zinc-500">
        <Loader2 className="text-brand-primary h-10 w-10 animate-spin" />
        <span className="animate-pulse text-xs font-bold tracking-widest uppercase">
          Scanning hives...
        </span>
      </div>
    );
  }

  if (streams.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-500">
        <AlertCircle className="h-10 w-10 opacity-20" />
        <span className="text-xs font-bold tracking-widest uppercase">
          No streams found
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <StreamFilterBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        counts={filterCounts}
        totalStreams={streams.length}
        shownStreams={filteredStreams.length}
      />

      <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto px-3 pt-2 pb-20">
        {sortedStreams.map((stream) => (
          <StreamItem
            // BUG FIX: Use the robust, counter-safe key we generated in StreamParser
            key={stream._parsed.uniqueHash}
            stream={stream}
            onPlay={() => onStreamClick(stream)}
          />
        ))}
        {sortedStreams.length === 0 && (
          <div className="py-12 text-center text-xs text-zinc-600">
            No streams match current filters.
          </div>
        )}
      </div>
    </div>
  );
}
