export { };

declare global {
    interface Window {
        chrome?: {
            webview?: {
                postMessage(message: string): void;
                addEventListener(type: "message", handler: (event: MessageEvent<string>) => void): void;
                removeEventListener(type: "message", handler: (event: MessageEvent<string>) => void): void;
            };
        };
        qt?: {
            webChannelTransport: {
                send: (message: string) => void;
                onmessage: (event: { data: string }) => void;
            };
        };
        WebviewTransport?: {
            send: (data: any) => void;
            onmessage: ((event: { data: any }) => void) | null;
        };
        InitializeWebviewCommunication?: () => void;
        onCoreEvent?: (name: any, args: any) => void;
    }
}