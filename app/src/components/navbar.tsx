"use client";

import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ConnectWalletButton } from "./custom-connect-wallet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";

export default function Navbar() {
  const [anonAadhaar] = useAnonAadhaar();
  console.log(anonAadhaar.status);
  return (
    <div className="flex items-center justify-between py-6 max-w-7xl mx-auto">
      <Link href={"/"} className="text-xl font-semibold">
        Intents-MRU
      </Link>
      <div className=" flex items-center gap-3">
        {/* <LogInWithAnonAadhaar /> */}

        <ConnectButton />
        {/* <ConnectWalletButton /> */}
        {/* <Link
          href={"/app"}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Launch App
        </Link> */}
      </div>
    </div>
  );
}
