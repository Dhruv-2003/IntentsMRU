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
import React from "react";
import IntentSuggestions from "./intent-suggestions";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { TypeAnimation } from "react-type-animation";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

const messages = [
  { time: new Date(), text: "Executing your intent..." },
  { time: new Date(), text: "Sending transaction to Uniswap..." },
  { time: new Date(), text: "Fetching transaction preview..." },
];

export default function AppPage() {
  const [intent, setIntent] = React.useState("");

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
        <Button className="py-0 h-10 mb-0.5 flex items-center gap-2">
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
                <Badge>Matic</Badge>
                <Badge>USDC</Badge>
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
            <Button variant={"secondary"}>Execute Transaction</Button>
          </CardContent>
        </Card>
      </div>
      <div className=" w-full max-w-4xl space-y-3">
        <div>Intent Suggestions</div>
        <IntentSuggestions setIntent={setIntent} />
      </div>
    </div>
  );
}

{
  /* <TypeAnimation
                sequence={[
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus, mollitia recusandae? Consequatur accusamus assumenda quos officia nostrum! Nam veniam itaque, explicabo velit, error iure impedit totam et fuga, debitis est!",
                  1000,
                  // () => {
                  //   console.log("Sequence completed");
                  // },
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
              /> */
}

{
  /* export type IntentType = {
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
}; */
}
