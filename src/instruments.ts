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

export function getPriceForInstrument(): { bid: number; ask: number } {
  return {
    bid: Math.random() * 100,
    ask: Math.random() * 100,
  };
}
