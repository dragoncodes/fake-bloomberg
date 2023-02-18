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

export const InstumentQuoteConfigs: Record<string, QuoteConfig> = {
  TSLA: { max: 100, min: 50, updateInterval: 1000 },
  NFLX: { max: 150, min: 100, updateInterval: 3000 },
  AMZN: { max: 200, min: 150, updateInterval: 2000 },
  AAPL: { max: 250, min: 200, updateInterval: 3500 },
  AMD: { max: 300, min: 250, updateInterval: 4000 },
  META: { max: 350, min: 300, updateInterval: 1030 },
  BABA: { max: 1000, min: 190, updateInterval: 3120 },
};

type QuoteConfig = {
  max: number;
  min: number;
  updateInterval: number;
};

type Quote = {
  buy: number;
  sell: number;
};

export function getPriceForInstrument(
  config: QuoteConfig,
  randomBuySeed: number,
  randomSellSeed: number
): Quote {
  // Generate a random sell price within the range for the config using the provided random number
  const sellPrice =
    Math.floor(randomSellSeed * (config.max - config.min + 1)) + config.min;

  // Generate a random buy price that is a bit higher than the sell price by a random number
  const buyPrice = Math.floor(sellPrice + randomBuySeed * 10 + 1);

  // Return the generated buy and sell prices
  return {
    buy: buyPrice,
    sell: sellPrice,
  };
}
