"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calcWagering, type GameType } from "@/lib/calculations";

interface CasinoBonus {
  casino: string;
  matchPercent: number;
  maxBonus: number;
  wageringReq: number;
  gameType: GameType;
}

const CASINOS: CasinoBonus[] = [
  { casino: "1xBet", matchPercent: 100, maxBonus: 100, wageringReq: 35, gameType: "slots" },
  { casino: "22Bet", matchPercent: 100, maxBonus: 120, wageringReq: 30, gameType: "slots" },
  { casino: "BC.Game", matchPercent: 180, maxBonus: 20000, wageringReq: 40, gameType: "slots" },
  { casino: "BetFury", matchPercent: 100, maxBonus: 500, wageringReq: 35, gameType: "slots" },
  { casino: "TG.Casino", matchPercent: 200, maxBonus: 10000, wageringReq: 45, gameType: "slots" },
];

type SortKey = "casino" | "bonus" | "wagering" | "ev" | "verdict";
type SortDir = "asc" | "desc";

function verdictColor(verdict: string): string {
  switch (verdict) {
    case "GREAT DEAL": return "bg-emerald-600 text-white";
    case "GOOD": return "bg-green-600 text-white";
    case "FAIR": return "bg-yellow-600 text-white";
    case "BAD": return "bg-orange-600 text-white";
    case "TRAP": return "bg-red-600 text-white";
    default: return "";
  }
}

interface BonusCompareProps {
  onDecode?: (bonus: number, wagering: number, gameType: GameType) => void;
}

export default function BonusCompare({ onDecode }: BonusCompareProps) {
  const [sortKey, setSortKey] = useState<SortKey>("ev");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const data = CASINOS.map((c) => {
      const result = calcWagering(c.maxBonus, c.wageringReq, c.gameType);
      return { ...c, ...result };
    });

    return data.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "casino": cmp = a.casino.localeCompare(b.casino); break;
        case "bonus": cmp = a.maxBonus - b.maxBonus; break;
        case "wagering": cmp = a.wageringReq - b.wageringReq; break;
        case "ev": cmp = a.expectedValue - b.expectedValue; break;
        case "verdict": cmp = a.expectedValue - b.expectedValue; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("casino")}
            >
              Casino{sortIndicator("casino")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("bonus")}
            >
              Bonus{sortIndicator("bonus")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("wagering")}
            >
              Wagering{sortIndicator("wagering")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("ev")}
            >
              Expected Value{sortIndicator("ev")}
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("verdict")}
            >
              Verdict{sortIndicator("verdict")}
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.casino}>
              <TableCell className="font-medium">{row.casino}</TableCell>
              <TableCell>
                {row.matchPercent}% up to ${row.maxBonus.toLocaleString()}
              </TableCell>
              <TableCell>{row.wageringReq}x</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "font-semibold",
                    row.expectedValue >= 0 ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {row.expectedValue >= 0 ? "+" : ""}$
                  {row.expectedValue.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell>
                <Badge className={verdictColor(row.verdict)}>
                  {row.verdict}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onDecode?.(row.maxBonus, row.wageringReq, row.gameType)
                  }
                >
                  Decode
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
