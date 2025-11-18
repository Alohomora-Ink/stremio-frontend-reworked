export const WebViewCommands = {
    // Fire-and-forget commands
    PLAY: "play",
    STOP: "stop",
    TOGGLE_PAUSE: "toggle-pause",
    SET_VOLUME: "set-volume",
    TOGGLE_MUTE: "toggle-mute",
    SET_PROPERTY: "set-property",
    LOAD_SUBTITLE: "load-subtitle",
    TOGGLE_FULLSCREEN: "toggle-fullscreen",
    FRONTEND_READY: "frontend-ready",
    SET_RPC: "set-rpc",
    NAVIGATE: "navigate",
    UPDATE_INSTALL: "update-install",
    SEEK: "seek",

    // Request-response commands (Queries)
    GET_SETTING: "get-setting",
    GET_MODEL_STATE: "get-model-state",
} as const;

export const WebViewEvents = {
    COMMAND_RESPONSE: "command-response",
    PROPERTY_CHANGE: "property-change",
    PLAYBACK_ENDED: "playback-ended",
    PLAYBACK_ERROR: "playback-error",
    AUTH_RESULT: "auth-result",
    UPDATE_AVAILABLE: "update-available",
} as const;

// Create union types from our constants for type safety
export type WebViewCommandName = typeof WebViewCommands[keyof typeof WebViewCommands];
export type WebViewEventName = typeof WebViewEvents[keyof typeof WebViewEvents];