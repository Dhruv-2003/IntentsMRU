import { Loader2Icon } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="h-screen w-screen fixed inset-0 grid place-items-center bg-black/70 backdrop-blur-md">
      <Loader2Icon className="size-5 animate-spin text-white" />
    </div>
  );
}

export function Loader() {
  return <Loader2Icon className="size-5 animate-spin text-neutral-800" />;
}
