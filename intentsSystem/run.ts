import { Wallet, parseEther } from "ethers";
import { schemas } from "./src/actions";
import { stackrConfig } from "./stackr.config";

const { domain } = stackrConfig;

type ActionName = keyof typeof schemas;

const walletOne = new Wallet(
  "0x0123456789012345678901234567890123456789012345678901234567890123"
); // solver

const walletTwo = new Wallet(
  "0x0123456789012345678901234567890123456789012345678901234567890124"
); // user

const getBody = async (actionName: ActionName, wallet: Wallet) => {
  const walletAddress = wallet.address;
  const res = await fetch(`http://localhost:3000/`);
  const newReqId = (await res.json()).state.totalRequests;
  console.log(newReqId);

  let payload;
  if (actionName === "register") {
    payload = {
      address: walletAddress,
    };
  } else if (actionName === "request") {
    payload = {
      requestId: newReqId,
      userAddress: walletAddress,
      intent: "I want to swap WMATIC for 0.00001USDC",
    };
  } else if (actionName === "solve") {
    const timestamp = Math.round(new Date().getTime() / 1000);
    payload = {
      requestId: newReqId - 1,
      solverAddress: walletAddress,
      params: JSON.stringify([
        parseEther("0.0001").toString(),
        "0",
        [
          "0x8954afa98594b838bda56fe4c12a09d7739d179b",
          "0x8954afa98594b838bda56fe4c12a09d7739d179b",
        ],
        walletAddress,
        timestamp,
      ]),
      abiFunction:
        "function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] path,address to,uint deadline)",
      functionName: "swapExactTokensForTokens",
      protocolAddress: "0x8954afa98594b838bda56fe4c12a09d7739d179b",
      txValue: 0,
    };
  }
  // console.log(payload);
  // console.log(schemas[actionName].EIP712TypedData.types);

  const signature = await wallet.signTypedData(
    domain,
    schemas[actionName].EIP712TypedData.types,
    payload
  );

  console.log(signature);

  const body = JSON.stringify({
    msgSender: walletAddress,
    signature,
    payload,
  });

  return body;
};

const run = async (actionName: ActionName, wallet: Wallet) => {
  const start = Date.now();
  const body = await getBody(actionName, wallet);

  const res = await fetch(`http://localhost:3000/${actionName}`, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const end = Date.now();
  const json = await res.json();

  const elapsedSeconds = (end - start) / 1000;
  const requestsPerSecond = 1 / elapsedSeconds;

  console.info(`Requests per second: ${requestsPerSecond.toFixed(2)}`);
  console.log(`Response: ${JSON.stringify(json, null, 2)}`);
};

const main = async (actionName: string, walletName: string) => {
  if (!Object.keys(schemas).includes(actionName)) {
    throw new Error(
      `Action ${actionName} not found. Available actions: ${Object.keys(
        schemas
      ).join(", ")}`
    );
  }

  const wallet = walletName === "alice" ? walletOne : walletTwo;
  await run(actionName as ActionName, wallet);
};

main(process.argv[2], process.argv[3]);
