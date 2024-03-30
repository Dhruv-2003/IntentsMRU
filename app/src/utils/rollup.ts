import { AddressLike, Wallet } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const domain = {
  name: "Stackr MVP v0",
  version: "1",
  chainId: 28,
  verifyingContract: "0xB7E6d84675F51F1bf29AFE0DB31B1B2A6fB798aC",
  salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
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

export const requestIntent = async (requestData: {
  userAddress: AddressLike;
  intent: string;
}) => {
  const wallet = Wallet.createRandom();

  const actionName = "request";

  try {
    const response = await fetch(
      `http://localhost:5050/getEIP712Types/${actionName}`
    );
    // console.log(response);

    const eip712Types = (await response.json()).eip712Types;
    console.log(eip712Types);
    // const date = new Date();

    const res2 = await fetch(`http://localhost:5050/`);
    const newReqId = (await res2.json()).state.totalRequests;
    console.log(newReqId);

    const payload: RequestType = {
      requestId: newReqId,
      userAddress: requestData.userAddress,
      intent: requestData.intent,
    };

    const signature = await wallet.signTypedData(domain, eip712Types, payload);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature,
      payload,
    });

    const res = await fetch(`http://localhost:5050/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    console.log(json);
    return { ack: json, requestId: newReqId };
  } catch (error) {
    console.log(error);
  }
};

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

export const getIntentData = async (
  reqId: number
): Promise<IntentType | undefined> => {
  try {
    const res = await fetch(`http://localhost:5050/intent/${reqId}`);

    const json = await res.json();
    console.log(json);
    const data = json.intentRequest;
    return data;
  } catch (error) {
    console.log(error);
  }
};

interface SolveIntentType {
  requestId: number;
  params: any[];
  abiFunction: string;
  functionName: string;
  protocolAddress: AddressLike;
  txValue: number;
}

export const solveIntent = async (solveIntentData: SolveIntentType) => {
  console.log(solveIntentData);

  const wallet = new Wallet(
    "0x0123456789012345678901234567890123456789012345678901234567890123"
  );

  const actionName = "solve";

  try {
    const response = await fetch(
      `http://localhost:5050/getEIP712Types/${actionName}`
    );

    const eip712Types = (await response.json()).eip712Types;

    const payload: SolveType = {
      requestId: solveIntentData.requestId,
      solverAddress: wallet.address,
      params: JSON.stringify(solveIntentData.params),
      abiFunction: solveIntentData.abiFunction,
      functionName: solveIntentData.functionName,
      protocolAddress: solveIntentData.protocolAddress,
      txValue: solveIntentData.txValue,
    };

    const signature = await wallet.signTypedData(domain, eip712Types, payload);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature,
      payload,
    });

    const res = await fetch(`http://localhost:5050/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    console.log(json);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};
