import { Reducers, STF } from "@stackr/sdk/machine";
import { SolverMarket, SolverMarketTransport as StateWrapper } from "./state";
import { AddressLike, Interface, ZeroAddress, parseEther } from "ethers";

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
  abiFunction: string;
  functionName: string;
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

    state.intents.push({
      requestId: requestId,
      userAddress: userAddress,
      solverAddress: ZeroAddress,
      intent: intent,
      params: [],
      ABIFunction: "",
      functionName: "",
      protocolAddress: ZeroAddress,
      txValue: 0,
      solvedTxData: {},
    });

    state.totalRequests += 1;

    return state;
  },
};

const solveHandler: STF<SolverMarket, SolveType> = {
  handler: ({ inputs, state, msgSender }) => {
    const {
      requestId,
      solverAddress,
      params,
      abiFunction,
      functionName,
      protocolAddress,
      txValue,
    } = inputs;

    if (!state.intents.find((intent) => intent.requestId === requestId)) {
      throw new Error("Request doesn't exists");
    }

    //TODO: Check is a solver is calling
    if (!state.solvers.find((solver) => solver === msgSender)) {
      throw new Error("Only solver can solve intents");
    }

    const reqIndex = findIndexOfIntent(state, requestId);
    console.log(reqIndex);
    state.intents[reqIndex].solverAddress = solverAddress;
    state.intents[reqIndex].params = JSON.parse(params) as any[];
    state.intents[reqIndex].ABIFunction = abiFunction;
    state.intents[reqIndex].functionName = functionName;
    state.intents[reqIndex].protocolAddress = protocolAddress;
    state.intents[reqIndex].txValue = txValue;

    // actually solve the intent
    const txData = createTxData({
      params: JSON.parse(params) as any[],
      abiFunction: abiFunction,
      functionName: functionName,
      protocolAddress: protocolAddress,
      txValue: txValue,
    });
    console.log(txData);

    // TODO: check restriction in terms of the protocol we are using, so the protocol addres is correct
    // Function even exists for that protocol in the config

    state.intents[reqIndex].solvedTxData = JSON.stringify(txData);

    return state;
  },
};

interface createTxDataType {
  params: any[];
  abiFunction: string;
  functionName: string;
  protocolAddress: AddressLike;
  txValue: number;
}

interface createTxDataReturnType {
  to: AddressLike;
  data: string;
  value: bigint | number;
}

export const createTxData = (
  inputs: createTxDataType
): createTxDataReturnType | undefined => {
  const abiInterface = new Interface([inputs.abiFunction]);

  const argInputs = inputs.params;
  try {
    const encodedData = abiInterface.encodeFunctionData(
      inputs.functionName,
      argInputs
    );

    const tx = {
      to: inputs.protocolAddress,
      data: encodedData,
      value: inputs.txValue ? parseEther(inputs.txValue.toString()) : 0,
    };

    return tx;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const reducers: Reducers<SolverMarket> = {
  register: registerHandler,
  request: requestHandler,
  solve: solveHandler,
};
