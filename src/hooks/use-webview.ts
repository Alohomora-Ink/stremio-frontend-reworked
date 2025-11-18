"use client";

import { useContext } from "react";
import { WebViewContext } from "@/providers/WebViewProvider";

export const useWebView = () => {
    const context = useContext(WebViewContext);
    if (context === undefined) {
        throw new Error("useWebView2 must be used within a WebViewProvider");
    }
    return context;
};