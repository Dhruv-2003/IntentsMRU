import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../stackr.config.ts";

import { createAccountSchema, schemas } from "./actions.ts";
import { erc20StateMachine } from "./machines.stackr.ts";

type ERC20Machine = typeof erc20StateMachine;

const mru = await MicroRollup({
  config: stackrConfig,
  actions: [createAccountSchema, ...Object.values(schemas)],
});

mru.stateMachines.add(erc20StateMachine);

await mru.init();

export { ERC20Machine, mru };
