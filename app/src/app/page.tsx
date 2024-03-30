"use client";
import Image from "next/image";
import flow from "@/assets/flow.jpeg";
import arrow from "@/assets/arroow.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    <main className=" grid grid-cols-12 min-h-screen bg-gradient-to-b from-purple-400/40 via-violet-500/40 to-indigo-600/40 py-20 max-w-7xl mx-auto rounded-xl">
      <div className="min-h-[60vh] col-span-12 flex items-center justify-start flex-col backgrnd-pattern">
        <div className="space-y-4 pb-10 flex-col items-center justify-center flex relative">
          <h1 className=" text-4xl font-[800]">Intents-MRU</h1>
          <p className=" max-w-xl text-center ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae
            molestiae ratione culpa, totam similique ipsum autem cupiditate
          </p>
          <Button onClick={performAPICall}>Call</Button>

          <Link
            href={"/app"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Launch App
          </Link>
          <Image
            src={arrow}
            alt="arrow"
            // className="absolute w-40 -bottom-16 right-48 -z-10 rotate-[20deg]"
            // className=" absolute -top-20 right-48 -z-10 rotate-[20deg]"
            className=" w-64 h-20 object-cover -z-10 -mt-6 animate-pulse"
          />
        </div>
        <Image
          src={flow}
          alt="product flow"
          className="rounded-md max-w-2xl mx-auto border border-transparent shadow-2xl p-2  animate-border inline-block bg-white  bg-[length:400%_400%] bg-gradient-to-r to-purple-400/80 via-violet-500/60 from-indigo-600/60 -mt-6"
        />
      </div>
      {/* <div className="min-h-[70vh] w-full absolute bottom-0 bg-black"></div> */}
      {/* <div className="min-h-[50vh] w-full flex items-end justify-center pb-8 col-span-12 "></div> */}
      {/* <div className="min-h-[10vh] w-full col-span-12 bg-gradient-to-b from-white/10 via-white/40 to-white backdrop-blur-2xl absolute top-[70vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div> */}
    </main>
  );
}
