type QuoteConfig = {
  min: number;
  max: number;
  updateInterval: number;
};

type Quote = {
  bid: number;
  ask: number;
};

export const Instruments = [
  "TSLA",
  "NFLX",
  "AMZN",
  "AAPL",
  "AMD",
  "META",
  "BABA",
] as const;

export const InstrumentNames: Record<string, string> = {
  TSLA: "Tesla",
  NFLX: "Netflix",
  AMZN: "Amazon",
  AAPL: "Apple",
  AMD: "AMD",
  META: "Meta Platforms",
  BABA: "Alibaba",
};

export const QuoteConfigByInstrumentTicker: Record<string, QuoteConfig> = {
  TSLA: { min: 500, max: 2000, updateInterval: 3000 },
  NFLX: { min: 200, max: 500, updateInterval: 1500 },
  AMZN: { min: 1500, max: 3000, updateInterval: 1500 },
  AAPL: { min: 150, max: 400, updateInterval: 1500 },
  AMD: { min: 50, max: 100, updateInterval: 1500 },
  META: { min: 150, max: 300, updateInterval: 1500 },
  BABA: { min: 160, max: 350, updateInterval: 1500 },
};

export function getPriceForInstrument(
  config: QuoteConfig,
  randomSellSeed: number,
  randomBuySeed: number
): Quote {
  // Generate a random sell price within the range for the config using the provided random number
  const sellPrice =
    Math.floor(randomSellSeed * (config.max - config.min + 1)) + config.min;

  // Generate a random buy price that is a bit higher than the sell price by a random number
  const buyPrice = Math.floor(sellPrice + randomBuySeed * 10 + 1);

  // Return the generated buy and sell prices
  return {
    bid: buyPrice,
    ask: sellPrice,
  };
}
