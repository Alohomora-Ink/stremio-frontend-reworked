"use client";

import { createContext, useContext, useRef, useCallback } from "react";

/**
 * ViewStateStore
 * Key: usually the pathname (e.g. "/board", "/detail/movie/tt123")
 * Value: any object containing state to restore
 */
type ViewStateStore = Map<string, any>;

interface ViewStateContextType {
  saveSnapshot: <T>(key: string, state: T) => void;
  getSnapshot: <T>(key: string) => T | null;
  clearSnapshot: (key: string) => void;
}

const ViewStateContext = createContext<ViewStateContextType | undefined>(
  undefined
);

export function ViewStateProvider({ children }: { children: React.ReactNode }) {
  // Use a Ref so saving state doesn't trigger re-renders of the provider
  const store = useRef<ViewStateStore>(new Map());

  const saveSnapshot = useCallback(<T,>(key: string, state: T) => {
    store.current.set(key, state);
  }, []);

  const getSnapshot = useCallback(<T,>(key: string): T | null => {
    const data = store.current.get(key);
    return (data as T) || null;
  }, []);

  const clearSnapshot = useCallback((key: string) => {
    store.current.delete(key);
  }, []);

  return (
    <ViewStateContext.Provider
      value={{ saveSnapshot, getSnapshot, clearSnapshot }}
    >
      {children}
    </ViewStateContext.Provider>
  );
}

export const useViewStateStore = () => {
  const context = useContext(ViewStateContext);
  if (!context) {
    throw new Error("useViewStateStore must be used within ViewStateProvider");
  }
  return context;
};
