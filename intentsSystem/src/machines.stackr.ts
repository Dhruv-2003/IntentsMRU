import { StateMachine } from "@stackr/sdk/machine";
import genesisState from "../genesis-state.json";
import { reducers } from "./reducers";
import { SolverMarket } from "./state";

const STATE_MACHINES = {
  SolverMarket: "solver-market",
};

const solverMarketStateMachine = new StateMachine({
  id: STATE_MACHINES.SolverMarket,
  state: new SolverMarket(genesisState.state),
  on: reducers,
});

export { STATE_MACHINES, solverMarketStateMachine };
