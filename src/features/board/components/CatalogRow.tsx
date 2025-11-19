import { useEffect, useState } from "react";
import { BoardCatalogStack } from "./BoardCatalogStack";
import { AddonClient, useCtx } from "@/stremio-core-ts-wrapper/src";
import type { Catalog } from "@/stremio-core-ts-wrapper/src/types/models/catalog";
import type { MetaItem } from "@/stremio-core-ts-wrapper/src/types/common/meta-item";

interface Props {
  catalog: Catalog;
}

export function CatalogRow({ catalog }: Props) {
  const { addons } = useCtx();
  const [items, setItems] = useState<MetaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (
        catalog.content.type === "Ready" &&
        catalog.content.content.length > 0
      ) {
        setItems(catalog.content.content);
        setLoading(false);
        return;
      }
      const addonId = catalog.addon.manifest.id;
      const installedAddon = addons.find((a) => a.manifest.id === addonId);
      const transportUrl =
        installedAddon?.transportUrl || catalog.addon.transportUrl;
      if (!transportUrl) return;
      try {
        setLoading(true);
        const response = await AddonClient.getCatalog(
          transportUrl,
          catalog.type,
          catalog.id,
        );
        if (mounted) {
          setItems(response.metas);
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          console.error(`Failed to fetch catalog ${catalog.name}:`, err);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [catalog, addons]);

  const getDisplayTitle = () => {
    const rawName = catalog.name || catalog.type;
    const genericNames = ["popular", "top", "featured", "new", "year"];
    if (genericNames.includes(rawName.toLowerCase())) {
      const typeLabel =
        catalog.type.charAt(0).toUpperCase() + catalog.type.slice(1);
      return `${rawName} ${typeLabel}`;
    }
    return rawName;
  };

  if (loading) {
    return (
      <div className="mb-10">
        <div className="h-7 w-48 bg-zinc-800 rounded-md mb-4 animate-pulse opacity-50" />
        <div className="flex gap-4 overflow-hidden -mx-[calc(50vw-50%)] px-[calc(50vw-50%+1rem)]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="w-[140px] md:w-[170px] aspect-2/3 bg-zinc-800/60 rounded-xl shrink-0 animate-pulse border border-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || items.length === 0) return null;
  return <BoardCatalogStack title={getDisplayTitle()} items={items} />;
}
