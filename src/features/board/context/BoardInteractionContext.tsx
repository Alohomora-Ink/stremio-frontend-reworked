"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState
} from "react";

import type { ReactNode } from "react";

interface SelectableItem {
  id: string;
  type: string;
  name: string;
  poster?: string;
  background?: string;
  description?: string;
  genres?: string[];
  releaseInfo?: string;
  imdbRating?: string;
  original?: any;
}

interface BoardInteractionContextType {
  activeItem: SelectableItem | null;
  isSwitching: boolean;
  selectItem: (item: any) => void;
  clearSelection: () => void;
}

const BoardInteractionContext = createContext<
  BoardInteractionContextType | undefined
>(undefined);

export function BoardInteractionProvider({
  children
}: {
  children: ReactNode;
}) {
  const [activeItem, setActiveItem] = useState<SelectableItem | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();

  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);

  const selectItem = useCallback(
    (rawItem: any) => {
      const normalizedId = rawItem.id || rawItem._id;
      const normalizedItem: SelectableItem = {
        id: normalizedId,
        type: rawItem.type,
        name: rawItem.name,
        poster: rawItem.poster,
        background: rawItem.background,
        description: rawItem.description,
        genres: rawItem.genres,
        releaseInfo: rawItem.releaseInfo,
        imdbRating: rawItem.imdbRating,
        original: rawItem
      };

      setActiveItem((current) => {
        // 1. Double Click -> Navigate
        if (current && current.id === normalizedId) {
          router.push(`/detail/${rawItem.type}/${normalizedId}`);
          return current;
        }

        // 2. Switching Logic (Card X -> Card Y)
        if (current && current.id !== normalizedId) {
          if (transitionTimeout.current)
            clearTimeout(transitionTimeout.current);

          // FLAG ON: transitioning, keep the layout open
          setIsSwitching(true);

          transitionTimeout.current = setTimeout(() => {
            setActiveItem(normalizedItem);
            // FLAG OFF: Transition done, new item active
            setIsSwitching(false);
          }, 400);

          return null; // Hides panel
        }

        return normalizedItem;
      });
    },
    [router]
  );

  const clearSelection = useCallback(() => {
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    setIsSwitching(false);
    setActiveItem(null);
  }, []);

  return (
    <BoardInteractionContext.Provider
      value={{ activeItem, isSwitching, selectItem, clearSelection }}
    >
      {children}
    </BoardInteractionContext.Provider>
  );
}

export const useBoardInteraction = () => {
  const context = useContext(BoardInteractionContext);
  if (!context)
    throw new Error(
      "useBoardInteraction must be used within BoardInteractionProvider"
    );
  return context;
};
