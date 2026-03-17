import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const referrals = await prisma.referral.findMany({
    where: { referrerId: user.id },
    include: {
      referee: { select: { phone: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalInvited = referrals.length;
  const qualified = referrals.filter(
    (r) => r.status === "qualified" || r.status === "rewarded"
  ).length;

  // Sum rewards from wallet transactions
  const wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
  });

  const totalEarned = wallet
    ? await prisma.walletTransaction
        .aggregate({
          where: {
            walletId: wallet.id,
            type: "referral_reward",
            status: "completed",
          },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0)
    : 0;

  const availableBalance = wallet?.balanceUsdt || 0;

  return NextResponse.json({
    totalInvited,
    qualified,
    totalEarned,
    availableBalance,
    referralCode: user.referralCode,
    referrals: referrals.map((r) => ({
      id: r.id,
      status: r.status,
      qualifiedAt: r.qualifiedAt,
      createdAt: r.createdAt,
      referePhone: r.referee.phone.replace(/.(?=.{4})/g, "*"),
    })),
  });
}
