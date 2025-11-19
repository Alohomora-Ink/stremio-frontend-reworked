"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WebViewProvider } from "@/providers/WebViewProvider";
import { StremioCoreProvider } from "@/stremio-core-ts-wrapper/src/providers/StremioCoreProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import StremioDebugTool from "@/stremio-core-ts-wrapper/src/debug/components/StremioDebugTool";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEBUG_STREMIO_CORE_VIEW = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-zinc-100 overflow-x-hidden`}
      >
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[128px] pointer-events-none translate-x-1/2 translate-y-1/2" />

        <WebViewProvider>
          {DEBUG_STREMIO_CORE_VIEW ? (
            <StremioDebugTool />
          ) : (
            <StremioCoreProvider>
              <QueryProvider>
                <Sidebar />
                <TopBar />
                <main className="min-h-screen pt-24 pb-20 relative z-0 w-full">
                  {children}
                </main>
              </QueryProvider>
            </StremioCoreProvider>
          )}
        </WebViewProvider>
      </body>
    </html>
  );
}
