import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const urlObj = new URL(request.url);
    const targetUrl = urlObj.searchParams.get("q");

    if (!targetUrl) {
        return NextResponse.json({ error: "Missing 'q' parameter" }, { status: 400 });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Stremio/4.4.168 (Desktop)",
                "Accept": "application/json, text/plain, */*",
            }
        });

        const responseText = await response.text();

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            // If the target returns HTML (like a Cloudflare error page), pass it as text 
            // so the client knows it failed instead of crashing JSON.parse
            return new NextResponse(responseText, {
                status: response.status,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "text/plain"
                }
            });
        }

        return NextResponse.json(data, {
            status: response.status,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Cache-Control": response.ok ? "s-maxage=300, stale-while-revalidate" : "no-store",
            },
        });

    } catch (error: any) {
        console.error(`[Proxy] Fetch error:`, error.message);
        return NextResponse.json(
            { error: "Proxy Error", details: error.message },
            {
                status: 500,
                headers: { "Access-Control-Allow-Origin": "*" }
            }
        );
    }
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}