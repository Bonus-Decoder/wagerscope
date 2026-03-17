import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wagering Requirements Explained - Complete Guide 2026 | Bonus Decoder",
  description:
    "Learn how wagering requirements work, how they affect your bonus value, and how to calculate expected value. A complete guide for crypto casino players.",
  openGraph: {
    title: "Wagering Requirements Explained - Complete Guide 2026",
    description:
      "Everything you need to know about casino wagering requirements and how to calculate bonus expected value.",
  },
};

export default function WageringRequirementsExplained() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wagering Requirements Explained - Complete Guide 2026",
    author: { "@type": "Organization", name: "Bonus Decoder" },
    datePublished: "2026-01-15",
    dateModified: "2026-03-01",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        {" / "}
        <span className="text-foreground">Wagering Requirements Explained</span>
      </nav>

      <h1 className="text-3xl font-bold sm:text-4xl">
        Wagering Requirements Explained
      </h1>
      <p className="mt-3 mb-8 text-lg text-muted-foreground">
        The complete guide to understanding wagering requirements, how they
        affect your bonus value, and how to calculate whether a bonus is
        actually worth claiming.
      </p>

      <article className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">What Are Wagering Requirements?</h2>
          <p className="text-muted-foreground">
            Wagering requirements (also called playthrough or rollover) are
            conditions set by casinos that determine how many times you need to
            bet the bonus amount before you can withdraw any winnings. For
            example, a $100 bonus with a 35x wagering requirement means you
            must place $3,500 in total bets before withdrawal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">How Wagering Requirements Work</h2>
          <p className="text-muted-foreground">
            The formula is straightforward:
          </p>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-mono text-sm">
              Total Wager = Bonus Amount × Wagering Multiplier
            </p>
            <p className="mt-2 font-mono text-sm">
              Example: $100 × 35x = $3,500 in total bets required
            </p>
          </div>
          <p className="text-muted-foreground">
            But the real cost depends on the <strong className="text-foreground">house edge</strong>{" "}
            of the games you play. Every bet you make, the casino keeps a small
            percentage on average. Over $3,500 in bets, that adds up.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Game Contributions</h2>
          <p className="text-muted-foreground">
            Not all games count equally toward wagering requirements:
          </p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              <strong className="text-foreground">Slots:</strong> Usually 100%
              contribution (every $1 bet counts as $1)
            </li>
            <li>
              <strong className="text-foreground">Table Games:</strong> Typically
              10% contribution ($1 bet counts as $0.10)
            </li>
            <li>
              <strong className="text-foreground">Blackjack:</strong> Often 5%
              contribution ($1 bet counts as $0.05)
            </li>
          </ul>
          <p className="text-muted-foreground">
            Lower contribution means you need to bet significantly more in real
            terms, which increases the total house edge cost.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Expected Value: The Key Metric</h2>
          <p className="text-muted-foreground">
            Expected value (EV) tells you what a bonus is actually worth after
            accounting for the house edge cost of meeting wagering requirements:
          </p>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-mono text-sm">
              House Edge Cost = Total Wager × House Edge %
            </p>
            <p className="mt-2 font-mono text-sm">
              Expected Value = Bonus Amount − House Edge Cost
            </p>
          </div>
          <p className="text-muted-foreground">
            A positive EV means the bonus has value even after wagering. A
            negative EV means the wagering will likely cost you more than the
            bonus is worth.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Wagering Requirement Tiers</h2>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              <strong className="text-foreground">10-20x:</strong> Excellent —
              usually positive EV on most games
            </li>
            <li>
              <strong className="text-foreground">25-35x:</strong> Average —
              check the EV carefully, may be worthwhile on low-edge games
            </li>
            <li>
              <strong className="text-foreground">40-50x:</strong> High — often
              negative EV on slots, only viable on very low edge games
            </li>
            <li>
              <strong className="text-foreground">50x+:</strong> Very high —
              almost always a bad deal
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Tips for Crypto Casino Bonuses</h2>
          <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Always calculate EV first</strong>{" "}
              — Use our calculator before depositing to know exactly what a
              bonus is worth.
            </li>
            <li>
              <strong className="text-foreground">Read the fine print</strong>{" "}
              — Check if wagering applies to bonus only or bonus + deposit.
            </li>
            <li>
              <strong className="text-foreground">Check game restrictions</strong>{" "}
              — Some bonuses exclude certain games entirely.
            </li>
            <li>
              <strong className="text-foreground">Watch for time limits</strong>{" "}
              — Most bonuses expire in 7-30 days. Make sure you can meet the
              wagering in time.
            </li>
            <li>
              <strong className="text-foreground">Max bet limits</strong> — Many
              bonuses cap individual bet sizes (e.g., $5 per spin). Exceeding
              this can void the bonus.
            </li>
          </ol>
        </section>

        <section className="rounded-xl border bg-card p-6 text-center">
          <h2 className="text-xl font-bold">
            Calculate any bonus in seconds
          </h2>
          <p className="mt-2 text-muted-foreground">
            Enter your bonus details and instantly see expected value, house
            edge cost, and our verdict.
          </p>
          <Link
            href="/calculator"
            className="mt-4 inline-block rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try the Calculator
          </Link>
        </section>
      </article>
    </main>
  );
}
