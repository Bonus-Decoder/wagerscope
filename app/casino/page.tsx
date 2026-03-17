import type { Metadata } from "next";
import { CASINOS } from "@/lib/casinos";
import CasinoListClient from "./CasinoListClient";

export const metadata: Metadata = {
  title: "Best Crypto Casinos 2026 - Bonus Decoder",
  description:
    "Compare the best crypto casinos available in Nigeria and Kenya. See bonus offers, wagering requirements, and expected value analysis side by side.",
};

export default function CasinoIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold sm:text-4xl">
        Best Crypto Casinos
      </h1>
      <p className="mt-2 mb-8 text-muted-foreground">
        Compare bonuses, wagering requirements, and expected value from top
        crypto casinos available in Nigeria &amp; Kenya.
      </p>

      <CasinoListClient casinos={CASINOS} />
    </main>
  );
}
