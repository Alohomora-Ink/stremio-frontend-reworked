import { useEffect, useState } from 'react';

import { StateParser, useCtx, useDispatch, useStremioCore } from '@/stremio-core-ts-wrapper/src';
import { useCoreQuery } from '@/stremio-core-ts-wrapper/src/hooks/use-core-model';

export function useContinueWatching(isEnabled: boolean) {
    const { isAuthenticated } = useCtx();
    const { transport } = useStremioCore();
    const dispatch = useDispatch();

    const { data, isLoading: isQueryLoading } = useCoreQuery(
        "continue_watching_preview",
        StateParser.parseContinueWatching,
        { enabled: isAuthenticated && !!transport }
    );

    const [hasDispatched, setHasDispatched] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (!isEnabled) return;
        if (hasDispatched) return;
        if (!transport) return;

        const load = async () => {
            try {
                setHasDispatched(true);
            } catch (e) {
                console.error("Failed to load continue watching", e);
            }
        };

        load();
    }, [isAuthenticated, isEnabled, hasDispatched, transport, dispatch]);

    return {
        items: data?.items || [],
        isLoading: isQueryLoading || (isEnabled && isAuthenticated && !data),
    };
}