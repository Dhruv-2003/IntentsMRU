// import { getUserEngagmentData } from "@/utils/getOpenRankData";
// import { getUserOnchainData } from "@/utils/airstack";
import { getGptCompletion, prepareParams } from "@/utils/intents";
import { solveIntent } from "@/utils/rollup";
import { NextRequest } from "next/server";

// Intent processing endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      requestId,
      intent,
      userAddress,
    }: { requestId: string; intent: string; userAddress: string } = await body;

    console.log(requestId, intent);

    // Process the intent and call Open AI to solve them and return back the params
    const data = await getGptCompletion(intent);

    if (!data) {
      console.log("No GPT data present");
      return;
    }

    // Prepare the param call to fulfill the request
    const params = await prepareParams({
      protocol: data?.protocol,
      functionName: data?.functionName,
      tokens: data.tokens,
      values: data.values,
      userAddress: userAddress,
    });
    if (!params) {
      // send a Invalid solve request back
      console.log("Params unprepared");
      return;
    }

    // Submit the request
    const ack = await solveIntent({
      requestId: Number(requestId),
      params: params?.params,
      abiFunction: params.abiFunction,
      functionName: params.functionName,
      protocolAddress: params.protocolAddress,
      txValue: params.txValue,
    });

    if (ack) {
      console.log("Ack received");
    }

    return new Response("ReuestCall Successful", {
      headers: {
        "Content-Type": "text/html",
      },
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
}
