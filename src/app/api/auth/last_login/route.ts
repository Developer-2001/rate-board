import { NextRequest, NextResponse } from "next/server";

function withRegisterDevicePrefix(deviceId: string) {
  return deviceId.startsWith("R_") ? deviceId : `R_${deviceId}`;
}

export async function POST(request: NextRequest) {
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

    const { clientId, deviceId } = await request.json();
    if (!clientId || !deviceId) {
      return NextResponse.json(
        {
          success: false,
          message: "Client ID and device ID are required.",
        },
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

    const response = await fetch(`${baseApiUrl}/login/last_login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: String(clientId),
        app_name: "account",
        unique_id: withRegisterDevicePrefix(String(deviceId)),
        app_type: "R",
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Last login update failed.", errorMessage);

      return NextResponse.json(
        { success: false, message: "Failed to update last login." },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Last login updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Last login API failed.", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
