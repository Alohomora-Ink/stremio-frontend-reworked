import { useEffect, useState, useRef, type RefObject } from 'react';

export function useOnScreen(ref: RefObject<HTMLElement | null>, rootMargin: string = "200px") {
    // State to store whether element is visible
    const [isIntersecting, setIntersecting] = useState(false);

    // We use a ref to ensure we only trigger the fetch ONCE. 
    // Once a row is loaded, we don't want to unload it if the user scrolls up.
    const hasIntersected = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // If we already loaded, don't set up observer again (optimization)
        if (hasIntersected.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update our state when observer callback fires
                if (entry?.isIntersecting) {
                    setIntersecting(true);
                    hasIntersected.current = true;
                    // Once intersected, we can stop observing to save resources
                    observer.unobserve(element);
                    observer.disconnect();
                }
            },
            {
                rootMargin, // Load content 200px before it comes into view for smoothness
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, rootMargin]);

    return isIntersecting;
}