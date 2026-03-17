"use client";

import { useRef, useCallback } from "react";
import WageringCalculator, {
  type WageringCalculatorHandle,
} from "./WageringCalculator";
import BonusCompare from "./BonusCompare";
import type { GameType } from "@/lib/calculations";

export default function CalculatorPage() {
  const calcRef = useRef<WageringCalculatorHandle>(null);

  const handleDecode = useCallback(
    (bonus: number, wagering: number, gameType: GameType) => {
      calcRef.current?.setValues(bonus, wagering, gameType);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  return (
    <>
      <WageringCalculator ref={calcRef} />

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Compare Casino Bonuses</h2>
        <p className="mb-6 text-muted-foreground">
          See how popular crypto casino bonuses stack up. Click &quot;Decode&quot; to
          analyze any bonus in detail.
        </p>
        <BonusCompare onDecode={handleDecode} />
      </section>
    </>
  );
}
