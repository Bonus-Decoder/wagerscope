import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const clickId = searchParams.get("click_id") || null;
  const type = searchParams.get("type"); // "FTD" or "registration"
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency") || "USD";
  const externalId = searchParams.get("external_id") || null;
  const secret = searchParams.get("secret");

  if (!secret || secret !== process.env.POSTBACK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }

  // Find casino slug from click if available
  let casinoSlug = searchParams.get("casino") || "unknown";
  if (clickId) {
    const click = await prisma.click.findUnique({
      where: { id: clickId },
      select: { casinoSlug: true },
    });
    if (click) casinoSlug = click.casinoSlug;
  }

  await prisma.conversion.create({
    data: {
      clickId,
      casinoSlug,
      type,
      commission: amount ? parseFloat(amount) : null,
      currency,
      externalId,
    },
  });

  return NextResponse.json({ status: "OK" });
}
