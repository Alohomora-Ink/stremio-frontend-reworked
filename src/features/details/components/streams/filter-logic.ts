import type { ParsedStream, StreamTags } from "@/stremio-core-ts-wrapper/src/types/parsed/parsed-stream";

// The active state of filters (e.g., { "4k": true, "Dolby Vision": false })
export type ActiveFilters = Record<string, boolean>;

/**
 * Checks if a stream passes ALL active filters
 */
export function streamMatches(stream: ParsedStream, activeFilters: ActiveFilters): boolean {
    const { tags } = stream._parsed;

    // Flatten the stream's tags into a single searchable set of strings
    const streamTokens = new Set([
        tags.quality,
        tags.source,
        ...tags.hdr,
        ...tags.codec,
        ...tags.audio,
        ...tags.languages
    ].filter(Boolean) as string[]);

    // Logic: 
    // We group filters by "category" implicitly.
    // BUT for simplicity: If a filter key is TRUE in activeFilters, the stream MUST have it.
    // EXCEPTION: Quality is usually "OR" (Show 4k OR 1080p).

    // Let's categorize the active filters first to apply "OR" logic for Quality
    const qualityFilters = ["4k", "1080p", "720p", "480p", "Cam"];
    const activeQualities = qualityFilters.filter(q => activeFilters[q]);

    // 1. Check Quality (Inclusive OR)
    // If ANY quality filter is on, the stream must match ONE of them.
    if (activeQualities.length > 0) {
        if (!tags.quality || !activeQualities.includes(tags.quality)) return false;
    }

    // 2. Check Everything Else (Exclusive AND)
    // For all other keys (HDR, Atmos, etc.), if it's Checked, the stream MUST have it.
    for (const [key, isActive] of Object.entries(activeFilters)) {
        if (qualityFilters.includes(key)) continue; // Skip quality (handled above)
        if (isActive && !streamTokens.has(key)) return false;
    }

    return true;
}

/**
 * Calculates availability for every possible tag in the dataset.
 * Returns: { "4k": 12, "HDR": 0, "Atmos": 5 }
 * Logic: "If I click this button, how many results will I get (respecting other active filters)?"
 */
export function getFilterCounts(streams: ParsedStream[], activeFilters: ActiveFilters) {
    // 1. Identify all unique tags present in the ENTIRE dataset
    const allTags = new Set<string>();
    streams.forEach(s => {
        const t = s._parsed.tags;
        [t.quality, t.source, ...t.hdr, ...t.codec, ...t.audio, ...t.languages].forEach(x => {
            if (x) allTags.add(x);
        });
    });

    const counts: Record<string, number> = {};

    // 2. Calculate count for each tag
    allTags.forEach(tag => {
        // To test "tag", we enable it temporarily
        const testFilters = { ...activeFilters };

        // If we are testing a Quality, we shouldn't enforce the *other* qualities logic,
        // we just want to see if THIS quality exists given the FEATURE filters.
        const qualityFilters = ["4k", "1080p", "720p", "480p", "Cam"];
        if (qualityFilters.includes(tag)) {
            // Reset other qualities for the test to see pure availability of THIS quality
            qualityFilters.forEach(q => testFilters[q] = false);
            testFilters[tag] = true;
        } else {
            // For features, just turn it on
            testFilters[tag] = true;
        }

        const count = streams.filter(s => streamMatches(s, testFilters)).length;
        counts[tag] = count;
    });

    return counts;
}