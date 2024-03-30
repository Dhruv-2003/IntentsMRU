"use client";
import Image from "next/image";
import flow from "@/assets/flow.jpeg";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const performAPICall = async () => {
    try {
      const body = JSON.stringify({
        requestId: 1,
        intent: "I want to bridge WETH for 0.00001USDC",
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
    <main className=" grid grid-cols-12 min-h-screen ">
      <div className="min-h-[60vh] col-span-12 flex items-center justify-start flex-col pt-14">
        <div className="space-y-4 pb-10 flex-col items-center justify-center flex">
          <h1 className=" text-4xl font-[800]">Intents-MRU</h1>
          <p className=" max-w-xl text-center">
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
        </div>
        <Image
          src={flow}
          alt="product flow"
          className=" rounded-md max-w-2xl mx-auto border border-transparent absolute top-[70vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl p-2 bg-gradient-to-b to-purple-400/60 via-violet-500/60 from-indigo-600/60"
        />
      </div>
      {/* <div className="min-h-[70vh] w-full absolute bottom-0 bg-black"></div> */}
      <div className="min-h-[50vh] w-full flex items-end justify-center pb-8 col-span-12 bg-gradient-to-b from-purple-400/40 via-violet-500/40 to-indigo-600/40">
        Built by &nbsp;
        <Link
          href={"https://twitter.com/0xdhruva/"}
          className=" hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          0xdhruva
        </Link>
        &nbsp;&&nbsp;
        <Link
          href={"https://twitter.com/kushagrasarathe/"}
          className=" hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          kushagrasarathe
        </Link>{" "}
      </div>
      {/* <div className="min-h-[10vh] w-full col-span-12 bg-gradient-to-b from-white/10 via-white/40 to-white backdrop-blur-2xl absolute top-[70vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div> */}
    </main>
  );
}
