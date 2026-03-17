import { NextRequest, NextResponse } from "next/server";
import { getCasinoBySlug } from "@/lib/casinos";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const casinoSlug = searchParams.get("casino");
  const utmSource = searchParams.get("utm_source") || null;
  const utmCampaign = searchParams.get("utm_campaign") || null;
  const utmMedium = searchParams.get("utm_medium") || null;

  if (!casinoSlug) {
    return NextResponse.redirect(new URL("/casino", request.url));
  }

  const casino = getCasinoBySlug(casinoSlug);
  if (!casino) {
    return NextResponse.redirect(new URL("/casino", request.url));
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    null;
  const userAgent = request.headers.get("user-agent") || null;

  // Get authenticated user if available
  const user = await getUser(request);

  // Save click to database
  try {
    await prisma.click.create({
      data: {
        casinoSlug,
        userId: user?.id || null,
        ip,
        userAgent,
        utmSource,
        utmCampaign,
        utmMedium,
      },
    });
  } catch (error) {
    // Log but don't block the redirect
    console.error("Failed to save click:", error);
  }

  // Check referral qualification if user is authenticated
  if (user) {
    try {
      const { checkAndQualifyReferral } = await import("@/lib/referral");
      await checkAndQualifyReferral(user.id);
    } catch (err) {
      console.error("Referral check failed:", err);
    }
  }

  return NextResponse.redirect(casino.affiliateUrl, { status: 302 });
}
