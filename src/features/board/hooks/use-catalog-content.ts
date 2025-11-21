import { useEffect, useRef, useState } from 'react';

import { AddonClient, useCtx } from '@/stremio-core-ts-wrapper/src';

import type { Catalog } from "@/stremio-core-ts-wrapper/src/types/models";
import type { MetaItem } from "@/stremio-core-ts-wrapper/src/types/models";

export function useCatalogContent(catalog: Catalog, isEnabled: boolean) {
    const { addons } = useCtx();
    const [items, setItems] = useState<MetaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasLoadedFromCore = useRef(false);

    const catalogId = catalog.id;
    const catalogType = catalog.type;
    const addonId = catalog.addon.manifest.id;
    const transportUrl = catalog.addon.transportUrl;
    const coreContent = catalog.content;

    useEffect(() => {
        // 0. CIRCUIT BREAKER: If not visible yet, do nothing.
        if (!isEnabled) return;

        let mounted = true;

        const fetchContent = async () => {
            // 1. FAST PATH: Core already has data
            if (coreContent.type === "Ready" && coreContent.content.length > 0) {
                setItems(coreContent.content);
                setIsLoading(false);
                hasLoadedFromCore.current = true;
                return;
            }

            // 2. ERROR PATH
            if (coreContent.type === "Err") {
                setError(coreContent.error);
                setIsLoading(false);
                return;
            }

            // 3. MANUAL FETCH PATH
            if (hasLoadedFromCore.current) return;

            const installedAddon = addons.find((a) => a.manifest.id === addonId);
            const targetUrl = installedAddon?.transportUrl || transportUrl;

            if (!targetUrl) {
                if (mounted) setIsLoading(false);
                return;
            }

            try {
                const fetchPromise = AddonClient.getCatalog(targetUrl, catalogType, catalogId);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Request timed out")), 8000)
                );

                const response = await Promise.race([fetchPromise, timeoutPromise]) as { metas: MetaItem[] };

                if (mounted) {
                    setItems(response.metas);
                }
            } catch (err: any) {
                if (mounted) {
                    console.warn(`[${addonId}] Failed to fetch ${catalogType}/${catalogId}:`, err.message);
                    setError(err.message);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchContent();

        return () => { mounted = false; };
    }, [
        isEnabled,
        catalogId, catalogType, addonId, transportUrl, addons, coreContent.type
    ]);

    return { items, isLoading, error };
}