"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className=" flex items-center gap-3 flex-col justify-center min-h-[80vh]">
      <h1 className=" text-xl font-semibold">Looks like you are lost buddy</h1>
      <Button onClick={() => router.push("/")}>Go Back</Button>
    </div>
  );
}
