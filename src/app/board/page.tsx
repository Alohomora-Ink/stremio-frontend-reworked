"use client";

import { useEffect, useState } from "react";
import { BoardCatalogStack } from "@/features/board/components/BoardCatalogStack";
import {
  AddonClient,
  useAuth,
  useLibrary,
  type MetaItem,
} from "@/stremio-core-ts-wrapper/src";

const CINEMETA_URL = "https://v3-cinemeta.strem.io";

interface BoardCatalog {
  title: string;
  items: MetaItem[];
}

export default function BoardPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { items: libraryItems, isLoading: isLibraryLoading } = useLibrary();
  const [catalogs, setCatalogs] = useState<BoardCatalog[]>([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      setIsLoadingCatalogs(true);
      setError(null);

      try {
        const [moviesResponse, seriesResponse] = await Promise.all([
          AddonClient.getCatalog(CINEMETA_URL, "movie", "top"),
          AddonClient.getCatalog(CINEMETA_URL, "series", "top"),
        ]);

        const newCatalogs: BoardCatalog[] = [];

        if (moviesResponse.metas && moviesResponse.metas.length > 0) {
          newCatalogs.push({
            title: "Popular Movies",
            items: moviesResponse.metas.slice(0, 12),
          });
        }

        if (seriesResponse.metas && seriesResponse.metas.length > 0) {
          newCatalogs.push({
            title: "Popular Series",
            items: seriesResponse.metas.slice(0, 12),
          });
        }

        setCatalogs(newCatalogs);
      } catch (err) {
        console.error("Failed to load catalogs:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoadingCatalogs(false);
      }
    };

    fetchCatalogs();
  }, []);

  if (isAuthLoading || isLibraryLoading || isLoadingCatalogs) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Failed to Load Catalogs
          </h1>
          <p className="text-zinc-400 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Board</h1>
        {isAuthenticated && (
          <p className="text-zinc-400">
            {libraryItems.length} items in your library
          </p>
        )}
      </div>

      {/* Continue Watching - only if authenticated and has library items */}
      {isAuthenticated && libraryItems.length > 0 && (
        <BoardCatalogStack
          title="Continue Watching"
          items={libraryItems
            .filter((item) => !item.removed && item.state.timeWatched > 0)
            .slice(0, 12)
            .map((item) => ({
              id: item._id,
              type: item.type,
              name: item.name,
              poster: item.poster,
            }))}
        />
      )}

      {/* Popular catalogs */}
      {catalogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-xl">No catalogs available</p>
        </div>
      ) : (
        <>
          {catalogs.map((catalog, index) => (
            <BoardCatalogStack
              key={index}
              title={catalog.title}
              items={catalog.items}
            />
          ))}
        </>
      )}
    </div>
  );
}
