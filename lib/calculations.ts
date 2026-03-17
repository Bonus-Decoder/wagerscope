export interface WageringResult {
  totalWager: number;
  houseEdgeCost: number;
  expectedValue: number;
  probability: number;
  verdict: "GREAT DEAL" | "GOOD" | "FAIR" | "BAD" | "TRAP";
}

export type GameType = "slots" | "table" | "blackjack" | "mixed";

const HOUSE_EDGE: Record<GameType, number> = {
  slots: 3,
  table: 1,
  blackjack: 0.5,
  mixed: 2,
};

const GAME_CONTRIBUTION: Record<GameType, number> = {
  slots: 100,
  table: 10,
  blackjack: 5,
  mixed: 50,
};

export function getHouseEdge(gameType: GameType): number {
  return HOUSE_EDGE[gameType];
}

export function getGameContribution(gameType: GameType): number {
  return GAME_CONTRIBUTION[gameType];
}

export function calcWagering(
  bonusAmount: number,
  wageringReq: number,
  gameType: GameType
): WageringResult {
  const contribution = GAME_CONTRIBUTION[gameType];
  const houseEdge = HOUSE_EDGE[gameType];

  const totalWager = (bonusAmount * wageringReq * 100) / contribution;
  const houseEdgeCost = (totalWager * houseEdge) / 100;
  const expectedValue = bonusAmount - houseEdgeCost;
  const probability = Math.max(0, 1 - (wageringReq * houseEdge) / 100);

  let verdict: WageringResult["verdict"];
  if (expectedValue <= 0) {
    verdict = "TRAP";
  } else if (expectedValue > bonusAmount * 0.7) {
    verdict = "GREAT DEAL";
  } else if (expectedValue > bonusAmount * 0.4) {
    verdict = "GOOD";
  } else if (expectedValue > bonusAmount * 0.1) {
    verdict = "FAIR";
  } else {
    verdict = "BAD";
  }

  return { totalWager, houseEdgeCost, expectedValue, probability, verdict };
}

export const WAGERING_POINTS = [10, 15, 20, 25, 30, 35, 40, 45, 50] as const;

export function calcWageringCurve(
  bonusAmount: number,
  gameType: GameType
): { wagering: number; ev: number }[] {
  return WAGERING_POINTS.map((w) => ({
    wagering: w,
    ev: calcWagering(bonusAmount, w, gameType).expectedValue,
  }));
}
