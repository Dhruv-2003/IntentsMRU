import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../stackr.config.ts";

import { schemas } from "./actions.ts";
import { solverMarketStateMachine } from "./machines.stackr.ts";

type SolverMarketMachine = typeof solverMarketStateMachine;

const mru = await MicroRollup({
  config: stackrConfig,
  actions: [...Object.values(schemas)],
  isSandbox: true,
});

mru.stateMachines.add(solverMarketStateMachine);

await mru.init();

export { SolverMarketMachine, mru };
