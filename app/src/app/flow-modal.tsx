import React from "react";
import dappFlow from "@/assets/dapp-flow.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function FlowModal() {
  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        {/* <Image src={dappFlow} alt="dapp flow" /> */}
        <Image
          src={dappFlow}
          alt="product flow"
          className="rounded-md max-w-4xl mx-auto border border-transparent shadow-2xl p-2  animate-border inline-block bg-white  bg-[length:400%_400%] bg-gradient-to-r to-purple-400/80 via-violet-500/60 from-indigo-600/60 -mt-6"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Flow</DialogTitle>
          <Image
            src={dappFlow}
            alt="product flow"
            className="rounded-md max-w-7xl"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
