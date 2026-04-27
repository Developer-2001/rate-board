import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      device_id?: string;
      platform?: "web" | "electron" | "android";
      source?: "fingerprint" | "uuid";
    };

    if (!payload?.device_id) {
      return NextResponse.json(
        {
          success: false,
          message: "device_id is required.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Device metadata registered successfully.",
        data: payload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to register device metadata.", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register device metadata.",
      },
      { status: 500 }
    );
  }
}
