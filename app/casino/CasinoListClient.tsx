"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import CasinoCard from "@/components/casino/CasinoCard";
import { type Casino } from "@/lib/casinos";

type SortKey = "rating" | "bonusValue" | "wageringReq";

const CRYPTO_FILTERS = ["All", "USDT", "BTC", "ETH"] as const;
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "rating", label: "Rating" },
  { key: "bonusValue", label: "Bonus" },
  { key: "wageringReq", label: "Wagering" },
];

export default function CasinoListClient({ casinos }: { casinos: Casino[] }) {
  const [cryptoFilter, setCryptoFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    let list = casinos;
    if (cryptoFilter !== "All") {
      list = list.filter((c) => c.cryptoSupported.includes(cryptoFilter));
    }
    return [...list].sort((a, b) => {
      if (sortKey === "rating") return b.rating - a.rating;
      if (sortKey === "bonusValue") return b.bonusValue - a.bonusValue;
      return a.wageringReq - b.wageringReq;
    });
  }, [casinos, cryptoFilter, sortKey]);

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Crypto:</span>
          {CRYPTO_FILTERS.map((f) => (
            <Button
              key={f}
              variant={cryptoFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setCryptoFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort:</span>
          {SORT_OPTIONS.map((s) => (
            <Button
              key={s.key}
              variant={sortKey === s.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSortKey(s.key)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((casino) => (
          <CasinoCard key={casino.slug} casino={casino} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No casinos match this filter.
        </p>
      )}
    </>
  );
}
