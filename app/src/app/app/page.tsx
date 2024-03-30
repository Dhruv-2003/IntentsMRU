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
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const messages = [
  // { time: new Date(), text: "Executing your intent..." },
  // { time: new Date(), text: "Sending transaction to Uniswap..." },
  // { time: new Date(), text: "Fetching transaction preview..." },
];

export default function AppPage() {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [intent, setIntent] = React.useState("");
  const [intentRequested, setIntentRequested] = useState<boolean>(false);
  const [intentRequestData, setIntentRequestData] = useState<IntentType>();
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

      handleStartPoll();
      messages.push({
        time: new Date(),
        text: `Intent Request Created with Id: ${data?.requestId}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getIntentRequestData = async (reqId: number) => {
    try {
      console.log("Polling the intent request Data ...");
      if (!reqId) {
        console.log("No reqId found");
        return;
      }
      const intentData = await getIntentData(reqId);
      // check the current State

      // If the solver data isn't present , then show "Request Sent to the Solver Market MRU"
      if (intentData?.functionName == "") {
        console.log("Request Sent to the Solver Market MRU...");
        messages.push({
          time: new Date(),
          text: "Request Sent to the Solver Market MRU...",
        });

        console.log("Waiting for the Solver to solve it ...");
        messages.push({
          time: new Date(),
          text: "Waiting for the Solver to solve it ...",
        });

        console.log(new Date());
      } else if (
        intentData?.functionName != "" &&
        intentData?.functionName != undefined
      ) {
        handleStopPoll();
        // If the solver data is present , then show "Intent solving completed ..."
        console.log("Intent solving completed by the solver...");
        messages.push({
          time: new Date(),
          text: "Intent solving completed by the solver...",
        });

        console.log("MRU constructed the txData successfully ...");
        messages.push({
          time: new Date(),
          text: "MRU constructed the txData successfully ...",
        });

        setIntentRequestData(intentData);
        console.log(new Date().toTimeString());
      } else {
        console.log("Intent Data Unavailable ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopPoll = () => {
    console.log(intervalId);
    if (intervalId) {
      clearInterval(intervalId);
      console.log("Stop polling");
    }
  };

  const handleStartPoll = () => {
    const interval = setInterval(() => getIntentRequestData(1), 10000); // Poll every 5 minutes (300,000 milliseconds)
    console.log(interval);
    intervalId = interval;
  };

  const executeTx = () => {
    // determine the type of Tx
    // If needed approval in case of token swap , etc , perform that
    // Then execute the Tx brought from MRU
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
        <Button
          className="py-0 h-10 mb-0.5 flex items-center gap-2"
          onClick={handleStartPoll}
        >
          <div>Fire my intent</div>
          <ChevronRightIcon className=" h-4 w-4" />{" "}
        </Button>
      </div>
      <div className=" w-full max-w-4xl space-y-3">
        <div>Executing your intent</div>

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
                    cursor={true}
                    repeat={Infinity}
                  />
                  {/* {message.text} */}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className=" w-full max-w-4xl space-y-3">
        <div>Transaction Details</div>

        <Card className="pt-8 pb-4 px-6 border-0">
          <CardContent className=" space-y-4">
            <div className=" flex items-start gap-3">
              <div className=" w-40 text-neutral-600 font-semibold">
                Protocol:
              </div>
              <div className="">Uniswap</div>
            </div>
            <div className=" flex items-start gap-3">
              <div className=" w-40 text-neutral-600 font-semibold">
                Protocol Address:
              </div>
              <div className="">0x2f5ad7a3bb2f5ad7a3bb2f5ad7a3bb2f5ad7a3bb</div>
            </div>
            <div className=" flex items-start gap-3">
              <div className=" w-40 text-neutral-600 font-semibold">
                Tokens:
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={"secondary"}
                  className=" border border-neutral-500"
                >
                  Matic
                </Badge>
                <Badge
                  variant={"secondary"}
                  className=" border border-neutral-500"
                >
                  USDC
                </Badge>
              </div>
            </div>
            <div className=" flex items-start gap-3">
              <div className=" w-40 text-neutral-600 font-semibold">Value:</div>
              <div>$ 100</div>
            </div>
            <div className=" flex items-start gap-3">
              <div className=" w-40 text-neutral-600 font-semibold">Chain:</div>
              <div>Sepolia</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant={"default"} className=" w-full mt-4">
              Execute Transaction
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className=" w-full max-w-4xl space-y-3">
        <div>Intent Suggestions</div>
        <IntentSuggestions setIntent={setIntent} />
      </div>
    </div>
  );
}
