/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";

import "express-async-errors";

import BaseRouter from "@src/routes/api";
import Paths from "@src/routes/constants/Paths";

import EnvVars from "@src/constants/EnvVars";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { NodeEnvs } from "@src/constants/misc";
import { RouteError } from "@src/other/classes";

import expressWs from "express-ws";
import { ConnectedClient } from "./ConnectedClient";
import {
  getPriceForInstrument,
  InstrumentNames,
  Instruments,
  InstumentQuoteConfigs,
} from "./instruments";

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

const webSocket = expressWs(app);

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan("dev"));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Nav to login pg by default
app.get("/", (_: Request, res: Response) => {
  res.send("Welcome to Trading212 quotes provider :))");
});

app.get("/instruments", (req, res) => {
  res.send(Instruments);
});

app.get("/instruments/:ticker", (req, res) => {
  const ticker = req.param("ticker");

  const instrumentName = InstrumentNames[ticker];

  if (!instrumentName) {
    res.status(404).json({ error: `No instrument for ticker ${ticker}` });

    return;
  }

  const price = getPriceForInstrument(
    InstumentQuoteConfigs[ticker],
    Math.random(),
    Math.random()
  );

  res.send({
    name: InstrumentNames[req.param("ticker")],
    buy: price.buy,
    sell: price.sell,
  });
});

// Redirect to login if not logged in.
app.get("/users", (req: Request, res: Response) => {
  const jwt = req.signedCookies[EnvVars.CookieProps.Key];
  if (!jwt) {
    res.redirect("/");
  } else {
    res.sendFile("users.html", { root: viewsDir });
  }
});

const connectedClients: ConnectedClient[] = [];

webSocket.app.ws("/", (ws, req) => {
  const client = new ConnectedClient(ws);
  connectedClients.push(client);

  client.start();
});

// **** Export default **** //

export default app;
