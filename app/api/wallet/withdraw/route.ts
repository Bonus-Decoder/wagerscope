import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-middleware";
import { prisma } from "@/lib/db";
import { checkWithdrawalEligibility } from "@/lib/antifraud";

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { amount, address } = body as { amount: number; address: string };

  if (!amount || !address || amount <= 0) {
    return NextResponse.json(
      { error: "Amount and address are required" },
      { status: 400 }
    );
  }

  const eligibility = await checkWithdrawalEligibility(user.id);
  if (!eligibility.eligible) {
    return NextResponse.json(
      { error: eligibility.reason },
      { status: 403 }
    );
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
  });

  if (!wallet || wallet.balanceUsdt < amount) {
    return NextResponse.json(
      { error: "Insufficient balance" },
      { status: 400 }
    );
  }

  // Decrement balance and create transaction
  await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balanceUsdt: { decrement: amount } },
  });

  const transaction = await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      type: "withdrawal",
      amount: -amount,
      status: "pending",
    },
  });

  return NextResponse.json({ success: true, txId: transaction.id });
}
