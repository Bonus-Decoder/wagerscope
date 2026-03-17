export interface Casino {
  slug: string;
  name: string;
  logo: string;
  bonusAmount: string;
  bonusValue: number;
  wageringReq: number;
  minDeposit: number;
  cryptoSupported: string[];
  rating: number;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  geoAvailable: string[];
  depositMethods: string[];
  withdrawalTime: string;
  license: string;
  established: number;
}

export const CASINOS: Casino[] = [
  {
    slug: "1xbet",
    name: "1xBet",
    logo: "/icons/casino-1xbet.svg",
    bonusAmount: "100% up to $100",
    bonusValue: 100,
    wageringReq: 35,
    minDeposit: 1,
    cryptoSupported: ["USDT", "BTC", "ETH", "LTC"],
    rating: 4.5,
    pros: [
      "Very low minimum deposit ($1)",
      "Wide range of crypto supported",
      "Huge sportsbook + casino selection",
      "Available in Nigeria and Kenya",
    ],
    cons: [
      "35x wagering is above average",
      "Complex bonus terms and conditions",
      "Verification process can be slow",
    ],
    affiliateUrl: "https://example.com/aff/1xbet",
    geoAvailable: ["NG", "KE"],
    depositMethods: ["Crypto", "Bank Transfer", "Mobile Money", "Cards"],
    withdrawalTime: "1-24 hours (crypto), 1-3 days (bank)",
    license: "Curaçao eGaming",
    established: 2007,
  },
  {
    slug: "22bet",
    name: "22Bet",
    logo: "/icons/casino-22bet.svg",
    bonusAmount: "100% up to $122",
    bonusValue: 122,
    wageringReq: 30,
    minDeposit: 1,
    cryptoSupported: ["USDT", "BTC", "ETH"],
    rating: 4.3,
    pros: [
      "Lower 30x wagering requirement",
      "$1 minimum deposit",
      "Fast crypto withdrawals",
      "Strong mobile experience",
    ],
    cons: [
      "Fewer crypto options than competitors",
      "Bonus limited to casino section",
      "Customer support can be slow",
    ],
    affiliateUrl: "https://example.com/aff/22bet",
    geoAvailable: ["NG", "KE"],
    depositMethods: ["Crypto", "Bank Transfer", "Mobile Money", "Cards"],
    withdrawalTime: "1-24 hours (crypto), 1-5 days (bank)",
    license: "Curaçao eGaming",
    established: 2018,
  },
  {
    slug: "bc-game",
    name: "BC.Game",
    logo: "/icons/casino-bc-game.svg",
    bonusAmount: "180% up to $20,000",
    bonusValue: 20000,
    wageringReq: 40,
    minDeposit: 0,
    cryptoSupported: ["USDT", "BTC", "ETH", "SOL", "DOGE", "100+ more"],
    rating: 4.6,
    pros: [
      "Massive bonus up to $20,000",
      "No minimum deposit required",
      "100+ cryptocurrencies accepted",
      "Provably fair games available",
    ],
    cons: [
      "40x wagering is high",
      "Bonus released in tiers",
      "Not licensed in all jurisdictions",
    ],
    affiliateUrl: "https://example.com/aff/bc-game",
    geoAvailable: ["NG", "KE"],
    depositMethods: ["Crypto", "P2P"],
    withdrawalTime: "Instant-2 hours (crypto)",
    license: "Curaçao eGaming",
    established: 2017,
  },
  {
    slug: "betfury",
    name: "BetFury",
    logo: "/icons/casino-betfury.svg",
    bonusAmount: "100% up to $500",
    bonusValue: 500,
    wageringReq: 35,
    minDeposit: 10,
    cryptoSupported: ["USDT", "BTC", "ETH", "BNB", "TRX"],
    rating: 4.2,
    pros: [
      "Generous $500 max bonus",
      "BFG token staking rewards",
      "Good variety of crypto games",
      "Active community",
    ],
    cons: [
      "Higher $10 minimum deposit",
      "35x wagering requirement",
      "Limited fiat options for Africa",
    ],
    affiliateUrl: "https://example.com/aff/betfury",
    geoAvailable: ["NG", "KE"],
    depositMethods: ["Crypto"],
    withdrawalTime: "Instant-1 hour (crypto)",
    license: "Curaçao eGaming",
    established: 2019,
  },
  {
    slug: "tg-casino",
    name: "TG.Casino",
    logo: "/icons/casino-tg-casino.svg",
    bonusAmount: "200% up to $10,000",
    bonusValue: 10000,
    wageringReq: 45,
    minDeposit: 5,
    cryptoSupported: ["USDT", "ETH", "BTC"],
    rating: 4.4,
    pros: [
      "Huge 200% match bonus",
      "Telegram-native experience",
      "Fast anonymous sign-up",
      "Cashback rewards on losses",
    ],
    cons: [
      "Very high 45x wagering",
      "Newer casino (est. 2023)",
      "Limited game providers compared to established sites",
    ],
    affiliateUrl: "https://example.com/aff/tg-casino",
    geoAvailable: ["NG", "KE"],
    depositMethods: ["Crypto", "Telegram Wallet"],
    withdrawalTime: "Instant-30 minutes (crypto)",
    license: "Curaçao eGaming",
    established: 2023,
  },
];

export function getCasinoBySlug(slug: string): Casino | undefined {
  return CASINOS.find((c) => c.slug === slug);
}

export function getCasinoSlugs(): string[] {
  return CASINOS.map((c) => c.slug);
}
