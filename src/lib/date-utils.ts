export function isReleased(dateStr?: string): boolean {
    if (!dateStr) return true; // Assume released if no date provided (legacy content)

    // Handle "2023-10-05T..." or "2023-10-05"
    const releaseDate = new Date(dateStr);
    const today = new Date();

    // Reset time components to compare dates only
    today.setHours(0, 0, 0, 0);
    releaseDate.setHours(0, 0, 0, 0);

    return releaseDate <= today;
}

export function formatDate(dateStr?: string): string {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}