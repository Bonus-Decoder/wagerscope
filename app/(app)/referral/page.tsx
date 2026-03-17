"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ReferralStats {
  totalInvited: number;
  qualified: number;
  totalEarned: number;
  availableBalance: number;
  referralCode: string;
  referrals: {
    id: string;
    status: string;
    qualifiedAt: string | null;
    createdAt: string;
    referePhone: string;
  }[];
}

export default function ReferralPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/referral/stats");
      if (res.ok) {
        setStats(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const referralLink = stats
    ? `https://bonusdecoder.app/r/${stats.referralCode}`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = `Check out Bonus Decoder - the best crypto casino bonus calculator! ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleTelegram = () => {
    const text = "Check out Bonus Decoder - the best crypto casino bonus calculator!";
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: stats?.availableBalance,
          address: "pending-setup",
        }),
      });
      if (res.ok) {
        setWithdrawOpen(false);
        fetchStats();
      }
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-lg bg-muted" />
          <div className="h-24 rounded-lg bg-muted" />
        </div>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-muted-foreground">Failed to load referral data.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Hero */}
      <Card className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/30 border-emerald-700/50">
        <CardContent className="py-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            Earn $1 USDT for every friend who uses Bonus Decoder
          </h1>
          <p className="text-muted-foreground">
            Share your referral link and earn rewards when friends use the calculator and explore casinos.
          </p>
        </CardContent>
      </Card>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">
              {referralLink}
            </code>
            <Button size="sm" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsApp}
              className="text-green-500 border-green-500/30"
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTelegram}
              className="text-blue-400 border-blue-400/30"
            >
              Telegram
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{stats.totalInvited}</p>
            <p className="text-xs text-muted-foreground">Total Invited</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{stats.qualified}</p>
            <p className="text-xs text-muted-foreground">Qualified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">${stats.totalEarned.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Total Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">${stats.availableBalance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Available Balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw */}
      <div className="flex justify-end">
        <Button
          disabled={stats.availableBalance < 5}
          onClick={() => setWithdrawOpen(true)}
        >
          Withdraw
        </Button>
      </div>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.referrals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No referrals yet. Share your link to get started!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.referrals.map((ref) => (
                  <TableRow key={ref.id}>
                    <TableCell className="font-mono text-sm">
                      {ref.referePhone}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ref.status === "qualified" || ref.status === "rewarded"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {ref.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {ref.status === "qualified" || ref.status === "rewarded"
                        ? "$1.00"
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              You are about to withdraw ${stats.availableBalance.toFixed(2)} USDT.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw} disabled={withdrawing}>
              {withdrawing ? "Processing..." : "Confirm Withdraw"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
