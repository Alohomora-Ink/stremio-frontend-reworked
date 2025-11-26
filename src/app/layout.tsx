"use client";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { QueryProvider } from "@/providers/QueryProvider";
import { WebViewProvider } from "@/providers/WebViewProvider";
import StremioCoreWebDebugCenter from "@/stremio-core-ts-wrapper/src/debug/components/StremioCoreWebDebugCenter";
import { StremioCoreProvider } from "@/stremio-core-ts-wrapper/src/providers/StremioCoreProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ViewStateProvider } from "@/providers/ViewStateProvider";
import { ScrollControllerProvider } from "@/providers/ScrollControllerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const ENABLE_STREMIO_CORE_WEB_DEBUG_CENTER = false;
const injectDevToolsScript = () => {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    const script = document.createElement("script");
    script.src = "http://localhost:8097";
    script.async = false;
    document.head.appendChild(script);
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // if (typeof window !== "undefined") {
  //   injectDevToolsScript();
  // }
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-hidden bg-[#050505] antialiased`}
        suppressHydrationWarning
      >
        <WebViewProvider>
          {ENABLE_STREMIO_CORE_WEB_DEBUG_CENTER ? (
            <StremioCoreWebDebugCenter />
          ) : (
            <QueryProvider>
              <StremioCoreProvider>
                <ToastProvider>
                  <ViewStateProvider>
                    <ScrollControllerProvider>
                      <AppShell>{children}</AppShell>
                    </ScrollControllerProvider>
                  </ViewStateProvider>
                </ToastProvider>
              </StremioCoreProvider>
            </QueryProvider>
          )}
        </WebViewProvider>
      </body>
    </html>
  );
}
