"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronRightIcon,
  CrossIcon,
  Delete,
  DeleteIcon,
  XCircle,
  XSquareIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import IntentSuggestions from "./intent-suggestions";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TypeAnimation } from "react-type-animation";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { IntentType, getIntentData, requestIntent } from "@/utils/rollup";
import { useAccount, useChains, usePublicClient, useWalletClient } from "wagmi";
import { Interface, formatUnits, parseUnits } from "ethers";
import { cn } from "@/lib/utils";
import { ERC20_ABI } from "@/constants";
// import { ERC20_ABI } from "@/constants";

export interface messageType {
  time: Date;
  text: string;
}

const approvalFunctionName = [
  "exactInputSingle",
  "exactOutputSingle",
  "supply",
];

const UNISWAP_V3ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const AAVE_LENDING_POOL_ADDRESS = "0xcC6114B983E4Ed2737E9BD3961c9924e6216c704";

const tokenAddresses: { [token: string]: string } = {
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": "MATIC",
  "0x0fa8781a83e46826621b3bc094ea2a0212e71b23": "USDC",
  "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889": "WMATIC",
  "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa": "WETH",
  "0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2": "USDT",
};

const tokenDecimals: { [token: string]: number } = {
  matic: 18,
  usdc: 6,
  wmatic: 18,
  weth: 18,
  usdt: 6,
};

const getTokenName = (tokens: string[]) => {
  const addresses: string[] = [];
  for (const token of tokens) {
    addresses.push(tokenAddresses[token.trim()] || "Unknown address");
  }
  return addresses;
};

const parseTokenDecimals = (tokens: string[], values: string[]) => {
  const _values: string[] = [];

  for (let i = 0; i < values.length; i++) {
    _values.push(
      parseUnits(
        values[i],
        tokenDecimals[tokens[i].trim().toLowerCase()]
      ).toString()
    );
  }

  return _values;
};

const getProtocolName = (protocolAddress: string) => {
  if (protocolAddress == UNISWAP_V3ROUTER_ADDRESS) {
    return "UNISWAP";
  } else if (protocolAddress == AAVE_LENDING_POOL_ADDRESS) {
    return "AAVE";
  } else {
    throw new Error("Invalid Protocol");
  }
};

export default function AppPage() {
  const network = useChains();
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [intent, setIntent] = React.useState("");
  const [intentRequested, setIntentRequested] = useState<boolean>(false);
  const [intentRequestData, setIntentRequestData] = useState<IntentType>();
  const [protocolName, setProtocolName] = useState<string>();
  const [tokens, setTokens] = useState<string[]>();
  const [value, setValue] = useState<string>();
  const [messages, setMessages] = useState<messageType[]>([]);
  // const [intervalId, setIntervalId] = useState<number>();
  const [reqId, setReqId] = useState<number>();

  let intervalId: any = 0;

  const requestIntentRollup = async () => {
    try {
      const data = await requestIntent({
        userAddress: account as string,
        intent: intent,
      });
      console.log(`Request created with Id: ${data?.requestId}`);
      setReqId(data?.requestId);

      handleStartPoll(data?.requestId);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          time: new Date(),
          text: `Intent Request Created with Id: ${data?.requestId}`,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getIntentRequestData = async (reqId: number) => {
    try {
      console.log("Polling the intent request Data ...");
      if (reqId == undefined) {
        console.log("No reqId found");
        return;
      }
      const intentData = await getIntentData(reqId);
      // check the current State

      // If the solver data isn't present , then show "Request Sent to the Solver Market MRU"
      if (intentData?.functionName == "") {
        console.log("Request Sent to the Solver Market MRU...");

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            time: new Date(),
            text: "Request Sent to the Solver Market MRU...",
          },
          {
            time: new Date(),
            text: "Waiting for the Solver to solve it ...",
          },
        ]);

        console.log("Waiting for the Solver to solve it ...");

        console.log(new Date());
      } else if (
        intentData?.functionName != "" &&
        intentData?.functionName != undefined
      ) {
        handleStopPoll();
        // If the solver data is present , then show "Intent solving completed ..."
        console.log("Intent solving completed by the solver...");
        console.log("MRU constructed the txData successfully ...");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            time: new Date(),
            text: "Intent solving completed by the solver...",
          },
          {
            time: new Date(),
            text: "MRU constructed the transaction Data successfully ...",
          },
        ]);

        setIntentRequestData(intentData);
        handleIntentData(intentData);
        console.log(new Date().toTimeString());
      } else {
        console.log("Intent Data Unavailable ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleIntentData = async (intentData: IntentType) => {
    // show the protocol name from the address
    const protocolName = getProtocolName(intentData.protocolAddress.toString());
    let tokenName: string[] = [];
    let value: string = "";

    // token Name from the token Address
    if (protocolName == "UNISWAP") {
      const params = intentData.params[0];
      tokenName = getTokenName([params.tokenIn, params.tokenOut]);
      value = formatUnits(
        params.amountIn,
        tokenDecimals[tokenName[0].trim().toLowerCase()]
      );
    } else if (protocolName == "AAVE") {
      const params = intentData.params[0];
      tokenName = getTokenName([params]);
      value = formatUnits(
        intentData.params[1],
        tokenDecimals[tokenName[0].trim().toLowerCase()]
      );
    }

    // extract the value
    console.log(protocolName);
    setProtocolName(protocolName);
    setTokens(tokenName);
    setValue(value);
  };

  const handleStopPoll = () => {
    console.log(intervalId);
    if (intervalId) {
      clearInterval(intervalId);
      console.log("Stop polling");
    }
  };

  const handleStartPoll = (reqId: number) => {
    // getIntentRequestData(reqId);
    const interval = setInterval(() => getIntentRequestData(reqId), 10000); // Poll every 5 minutes (300,000 milliseconds)
    console.log(interval);
    intervalId = interval;
  };

  const executeTx = async () => {
    if (!intentRequestData) {
      console.log("No intent data provided");
      return;
    }
    if (!tokens) {
      console.log("No intent data provided");
      return;
    }
    // determine the type of Tx
    if (approvalFunctionName.includes(intentRequestData?.functionName)) {
      // If needed approval in case of token swap , etc , perform that
      if (protocolName === "UNISWAP") {
        // const amount = parseUnits(
        //   intentRequestData.params[0].amountIn,
        //   tokenDecimals[tokens[0].toLowerCase()]
        // );
        const data = await publicClient?.simulateContract({
          account,
          address: intentRequestData.params[0].tokenIn as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [
            intentRequestData.protocolAddress as `0x${string}`,
            intentRequestData.params[0].amountIn,
          ],
        });
        if (!walletClient) {
          console.log("wallletClient not found");
        }
        // @ts-ignore
        const hash = await walletClient.writeContract(data.request);
        console.log(hash);
        const approvalTx = await publicClient?.waitForTransactionReceipt({
          hash,
        });
        console.log(approvalTx);

        console.log("Approval completed ..");

        const txData = JSON.parse(intentRequestData.solvedTxData);
        console.log(txData);

        // Then execute the Tx brought from MRU
        const uniswapHash = await walletClient?.sendTransaction({
          account,
          to: txData.to,
          data: txData.data,
          value: txData.value,
        });
        if (!uniswapHash) {
          return;
        }
        const uniswapTx = await publicClient?.waitForTransactionReceipt({
          hash: uniswapHash,
        });
        console.log(uniswapTx);

        console.log("Uniswap Tx completed ..");
      } else if (protocolName === "AAVE") {
        // const amount = parseUnits(
        //   intentRequestData.params[1],
        //   tokenDecimals[tokens[0].toLowerCase()]
        // );
        const data = await publicClient?.simulateContract({
          account,
          address: intentRequestData.params[0].tokenIn as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [
            intentRequestData.protocolAddress as `0x${string}`,
            intentRequestData.params[1],
          ],
        });
        if (!walletClient) {
          console.log("wallletClient not found");
        }
        // @ts-ignore
        const hash = await walletClient.writeContract(data.request);
        console.log(hash);
        const approvalTx = await publicClient?.waitForTransactionReceipt({
          hash,
        });
        console.log(approvalTx);

        console.log("Approval completed ..");

        const txData = JSON.parse(intentRequestData.solvedTxData);
        console.log(txData);

        // Then execute the Tx brought from MRU
        const aaveHash = await walletClient?.sendTransaction({
          account,
          to: txData.to,
          data: txData.data,
          value: txData.value,
        });
        if (!aaveHash) {
          return;
        }
        const aaveTx = await publicClient?.waitForTransactionReceipt({
          hash: aaveHash,
        });
        console.log(aaveTx);

        console.log("Aave Tx completed ..");
      }
    } else {
      const txData = JSON.parse(intentRequestData.solvedTxData);
      console.log(txData);

      // Then execute the Tx brought from MRU
      const txHash = await walletClient?.sendTransaction({
        account,
        to: txData.to,
        data: txData.data,
        value: txData.value,
      });
      if (!txHash) {
        return;
      }
      const Tx = await publicClient?.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log(Tx);

      console.log("Tx completed ..");
    }
  };

  return (
    <div className=" flex items-center flex-col gap-8 justify-start min-h-[90vh] bg-gradient-to-b from-purple-400/40 via-violet-500/40 to-indigo-600/40 py-20 max-w-7xl mx-auto rounded-xl">
      <div className=" w-full max-w-4xl flex items-end gap-3">
        <Label className="w-full space-y-2">
          <span className=" text-base">Enter a intent you want to execute</span>
          <div className=" relative">
            <Input
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="Send 100 USDC to 0x5Dc9C45Fbd38910b84D789C53b1269779abC4e36"
              className="h-11 pr-10"
            />
            {intent && (
              <XCircle
                onClick={() => setIntent("")}
                className=" cursor-pointer absolute right-3 top-3 h-5 w-5 z-10"
              />
            )}
          </div>
        </Label>
        <Button
          className="py-0 h-10 mb-0.5 flex items-center gap-2"
          onClick={requestIntentRollup}
        >
          <div>Fire my intent</div>
          <ChevronRightIcon className=" h-4 w-4" />{" "}
        </Button>
      </div>
      <div className=" w-full max-w-4xl space-y-3">
        {/* <div>Executing your intent</div> */}

        {messages && reqId && (
          <Card className="pt-8 pb-4 px-6 border-0">
            <CardContent className=" space-y-4">
              {messages.map((message, idx) => (
                <div className=" flex items-start gap-3" key={idx}>
                  <div className=" w-40 text-neutral-600">
                    {message.time.toLocaleTimeString()}
                  </div>
                  <div className=" animate-pulse">
                    <TypeAnimation
                      sequence={[message.text, 1000]}
                      wrapper="span"
                      className={cn()}
                      cursor={true}
                      repeat={Infinity}
                    />
                    {/* {message.text} */}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {intentRequestData && (
        <div className=" w-full max-w-4xl space-y-3">
          <div>Transaction Details</div>

          <Card className="pt-8 pb-4 px-6 border-0">
            <CardContent className=" space-y-4">
              <div className=" flex items-start gap-3">
                <div className=" w-40 text-neutral-600 font-semibold">
                  Protocol:
                </div>
                <div className="">{protocolName}</div>
              </div>
              <div className=" flex items-start gap-3">
                <div className=" w-40 text-neutral-600 font-semibold">
                  Protocol Address:
                </div>
                <div className="">
                  {intentRequestData.protocolAddress.toString()}
                </div>
              </div>
              <div className=" flex items-start gap-3">
                <div className=" w-40 text-neutral-600 font-semibold">
                  Tokens:
                </div>
                <div className="flex items-center gap-2">
                  {tokens?.map((token, idx) => {
                    return (
                      <Badge
                        key={idx}
                        variant={"secondary"}
                        className=" border border-neutral-500"
                      >
                        {token}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className=" flex items-start gap-3">
                <div className=" w-40 text-neutral-600 font-semibold">
                  Value:
                </div>
                <div>{value}</div>
              </div>
              <div className=" flex items-start gap-3">
                <div className=" w-40 text-neutral-600 font-semibold">
                  Chain:
                </div>
                <div>{publicClient?.chain.name}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={executeTx}
                variant={"default"}
                className=" w-full mt-4"
              >
                Execute Transaction
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className=" w-full max-w-4xl space-y-3">
        <div>Intent Suggestions</div>
        <IntentSuggestions setIntent={setIntent} />
      </div>
    </div>
  );
}
