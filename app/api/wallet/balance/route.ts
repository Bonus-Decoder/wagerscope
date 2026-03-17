import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json({
    balanceUsdt: wallet?.balanceUsdt || 0,
  });
}
