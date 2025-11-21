// Defines how a Card should look and behave
export interface CardInstructor {
    container: string;       // e.g. "rounded-2xl p-1.5 border..."
    inner: string;           // e.g. "bg-zinc-900 rounded-xl"
    image: string;           // e.g. "object-cover transition-transform"
    overlay: string;         // e.g. "bg-gradient..."
    textWrapper: string;     // e.g. "absolute inset-0 flex flex-col..."
    title: string;           // e.g. "font-bold text-white"
    subtitle: string;        // e.g. "text-zinc-400 text-xs"
    hoverEffect: string;     // e.g. "group-hover:scale-105"
}

// Defines how the ScrollRail looks
export interface RailInstructor {
    container: string;       // Margins/Breakout logic
    track: string;           // Padding/Gap logic
    button: {
        base: string;          // "backdrop-blur-2xl p-5 rounded-full..."
        icon: string;          // "w-6 h-6 text-white"
        positionLeft: string;  // "absolute left-32..."
        positionRight: string; // "absolute right-16..."
    };
}

// Defines text typography
export interface TypographyInstructor {
    pageTitle: string;       // "text-4xl font-bold..."
    sectionTitle: string;    // "text-xl font-bold..."
    sectionSubtitle: string; // "text-sm text-zinc-500..."
}

export interface SkeletonInstructor {
    container: string;      // The pulse/shimmer wrapper
    card: string;           // The shape of the empty card
    text: string;           // The shape of the empty title
    errorCard: string;
    errorText: string;
}

// The Master Theme Object
export interface UITheme {
    name: string;
    card: CardInstructor;
    rail: RailInstructor;
    typography: TypographyInstructor;
    surface: string;
    skeleton: SkeletonInstructor;       // Base glass material
}