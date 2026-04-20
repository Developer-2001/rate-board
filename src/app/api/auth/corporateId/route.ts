import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { cId } = await request.json();
    const corporateId = typeof cId === "string" ? cId.trim() : "";
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

    if (!corporateId) {
      return NextResponse.json(
        { success: false, message: "Corporate ID is required." },
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

    const response = await fetch(`${baseApiUrl}/login/corporateid/${corporateId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to retrieve data from the server.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.ClientId) {
      return NextResponse.json(
        { success: false, message: "The id does not exists" },
        { status: 400 }
      );
    }

    if (!data.ServerIp) {
      return NextResponse.json(
        { success: false, message: "Service not updated. Contact Support" },
        { status: 503 }
      );
    }

    const now = new Date();
    const licenseDate = new Date(data.LicenseSupportDate);
    const expirationLimit = new Date(licenseDate);
    expirationLimit.setDate(expirationLimit.getDate() + 1);

    if (now >= expirationLimit) {
      return NextResponse.json(
        { success: false, message: "License Expired. Contact Support" },
        { status: 401 }
      );
    }

    const fifteenDaysFromNow = new Date(now);
    fifteenDaysFromNow.setDate(now.getDate() + 15);

    let warningMessage: string | null = null;
    if (licenseDate <= fifteenDaysFromNow && licenseDate > now) {
      const daysUntilExpiry = Math.ceil(
        (licenseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const actualExpiryDate = new Date(licenseDate);
      actualExpiryDate.setDate(licenseDate.getDate() + 1);

      warningMessage = `Your subscription will expire on ${actualExpiryDate.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      )} (${daysUntilExpiry} days remaining)`;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data retrieved successfully.",
        data,
        warningMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Corporate ID authentication failed.", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to authenticate corporate ID.",
      },
      { status: 500 }
    );
  }
}
