// import { getUserEngagmentData } from "@/utils/getOpenRankData";
// import { getUserOnchainData } from "@/utils/airstack";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { requestId, intent }: { requestId: string; intent: string } =
      await body;

    // Process the intent and call Open AI to solve them and return back the params

    // Prepare the param call to fulfill the request

    // Submit the request

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
