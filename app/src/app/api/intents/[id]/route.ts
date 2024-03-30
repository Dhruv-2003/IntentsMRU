// import { getUserEngagmentData } from "@/utils/getOpenRankData";
// import { getUserOnchainData } from "@/utils/airstack";
import { NextRequest } from "next/server";

// Just a get route to get the data for a particular request
// Not really needed
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(params.id);

    const requestId = params.id;
    return new Response("RequestCall Successful", {
      headers: {
        "Content-Type": "text/html",
      },
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
}
