"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface SelectionState {
    type: string;
    id: string;
    sourceId: string;
}

export function useSelection() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const previewParam = searchParams.get("preview");

    const selection = useMemo((): SelectionState | null => {
        if (!previewParam) return null;

        const parts = previewParam.split(":");

        // Safety check
        if (parts.length < 3) return null;

        // TS Fix: Ensure we don't pass undefined to decodeURIComponent
        // We use ( || "") as a fallback, though the length check above makes it safe at runtime.
        const type = parts[0] || "";
        const id = decodeURIComponent(parts[1] || "");

        // Rejoin the rest for sourceId
        const rawSourceId = parts.slice(2).join(":");
        const sourceId = decodeURIComponent(rawSourceId);

        if (!type || !id || !sourceId) return null;

        return { type, id, sourceId };
    }, [previewParam]);

    const selectItem = useCallback((type: string, id: string, sourceId: string) => {
        const params = new URLSearchParams(searchParams.toString());

        const safeId = encodeURIComponent(id);
        const safeSourceId = encodeURIComponent(sourceId);

        params.set("preview", `${type}:${safeId}:${safeSourceId}`);

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const clearSelection = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("preview");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const isItemSelected = useCallback((itemId: string, railSourceId: string) => {
        if (!selection) return false;
        return selection.id === itemId && selection.sourceId === railSourceId;
    }, [selection]);

    return {
        selection,
        selectItem,
        clearSelection,
        isItemSelected
    };
}