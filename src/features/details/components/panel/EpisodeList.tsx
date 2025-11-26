"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellOff, BellRing, Check, Eye, EyeOff, Settings2 } from "lucide-react";

import { EpisodeItem } from "./EpisodeItem";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";

import type { MetaItem, MetaVideo } from "@/stremio-core-ts-wrapper/src/";
import { useMetaUserState } from "../../hooks/use-meta-user-state";
import { useEpisodeSorting } from "../../hooks/use-episode-sorting";

interface Props {
  meta: MetaItem;
  onEpisodeSelect: (video: MetaVideo) => void;
}

export function EpisodeList({ meta, onEpisodeSelect }: Props) {
  const {
    inLibrary,
    notificationsEnabled,
    toggleNotifications,
    markVideoAsWatched,
    markSeasonAsWatched,
    isVideoWatched,
    libraryItem
  } = useMetaUserState(meta);

  const lastVideoId = libraryItem?.state?.video_id;
  const lastWatchedVideo = meta.videos?.find((v) => v.id === lastVideoId);
  const lastWatchedSeason =
    lastWatchedVideo?.season ?? libraryItem?.state?.season;

  const { seasons, selectedSeason, setSelectedSeason, currentEpisodes } =
    useEpisodeSorting(meta.videos, lastWatchedSeason);

  const handleMarkSeasonWatched = async () => {
    await markSeasonAsWatched(selectedSeason, true);
  };

  const handleMarkSeasonNew = async () => {
    await markSeasonAsWatched(selectedSeason, false);
  };

  const onToggleNotif = async () => {
    await toggleNotifications();
  };

  if (!meta.videos || meta.videos.length === 0) return null;

  return (
    <div className="flex h-full flex-col border-l border-white/5">
      {/* Header Section */}
      <div className="relative z-50 shrink-0 space-y-4 border-b border-white/5 bg-black/95 px-4 py-6 shadow-xl">
        {/* Title & Notifications */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-white">
            {meta.name}
          </h3>

          {inLibrary && (
            <button
              onClick={onToggleNotif}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
                notificationsEnabled
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              )}
              title={
                notificationsEnabled
                  ? "Mute Notifications"
                  : "Enable Notifications"
              }
            >
              {notificationsEnabled ? (
                <BellRing className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* CONTROLS ROW */}
        <div className="flex items-center gap-2">
          {/* 1. Season Selector (Standard Arrow) */}
          {seasons.length > 0 && (
            <div className="min-w-0 flex-1">
              <Dropdown
                label={
                  selectedSeason === 0 ? "Specials" : `Season ${selectedSeason}`
                }
                width="w-full"
              >
                <DropdownLabel>Select Season</DropdownLabel>
                {seasons.map((s) => (
                  <DropdownItem
                    key={s}
                    isActive={selectedSeason === s}
                    onClick={() => setSelectedSeason(s)}
                  >
                    <span>{s === 0 ? "Specials" : `Season ${s}`}</span>
                    {selectedSeason === s && <Check className="h-3 w-3" />}
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
          )}

          {/* 2. Action Menu (NO ARROW) */}
          <div className="shrink-0">
            <Dropdown
              label=""
              icon={<Settings2 className="h-5 w-5" />}
              rightIcon={null}
              width="w-48"
              align="right"
              className="w-12"
            >
              <DropdownLabel>Season {selectedSeason}</DropdownLabel>
              <DropdownItem
                onClick={handleMarkSeasonWatched}
                className="text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Mark All Watched</span>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={handleMarkSeasonNew}
                className="text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Mark All Unwatched</span>
                </div>
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="custom-scrollbar relative z-0 flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={selectedSeason}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            {currentEpisodes.map((ep) => (
              <EpisodeItem
                key={ep.id}
                episode={ep}
                isWatched={isVideoWatched(ep)}
                onPlay={() => onEpisodeSelect(ep)}
                onMarkWatched={() => markVideoAsWatched(ep, true)}
                onMarkNew={() => markVideoAsWatched(ep, false)}
              />
            ))}
            {currentEpisodes.length === 0 && (
              <div className="py-12 text-center text-sm text-zinc-500 italic">
                No episodes found for this season.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
