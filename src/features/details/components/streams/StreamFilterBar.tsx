"use client";

import { cn } from "@/lib/utils";
import { Check, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel
} from "@/components/ui/dropdown";
import type { ActiveFilters } from "./filter-logic";

export type SortOption = "score" | "quality" | "seeds" | "size";
export type SortDirection = "asc" | "desc";

interface StreamFilterBarProps {
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  sortDir: SortDirection;
  setSortDir: (d: SortDirection) => void;
  activeFilters: ActiveFilters;
  toggleFilter: (key: string) => void;
  counts: Record<string, number>;
  totalStreams: number;
  shownStreams: number;
}

export function StreamFilterBar({
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  activeFilters,
  toggleFilter,
  counts,
  totalStreams,
  shownStreams
}: StreamFilterBarProps) {
  const renderRow = (
    title: string,
    tags: string[],
    colorTheme: "yellow" | "orange" | "pink" | "blue" | "green"
  ) => {
    // FIX: Add fallback || 0 to satisfy TS
    const visibleTags = tags.filter(
      (tag) => (counts[tag] || 0) > 0 || activeFilters[tag]
    );

    if (visibleTags.length === 0) return null;

    return (
      <div className="scrollbar-hide flex min-h-8 items-center gap-2 overflow-x-auto py-1">
        <span className="w-14 shrink-0 text-right text-[9px] font-bold tracking-wider text-zinc-600 uppercase">
          {title}
        </span>
        <div className="h-3 w-px shrink-0 bg-white/5" />
        {visibleTags.map((tag) => (
          <FilterChip
            key={tag}
            label={tag}
            count={counts[tag] || 0} // FIX: Add fallback here too
            isActive={!!activeFilters[tag]}
            onClick={() => toggleFilter(tag)}
            theme={colorTheme}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="sticky top-0 z-30 flex flex-col gap-1 border-b border-white/5 bg-[#050505]/95 p-2 shadow-2xl backdrop-blur-xl transition-all">
      <div className="mb-1 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-brand-primary bg-brand-primary/10 rounded px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
            {shownStreams} Matches
          </span>
          {shownStreams < totalStreams && (
            <span className="text-[9px] text-zinc-600">
              of {totalStreams} total
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Dropdown
            label={
              sortBy === "score"
                ? "Best Match"
                : sortBy === "quality"
                  ? "Resolution"
                  : sortBy === "seeds"
                    ? "Seeds"
                    : "Size"
            }
            className="w-32 origin-right scale-90"
          >
            <DropdownLabel>Sort By</DropdownLabel>
            <DropdownItem
              onClick={() => setSortBy("score")}
              isActive={sortBy === "score"}
            >
              Best Match
            </DropdownItem>
            <DropdownItem
              onClick={() => setSortBy("quality")}
              isActive={sortBy === "quality"}
            >
              Resolution
            </DropdownItem>
            <DropdownItem
              onClick={() => setSortBy("seeds")}
              isActive={sortBy === "seeds"}
            >
              Seeds
            </DropdownItem>
            <DropdownItem
              onClick={() => setSortBy("size")}
              isActive={sortBy === "size"}
            >
              File Size
            </DropdownItem>
          </Dropdown>
          <button
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="rounded-lg border border-white/10 bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            {sortDir === "asc" ? (
              <ArrowUpAZ className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownAZ className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        {renderRow("Quality", ["4k", "1080p", "720p", "480p", "Cam"], "yellow")}
        {renderRow("HDR", ["HDR", "HDR10+", "DV"], "orange")}
        {renderRow(
          "Audio",
          ["Atmos", "TrueHD", "DTS-HD", "5.1", "7.1", "Dubbed"],
          "pink"
        )}
        {renderRow(
          "Tech",
          ["HEVC", "x265", "x264", "10bit", "Remux", "BluRay", "WEB-DL"],
          "blue"
        )}
        {renderRow(
          "Lang",
          [
            "English",
            "Italian",
            "Russian",
            "French",
            "German",
            "Spanish",
            "Hindi",
            "Japanese"
          ],
          "green"
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, count, isActive, onClick, theme }: any) {
  const colors = {
    yellow: {
      active: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
      hover: "hover:border-yellow-500/20"
    },
    orange: {
      active: "text-orange-400 border-orange-500/40 bg-orange-500/10",
      hover: "hover:border-orange-500/20"
    },
    pink: {
      active: "text-pink-400 border-pink-500/40 bg-pink-500/10",
      hover: "hover:border-pink-500/20"
    },
    blue: {
      active: "text-blue-400 border-blue-500/40 bg-blue-500/10",
      hover: "hover:border-blue-500/20"
    },
    green: {
      active: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      hover: "hover:border-emerald-500/20"
    }
  };
  const c = colors[theme as keyof typeof colors];
  const isDisabled = count === 0 && !isActive;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-[9px] font-bold transition-all select-none",
        isActive
          ? c.active
          : isDisabled
            ? "cursor-not-allowed border-transparent bg-white/5 text-zinc-700 opacity-30"
            : `border-white/5 bg-zinc-900/40 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 ${c.hover}`
      )}
    >
      {isActive && <Check className="h-2.5 w-2.5" />}
      <span>{label}</span>
      {!isDisabled && <span className="ml-0.5 opacity-50">({count})</span>}
    </button>
  );
}
