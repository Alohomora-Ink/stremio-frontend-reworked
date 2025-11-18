// Payloads for commands sent FROM frontend TO webview
export type BeginGoogleAuthPayload = { clientId: string };
export type PlayPayload = { url: string; startTime?: number };
export type SeekPayload = { time: number };
export type SetVolumePayload = { volume: number };
export type SetPropertyPayload = { property: 'aid' | 'sid' | 'pause'; value: string };
export type LoadSubtitlePayload = { url: string };

// Payloads for events sent FROM webview TO frontend
export type PropertyChangeEventPayload = { property: string; value: any };
export type PlaybackErrorEventPayload = { message: string };
export type AuthResultPayload = { code: string; redirectUri: string };
export type CommandResponsePayload = {
    messageId: string;
    result?: any;
    error?: string;
};