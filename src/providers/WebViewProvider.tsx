"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { isWebView } from "@/webview/utils";
import type { PendingRequest } from "@/webview/types";
import {
  WebViewCommands,
  WebViewEvents,
  type WebViewEventName,
} from "@/webview/constants";
import type { WebViewCommandMap, WebViewQueryMap } from "@/webview/commands";
import type { CommandResponsePayload } from "@/webview/payloads";
import type { InboundWebViewEvent, WebViewEventMap } from "@/webview/events";
import { type WebViewTransport } from "@/webview/transport";

interface WebViewContextType {
  isRunningInWebview: boolean;
  transport: WebViewTransport | null;
}

export const WebViewContext = createContext<WebViewContextType>({
  isRunningInWebview: false,
  transport: null,
});

export function WebViewProvider({ children }: { children: React.ReactNode }) {
  const [isRunningInWebview, setIsRunningInWebview] = useState(false);
  const [transport, setTransport] = useState<WebViewTransport | null>(null);
  const listeners = useRef<Map<WebViewEventName, Set<(data: any) => void>>>(
    new Map(),
  );
  const pendingRequests = useRef<Map<string, PendingRequest>>(new Map());

  const send = useCallback(
    <C extends keyof WebViewCommandMap>(
      command: C,
      payload: WebViewCommandMap[C],
    ) => {
      if (isWebView()) {
        const message = { command, payload };
        window?.chrome?.webview?.postMessage(JSON.stringify(message));
      }
    },
    [],
  );

  const request = useCallback(
    <C extends keyof WebViewQueryMap>(
      command: C,
      payload: WebViewQueryMap[C],
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!isWebView()) {
          return reject(new Error("Not running in a WebView environment."));
        }

        const messageId = crypto.randomUUID();
        pendingRequests.current.set(messageId, { resolve, reject });

        const message = { command, payload, messageId };
        window?.chrome?.webview?.postMessage(JSON.stringify(message));

        setTimeout(() => {
          if (pendingRequests.current.has(messageId)) {
            pendingRequests.current.delete(messageId);
            reject(new Error(`Request timed out for command: ${command}`));
          }
        }, 10000);
      });
    },
    [],
  );

  const on = useCallback(
    <E extends WebViewEventName>(
      event: E,
      callback: (payload: WebViewEventMap[E]) => void,
    ) => {
      if (!listeners.current.has(event)) {
        listeners.current.set(event, new Set());
      }
      listeners.current.get(event)!.add(callback);
    },
    [],
  );

  const off = useCallback(
    <E extends WebViewEventName>(
      event: E,
      callback: (payload: WebViewEventMap[E]) => void,
    ) => {
      if (listeners.current.has(event)) {
        listeners.current.get(event)!.delete(callback);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isWebView()) return;
    const handleMessage = (event: MessageEvent<any>) => {
      try {
        const message = event.data as InboundWebViewEvent;

        if (message.event === WebViewEvents.COMMAND_RESPONSE) {
          const { messageId, result, error } =
            message.payload as CommandResponsePayload;
          if (pendingRequests.current.has(messageId)) {
            const { resolve, reject } = pendingRequests.current.get(messageId)!;
            if (error) {
              reject(new Error(error));
            } else {
              resolve(result);
            }
            pendingRequests.current.delete(messageId);
          }
          return;
        }

        if (message.event && listeners.current.has(message.event)) {
          listeners.current
            .get(message.event)!
            .forEach((cb) => cb(message.payload));
        }
      } catch (e) {
        console.error(
          "Failed to process message from native host:",
          event.data,
          e,
        );
      }
    };

    window?.chrome?.webview?.addEventListener("message", handleMessage);
    setIsRunningInWebview(true);
    setTransport({ send, on, off, request });
    send(WebViewCommands.FRONTEND_READY, {});
    console.log("WebView communication bridge is ready.");
    return () => {
      window?.chrome?.webview?.removeEventListener("message", handleMessage);
    };
  }, [send, on, off, request]);

  const value = { isRunningInWebview, transport };

  return (
    <WebViewContext.Provider value={value}>{children}</WebViewContext.Provider>
  );
}
