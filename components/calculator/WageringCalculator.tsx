"use client";

import { useState, useMemo, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  calcWagering,
  calcWageringCurve,
  type GameType,
  type WageringResult,
} from "@/lib/calculations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Currency = "USDT" | "NGN" | "KES";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USDT: "$",
  NGN: "₦",
  KES: "KSh",
};

const GAME_TYPE_LABELS: Record<GameType, string> = {
  slots: "Slots (100%)",
  table: "Table Games (10%)",
  blackjack: "Blackjack (5%)",
  mixed: "Mixed (50%)",
};

function verdictColor(verdict: WageringResult["verdict"]): string {
  switch (verdict) {
    case "GREAT DEAL":
      return "bg-emerald-600 text-white";
    case "GOOD":
      return "bg-green-600 text-white";
    case "FAIR":
      return "bg-yellow-600 text-white";
    case "BAD":
      return "bg-orange-600 text-white";
    case "TRAP":
      return "bg-red-600 text-white";
  }
}

export interface WageringCalculatorHandle {
  setValues: (bonus: number, wagering: number, gameType: GameType) => void;
}

interface WageringCalculatorProps {
  initialBonus?: number;
  initialWagering?: number;
  initialGameType?: GameType;
}

const WageringCalculator = forwardRef<WageringCalculatorHandle, WageringCalculatorProps>(
  function WageringCalculator(
    { initialBonus = 100, initialWagering = 35, initialGameType = "slots" },
    ref
  ) {
  const [bonusAmount, setBonusAmount] = useState(initialBonus);
  const [wageringReq, setWageringReq] = useState(initialWagering);
  const [gameType, setGameType] = useState<GameType>(initialGameType);

  useImperativeHandle(ref, () => ({
    setValues(bonus: number, wagering: number, gt: GameType) {
      setBonusAmount(bonus);
      setWageringReq(wagering);
      setGameType(gt);
    },
  }));
  const [currency, setCurrency] = useState<Currency>("USDT");

  // Track calculator usage (debounced, max 1 call per 5 minutes)
  const lastTrackRef = useRef(0);
  const trackCalculatorUse = useCallback(() => {
    const now = Date.now();
    if (now - lastTrackRef.current < 5 * 60 * 1000) return;
    lastTrackRef.current = now;
    fetch("/api/calculator/use", { method: "POST" }).catch(() => {});
  }, []);

  const result = useMemo(() => {
    trackCalculatorUse();
    return calcWagering(bonusAmount, wageringReq, gameType);
  }, [bonusAmount, wageringReq, gameType, trackCalculatorUse]);

  const chartData = useMemo(
    () => calcWageringCurve(bonusAmount, gameType),
    [bonusAmount, gameType]
  );

  const sym = CURRENCY_SYMBOLS[currency];

  const fmt = (n: number) => {
    if (currency === "NGN") return `₦${n.toLocaleString("en", { maximumFractionDigits: 0 })}`;
    if (currency === "KES") return `KSh${n.toLocaleString("en", { maximumFractionDigits: 0 })}`;
    return `$${n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bonus Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Bonus Amount ({sym})
              </label>
              <Input
                type="number"
                min={1}
                value={bonusAmount}
                onChange={(e) => setBonusAmount(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Wagering Requirement: {wageringReq}x
              </label>
              <input
                type="range"
                min={1}
                max={60}
                value={wageringReq}
                onChange={(e) => setWageringReq(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1x</span>
                <span>60x</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Game Type
              </label>
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value as GameType)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {Object.entries(GAME_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="USDT">USDT ($)</option>
                <option value="NGN">NGN (₦)</option>
                <option value="KES">KES (KSh)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Wager Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{fmt(result.totalWager)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              House Edge Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">
              -{fmt(result.houseEdgeCost)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expected Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={cn(
                "text-2xl font-bold",
                result.expectedValue >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {result.expectedValue >= 0 ? "+" : ""}
              {fmt(result.expectedValue)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Survival probability: {(result.probability * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verdict
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={cn("text-base px-3 py-1", verdictColor(result.verdict))}>
              {result.verdict}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Expected Value vs Wagering Requirement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                <XAxis
                  dataKey="wagering"
                  tickFormatter={(v) => `${v}x`}
                  stroke="hsl(0 0% 64%)"
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={(v) => `${sym}${v}`}
                  stroke="hsl(0 0% 64%)"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 9%)",
                    border: "1px solid hsl(0 0% 20%)",
                    borderRadius: "0.5rem",
                    color: "hsl(0 0% 98%)",
                  }}
                  formatter={(value) => [fmt(Number(value)), "Expected Value"]}
                  labelFormatter={(label) => `${label}x wagering`}
                />
                <Line
                  type="monotone"
                  dataKey="ev"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(142 76% 36%)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default WageringCalculator;
