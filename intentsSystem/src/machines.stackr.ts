import { StateMachine } from "@stackr/sdk/machine";
import genesisState from "../genesis-state.json";
import { transitions } from "./transitions";
import { SolverMarket } from "./state";

const STATE_MACHINES = {
  SolverMarket: "solver-market",
};

const solverMarketStateMachine = new StateMachine({
  id: STATE_MACHINES.SolverMarket,
  stateClass: SolverMarket,
  initialState: genesisState.state,
  on: transitions,
});

export { STATE_MACHINES, solverMarketStateMachine };
