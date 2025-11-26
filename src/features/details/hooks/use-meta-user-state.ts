import { useCallback, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ActionBuilder, useDispatch, useLibraryItemsCtx, useUserProfileCtx, useLibrary } from '@/stremio-core-ts-wrapper/src';
import { useMetaDetails } from '@/stremio-core-ts-wrapper/src/hooks/use-meta-details';
import { coreKeys } from '@/stremio-core-ts-wrapper/src/queries/keys';
import { useToast } from '@/providers/ToastProvider';
import type { MetaItem, MetaVideo, LibraryItem } from '@/stremio-core-ts-wrapper/src/types/models';

/**
 * Sanitizes meta for Stremio Core.
 * IMPORTANT: strips _variants AND _aggregatedIds (frontend-only props)
 */
function sanitizeMetaForCore(meta: MetaItem): MetaItem {
    const clone = { ...meta };
    delete (clone as any)._sourceAddon;
    delete (clone as any)._aggregatedIds;

    if (clone.videos) {
        clone.videos = clone.videos.map(v => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _variants, ...cleanVideo } = v;
            return cleanVideo;
        });
    }
    return clone;
}

export function useMetaUserState(meta: MetaItem) {
    const { isAuthenticated } = useUserProfileCtx();
    const { emit } = useToast();

    // Data Sources
    const ctxLibraryItems = useLibraryItemsCtx();
    const { items: viewLibraryItems } = useLibrary();

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    // FORCE SYNC if ctx library is empty but we are authenticated
    // This fixes the issue where only the first page (100 items) is visible in viewLibraryItems
    useEffect(() => {

        if (isAuthenticated && Object.keys(ctxLibraryItems).length === 0) {
            console.warn('⚠️ ctxLibraryItems is empty. Triggering FORCE SYNC...');
            dispatch(ActionBuilder.Library.sync(), "ctx");
        }
    }, [isAuthenticated, ctxLibraryItems, dispatch]);

    // =========================================================================
    //  1. ROBUST LIBRARY MATCHING (Aggregated Variants Aware)
    // =========================================================================
    const { relatedLibraryItems, libraryItem } = useMemo(() => {
        const candidates = new Set<string>();

        if (meta._aggregatedIds) {
            meta._aggregatedIds.forEach(id => {
                candidates.add(String(id));
                if (id.includes(':')) {
                    const parts = id.split(':');
                    if (parts.length > 1) candidates.add(parts[1] as string);
                }
            });
        }

        if (meta.id) candidates.add(String(meta.id));
        if (meta.imdb_id) candidates.add(String(meta.imdb_id));
        if (meta.kitsu_id) candidates.add(String(meta.kitsu_id));
        if (meta.moviedb_id) candidates.add(String(meta.moviedb_id));

        // 🔍 LIBRARY MATCHING DEBUG - Log for ALL items to see inconsistencies
        console.group(`🔍 LIBRARY MATCHING for ${meta.name} (${meta.id})`);
        console.log('Meta ID:', meta.id);
        console.log('Candidates:', Array.from(candidates));
        console.log('Context Library Items Count:', Object.keys(ctxLibraryItems).length);
        console.log('View Library Items Count:', viewLibraryItems.length);
        console.log('Meta Aggregated IDs:', meta._aggregatedIds || []);

        const matches: LibraryItem[] = [];
        const seenMatches = new Set<string>();

        const checkLibraryItem = (item: LibraryItem) => {
            if (!item || item.removed) return;
            if (seenMatches.has(item._id)) return;

            const itemId = String(item._id);
            let isMatch = false;
            let matchReason = '';

            // 1. Forward check: Does library item ID match any of our meta candidates?
            if (candidates.has(itemId)) {
                isMatch = true;
                matchReason = `Direct ID match: ${itemId}`;
            }

            // 2. Fallback check: Check external IDs
            if (!isMatch) {
                if (item.imdb_id && candidates.has(String(item.imdb_id))) {
                    isMatch = true;
                    matchReason = `IMDB match: ${item.imdb_id}`;
                }
                if (item.kitsu_id && candidates.has(String(item.kitsu_id))) {
                    isMatch = true;
                    matchReason = `Kitsu match: ${item.kitsu_id}`;
                }
                if (item.moviedb_id && candidates.has(String(item.moviedb_id))) {
                    isMatch = true;
                    matchReason = `MovieDB match: ${item.moviedb_id}`;
                }
            }

            // 3. Reverse check: Does the library item have aggregated IDs that match our meta ID?
            if (!isMatch && (item as any)._aggregatedIds) {
                const itemAggregatedIds = (item as any)._aggregatedIds as string[];
                if (Array.isArray(itemAggregatedIds) && itemAggregatedIds.some(aggId => candidates.has(String(aggId)))) {
                    isMatch = true;
                    matchReason = `Aggregated ID match: ${itemAggregatedIds.find(aggId => candidates.has(String(aggId)))}`;
                }
            }

            console.log(`  Checking ${item.name} (${item._id}): ${isMatch ? '✅ MATCH (' + matchReason + ')' : '❌ NO MATCH'}`);

            if (isMatch) {
                matches.push(item);
                seenMatches.add(item._id);
            }
        };

        console.log('Checking Context Library Items:');
        Object.values(ctxLibraryItems).forEach(checkLibraryItem);
        console.log('Checking View Library Items:');
        viewLibraryItems.forEach(checkLibraryItem);

        const primary = matches.find(i => i._id === meta.id) || matches[0] || null;

        console.log('Matches Found:', matches.length);
        console.log('Match IDs:', matches.map(m => m._id));
        console.log('Primary Match:', primary?._id || 'NONE');
        console.log('inLibrary:', matches.length > 0);
        console.groupEnd();

        return { relatedLibraryItems: matches, libraryItem: primary };
    }, [meta, ctxLibraryItems, viewLibraryItems]);


    const activeId = libraryItem?._id || meta.id;
    const { meta: detailedMeta } = useMetaDetails(meta.type, activeId);

    const inLibrary = relatedLibraryItems.length > 0;

    // FIX: Check if ANY of the related library items have notifications enabled
    const notificationsEnabled = relatedLibraryItems.length > 0
        ? relatedLibraryItems.some(item => item.state.noNotif !== true)
        : false;

    // Watched Status
    const watchedIdsSet = useMemo(() => {
        const ids = new Set<string>();
        detailedMeta?.videos?.forEach(v => { if (v.watched) ids.add(v.id); });
        meta.videos?.forEach(v => {
            if (v.watched) ids.add(v.id);
            v._variants?.forEach(vr => { if (vr.rawVideo?.watched) ids.add(vr.rawVideo.id); });
        });
        return ids;
    }, [detailedMeta, meta]);

    const isVideoWatched = useCallback((video: MetaVideo) => {
        if (watchedIdsSet.has(video.id)) return true;
        if (video._variants) return video._variants.some(v => watchedIdsSet.has(v.rawVideo.id));
        return false;
    }, [watchedIdsSet]);


    // =========================================================================
    //  ACTIONS
    // =========================================================================

    // 1. In handleToggleLibrary callback:
    const handleToggleLibrary = useCallback(async () => {
        if (!isAuthenticated) return;

        console.log('\n📚 ========== LIBRARY TOGGLE ==========');
        console.log('Action:', inLibrary ? 'REMOVE' : 'ADD');

        if (inLibrary) {
            // REMOVE
            for (const item of relatedLibraryItems) {
                await dispatch(ActionBuilder.Library.removeItem(item._id), "ctx");
            }
            emit({ type: "LIBRARY_REMOVE", item: meta });
        } else {
            // ADD
            const idsToAdd = meta._aggregatedIds && meta._aggregatedIds.length > 0
                ? meta._aggregatedIds
                : [meta.id];

            const uniqueIdsToAdd = new Set(idsToAdd);

            for (const id of uniqueIdsToAdd) {
                const variantMeta = { ...meta, id: id };
                const safeMeta = sanitizeMetaForCore(variantMeta);
                try {
                    await dispatch(ActionBuilder.Library.addItem(safeMeta), "ctx");
                } catch (e) {
                    console.error('    ❌ Failed:', e);
                }
            }
            emit({ type: "LIBRARY_ADD", item: meta });
        }

        setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: coreKeys.ctx() });
            queryClient.invalidateQueries({ queryKey: coreKeys.library() });
            dispatch(ActionBuilder.Load.library(null, "lastwatched", 1), "library");
        }, 100);

    }, [inLibrary, isAuthenticated, meta, relatedLibraryItems, dispatch, queryClient, emit]);

    // 2. In toggleNotifications callback:
    const toggleNotifications = useCallback(async () => {
        const targets = relatedLibraryItems.length > 0 ? relatedLibraryItems : (libraryItem ? [libraryItem] : []);

        if (targets.length === 0) return;

        const desiredState = !notificationsEnabled;

        try {
            await Promise.all(targets.map(item => {
                return dispatch(ActionBuilder.Library.toggleNotifications(item._id, desiredState), "ctx");
            }));

            emit({ type: "NOTIFICATIONS_TOGGLE", item: meta, enabled: desiredState });
            queryClient.invalidateQueries({ queryKey: coreKeys.ctx() });
            queryClient.invalidateQueries({ queryKey: coreKeys.library() });
        } catch (e) {
            console.error("❌ Notification Toggle Failed", e);
        }
    }, [dispatch, isAuthenticated, relatedLibraryItems, libraryItem, notificationsEnabled, meta, emit, queryClient]);


    // 3. In markVideoAsWatched callback:
    const markVideoAsWatched = useCallback(async (uiVideo: MetaVideo, isWatched: boolean) => {
        if (!isAuthenticated) return;

        const videosToMark: MetaVideo[] = [];

        // 1. Add variants if they exist
        if (uiVideo._variants && uiVideo._variants.length > 0) {
            uiVideo._variants.forEach(v => {
                videosToMark.push(v.rawVideo);
            });
        }

        // 2. If no variants, add the UI video itself
        if (videosToMark.length === 0) {
            videosToMark.push(uiVideo);
        }

        const results = await Promise.allSettled(
            videosToMark.map(async (video) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _variants, ...cleanVideo } = video;
                try {
                    await dispatch(ActionBuilder.Player.markVideoAsWatched(cleanVideo, isWatched), "player");
                    await dispatch(ActionBuilder.MetaDetails.markVideoAsWatched(cleanVideo, isWatched), "meta_details");
                } catch (e) {
                    console.error(`    ❌ Failed:`, e);
                    throw e;
                }
            })
        );

        const succeeded = results.filter(r => r.status === 'fulfilled').length;

        if (succeeded > 0) {
            emit({ type: "EPISODE_WATCHED", item: meta, video: uiVideo, watched: isWatched });

            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: coreKeys.model("meta_details") });
                queryClient.invalidateQueries({ queryKey: coreKeys.ctx() });
                queryClient.invalidateQueries({ queryKey: coreKeys.library() });
            }, 100);
        }

    }, [dispatch, isAuthenticated, meta, emit, queryClient]);

    const markSeasonAsWatched = useCallback(async (season: number, isWatched: boolean) => {
        if (!isAuthenticated || !meta.videos) return;

        const videos = meta.videos.filter(v => (v.season || 0) === season);
        const chunkSize = 5;
        for (let i = 0; i < videos.length; i += chunkSize) {
            const chunk = videos.slice(i, i + chunkSize);
            await Promise.all(chunk.map(v => markVideoAsWatched(v, isWatched)));
        }

        await dispatch(ActionBuilder.MetaDetails.markSeasonAsWatched(season, isWatched), "meta_details");

        emit({ type: "SEASON_WATCHED", item: meta, season, watched: isWatched });

        setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: coreKeys.model("meta_details") });
        }, 200);

    }, [markVideoAsWatched, meta, isAuthenticated, dispatch, emit, queryClient]);

    const markAsNew = useCallback(async () => {
        if (!libraryItem) return;
        await dispatch(ActionBuilder.Library.markAsWatched(libraryItem._id, false), "ctx");
        queryClient.invalidateQueries({ queryKey: coreKeys.ctx() });
        queryClient.invalidateQueries({ queryKey: coreKeys.library() });
        queryClient.invalidateQueries({ queryKey: coreKeys.model("meta_details") });
        emit({ type: "SEASON_WATCHED", item: meta, season: 0, watched: false });
    }, [dispatch, isAuthenticated, libraryItem, queryClient, emit, meta]);

    return {
        inLibrary,
        isWatched: relatedLibraryItems.some(i => i.state.timesWatched > 0),
        libraryItem,
        lastWatchedVideoId: libraryItem?.state?.video_id || null,
        notificationsEnabled,
        isVideoWatched,
        detailedMeta,
        handleToggleLibrary,
        toggleNotifications,
        markVideoAsWatched,
        markSeasonAsWatched,
        markAsNew
    };
}