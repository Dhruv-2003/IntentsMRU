// import express, { Request, Response } from "express";

import axios from "axios";

// const app = express();
// app.use(express.json());

import dotenv from "dotenv";
import { AddressLike } from "ethers";
dotenv.config();

const endpointUrl = process.env.ROLLUP_HOST;

if (!endpointUrl) {
  throw new Error("No endpoint found !!");
}

export type IntentType = {
  requestId: number;
  userAddress: AddressLike;
  solverAddress: AddressLike;
  intent: string;
  params: any[]; // in format [param1 , param2]
  ABIFunction: string; // in format "function name(uint param1, bytes param2)"
  functionName: string; // function Name for interface
  protocolAddress: AddressLike; // to address
  txValue: number; // in ethers format
  solvedTxData: {}; // { to: ,  data: , value:  }
};

async function pollEndpoint() {
  // get the rollup state
  const res = await fetch(`${endpointUrl}`);
  const state = (await res.json()).state;

  console.log(state);
  const intents: IntentType[] = state.intents;

  // check for new requests which haven't been fulfilled
  const filteredIntents = intents.filter(
    (intent) => intent.functionName === ""
  );

  console.log(filteredIntents);

  // If a request is found , send one to the solver in Next API
  filteredIntents.forEach(async (intentRequest) => {
    console.log("Found pending Intent Solving request ... ");

    const body = JSON.stringify({
      requestId: intentRequest.requestId,
      intent: intentRequest.intent,
      userAddress: intentRequest.userAddress,
    });
    console.log(body);

    const data = await fetch("http://localhost:3000/api/intents", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(data);

    console.log("Solving the Intent ...");
  });
}

// Poll the endpoint every 5 minutes (300,000 milliseconds)
function main() {
  try {
    const interval = setInterval(pollEndpoint, 20000);
  } catch (error) {
    console.log(error);
  }
}

main();
