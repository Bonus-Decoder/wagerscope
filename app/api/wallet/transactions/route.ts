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

  if (!wallet) {
    return NextResponse.json({ transactions: [] });
  }

  const transactions = await prisma.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ transactions });
}
