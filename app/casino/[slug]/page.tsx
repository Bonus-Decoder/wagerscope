import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { CASINOS, getCasinoBySlug } from "@/lib/casinos";
import { calcWagering } from "@/lib/calculations";

export function generateStaticParams() {
  return CASINOS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const casino = getCasinoBySlug(params.slug);
  if (!casino) return { title: "Casino Not Found" };

  return {
    title: `${casino.name} Review 2026 - Bonus & Wagering Analysis`,
    description: `${casino.name} offers ${casino.bonusAmount} with ${casino.wageringReq}x wagering. Read our full analysis including expected value, pros, cons, and crypto support.`,
    openGraph: {
      title: `${casino.name} Review 2026 - Bonus Decoder`,
      description: `${casino.bonusAmount} bonus with ${casino.wageringReq}x wagering. Is it worth it?`,
    },
  };
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5 text-yellow-500">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="text-2xl">
          {i < full ? "★" : i === full && half ? "★" : "☆"}
        </span>
      ))}
      <span className="ml-2 text-lg text-muted-foreground">{rating}/5</span>
    </span>
  );
}

export default function CasinoPage({
  params,
}: {
  params: { slug: string };
}) {
  const casino = getCasinoBySlug(params.slug);
  if (!casino) notFound();

  const trackUrl = `/api/tracking/click?casino=${casino.slug}`;
  const slotsResult = calcWagering(casino.bonusValue, casino.wageringReq, "slots");
  const tableResult = calcWagering(casino.bonusValue, casino.wageringReq, "table");
  const bjResult = calcWagering(casino.bonusValue, casino.wageringReq, "blackjack");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Casino",
      name: casino.name,
      url: casino.affiliateUrl,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: casino.rating,
      bestRating: 5,
    },
    author: {
      "@type": "Organization",
      name: "Bonus Decoder",
    },
    datePublished: "2026-01-15",
    description: `${casino.name} offers ${casino.bonusAmount} with ${casino.wageringReq}x wagering requirement.`,
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        {" / "}
        <Link href="/casino" className="hover:text-foreground">Casinos</Link>
        {" / "}
        <span className="text-foreground">{casino.name}</span>
      </nav>

      {/* Hero */}
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted text-3xl font-bold">
          {casino.name.charAt(0)}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold sm:text-4xl">{casino.name}</h1>
            <Badge variant="default">Verified</Badge>
          </div>
          <StarRating rating={casino.rating} />
          <p className="mt-1 text-sm text-muted-foreground">
            Est. {casino.established} · {casino.license}
          </p>
        </div>
      </section>

      {/* Bonus Highlight Card */}
      <Card className="mb-8 border-primary/50">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome Bonus</p>
            <p className="text-2xl font-bold text-primary">{casino.bonusAmount}</p>
            <p className="text-sm text-muted-foreground">
              {casino.wageringReq}x wagering · Min deposit ${casino.minDeposit}
            </p>
          </div>
          <Button asChild size="lg">
            <a href={trackUrl} target="_blank" rel="noopener noreferrer">
              Claim Bonus
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Wagering Analysis */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Wagering Analysis</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Slots", result: slotsResult },
            { label: "Table Games", result: tableResult },
            { label: "Blackjack", result: bjResult },
          ].map(({ label, result }) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Wager</span>
                  <span>${result.totalWager.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">House Edge Cost</span>
                  <span className="text-red-400">
                    -${result.houseEdgeCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Value</span>
                  <span
                    className={
                      result.expectedValue > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    ${result.expectedValue.toLocaleString()}
                  </span>
                </div>
                <div className="pt-1">
                  <Badge
                    variant={
                      result.verdict === "GREAT DEAL" || result.verdict === "GOOD"
                        ? "default"
                        : result.verdict === "FAIR"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {result.verdict}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Pros &amp; Cons</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-green-400">Pros</h3>
            <ul className="space-y-2">
              {casino.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-green-400">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-red-400">Cons</h3>
            <ul className="space-y-2">
              {casino.cons.map((con) => (
                <li key={con} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-red-400">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Info Table */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Casino Details</h2>
        <Card>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Crypto Supported</TableCell>
                <TableCell>{casino.cryptoSupported.join(", ")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Deposit Methods</TableCell>
                <TableCell>{casino.depositMethods.join(", ")}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Withdrawal Time</TableCell>
                <TableCell>{casino.withdrawalTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">License</TableCell>
                <TableCell>{casino.license}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Established</TableCell>
                <TableCell>{casino.established}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Available In</TableCell>
                <TableCell>
                  {casino.geoAvailable
                    .map((g) => (g === "NG" ? "Nigeria" : g === "KE" ? "Kenya" : g))
                    .join(", ")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="rounded-xl border bg-card p-8 text-center">
        <h2 className="text-2xl font-bold">
          Ready to play at {casino.name}?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Claim your {casino.bonusAmount} welcome bonus today.
        </p>
        <Button asChild size="lg" className="mt-6">
          <a href={trackUrl} target="_blank" rel="noopener noreferrer">
            Play at {casino.name}
          </a>
        </Button>
      </section>
    </main>
  );
}
