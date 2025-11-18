export const isWebView = () =>
    typeof window !== "undefined" && !!window.chrome?.webview;