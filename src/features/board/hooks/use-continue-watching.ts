import { useEffect, useState } from 'react';

import { StateParser, useDispatch, useStremioCore, useUserProfileCtx } from '@/stremio-core-ts-wrapper/src'; // CHANGED
import { useCoreQuery } from '@/stremio-core-ts-wrapper/src/hooks/use-core-model';

export function useContinueWatching(isEnabled: boolean) {
    // CHANGED: Use specific hook
    const { isAuthenticated } = useUserProfileCtx();

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

        // Just triggering state, actual logic likely handled by Core side effect or previous dispatch
        // Keeping logic as is, just fixing dependencies
        setHasDispatched(true);
    }, [isAuthenticated, isEnabled, hasDispatched, transport, dispatch]);

    return {
        items: data?.items || [],
        isLoading: isQueryLoading || (isEnabled && isAuthenticated && !data),
    };
}