import WebSocket from "ws";
import {
  getPriceForInstrument,
  Instruments,
  QuoteConfigByInstrumentTicker,
} from "./util/instruments";

export class ConnectedClient {
  intervalIds: (NodeJS.Timer | undefined)[] = [];

  webSocketConnection: WebSocket | undefined = undefined;

  constructor(webSocketConnection: WebSocket) {
    this.webSocketConnection = webSocketConnection;
  }

  start() {
    for (let instrument of Instruments) {
      let intervalId = setInterval(() => {
        const price = getPriceForInstrument(
          QuoteConfigByInstrumentTicker[instrument],
          Math.random(),
          Math.random()
        );

        this.webSocketConnection?.send(
          `${instrument}|${price.ask}|${price.bid}`
        );
      }, QuoteConfigByInstrumentTicker[instrument].updateInterval);

      this.intervalIds.push(intervalId);
    }
  }

  teardown() {
    this.intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);

      this.webSocketConnection?.close();
    });
  }
}
