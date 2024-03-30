"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronsUpDownIcon,
  ChevronsUpIcon,
  ChevronUpIcon,
} from "lucide-react";
import React from "react";

interface Props {
  setIntent: React.Dispatch<React.SetStateAction<string>>;
}

const intentSuggestions = [
  {
    title: "Swap",
    description: "Exchange one cryptocurrency for another",
  },
  {
    title: "Send",
    description: "Transfer funds from your wallet to another address",
  },
  {
    title: "Random",
    description:
      " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis voluptate illo iusto! Earum",
  },
  {
    title: "Swap",
    description: "Exchange one cryptocurrency for another",
  },
  {
    title: "Send",
    description: "Transfer funds from your wallet to another address",
  },
  {
    title: "Random",
    description:
      " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis voluptate illo iusto! Earum",
  },
];

export default function IntentSuggestions({ setIntent }: Props) {
  return (
    <div className=" grid grid-cols-12 items-stretch justify-between w-full gap-4 flex-wrap">
      {intentSuggestions.map((suggestion, idx) => (
        <Card
          key={idx}
          onClick={() => setIntent(suggestion.description)}
          className="md:col-span-4 w-full hover:bg-white/90 transition-all ease-in-out active:scale-95 cursor-pointer"
        >
          <CardHeader>
            <div className=" flex items-center justify-between">
              <CardTitle className="text-xl">{suggestion.title}</CardTitle>
              <div>
                <ChevronsUpIcon />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>{suggestion.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
