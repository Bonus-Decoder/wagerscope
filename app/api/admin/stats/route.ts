import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.phone !== process.env.ADMIN_PHONE) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, clicks, conversions, referrals] = await Promise.all([
    prisma.user.count(),
    prisma.click.count(),
    prisma.conversion.count(),
    prisma.referral.count(),
  ]);

  const revenueAgg = await prisma.conversion.aggregate({
    _sum: { commission: true },
  });
  const revenue = revenueAgg._sum.commission || 0;

  // Clicks by day (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentClicks = await prisma.click.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  });

  const clicksByDay: Record<string, number> = {};
  recentClicks.forEach((click) => {
    const day = click.createdAt.toISOString().split("T")[0];
    clicksByDay[day] = (clicksByDay[day] || 0) + 1;
  });

  // Casino performance
  const casinoClicks = await prisma.click.groupBy({
    by: ["casinoSlug"],
    _count: true,
  });

  const casinoConversions = await prisma.conversion.groupBy({
    by: ["casinoSlug"],
    _count: true,
    _sum: { commission: true },
  });

  const casinoMap = new Map<string, { clicks: number; conversions: number; revenue: number }>();
  casinoClicks.forEach((c) => {
    casinoMap.set(c.casinoSlug, { clicks: c._count, conversions: 0, revenue: 0 });
  });
  casinoConversions.forEach((c) => {
    const existing = casinoMap.get(c.casinoSlug) || { clicks: 0, conversions: 0, revenue: 0 };
    existing.conversions = c._count;
    existing.revenue = c._sum.commission || 0;
    casinoMap.set(c.casinoSlug, existing);
  });

  const casinoStats = Array.from(casinoMap.entries()).map(([slug, stats]) => ({
    casinoSlug: slug,
    ...stats,
  }));

  // Flagged users
  const flaggedUsers = await prisma.user.findMany({
    where: { suspicious: true },
    select: {
      id: true,
      phone: true,
      deviceFingerprint: true,
      createdAt: true,
      _count: { select: { referralsMade: true } },
    },
  });

  return NextResponse.json({
    users,
    clicks,
    conversions,
    revenue,
    referrals,
    clicksByDay: Object.entries(clicksByDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    casinoStats,
    flaggedUsers: flaggedUsers.map((u) => ({
      id: u.id,
      phone: u.phone,
      deviceFingerprint: u.deviceFingerprint,
      referralCount: u._count.referralsMade,
      createdAt: u.createdAt,
    })),
  });
}
