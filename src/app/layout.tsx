"use client";

import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { WebViewProvider } from "@/providers/WebViewProvider";
import StremioCoreWebDebugCenter from "@/stremio-core-ts-wrapper/src/debug/components/StremioCoreWebDebugCenter";
import { StremioCoreProvider } from "@/stremio-core-ts-wrapper/src/providers/StremioCoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const ENABLE_STREMIO_CORE_WEB_DEBUG_CENTER = false;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-hidden bg-[#050505] antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <WebViewProvider>
            {ENABLE_STREMIO_CORE_WEB_DEBUG_CENTER ? (
              <StremioCoreWebDebugCenter />
            ) : (
              <StremioCoreProvider>
                <QueryProvider>
                  <AppShell>{children}</AppShell>
                </QueryProvider>
              </StremioCoreProvider>
            )}
          </WebViewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
