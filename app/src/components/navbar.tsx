import React from "react";
import { Button } from "./ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ConnectWalletButton } from "./custom-connect-wallet";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between py-6 border-b ">
      <div className="text-xl font-semibold">Intents-MRU</div>
      <div className=" flex items-center gap-3">
        <ConnectWalletButton />
        <Button>Launch App</Button>
      </div>
    </div>
  );
}
