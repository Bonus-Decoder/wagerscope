import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

interface Props {
  params: { code: string };
}

export default async function ReferralLanding({ params }: Props) {
  const { code } = params;

  // Validate referral code exists
  const referrer = await prisma.user.findUnique({
    where: { referralCode: code },
  });

  if (referrer) {
    // Set referral cookie for 30 days
    cookies().set("ref", code, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
  }

  redirect("/");
}
