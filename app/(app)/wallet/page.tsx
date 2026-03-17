"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  txHash: string | null;
  createdAt: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [balRes, txRes] = await Promise.all([
        fetch("/api/wallet/balance"),
        fetch("/api/wallet/transactions"),
      ]);
      if (balRes.ok) {
        const data = await balRes.json();
        setBalance(data.balanceUsdt);
      }
      if (txRes.ok) {
        const data = await txRes.json();
        setTransactions(data.transactions);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWithdraw = async () => {
    setError("");
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !address.trim()) {
      setError("Enter a valid amount and address");
      return;
    }

    setWithdrawing(true);
    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numAmount, address: address.trim() }),
      });

      if (res.ok) {
        setWithdrawOpen(false);
        setAmount("");
        setAddress("");
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error || "Withdrawal failed");
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
          <div className="h-48 rounded-lg bg-muted" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-violet-900/50 to-violet-800/30 border-violet-700/50">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
          <p className="text-4xl font-bold">${balance.toFixed(2)} USDT</p>
          <Button
            className="mt-4"
            onClick={() => setWithdrawOpen(true)}
            disabled={balance < 5}
          >
            Withdraw
          </Button>
          {balance < 5 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Minimum withdrawal: $5.00 USDT
            </p>
          )}
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Tx Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="capitalize">
                      {tx.type.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell
                      className={
                        tx.amount >= 0 ? "text-emerald-400" : "text-red-400"
                      }
                    >
                      {tx.amount >= 0 ? "+" : ""}
                      ${Math.abs(tx.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {tx.txHash
                        ? `${tx.txHash.slice(0, 8)}...`
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
            <DialogTitle>Withdraw USDT</DialogTitle>
            <DialogDescription>
              Enter the amount and your USDT wallet address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Amount (USDT)</label>
              <Input
                type="number"
                placeholder="5.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={5}
                max={balance}
                step={0.01}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Wallet Address</label>
              <Input
                placeholder="0x... or TRC-20 address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleWithdraw} disabled={withdrawing}>
                {withdrawing ? "Processing..." : "Withdraw"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
