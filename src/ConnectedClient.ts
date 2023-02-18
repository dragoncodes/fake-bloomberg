import WebSocket from "ws";
import { getPriceForInstrument } from "./instruments";

export class ConnectedClient {
  intervalId: NodeJS.Timer | undefined = undefined;

  webSocketConnection: WebSocket | undefined = undefined;

  constructor(webSocketConnection: WebSocket) {
    this.webSocketConnection = webSocketConnection;
  }

  start() {
    this.intervalId = setInterval(() => {
      const price = getPriceForInstrument();
      this.webSocketConnection?.send(`TSLA|${price.ask}|${price.bid}`);
    }, 1000);
  }

  teardown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.webSocketConnection?.close();
    }
  }
}
