import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    clientId: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { clientId } = await context.params;
    const normalizedClientId = clientId.trim();

    if (!normalizedClientId) {
      return NextResponse.json(
        {
          success: false,
          message: "Client ID is required.",
        },
        { status: 400 }
      );
    }

    const upstreamResponse = await fetch(
      `https://report-api-742717265610.asia-south1.run.app/api/Report/rate/Rate-${normalizedClientId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch rate board data.",
        },
        { status: upstreamResponse.status }
      );
    }

    const payload = await upstreamResponse.json();

    return NextResponse.json(
      {
        success: true,
        data: payload,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Rate board proxy failed.", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load rate board data.",
      },
      { status: 500 }
    );
  }
}
