"use client";
import Image from "next/image";
import flow from "@/assets/flow.jpeg";
import arrow from "@/assets/arroow.svg";
import avail from "@/assets/avail-logo.png";
import stackr from "@/assets/stackr-logo.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Features from "./features";
import { XIcon } from "lucide-react";

export default function Home() {
  const performAPICall = async () => {
    try {
      const body = JSON.stringify({
        requestId: 1,
        intent: "I want to swap WMATIC for 0.00001USDC",
      });
      const data = await fetch("/api/intents", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <main className=" grid grid-cols-12 min-h-screen bg-gradient-to-b from-purple-400/40 via-violet-500/40 to-indigo-600/40 py-20 max-w-7xl mx-auto rounded-xl rounded-b-none">
        <div className="min-h-[60vh] col-span-12 flex items-center justify-start flex-col backgrnd-pattern">
          <div className="space-y-4 pb-10 flex-col items-center justify-center flex relative">
            <h1 className=" text-4xl font-[800]">Intents-MRU</h1>
            <p className=" max-w-xl text-center ">
              Talk to the blockchain like {`you'd`} talk to a friend. With
              Intents-MRU, simply express what you want to do in plain language,
              and our network of solvers will turn your words into code that
              executes seamlessly on-chain.
            </p>

            <Link
              href={"/app"}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Launch App
            </Link>
            <Image
              src={arrow}
              alt="arrow"
              className=" w-64 h-20 object-cover -z-10 -mt-6 animate-pulse"
            />
          </div>
          <Image
            src={flow}
            alt="product flow"
            className="rounded-md max-w-2xl mx-auto border border-transparent shadow-2xl p-2  animate-border inline-block bg-white  bg-[length:400%_400%] bg-gradient-to-r to-purple-400/80 via-violet-500/60 from-indigo-600/60 -mt-6"
          />
          <div className=" space-y-5 mt-16">
            <div className=" text-base font-semibold text-center">
              Powered By
            </div>
            <div className=" flex items-center justify-center gap-5">
              <Image
                src={stackr}
                alt="stackr logo"
                className=" w-36 grayscale drop-shadow-md"
              />
              <XIcon className=" w-3.5 h-3.5" />
              <Image
                src={avail}
                alt="avail logo"
                className=" w-32 grayscale drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </main>
      <div className="pb-12">
        <Features />
      </div>
    </div>
  );
}
