import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth";
import { checkDuplicateDevice, checkIpClustering } from "@/lib/antifraud";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code, country, referralCode } = body as {
      phone: string;
      code: string;
      country: string;
      referralCode?: string;
    };

    if (!phone || !code || !country) {
      return NextResponse.json(
        { success: false, message: "Phone, code, and country are required" },
        { status: 400 }
      );
    }

    // Anti-fraud: check device fingerprint for new users
    const fingerprint = request.cookies.get("dfp")?.value;
    const existingUser = await prisma.user.findUnique({ where: { phone } });

    if (!existingUser && fingerprint) {
      const isDuplicate = await checkDuplicateDevice(fingerprint);
      if (isDuplicate) {
        return NextResponse.json(
          { success: false, message: "Registration blocked" },
          { status: 403 }
        );
      }
    }

    // Anti-fraud: check IP clustering
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
    if (!existingUser && ip) {
      const isClustered = await checkIpClustering(ip);
      if (isClustered) {
        // Flag user as suspicious after creation instead of blocking
        // We'll flag below after user creation
      }
    }

    const result = await verifyOtp(phone, code, country, referralCode);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    });

    // Save device fingerprint and check IP clustering for new users
    if (fingerprint) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { deviceFingerprint: fingerprint },
      });
    }

    if (!existingUser && ip) {
      const isClustered = await checkIpClustering(ip);
      if (isClustered) {
        await prisma.user.update({
          where: { id: result.user.id },
          data: { suspicious: true },
        });
      }
    }

    // Set HttpOnly cookie
    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
