import { useEffect, useState, useRef, type RefObject } from 'react';

export function useOnScreen(ref: RefObject<HTMLElement | null>, rootMargin: string = "200px") {
    const [isIntersecting, setIntersecting] = useState(false);
    const hasIntersected = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        if (hasIntersected.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setIntersecting(true);
                    hasIntersected.current = true;
                    observer.unobserve(element);
                    observer.disconnect();
                }
            },
            {
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, rootMargin]);

    return isIntersecting;
}