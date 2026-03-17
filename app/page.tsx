import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4">
      {/* Hero */}
      <section className="flex max-w-3xl flex-col items-center pt-24 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Decode Any Casino Bonus in Seconds
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The only tool that shows you the REAL cost of crypto casino bonuses.
          Stop guessing — know exactly what you need to wager and what
          you&apos;ll actually keep.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/calculator">Try the Calculator</Link>
        </Button>
      </section>

      {/* Features */}
      <section className="grid w-full max-w-4xl gap-6 pb-24 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instant Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get real-time expected value calculations as you adjust bonus
              parameters. No sign-up required.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compare Bonuses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See how bonuses from top crypto casinos stack up side by side
              with automatic EV ranking.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Multi-Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Calculate in USDT, NGN, or KES. Built for crypto casino players
              in Nigeria and Kenya.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
