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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TypeAnimation } from "react-type-animation";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { requestIntent } from "@/utils/rollup";
import { useAccount } from "wagmi";

const messages = [
  { time: new Date(), text: "Executing your intent..." },
  { time: new Date(), text: "Sending transaction to Uniswap..." },
  { time: new Date(), text: "Fetching transaction preview..." },
];

export default function AppPage() {
  const [intent, setIntent] = React.useState("");
  const { address: account } = useAccount();

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
          onClick={() =>
            requestIntent({
              userAddress: account as string,
              intent: intent,
            })
          }
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
