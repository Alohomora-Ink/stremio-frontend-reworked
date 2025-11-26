import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const urlObj = new URL(request.url);
    const targetUrl = urlObj.searchParams.get("url");

    if (!targetUrl) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
            }
        });

        if (!response.ok) {
            return new NextResponse(null, { status: response.status });
        }

        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*",
                // AGGRESSIVE CACHING:
                // public: Can be cached by anyone (browser, CDN)
                // max-age=604800: Cache for 7 days
                // immutable: The content will NEVER change. Do not revalidate.
                "Cache-Control": "public, max-age=604800, immutable"
            }
        });

    } catch (error) {
        return new NextResponse(null, { status: 500 });
    }
}