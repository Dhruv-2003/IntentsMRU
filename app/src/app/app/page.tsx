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

export default function AppPage() {
  const [intent, setIntent] = React.useState("");

  return (
    <div className=" flex items-center flex-col gap-8 justify-center min-h-[90vh]">
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
        <div>Intent Suggestions</div>
        <IntentSuggestions setIntent={setIntent} />
      </div>
    </div>
  );
}
