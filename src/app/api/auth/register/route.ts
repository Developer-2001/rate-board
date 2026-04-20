import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const registerData = await request.json();
    if (!registerData) {
      return NextResponse.json(
        { success: false, message: "Register data is required." },
        { status: 400 }
      );
    }

    const bearerToken = request.cookies.get("bearerToken")?.value;
    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Bearer token not found in cookies." },
        { status: 401 }
      );
    }

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

    const response = await fetch(`${baseApiUrl}/login/register_device`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ ...registerData, device_type: "R" }),
    });

    if (!response.ok) {
      const message = await response.text();
      return NextResponse.json(
        {
          success: false,
          message: message || "Failed to register device.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registered successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Register API failed.", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error occurred while registering device.",
      },
      { status: 500 }
    );
  }
}
