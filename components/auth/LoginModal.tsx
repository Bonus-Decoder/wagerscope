"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COUNTRY_PREFIXES = [
  { code: "NG", prefix: "+234", label: "Nigeria (+234)" },
  { code: "KE", prefix: "+254", label: "Kenya (+254)" },
];

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [country, setCountry] = useState("NG");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const prefix = COUNTRY_PREFIXES.find((c) => c.code === country)?.prefix || "+234";

  useEffect(() => {
    if (resendTimer <= 0) {
      setResendDisabled(false);
      return;
    }
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep("phone");
      setPhone("");
      setOtp("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  async function handleSendOtp() {
    setError("");
    setLoading(true);

    const fullPhone = `${prefix}${phone}`;

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, country }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }

      setStep("otp");
      setResendDisabled(true);
      setResendTimer(60);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError("");
    setLoading(true);

    const fullPhone = `${prefix}${phone}`;

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, code: otp, country }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      // Save token in client-accessible cookie too (for middleware)
      Cookies.set("token", data.token, { expires: 30, path: "/" });

      onOpenChange(false);
      window.location.reload();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendDisabled(true);
    setResendTimer(60);
    await handleSendOtp();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "phone" ? "Sign In" : "Enter Verification Code"}
          </DialogTitle>
        </DialogHeader>

        {step === "phone" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {COUNTRY_PREFIXES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <div className="flex gap-2">
                <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                  {prefix}
                </div>
                <Input
                  type="tel"
                  placeholder={country === "NG" ? "8012345678" : "712345678"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  maxLength={country === "NG" ? 10 : 9}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              onClick={handleSendOtp}
              disabled={loading || !phone}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Code"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to {prefix}{phone}
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Code</label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </Button>

            <button
              onClick={handleResend}
              disabled={resendDisabled}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {resendDisabled
                ? `Resend code in ${resendTimer}s`
                : "Resend code"}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
