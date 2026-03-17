import type { Metadata } from "next";
import Link from "next/link";
import { CASINOS } from "@/lib/casinos";
import CasinoCard from "@/components/casino/CasinoCard";

export const metadata: Metadata = {
  title: "Best Crypto Casinos in Nigeria 2026 - Bonus Decoder",
  description:
    "Discover the best crypto casinos available in Nigeria for 2026. Compare bonuses, wagering requirements, and expected value from top platforms accepting USDT, BTC, and ETH.",
  openGraph: {
    title: "Best Crypto Casinos in Nigeria 2026",
    description:
      "Compare the top crypto casinos for Nigerian players with honest bonus analysis.",
  },
};

export default function BestCryptoCasinoNigeria() {
  const ngCasinos = CASINOS.filter((c) => c.geoAvailable.includes("NG")).sort(
    (a, b) => b.rating - a.rating
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Crypto Casinos in Nigeria 2026",
    author: { "@type": "Organization", name: "Bonus Decoder" },
    datePublished: "2026-01-15",
    dateModified: "2026-03-01",
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        {" / "}
        <span className="text-foreground">Best Crypto Casinos Nigeria</span>
      </nav>

      <h1 className="text-3xl font-bold sm:text-4xl">
        Best Crypto Casinos in Nigeria (2026)
      </h1>
      <p className="mt-3 mb-8 text-lg text-muted-foreground">
        Nigeria is one of Africa&apos;s fastest-growing markets for crypto
        gambling. We&apos;ve analyzed the top platforms accepting cryptocurrency
        deposits with the best bonus offers for Nigerian players.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-bold">Top Picks for Nigeria</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ngCasinos.map((casino) => (
            <CasinoCard key={casino.slug} casino={casino} />
          ))}
        </div>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold">
          What to Look for in a Nigerian Crypto Casino
        </h2>
        <p className="text-muted-foreground">
          When choosing a crypto casino in Nigeria, consider these key factors:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">USDT support</strong> — Most
            Nigerian players prefer USDT (Tether) for stable value and easy P2P
            trading on platforms like Binance P2P.
          </li>
          <li>
            <strong className="text-foreground">Low minimum deposits</strong> —
            Look for casinos with $1-5 minimums that match Nigerian income
            levels.
          </li>
          <li>
            <strong className="text-foreground">Fair wagering requirements</strong>{" "}
            — Under 35x is considered reasonable. Use our{" "}
            <Link href="/calculator" className="text-primary hover:underline">
              calculator
            </Link>{" "}
            to check the real value.
          </li>
          <li>
            <strong className="text-foreground">Fast withdrawals</strong> —
            Crypto casinos should process withdrawals within hours, not days.
          </li>
          <li>
            <strong className="text-foreground">Mobile-friendly</strong> —
            Most Nigerian players access casinos via mobile devices.
          </li>
        </ul>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold">
          Is Crypto Gambling Legal in Nigeria?
        </h2>
        <p className="text-muted-foreground">
          Online gambling in Nigeria is regulated by the National Lottery
          Regulatory Commission (NLRC). While the regulatory framework is still
          evolving for crypto-specific gambling, many international platforms
          accept Nigerian players. Always gamble responsibly and only with funds
          you can afford to lose.
        </p>
      </section>

      <section className="rounded-xl border bg-card p-6 text-center">
        <h2 className="text-xl font-bold">
          Not sure which bonus is worth it?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Use our free calculator to analyze any casino bonus before you deposit.
        </p>
        <Link
          href="/calculator"
          className="mt-4 inline-block rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try the Calculator
        </Link>
      </section>
    </main>
  );
}
