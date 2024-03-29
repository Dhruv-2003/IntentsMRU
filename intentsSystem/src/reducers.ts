import { Reducers, STF } from "@stackr/sdk/machine";
import { ERC20, BetterMerkleTree as StateWrapper } from "./state";

// --------- Utilities ---------
const findIndexOfAccount = (state: StateWrapper, address: string) => {
  return state.leaves.findIndex((leaf) => leaf.address === address);
};

type CreateInput = {
  address: string;
};

type BaseActionInput = {
  from: string;
  to: string;
  amount: number;
};

// --------- State Transition Handlers ---------
const create: STF<ERC20, CreateInput> = {
  handler: ({ inputs, state }) => {
    const { address } = inputs;
    if (state.leaves.find((leaf) => leaf.address === address)) {
      throw new Error("Account already exists");
    }
    state.leaves.push({
      address,
      balance: 0,
      nonce: 0,
      allowances: [],
    });
    return state;
  },
};

const mint: STF<ERC20, BaseActionInput> = {
  handler: ({ inputs, state }) => {
    const { to, amount } = inputs;

    const index = findIndexOfAccount(state, to);
    state.leaves[index].balance += amount;
    return state;
  },
};

const burn: STF<ERC20, BaseActionInput> = {
  handler: ({ inputs, state, msgSender }) => {
    const { from, amount } = inputs;

    const index = findIndexOfAccount(state, from);

    if (state.leaves[index].address !== msgSender) {
      throw new Error("Unauthorized");
    }
    state.leaves[index].balance -= amount;
    return state;
  },
};

const transfer: STF<ERC20, BaseActionInput> = {
  handler: ({ inputs, state, msgSender }) => {
    const { to, from, amount } = inputs;

    const fromIndex = findIndexOfAccount(state, from);
    const toIndex = findIndexOfAccount(state, to);

    // check if the sender is the owner of the account
    if (state.leaves[fromIndex]?.address !== msgSender) {
      throw new Error("Unauthorized");
    }

    // check if the sender has enough balance
    if (state.leaves[fromIndex]?.balance < inputs.amount) {
      throw new Error("Insufficient funds");
    }

    // check if to account exists
    if (!state.leaves[toIndex]) {
      throw new Error("Account does not exist");
    }

    state.leaves[fromIndex].balance -= amount;
    state.leaves[toIndex].balance += amount;
    return state;
  },
};

const approve: STF<ERC20, BaseActionInput> = {
  handler: ({ inputs, state, msgSender }) => {
    const { from, to, amount } = inputs;

    const index = findIndexOfAccount(state, from);
    if (state.leaves[index].address !== msgSender) {
      throw new Error("Unauthorized");
    }

    state.leaves[index].allowances.push({ address: to, amount });
    return state;
  },
};

const transferFrom: STF<ERC20, BaseActionInput> = {
  handler: ({ inputs, state, msgSender }) => {
    const { to, from, amount } = inputs;

    // check if the msgSender has enough allowance from the owner
    const toIndex = findIndexOfAccount(state, to);
    const fromIndex = findIndexOfAccount(state, from);

    const allowance = state.leaves[fromIndex].allowances.find(
      (allowance) => allowance.address === msgSender
    );
    if (!allowance || allowance.amount < inputs.amount) {
      throw new Error("Insufficient allowance");
    }

    // check if the sender has enough balance
    if (state.leaves[fromIndex].balance < inputs.amount) {
      throw new Error("Insufficient funds");
    }

    state.leaves[fromIndex].balance -= amount;
    state.leaves[toIndex].balance += amount;
    state.leaves[fromIndex].allowances = state.leaves[fromIndex].allowances.map(
      (allowance) => {
        if (allowance.address === msgSender) {
          allowance.amount -= amount;
        }
        return allowance;
      }
    );
    return state;
  },
};

export const reducers: Reducers<ERC20> = {
  create,
  mint,
  burn,
  transfer,
  approve,
  transferFrom,
};
