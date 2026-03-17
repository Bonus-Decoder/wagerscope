"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AdminStats {
  users: number;
  clicks: number;
  conversions: number;
  revenue: number;
  referrals: number;
  clicksByDay: { date: string; count: number }[];
  casinoStats: {
    casinoSlug: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
  flaggedUsers: {
    id: string;
    phone: string;
    deviceFingerprint: string | null;
    referralCount: number;
    createdAt: string;
  }[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 403) {
        setError("Access denied");
        return;
      }
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

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-24 rounded-lg bg-muted" />
          <div className="h-64 rounded-lg bg-muted" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-red-400">{error}</p>
      </main>
    );
  }

  if (!stats) return null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Total Users", value: stats.users },
          { label: "Total Clicks", value: stats.clicks },
          { label: "Total FTDs", value: stats.conversions },
          { label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
          { label: "Referrals", value: stats.referrals },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Clicks Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clicks (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.clicksByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#888" }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 12, fill: "#888" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Casino Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Casino Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.casinoStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Casino</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.casinoStats.map((c) => (
                  <TableRow key={c.casinoSlug}>
                    <TableCell className="font-medium">{c.casinoSlug}</TableCell>
                    <TableCell className="text-right">{c.clicks}</TableCell>
                    <TableCell className="text-right">{c.conversions}</TableCell>
                    <TableCell className="text-right">
                      ${c.revenue.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Flagged Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-400">Flagged Users</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.flaggedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No flagged users.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone</TableHead>
                  <TableHead>Fingerprint</TableHead>
                  <TableHead className="text-right">Referrals</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.flaggedUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-sm">
                      {u.phone}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {u.deviceFingerprint
                        ? `${u.deviceFingerprint.slice(0, 12)}...`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.referralCount}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
