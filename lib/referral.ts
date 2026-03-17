import { prisma } from "@/lib/db";

export async function checkAndQualifyReferral(userId: string) {
  // Find the referral where this user is the referee
  const referral = await prisma.referral.findUnique({
    where: { refereeId: userId },
    include: { referee: true },
  });

  if (!referral || referral.status !== "pending") return;

  const referee = referral.referee;

  // Check qualification criteria:
  // a) Calculator used at least 2 times
  if (referee.calculatorUses < 2) return;

  // b) At least 1 casino click
  const clickCount = await prisma.click.count({
    where: { userId },
  });
  if (clickCount < 1) return;

  // Check rate limit before qualifying
  const { checkReferralRateLimit } = await import("@/lib/antifraud");
  const rateLimited = await checkReferralRateLimit(referral.referrerId);
  if (rateLimited) return;

  // Qualify the referral
  await prisma.referral.update({
    where: { id: referral.id },
    data: {
      status: "qualified",
      qualifiedAt: new Date(),
    },
  });

  // Credit $1 USDT to referrer's wallet
  const wallet = await prisma.wallet.findUnique({
    where: { userId: referral.referrerId },
  });

  if (wallet) {
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balanceUsdt: { increment: 1 } },
    });

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "referral_reward",
        amount: 1,
        status: "completed",
      },
    });
  }
}
