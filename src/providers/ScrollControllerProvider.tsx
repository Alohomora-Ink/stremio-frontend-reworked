"use client";

import { createContext, useContext, useRef, useCallback } from "react";

interface ScrollControllerContextType {
  scrollRef: React.RefObject<HTMLElement | null>;
  getScrollPosition: () => number;
  scrollTo: (top: number, behavior?: ScrollBehavior) => void;
}

const ScrollControllerContext = createContext<
  ScrollControllerContextType | undefined
>(undefined);

export function ScrollControllerProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLElement>(null);

  const getScrollPosition = useCallback(() => {
    return scrollRef.current?.scrollTop || 0;
  }, []);

  const scrollTo = useCallback(
    (top: number, behavior: ScrollBehavior = "auto") => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top, behavior });
      }
    },
    []
  );

  return (
    <ScrollControllerContext.Provider
      value={{ scrollRef, getScrollPosition, scrollTo }}
    >
      {children}
    </ScrollControllerContext.Provider>
  );
}

export const useScrollController = () => {
  const context = useContext(ScrollControllerContext);
  if (!context) {
    throw new Error(
      "useScrollController must be used within ScrollControllerProvider"
    );
  }
  return context;
};
