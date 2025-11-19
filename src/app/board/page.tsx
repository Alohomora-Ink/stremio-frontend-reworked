"use client";

import { useEffect } from "react";
import { useBoard, useCtx, useLibrary } from "@/stremio-core-ts-wrapper/src";
import { CatalogRow } from "@/features/board/components/CatalogRow";

export default function BoardPage() {
  const { catalogs, isLoading: isBoardLoading, loadBoard } = useBoard();
  const { isAuthenticated, addons, isLoading: isCtxLoading } = useCtx();
  const { items: libraryItems } = useLibrary();

  useEffect(() => {
    if (addons.length === 0 && !isCtxLoading) {
      console.warn("DEBUG: Ctx has no addons. PullAddons might have failed.");
    } else if (addons.length > 0) {
      console.log("DEBUG: Ctx has addons:", addons.length);
    }
  }, [addons, isCtxLoading]);

  useEffect(() => {
    if (addons.length > 0 && catalogs.length === 0) {
      console.log("Addons detected, refreshing board...");
      loadBoard();
    }
  }, [addons.length, catalogs.length, loadBoard]);

  const isLoading = isBoardLoading || isCtxLoading;

  if (isLoading && catalogs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-zinc-400 font-medium">Loading Board...</p>
        </div>
      </div>
    );
  }

  if (catalogs.length === 0 && addons.length === 0 && !isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">No Addons Found</h2>
          <p className="text-zinc-400 mb-4">
            We couldn't load standard addons.
          </p>
          {/* This button acts as a manual retry */}
          <button
            onClick={() => window.location.reload()}
            className="text-purple-400 hover:text-purple-300"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-700">
      <div className="mb-8 flex items-end justify-between px-4 md:pl-28 md:pr-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Board</h1>
          <p className="text-zinc-400 text-sm">
            {isAuthenticated
              ? `${libraryItems.length} items in Library`
              : "Guest Mode"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {catalogs.map((catalog, index) => (
          <CatalogRow
            key={`${catalog.addon.manifest.id}-${catalog.type}-${catalog.id}-${index}`}
            catalog={catalog}
          />
        ))}
      </div>
    </div>
  );
}
