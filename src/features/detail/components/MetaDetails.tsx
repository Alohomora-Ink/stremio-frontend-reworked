// ============================================================================
// Example component for fetching and displaying meta details
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import { AddonClient } from "@/stremio-core";
import { useLibraryActions } from "@/stremio-core";
import type { MetaItem, Stream } from "@/stremio-core";

interface MetaDetailsProps {
  type: string;
  id: string;
}

export function MetaDetails({ type, id }: MetaDetailsProps) {
  const [meta, setMeta] = useState<MetaItem | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { addToLibrary } = useLibraryActions();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch meta details and streams from Cinemeta
        const addonUrl = "https://v3-cinemeta.strem.io";

        const [metaResponse, streamsResponse] = await Promise.all([
          AddonClient.getMeta(addonUrl, type, id),
          AddonClient.getStreams(addonUrl, type, id),
        ]);

        setMeta(metaResponse.meta);
        setStreams(streamsResponse.streams || []);
      } catch (err) {
        console.error("Failed to fetch details:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !meta) {
    return <div>Error: {error?.message || "Meta not found"}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="relative h-96 rounded-lg overflow-hidden mb-8">
        {meta.background && (
          <img
            src={meta.background}
            alt={meta.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-5xl font-bold text-white mb-4">{meta.name}</h1>

          <div className="flex items-center gap-4 text-zinc-300 mb-4">
            {meta.releaseInfo && <span>{meta.releaseInfo}</span>}
            {meta.runtime && <span>• {meta.runtime}</span>}
            {meta.imdbRating && (
              <span className="flex items-center gap-1">
                • ⭐ {meta.imdbRating}
              </span>
            )}
          </div>

          <button
            onClick={() => addToLibrary(meta)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            Add to Library
          </button>
        </div>
      </div>

      {/* Description */}
      {meta.description && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-zinc-300">{meta.description}</p>
        </div>
      )}

      {/* Genres */}
      {meta.genres && meta.genres.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {meta.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-zinc-800 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cast */}
      {meta.cast && meta.cast.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <p className="text-zinc-300">{meta.cast.join(", ")}</p>
        </div>
      )}

      {/* Streams */}
      {streams.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Streams</h2>
          <div className="space-y-2">
            {streams.map((stream, index) => (
              <div
                key={index}
                className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <div className="font-semibold">
                  {stream.name || stream.title || "Unnamed Stream"}
                </div>
                {stream.description && (
                  <div className="text-sm text-zinc-400 mt-1">
                    {stream.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
