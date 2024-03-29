import { StateMachine } from "@stackr/sdk/machine";
import genesisState from "../genesis-state.json";
import { reducers } from "./reducers";
import { ERC20 } from "./state";

const STATE_MACHINES = {
  ERC20: "erc-20",
};

const erc20StateMachine = new StateMachine({
  id: STATE_MACHINES.ERC20,
  state: new ERC20(genesisState.state),
  on: reducers,
});

export { STATE_MACHINES, erc20StateMachine };
