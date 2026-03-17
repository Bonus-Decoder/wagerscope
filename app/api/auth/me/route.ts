import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        country: user.country,
        referralCode: user.referralCode,
        walletBalance: user.wallet?.balanceUsdt ?? 0,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
