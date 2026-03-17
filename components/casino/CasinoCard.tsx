import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Casino } from "@/lib/casinos";
import { calcWagering } from "@/lib/calculations";

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5 text-yellow-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="text-sm">
          {i < full ? "★" : i === full && half ? "★" : "☆"}
        </span>
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating}</span>
    </span>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const variant =
    verdict === "GREAT DEAL" || verdict === "GOOD"
      ? "default"
      : verdict === "FAIR"
        ? "secondary"
        : "destructive";
  return <Badge variant={variant}>{verdict}</Badge>;
}

export default function CasinoCard({ casino }: { casino: Casino }) {
  const result = calcWagering(casino.bonusValue, casino.wageringReq, "slots");

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-bold">
            {casino.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{casino.name}</h3>
            <StarRating rating={casino.rating} />
          </div>
        </div>

        {/* Bonus info */}
        <div className="space-y-1">
          <p className="text-lg font-bold text-primary">{casino.bonusAmount}</p>
          <p className="text-sm text-muted-foreground">
            {casino.wageringReq}x wagering · Min ${casino.minDeposit}
          </p>
        </div>

        {/* Crypto badges */}
        <div className="flex flex-wrap gap-1">
          {casino.cryptoSupported.slice(0, 4).map((crypto) => (
            <Badge key={crypto} variant="outline" className="text-xs">
              {crypto}
            </Badge>
          ))}
          {casino.cryptoSupported.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{casino.cryptoSupported.length - 4}
            </Badge>
          )}
        </div>

        {/* Verdict */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">EV (slots):</span>
          <VerdictBadge verdict={result.verdict} />
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/casino/${casino.slug}`}>Read Review</Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <a href={`/api/tracking/click?casino=${casino.slug}`} target="_blank" rel="noopener noreferrer">
              Play Now
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
