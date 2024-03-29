import { StateMachine } from "@stackr/sdk/machine";
import { expect } from "chai";
import { Wallet, ZeroHash, verifyTypedData } from "ethers";
import genesisState from "../genesis-state.json";
import { schemas } from "../src/actions";
import { reducers } from "../src/reducers";
import { ERC20, Leaves } from "../src/state";
import { stackrConfig } from "../stackr.config";

const getAccountWiseBalances = (accounts: Leaves) => {
  return accounts.reduce((balances, { address, balance }) => {
    balances[address] = balance;
    return balances;
  }, {} as Record<string, number>);
};

describe("Token Machine Behaviours", () => {
  const STATE_MACHINES = {
    ERC20: "erc-20",
  };

  const machine = new StateMachine({
    id: STATE_MACHINES.ERC20,
    state: new ERC20(genesisState.state),
    on: reducers,
  });

  const { domain } = stackrConfig;

  const ALICE_ADDRESS =
    "0x0123456789012345678901234567890123456789012345678901234567890124";
  const BOB_ADDRESS =
    "0x0123456789012345678901234567890123456789012345678901234567890123";
  const CHARLIE_ADDRESS =
    "0x0123456789012345678901234567890123456789012345678901234567890125";

  const aliceWallet = new Wallet(ALICE_ADDRESS);
  const bobWallet = new Wallet(BOB_ADDRESS);
  const charlieWallet = new Wallet(CHARLIE_ADDRESS);

  it("should have the correct id", () => {
    expect(machine.id).to.equal(STATE_MACHINES.ERC20);
  });

  it("should have correct root as per initial state", () => {
    expect(machine.state.root).to.equal(ZeroHash);
  });

  it("should be able to create new account", async () => {
    const msgSender = bobWallet.address;
    const payload = {
      address: msgSender,
    };

    const signature = await bobWallet.signTypedData(
      domain,
      schemas.create.EIP712TypedData.types,
      payload
    );

    machine.reduce({
      name: "create",
      payload,
      msgSender,
      signature,
    });

    const leaves = machine.state.unwrap();

    expect(leaves.length).to.equal(1);

    const { address, balance, allowances } = leaves[0];
    expect(address).to.equal(msgSender);
    expect(balance).to.equal(0);
    expect(allowances).to.deep.equal([]);
  });

  it("should be able to mint tokens", async () => {
    const AMOUNT_TO_MINT = 42;
    const msgSender = bobWallet.address;

    const payload = {
      to: msgSender,
      from: msgSender,
      amount: AMOUNT_TO_MINT,
    };

    const signature = await bobWallet.signTypedData(
      domain,
      schemas.mint.EIP712TypedData.types,
      payload
    );

    machine.reduce({
      name: "mint",
      payload,
      msgSender,
      signature,
    });

    const accounts = machine.state.unwrap();
    expect(accounts.length).to.equal(1);

    const { address, balance, allowances } = accounts[0];
    expect(address).to.equal(msgSender);
    expect(balance).to.equal(AMOUNT_TO_MINT);
    expect(allowances).to.deep.equal([]);
  });

  it("should be allow burning own token", async () => {
    const initialState = machine.state.unwrap();
    const bobAccount = initialState.find(
      (account) => account.address === bobWallet.address
    );
    if (!bobAccount) {
      throw new Error("Account not found");
    }
    const bobBalance = bobAccount.balance;

    const AMOUNT_TO_BURN = 20;
    const msgSender = bobWallet.address;

    const payload = {
      to: msgSender,
      from: msgSender,
      amount: AMOUNT_TO_BURN,
    };

    const signature = await bobWallet.signTypedData(
      domain,
      schemas.burn.EIP712TypedData.types,
      payload
    );

    const signer = verifyTypedData(
      domain,
      schemas.burn.EIP712TypedData.types,
      payload,
      signature
    );

    machine.reduce({
      name: "burn",
      payload,
      msgSender: signer,
      signature,
    });

    const accounts = machine.state.unwrap();
    expect(accounts.length).to.equal(1);

    const { address, balance, allowances } = accounts[0];
    expect(address).to.equal(msgSender);
    expect(balance).to.equal(bobBalance - AMOUNT_TO_BURN);
    expect(allowances).to.deep.equal([]);
  });

  it("should not allow burning someone else's tokens", async () => {
    const AMOUNT_TO_BURN = 20;

    const initialStateRoot = machine.state.root;
    const msgSender = aliceWallet.address;
    const targetAccount = bobWallet.address;

    const payload = {
      to: targetAccount,
      from: targetAccount,
      amount: AMOUNT_TO_BURN,
    };

    const signature = await bobWallet.signTypedData(
      domain,
      schemas.burn.EIP712TypedData.types,
      payload
    );

    expect(() => {
      machine.reduce({
        name: "burn",
        payload,
        msgSender,
        signature,
      });
    }).to.throw("Unauthorized");

    const finalStateRoot = machine.state.root;
    expect(initialStateRoot).to.equal(finalStateRoot);
  });

  it("should be able to create another account", async () => {
    const msgSender = aliceWallet.address;
    const payload = {
      address: msgSender,
    };

    const signature = await aliceWallet.signTypedData(
      domain,
      schemas.create.EIP712TypedData.types,
      payload
    );

    machine.reduce({
      name: "create",
      payload,
      msgSender,
      signature,
    });

    const leaves = machine.state.unwrap();

    expect(leaves.length).to.equal(2);

    const aliceAccount = leaves.find(
      (account) => account.address === aliceWallet.address
    );
    if (!aliceAccount) {
      throw new Error("Account not found");
    }

    const { address, balance, allowances } = aliceAccount;
    expect(address).to.equal(msgSender);
    expect(balance).to.equal(0);
    expect(allowances).to.deep.equal([]);
  });

  it("should be able to transfer tokens, if sufficient balance", async () => {
    const msgSender = bobWallet.address;
    const initialBalances = getAccountWiseBalances(machine.state.unwrap());

    const AMOUNT_TO_TRANSFER = Math.floor(initialBalances[msgSender] / 2);

    const payload = {
      to: aliceWallet.address,
      from: msgSender,
      amount: AMOUNT_TO_TRANSFER,
    };

    const signature = await bobWallet.signTypedData(
      domain,
      schemas.transfer.EIP712TypedData.types,
      payload
    );

    machine.reduce({
      name: "transfer",
      payload,
      msgSender,
      signature,
    });

    const accounts = machine.state.unwrap();
    expect(accounts.length).to.equal(2);

    const aliceAccount = accounts.find(
      (account) => account.address === aliceWallet.address
    );

    if (!aliceAccount) {
      throw new Error("Account not found");
    }

    const bobAccount = accounts.find(
      (account) => account.address === bobWallet.address
    );

    if (!bobAccount) {
      throw new Error("Account not found");
    }

    expect(aliceAccount.balance).to.equal(
      initialBalances[aliceWallet.address] + AMOUNT_TO_TRANSFER
    );

    expect(bobAccount.balance).to.equal(
      initialBalances[msgSender] - AMOUNT_TO_TRANSFER
    );
  });

  it("should not allow token transfer to unregistered account", async () => {
    const msgSender = bobWallet.address;

    const initialStateRoot = machine.state.root;
    const initialBalances = getAccountWiseBalances(machine.state.unwrap());

    const AMOUNT_TO_TRANSFER = Math.floor(initialBalances[msgSender] / 2);

    const payload = {
      to: charlieWallet.address,
      from: msgSender,
      amount: AMOUNT_TO_TRANSFER,
    };

    const signature = await bobWallet.signTypedData(
      domain,
      schemas.transfer.EIP712TypedData.types,
      payload
    );

    expect(() => {
      machine.reduce({
        name: "transfer",
        payload,
        msgSender,
        signature,
      });
    }).to.throw("Account does not exist");

    const finalStateRoot = machine.state.root;
    expect(initialStateRoot).to.equal(finalStateRoot);
  });

  it("should not allow token transfer if insufficient balance", async () => {
    const msgSender = bobWallet.address;

    const initialStateRoot = machine.state.root;
    const initialBalances = getAccountWiseBalances(machine.state.unwrap());

    const AMOUNT_TO_TRANSFER = Math.floor(initialBalances[msgSender] * 2);

    const payload = {
      to: aliceWallet.address,
      from: msgSender,
      amount: AMOUNT_TO_TRANSFER,
    };

    const signature = await bobWallet.signTypedData(
      domain,
      schemas.transfer.EIP712TypedData.types,
      payload
    );

    expect(() => {
      machine.reduce({
        name: "transfer",
        payload,
        msgSender,
        signature,
      });
    }).to.throw("Insufficient funds");

    const finalStateRoot = machine.state.root;
    expect(initialStateRoot).to.equal(finalStateRoot);
  });
});
