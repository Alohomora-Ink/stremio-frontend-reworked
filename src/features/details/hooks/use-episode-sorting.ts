import { useMemo, useState, useEffect, useRef } from "react";
import type { MetaVideo } from "@/stremio-core-ts-wrapper/src/types/models/meta-item";

export function useEpisodeSorting(videos: MetaVideo[] | undefined, defaultSeason?: number) {
    // 1. Grouping Logic (Memoized - safe)
    const { seasons, seasonMap } = useMemo(() => {
        if (!videos) return { seasons: [], seasonMap: {} };

        const map: Record<number, MetaVideo[]> = {};
        const seasonSet = new Set<number>();

        videos.forEach((vid) => {
            const s = vid.season === undefined ? 1 : vid.season;
            if (!map[s]) map[s] = [];
            map[s].push(vid);
            seasonSet.add(s);
        });

        const sortedSeasons = Array.from(seasonSet).sort((a, b) => {
            if (a === 0) return 1;
            if (b === 0) return -1;
            return a - b;
        });

        return {
            seasons: sortedSeasons,
            seasonMap: map
        };
    }, [videos]);

    // 2. Selection State
    // Initialize lazily. If history is ready immediately, use it.
    const [selectedSeason, setSelectedSeason] = useState<number>(() => {
        if (typeof defaultSeason === 'number') return defaultSeason;
        return 1;
    });

    // 3. Smart Sync Logic
    // We track the last "synced" default season to avoid forcing it repeatedly
    const lastSyncedDefault = useRef<number | undefined>(undefined);

    useEffect(() => {
        // Wait for data
        if (seasons.length === 0) return;

        // CASE A: History Update / Initial Load
        // We only switch if the defaultSeason has *changed* from what we last synced,
        // OR if we haven't synced yet.
        if (typeof defaultSeason === 'number' && defaultSeason !== lastSyncedDefault.current) {
            if (seasonMap[defaultSeason]) {
                console.log(`[useEpisodeSorting] Syncing to History: ${defaultSeason}`);
                setSelectedSeason(defaultSeason);
                lastSyncedDefault.current = defaultSeason;
                return;
            }
        }

        // CASE B: Fallback
        // Only force a change if the CURRENT selection is completely invalid (empty/missing)
        // This handles cases where data loads but the currently selected season doesn't exist.
        if (!seasonMap[selectedSeason]) {
            const fallback = seasons[0] || 1;
            console.log(`[useEpisodeSorting] Selection invalid, falling back to: ${fallback}`);
            setSelectedSeason(fallback);
        }

        // CRITICAL FIX: 
        // We exclude 'selectedSeason' from deps so manual changes don't trigger this.
        // We include 'seasonMap' (structural change) and 'defaultSeason' (history change).
    }, [seasons, seasonMap, defaultSeason]);

    return {
        seasons,
        currentEpisodes: seasonMap[selectedSeason] || [],
        selectedSeason,
        setSelectedSeason
    };
}