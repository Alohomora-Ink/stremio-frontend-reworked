"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WebViewProvider } from "@/providers/WebViewProvider";
import { StremioCoreProvider } from "@/stremio-core-ts-wrapper/src/providers/StremioCoreProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import Nav from "@/components/navigation/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-white`}
      >
        <WebViewProvider>
          <StremioCoreProvider>
            <QueryProvider>
              <Nav />
              <main className="pt-16">{children}</main>
            </QueryProvider>
          </StremioCoreProvider>
        </WebViewProvider>
      </body>
    </html>
  );
}
