import { State } from "@stackr/sdk/machine";
import {
  AddressLike,
  BytesLike,
  ZeroHash,
  solidityPackedKeccak256,
} from "ethers";
import { MerkleTree } from "merkletreejs";

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

export type SolverMarketState = {
  intents: IntentType[];
  totalRequests: number;
  solvers: AddressLike[];
};

export class SolverMarketTransport {
  public merkleTree: MerkleTree;
  public intents: IntentType[];
  public totalRequests: number;
  public solvers: AddressLike[];

  constructor(state: SolverMarketState) {
    this.merkleTree = this.createTree(state.intents);
    this.intents = state.intents;
    this.totalRequests = state.totalRequests;
    this.solvers = state.solvers;
  }

  createTree(leaves: IntentType[]) {
    const hashedLeaves = leaves.map((leaf) => {
      return solidityPackedKeccak256(
        [
          "uint256",
          "address",
          "address",
          "string",
          "string",
          "string",
          "string",
          "address",
          "uint",
          "string",
        ],
        [
          leaf.requestId,
          leaf.userAddress,
          leaf.solverAddress,
          leaf.intent,
          JSON.stringify(leaf.params),
          leaf.ABIFunction,
          leaf.functionName,
          leaf.protocolAddress,
          leaf.txValue,
          JSON.stringify(leaf.solvedTxData),
        ]
      );
    });
    return new MerkleTree(hashedLeaves);
  }
}

export class SolverMarket extends State<
  SolverMarketState,
  SolverMarketTransport
> {
  constructor(state: SolverMarketState) {
    super(state);
  }

  transformer() {
    return {
      wrap: (): SolverMarketTransport => {
        const newTree = new SolverMarketTransport(this.state);
        return newTree;
      },
      unwrap: (wrappedState: SolverMarketTransport) => {
        return {
          intents: wrappedState.intents,
          totalRequests: wrappedState.totalRequests,
          solvers: wrappedState.solvers,
        };
      },
    };
  }

  getRootHash(): BytesLike {
    if (this.state.intents.length === 0) {
      return ZeroHash;
    }
    return this.transformer().wrap().merkleTree.getHexRoot();
  }
}
