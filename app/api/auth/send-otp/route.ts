import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOtp } from "@/lib/auth";

const PHONE_REGEX: Record<string, RegExp> = {
  NG: /^\+234\d{10}$/,
  KE: /^\+254\d{9}$/,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, country } = body as { phone: string; country: string };

    if (!phone || !country) {
      return NextResponse.json(
        { success: false, message: "Phone and country are required" },
        { status: 400 }
      );
    }

    if (!["NG", "KE"].includes(country)) {
      return NextResponse.json(
        { success: false, message: "Invalid country. Must be NG or KE" },
        { status: 400 }
      );
    }

    const regex = PHONE_REGEX[country];
    if (!regex.test(phone)) {
      return NextResponse.json(
        { success: false, message: `Invalid phone format for ${country}` },
        { status: 400 }
      );
    }

    // Rate limit: max 3 OTPs per phone in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentOtps = await prisma.otpCode.count({
      where: {
        phone,
        createdAt: { gt: tenMinutesAgo },
      },
    });

    if (recentOtps >= 3) {
      return NextResponse.json(
        { success: false, message: "Too many OTP requests. Try again later." },
        { status: 429 }
      );
    }

    const code = await generateOtp(phone);

    // SMS not integrated yet — log to console
    console.log(`[OTP] Phone: ${phone} | Code: ${code}`);

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
