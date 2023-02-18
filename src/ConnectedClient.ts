import WebSocket from "ws";
import {
  getPriceForInstrument,
  Instruments,
  InstumentQuoteConfigs,
} from "./instruments";

export class ConnectedClient {
  intervalIds: (NodeJS.Timer | undefined)[] = [];

  webSocketConnection: WebSocket | undefined = undefined;

  constructor(webSocketConnection: WebSocket) {
    this.webSocketConnection = webSocketConnection;
  }

  start() {
    for (let instrument of Instruments) {
      const intervalId = setInterval(() => {
        const price = getPriceForInstrument(
          InstumentQuoteConfigs[instrument],
          Math.random(),
          Math.random()
        );

        this.intervalIds.push(intervalId);

        this.webSocketConnection?.send(
          `${instrument}|${price.buy}|${price.sell}`
        );
      }, InstumentQuoteConfigs[instrument].updateInterval);
    }
  }

  teardown() {
    this.intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);
      this.webSocketConnection?.close();
    });
  }
}
