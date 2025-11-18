// ============================================================================
// Example component using the library hooks
// ============================================================================

"use client";

import { useLibrary, useLibraryActions } from "@/stremio-core";
import type { LibraryItem } from "@/stremio-core";

export function LibraryGrid() {
  const { items, isLoading } = useLibrary();
  const { removeFromLibrary, toggleNotifications } = useLibraryActions();

  if (isLoading) {
    return <div>Loading library...</div>;
  }

  const activeItems = items.filter((item) => !item.removed);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {activeItems.map((item) => (
        <LibraryItemCard
          key={item._id}
          item={item}
          onRemove={() => removeFromLibrary(item._id)}
          onToggleNotifications={() => toggleNotifications(item._id)}
        />
      ))}
    </div>
  );
}

interface LibraryItemCardProps {
  item: LibraryItem;
  onRemove: () => void;
  onToggleNotifications: () => void;
}

function LibraryItemCard({
  item,
  onRemove,
  onToggleNotifications,
}: LibraryItemCardProps) {
  const progress =
    item.state.duration > 0
      ? (item.state.timeWatched / item.state.duration) * 100
      : 0;

  return (
    <div className="group relative">
      <div className="relative aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden">
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            No Poster
          </div>
        )}

        {/* Progress bar */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
            <div
              className="h-full bg-purple-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <h3 className="text-white font-semibold text-sm text-center px-2">
            {item.name}
          </h3>

          <div className="flex gap-2">
            <button
              onClick={onToggleNotifications}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs"
            >
              {item.state.flaggedWatched ? "Unwatch" : "Mark Watched"}
            </button>
            <button
              onClick={onRemove}
              className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-xs"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
