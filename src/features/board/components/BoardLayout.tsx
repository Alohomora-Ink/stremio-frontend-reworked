"use client";

import { useEffect, useRef } from "react";
import { useAddonsCtx, useCtxSyncState } from "@/stremio-core-ts-wrapper/src";
import { useBoardGrouping } from "../hooks/use-board-grouping";
import { AddonSection } from "./AddonSection";
import { ContinueWatchingRail } from "@/components/domain/ContinueWatchingRail";
import { useSelection } from "@/hooks/use-selection";

// NOTE: We removed MetaPreviewPanel and BoardInteractionProvider.
// State is now URL-based and Drawer is global in AppShell.

function BoardContent() {
  const {
    groups,
    isLoading: isStructureLoading,
    loadBoard
  } = useBoardGrouping();
  const { installed } = useAddonsCtx();
  const { isLoading: isCtxLoading } = useCtxSyncState();
  const { clearSelection } = useSelection(); // To handle background click
  const hasRequestedBoard = useRef(false);

  useEffect(() => {
    if (isCtxLoading) return;
    if (
      installed.length > 0 &&
      groups.length === 0 &&
      !hasRequestedBoard.current
    ) {
      hasRequestedBoard.current = true;
      loadBoard();
    }
  }, [isCtxLoading, installed.length, groups.length, loadBoard]);

  if (isCtxLoading)
    return (
      <div className="flex h-[80vh] items-center justify-center text-zinc-500">
        Loading...
      </div>
    );
  if (groups.length === 0 && isStructureLoading)
    return (
      <div className="flex h-[80vh] items-center justify-center text-zinc-500">
        Constructing Board...
      </div>
    );
  if (groups.length === 0 && !isStructureLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <h2 className="mb-2 text-2xl font-bold text-white">Board Empty</h2>
        <button
          onClick={() => window.location.reload()}
          className="text-zinc-400 hover:text-white"
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full">
      <div className="min-w-0 flex-1" onClick={() => clearSelection()}>
        <div className="animate-in fade-in w-full pb-32 duration-1000 ease-out">
          <div className="space-y-8">
            <ContinueWatchingRail />
            {groups.map((group) => (
              <AddonSection key={group.addonId} group={group} />
            ))}
          </div>
        </div>
      </div>
      {/* Drawer is now Global in AppShell */}
    </div>
  );
}

export default function BoardLayout() {
  return <BoardContent />;
}
