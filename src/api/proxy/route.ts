import { NextRequest, NextResponse } from "next/server";
export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const targetUrl = searchParams.get("q");

    if (!targetUrl) {
        return NextResponse.json({ error: "Missing 'q' parameter" }, { status: 400 });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Stremio/4.4.132 Web/5.0.0"
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Target fetch failed: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "s-maxage=300, stale-while-revalidate",
            },
        });

    } catch (error: any) {
        console.error(`[Proxy] Failed to fetch ${targetUrl}:`, error.message);
        return NextResponse.json({ error: "Proxy Error", details: error.message }, { status: 500 });
    }
}