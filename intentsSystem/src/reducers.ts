import { Reducers, STF } from "@stackr/sdk/machine";
import { SolverMarket, SolverMarketTransport as StateWrapper } from "./state";
import { AddressLike } from "ethers";

// --------- Utilities ---------
const findIndexOfIntent = (state: StateWrapper, requestId: number) => {
  return state.intents.findIndex((intent) => intent.requestId === requestId);
};

export type RegisterType = {
  address: AddressLike;
};

export type RequestType = {
  requestId: number;
  userAddress: AddressLike;
  intent: string;
};

export type SolveType = {
  requestId: number;
  solverAddress: AddressLike;
  params: string;
  abi: string;
  protocolAddress: AddressLike;
  txValue: number;
};

// --------- State Transition Handlers ---------
const registerHandler: STF<SolverMarket, RegisterType> = {
  handler: ({ inputs, state }) => {
    const { address } = inputs;
    if (state.solvers.find((_address) => _address === address)) {
      throw new Error("Account already exists");
    }
    state.solvers.push(address);
    return state;
  },
};

const requestHandler: STF<SolverMarket, RequestType> = {
  handler: ({ inputs, state }) => {
    const { requestId, userAddress, intent } = inputs;
    if (state.intents.find((intent) => intent.requestId === requestId)) {
      throw new Error("Request already exists");
    }
    state.intents[requestId].requestId = requestId;
    state.intents[requestId].intent = intent;
    state.intents[requestId].userAddress = userAddress;

    return state;
  },
};

const solveHandler: STF<SolverMarket, SolveType> = {
  handler: ({ inputs, state, msgSender }) => {
    const { requestId, solverAddress, params, abi, protocolAddress, txValue } =
      inputs;
    if (!state.intents.find((intent) => intent.requestId === requestId)) {
      throw new Error("Request doesn't exists");
    }
    state.intents[requestId].solverAddress = solverAddress;
    state.intents[requestId].params = JSON.parse(params) as any[];
    state.intents[requestId].ABI = abi;
    state.intents[requestId].protocolAddress = protocolAddress;
    state.intents[requestId].txValue = txValue;

    // actually solve the intent , check restriction in terms of the protocol we are using
    return state;
  },
};

export const reducers: Reducers<SolverMarket> = {
  register: registerHandler,
  request: requestHandler,
  solve: solveHandler,
};
