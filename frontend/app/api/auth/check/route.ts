import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    // Verify token with your Express backend
    const response = await fetch(
      `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // Token is invalid, clear the cookie
      cookieStore.delete("auth-token");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const data = await response.json();

    return NextResponse.json({
      user: data.user,
      token: token, // Return token for client-side API calls
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
