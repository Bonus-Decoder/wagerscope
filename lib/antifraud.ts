import { prisma } from "@/lib/db";

export async function checkDuplicateDevice(fingerprint: string): Promise<boolean> {
  const existing = await prisma.user.findFirst({
    where: { deviceFingerprint: fingerprint },
  });
  return !!existing;
}

export async function checkReferralRateLimit(userId: string): Promise<boolean> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const qualifiedToday = await prisma.referral.count({
    where: {
      referrerId: userId,
      status: { in: ["qualified", "rewarded"] },
      qualifiedAt: { gte: twentyFourHoursAgo },
    },
  });

  if (qualifiedToday >= 10) {
    console.warn(`[antifraud] Rate limit hit for user ${userId}: ${qualifiedToday} qualified referrals in 24h`);
    return true;
  }

  return false;
}

export async function checkIpClustering(ip: string): Promise<boolean> {
  // Extract /24 subnet
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  const subnet = `${parts[0]}.${parts[1]}.${parts[2]}.`;

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Check clicks from same /24 subnet for unique users
  const recentClicks = await prisma.click.findMany({
    where: {
      ip: { startsWith: subnet },
      createdAt: { gte: twentyFourHoursAgo },
    },
    select: { userId: true },
    distinct: ["userId"],
  });

  const uniqueUsers = recentClicks.filter((c) => c.userId).length;
  return uniqueUsers > 5;
}

export async function checkWithdrawalEligibility(
  userId: string
): Promise<{ eligible: boolean; reason?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });

  if (!user || !user.wallet) {
    return { eligible: false, reason: "User or wallet not found" };
  }

  // Balance >= $5
  if (user.wallet.balanceUsdt < 5) {
    return { eligible: false, reason: "Minimum withdrawal is $5 USDT" };
  }

  // Account created at least 48h ago
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  if (user.createdAt > fortyEightHoursAgo) {
    return { eligible: false, reason: "Account must be at least 48 hours old" };
  }

  // Not flagged as suspicious
  if (user.suspicious) {
    return { eligible: false, reason: "Account flagged for review" };
  }

  // Max 1 withdrawal per 24h
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentWithdrawals = await prisma.walletTransaction.count({
    where: {
      walletId: user.wallet.id,
      type: "withdrawal",
      createdAt: { gte: twentyFourHoursAgo },
    },
  });

  if (recentWithdrawals >= 1) {
    return { eligible: false, reason: "Maximum 1 withdrawal per 24 hours" };
  }

  return { eligible: true };
}
