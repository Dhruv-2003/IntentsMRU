import { Wallet } from "ethers";
import { schemas } from "./src/actions";
import { stackrConfig } from "./stackr.config";

const { domain } = stackrConfig;

type ActionName = keyof typeof schemas;

const walletOne = new Wallet(
  "0x0123456789012345678901234567890123456789012345678901234567890123"
);
const walletTwo = new Wallet(
  "0x0123456789012345678901234567890123456789012345678901234567890124"
);

const getBody = async (actionName: ActionName, wallet: Wallet) => {
  const walletAddress = wallet.address;
  const payload =
    actionName === "announce"
      ? {
          stealthAddress: "0x084c53dad73b23f7d709fdcc2edbe5caa44bccce",
          ephemeralPublicKey:
            "0x0391e14240e98bc771f00b5ad49f3f7ec92fd498e43f04708fd61f02fddc0931f2",
          viewTag: 33,
        }
      : {
          publicAddress: "0x084c53dad73b23f7d709fdcc2edbe5caa44bccce",
          stelathMetaAddress:
            "0x02f868433a12a9d57e355176a00ee6b5c80ed1fe2c939d81062e0251081994f039022290fba566a42824f283e54582fc4fefb0767f04551c748aa8bd8b66bef677cf",
          schemeId: 0,
        };

  const signature = await wallet.signTypedData(
    domain,
    schemas[actionName].EIP712TypedData.types,
    payload
  );

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
