import express, { Request, Response } from "express";

import { ActionEvents } from "@stackr/sdk";
import { Playground } from "@stackr/sdk/plugins";
import { schemas } from "./actions.ts";
import { SolverMarketMachine, mru } from "./solver.ts";
import { reducers } from "./reducers.ts";
import cors from "cors";
import { IntentType } from "./state.ts";

console.log("Starting server...");

const solverMarketMachine =
  mru.stateMachines.get<SolverMarketMachine>("solver-market");

const app = express();
app.use(express.json());
app.use(cors());

const playground = Playground.init(mru);

const { actions, chain, events } = mru;

app.get("/actions/:hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  const action = await actions.getByHash(hash);
  if (!action) {
    return res.status(404).send({ message: "Action not found" });
  }
  return res.send(action);
});

app.get("/blocks/:hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  const block = await chain.getBlockByHash(hash);
  if (!block) {
    return res.status(404).send({ message: "Block not found" });
  }
  return res.send(block.data);
});

app.post("/:reducerName", async (req: Request, res: Response) => {
  const { reducerName } = req.params;
  const actionReducer = reducers[reducerName];

  if (!actionReducer) {
    res.status(400).send({ message: "no reducer for action" });
    return;
  }
  const action = reducerName as keyof typeof schemas;

  const { msgSender, signature, payload } = req.body as {
    msgSender: string;
    signature: string;
    payload: any;
  };

  const schema = schemas[action];

  try {
    console.log(msgSender, signature, payload);
    const newAction = schema.newAction({ msgSender, signature, payload });
    const ack = await mru.submitAction(reducerName, newAction);
    res.status(201).send({ ack });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
  return;
});

events.subscribe(ActionEvents.SUBMIT, (args) => {
  console.log("Submitted an action", args);
});

events.subscribe(ActionEvents.EXECUTION_STATUS, async (action) => {
  console.log("Submitted an action", action);
});

app.get("/", (_req: Request, res: Response) => {
  return res.send({ state: solverMarketMachine?.state.unwrap() });
});

type ActionName = keyof typeof schemas;

app.get("/getEIP712Types/:action", (_req: Request, res: Response) => {
  // @ts-ignore
  const { action }: { action: ActionName } = _req.params;

  const eip712Types = schemas[action].EIP712TypedData.types;
  return res.send({ eip712Types });
});

app.get("/intent/:requestId", (_req: Request, res: Response) => {
  // @ts-ignore
  const { requestId }: { requestId: number } = _req.params;
  const intents = solverMarketMachine?.state.unwrap().intents;

  const intentRequest: IntentType | undefined = intents?.find(
    (intent) => intent.requestId == requestId
  );

  if (!intentRequest) {
    res.status(400).send({ error: "Intent Request not found" });
  }
  return res.send({ intentRequest });
});

app.listen(5050, () => {
  console.log("listening on port 5050");
});
