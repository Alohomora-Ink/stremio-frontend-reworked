"use client";

import { useEffect, useRef } from "react";

import { useCtx } from "@/stremio-core-ts-wrapper/src";

import {
  BoardInteractionProvider,
  useBoardInteraction
} from "../context/BoardInteractionContext";
import { useBoardGrouping } from "../hooks/use-board-grouping";
import { AddonSection } from "./AddonSection";
// import { PageTitle } from "@/components/primitives/layout/PageTitle";
import { ContinueWatchingRow } from "./ContinueWatchingRow";
import { MetaPreviewPanel } from "./MetaPreviewPanel";

function BoardContent() {
  const {
    groups,
    isLoading: isStructureLoading,
    loadBoard
  } = useBoardGrouping();
  const { isAuthenticated, addons, isLoading: isCtxLoading } = useCtx();
  const { clearSelection } = useBoardInteraction();
  const hasRequestedBoard = useRef(false);

  useEffect(() => {
    if (isCtxLoading) return;
    if (
      addons.length > 0 &&
      groups.length === 0 &&
      !hasRequestedBoard.current
    ) {
      hasRequestedBoard.current = true;
      loadBoard();
    }
  }, [isCtxLoading, addons.length, groups.length, loadBoard]);

  if (isCtxLoading)
    return (
      <div className="flex h-[80vh] items-center justify-center text-zinc-500">
        Loading...
      </div>
    );

  if (groups.length === 0 && isStructureLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-zinc-500">
        Constructing Board...
      </div>
    );
  }

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
          {/* <div className="mb-8 flex items-end justify-between px-2 pt-8 pl-2">
            <PageTitle
              title="Board"
              subtitle={isAuthenticated ? "Library Connected" : "Guest Mode"}
            />
          </div> */}
          <div className="space-y-8">
            <ContinueWatchingRow />
            {groups.map((group) => (
              <AddonSection key={group.addonId} group={group} />
            ))}
          </div>
        </div>
      </div>

      <MetaPreviewPanel />
    </div>
  );
}

export default function BoardLayout() {
  return (
    <BoardInteractionProvider>
      <BoardContent />
    </BoardInteractionProvider>
  );
}
