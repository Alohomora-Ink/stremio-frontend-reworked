export const RouteBuilder = {
    // Navigate to Discover with a preset filter
    toGenre: (type: string, genre: string) =>
        `/discover?type=${type}&genre=${encodeURIComponent(genre)}`,

    // Navigate to Search (for now, for Cast/Directors)
    toSearch: (query: string) =>
        `/search?q=${encodeURIComponent(query)}`,

    // Future proofing: for when we want to make a specific person page (actor , director, etc)
    toPerson: (id: string) => `/person/${id}`,
};