import { useAddonsCtx } from '@/stremio-core-ts-wrapper/src';
import { useAddonCatalog } from '@/stremio-core-ts-wrapper/src/queries/addon-queries';
import type { Catalog } from "@/stremio-core-ts-wrapper/src/types/models/catalog";
import type { MetaItem } from "@/stremio-core-ts-wrapper/src/types/models/meta-item";
import type { AddonDescriptor } from "@/stremio-core-ts-wrapper/src/types/models/addon"; // Import this

export function useCatalogContent(catalog: Catalog, isVisible: boolean) {
    const { installed } = useAddonsCtx();

    const catalogId = catalog.id;
    const catalogType = catalog.type;
    const addonId = catalog.addon.manifest.id;

    const installedAddon = installed.find((a: AddonDescriptor) => a.manifest.id === addonId);
    const transportUrl = installedAddon?.transportUrl || catalog.addon.transportUrl;

    const coreHasData = catalog.content.type === "Ready" && Array.isArray(catalog.content.content) && catalog.content.content.length > 0;

    const { data, isLoading, error } = useAddonCatalog({
        transportUrl,
        type: catalogType,
        id: catalogId,
        enabled: isVisible && !coreHasData && !!transportUrl,
    });

    const items: MetaItem[] = coreHasData
        ? (catalog.content as { type: "Ready"; content: MetaItem[] }).content
        : (data || []);

    const isReallyLoading = coreHasData ? false : isLoading;
    const actualError = catalog.content.type === "Err" ? catalog.content.error : error;

    return { items, isLoading: isReallyLoading, error: actualError };
}