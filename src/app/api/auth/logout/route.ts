import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully.",
    },
    { status: 200 }
  );

  response.cookies.set("bearerToken", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set("Verified", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
