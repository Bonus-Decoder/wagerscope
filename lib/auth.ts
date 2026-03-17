import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);

function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function generateOtp(phone: string): Promise<string> {
  const code = generateRandomCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.otpCode.create({
    data: { phone, code, expiresAt },
  });

  return code;
}

export async function verifyOtp(
  phone: string,
  code: string,
  country: string,
  referralCode?: string
): Promise<{ user: { id: string; phone: string; country: string; referralCode: string }; token: string } | null> {
  const otp = await prisma.otpCode.findFirst({
    where: {
      phone,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return null;

  // Mark OTP as used
  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { used: true },
  });

  // Find or create user
  let user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    // Generate unique referral code
    let newReferralCode = generateReferralCode();
    let exists = await prisma.user.findUnique({ where: { referralCode: newReferralCode } });
    while (exists) {
      newReferralCode = generateReferralCode();
      exists = await prisma.user.findUnique({ where: { referralCode: newReferralCode } });
    }

    user = await prisma.user.create({
      data: {
        phone,
        country,
        referralCode: newReferralCode,
        referredBy: referralCode || null,
        wallet: { create: { balanceUsdt: 0 } },
      },
    });

    // If referred by someone, create Referral record
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      });
      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            refereeId: user.id,
          },
        });
      }
    }
  }

  // Link OTP to user
  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { userId: user.id },
  });

  // Create session
  const token = await createSession(user.id);

  return {
    user: {
      id: user.id,
      phone: user.phone,
      country: user.country,
      referralCode: user.referralCode,
    },
    token,
  };
}

export async function createSession(userId: string): Promise<string> {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const session = await prisma.session.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    return user;
  } catch {
    return null;
  }
}

export async function deleteSession(token: string) {
  try {
    await prisma.session.delete({ where: { token } });
  } catch {
    // Session may not exist
  }
}
