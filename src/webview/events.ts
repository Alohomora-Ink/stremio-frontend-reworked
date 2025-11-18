import type { WebViewEventName, WebViewEvents } from "./constants";
import type { AuthResultPayload, CommandResponsePayload, PlaybackErrorEventPayload, PropertyChangeEventPayload } from "./payloads";

// --- Event Map  ---
export interface WebViewEventMap {
    [WebViewEvents.PROPERTY_CHANGE]: PropertyChangeEventPayload;
    [WebViewEvents.PLAYBACK_ENDED]: {};
    [WebViewEvents.PLAYBACK_ERROR]: PlaybackErrorEventPayload;
    [WebViewEvents.AUTH_RESULT]: AuthResultPayload;
    [WebViewEvents.COMMAND_RESPONSE]: CommandResponsePayload;
    [WebViewEvents.UPDATE_AVAILABLE]: {};
}

// A type that represents any possible event object to recieve (generic)
export type InboundWebViewEvent = {
    [E in WebViewEventName]: { event: E; payload: WebViewEventMap[E] };
}[WebViewEventName];