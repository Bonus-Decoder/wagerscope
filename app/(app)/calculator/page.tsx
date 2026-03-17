import type { Metadata } from "next";
import CalculatorPage from "@/components/calculator/CalculatorPage";

export const metadata: Metadata = {
  title: "Bonus Decoder - Crypto Casino Bonus Calculator",
  description:
    "Free wagering requirement calculator for crypto casino bonuses. Analyze bonus expected value, house edge cost, and compare offers from top crypto casinos.",
};

const faqItems = [
  {
    question: "What are wagering requirements?",
    answer:
      "Wagering requirements (also called playthrough or rollover) determine how many times you must bet the bonus amount before you can withdraw winnings. For example, a $100 bonus with 35x wagering means you must place $3,500 in total bets.",
  },
  {
    question: "How does house edge affect my bonus value?",
    answer:
      "Every casino game has a built-in house edge — the percentage the casino expects to keep over time. Slots typically have a 3% edge, table games 1%, and blackjack 0.5%. The higher the wagering requirement, the more you lose to the house edge, reducing your bonus value.",
  },
  {
    question: "Are crypto casino bonuses worth it?",
    answer:
      "It depends on the wagering requirement and game contribution. Low wagering (under 20x) on games with low house edge can offer positive expected value. High wagering (40x+) on slots usually means the house edge will eat most of the bonus. Use our calculator to check before you deposit.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Calculator() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-3xl font-bold sm:text-4xl">
        Crypto Casino Bonus Calculator
      </h1>
      <p className="mt-2 mb-8 text-muted-foreground">
        Enter your bonus details to instantly see the real cost of wagering
        requirements and whether the bonus is worth claiming.
      </p>

      <CalculatorPage />

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((item) => (
            <div key={item.question}>
              <h3 className="text-lg font-semibold">{item.question}</h3>
              <p className="mt-1 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
