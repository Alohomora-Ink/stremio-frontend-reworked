import { useMemo } from 'react';

import { useBoard } from '@/stremio-core-ts-wrapper/src';

import type { Catalog } from "@/stremio-core-ts-wrapper/src/types/models/catalog";
export interface AddonGroup {
    addonId: string;
    addonName: string;
    catalogs: Catalog[];
}


interface BoardPreferences {
    hiddenAddons: string[];
    hiddenCatalogs: string[];
    addonOrder: string[];
}

export function useBoardGrouping() {
    const { catalogs: rawCatalogs, isLoading, loadBoard, error } = useBoard();
    const groups = useMemo(() => {
        const prefs: BoardPreferences = {
            hiddenAddons: [],
            hiddenCatalogs: [],
            addonOrder: []
        };

        // 2. FILTER STAGE
        const filteredCatalogs = rawCatalogs.filter(cat => {
            const addonId = cat.addon.manifest.id;
            if (prefs.hiddenAddons.includes(addonId)) return false;
            return true;
        });

        // 3. GROUP STAGE
        const result: AddonGroup[] = [];

        filteredCatalogs.forEach((catalog) => {
            const lastGroup = result[result.length - 1];
            const addonId = catalog.addon.manifest.id;
            const addonName = catalog.addon.manifest.name;

            if (lastGroup && lastGroup.addonId === addonId) {
                lastGroup.catalogs.push(catalog);
            } else {
                result.push({
                    addonId,
                    addonName,
                    catalogs: [catalog]
                });
            }
        });

        return result;

    }, [rawCatalogs]);

    return {
        groups,
        isLoading,
        loadBoard,
        error
    };
}