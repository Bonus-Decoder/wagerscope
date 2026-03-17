import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";
import { checkAndQualifyReferral } from "@/lib/referral";

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Increment calculator uses
  await prisma.user.update({
    where: { id: user.id },
    data: { calculatorUses: { increment: 1 } },
  });

  // Check if referral qualifies
  await checkAndQualifyReferral(user.id);

  return NextResponse.json({ success: true });
}
