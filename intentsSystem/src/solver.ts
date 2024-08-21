import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../stackr.config.ts";

import { schemas } from "./actions.ts";
import { solverMarketStateMachine } from "./machines.stackr.ts";

type SolverMarketMachine = typeof solverMarketStateMachine;

const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [...Object.values(schemas)],
  stateMachines: [solverMarketStateMachine],
  stfSchemaMap: schemas,
});

await mru.init();

export { SolverMarketMachine, mru };
