import type { WebViewCommandMap, WebViewQueryMap, WebViewQueryResponseMap } from './commands';
import type { WebViewEventMap } from './events';
import type { WebViewEventName } from './constants';

export type WebViewTransport = {
    /**
     * Sends a fire-and-forget command to the C++ host.
     * The payload type is inferred from the command name.
     */
    send: <C extends keyof WebViewCommandMap>(
        command: C,
        payload: WebViewCommandMap[C]
    ) => void;

    /**
     * Sends a command that expects a response from the C++ host.
     * The payload and response types are inferred from the command name.
     */
    request: <C extends keyof WebViewQueryMap>(
        command: C,
        payload: WebViewQueryMap[C]
    ) => Promise<WebViewQueryResponseMap[C]>;

    /**
     * Listens for a strongly-typed event from the C++ host.
     */
    on: <E extends WebViewEventName>(
        event: E,
        callback: (payload: WebViewEventMap[E]) => void
    ) => void;

    /**
     * Removes an event listener.
     */
    off: <E extends WebViewEventName>(
        event: E,
        callback: (payload: WebViewEventMap[E]) => void
    ) => void;

};