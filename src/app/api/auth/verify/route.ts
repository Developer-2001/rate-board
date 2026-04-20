import { NextRequest, NextResponse } from "next/server";

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

    const { clientId, SysName, fingerPrintId } = await request.json();
    if (!clientId || !SysName || !fingerPrintId) {
      return NextResponse.json(
        {
          success: false,
          message: "Client ID, system name, and fingerprint are required.",
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

    const response = await fetch(
      `${baseApiUrl}/login/device/${clientId}/${SysName}/${fingerPrintId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Device verification failed.", errorMessage);

      return NextResponse.json(
        { success: false, message: "Failed to fetch device data." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: "Device data retrieved successfully.",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Device verification failed.", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
