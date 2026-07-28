import { NextResponse } from "next/server";
import { localEndOfDay } from "@/utils/time";

export async function POST() {
  try {
    const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseApiUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Base API URL is missing in environment variables.",
        },
        { status: 500 }
      );
    }

    const tokenResponse = await fetch(`${baseApiUrl}/sysfunction/gettoken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid: "AImzaSoyDbk23if7sll9aeW9", password: "5fm2B1o5TtVb8ayJi202Dl3G3Se9JIL" }),
    });

    const bearerToken = (await tokenResponse.text()).trim();
    if (!tokenResponse.ok || !bearerToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch bearer token.",
        },
        { status: tokenResponse.status || 502 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Bearer token fetched successfully.",
      },
      { status: 200 }
    );

    response.cookies.set("bearerToken", bearerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: localEndOfDay(),
    });

    return response;
  } catch (error) {
    console.error("Failed to fetch bearer token.", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch token.",
      },
      { status: 500 }
    );
  }
}
