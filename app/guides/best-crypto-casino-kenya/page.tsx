import type { Metadata } from "next";
import Link from "next/link";
import { CASINOS } from "@/lib/casinos";
import CasinoCard from "@/components/casino/CasinoCard";

export const metadata: Metadata = {
  title: "Best Crypto Casinos in Kenya 2026 - WagerScope",
  description:
    "Find the best crypto casinos for Kenyan players in 2026. Compare bonuses, wagering requirements, and expected value from platforms accepting USDT, BTC, and M-Pesa.",
  openGraph: {
    title: "Best Crypto Casinos in Kenya 2026",
    description:
      "Compare the top crypto casinos for Kenyan players with honest bonus analysis.",
  },
};

export default function BestCryptoCasinoKenya() {
  const keCasinos = CASINOS.filter((c) => c.geoAvailable.includes("KE")).sort(
    (a, b) => b.rating - a.rating
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Crypto Casinos in Kenya 2026",
    author: { "@type": "Organization", name: "WagerScope" },
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
        <span className="text-foreground">Best Crypto Casinos Kenya</span>
      </nav>

      <h1 className="text-3xl font-bold sm:text-4xl">
        Best Crypto Casinos in Kenya (2026)
      </h1>
      <p className="mt-3 mb-8 text-lg text-muted-foreground">
        Kenya&apos;s mobile-first economy makes it a natural fit for crypto
        casinos. We&apos;ve reviewed the top platforms for Kenyan players,
        analyzing bonus value, crypto support, and withdrawal speeds.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-bold">Top Picks for Kenya</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {keCasinos.map((casino) => (
            <CasinoCard key={casino.slug} casino={casino} />
          ))}
        </div>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold">
          What Kenyan Players Should Know
        </h2>
        <p className="text-muted-foreground">
          Key considerations for Kenyan crypto casino players:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">M-Pesa to crypto</strong> —
            Many players buy USDT via P2P platforms using M-Pesa, then deposit
            to crypto casinos for fast and low-fee transactions.
          </li>
          <li>
            <strong className="text-foreground">KES conversion</strong> — Watch
            exchange rates when converting KES to crypto. USDT offers the most
            stable value for gambling.
          </li>
          <li>
            <strong className="text-foreground">Wagering requirements</strong>{" "}
            — Always check the wagering before depositing. Our{" "}
            <Link href="/calculator" className="text-primary hover:underline">
              calculator
            </Link>{" "}
            shows you the real cost of any bonus.
          </li>
          <li>
            <strong className="text-foreground">Mobile experience</strong> —
            Prioritize casinos with smooth mobile web apps since most Kenyan
            players use phones.
          </li>
        </ul>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-bold">
          Crypto Gambling Regulations in Kenya
        </h2>
        <p className="text-muted-foreground">
          The Betting Control and Licensing Board (BCLB) regulates gambling in
          Kenya. While crypto-specific regulations are still developing,
          international crypto casinos are widely accessible. A 20% excise tax
          applies to gambling stakes in Kenya. Always gamble responsibly.
        </p>
      </section>

      <section className="rounded-xl border bg-card p-6 text-center">
        <h2 className="text-xl font-bold">
          Analyze any bonus before you deposit
        </h2>
        <p className="mt-2 text-muted-foreground">
          Our free calculator shows the real expected value of any casino bonus.
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
