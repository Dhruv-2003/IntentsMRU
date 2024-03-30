import { ethers } from "ethers";
import OpenAI from "openai";
import {
  ERC20_ABI,
  SUSHISWAP_ROUTER_ABI,
  UNISWAP_ROUTER_ABI,
  AAVE_LENDING_POOL_ABI,
} from "@/constants";

const UNISWAP_V3ROUTER_ADDRESS = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
const AAVE_LENDING_POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";

const tokenAddresses: { [token: string]: string } = {
  usdc: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
  wmatic: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  usdt: "0xAcDe43b9E5f72a4F554D4346e69e8e7AC8F352f0",
};

// const getTokenAddresses = (tokens: string[]) => {
//   const addresses: any = {};
//   for (const token of tokens) {
//     addresses[token] =
//       tokenAddresses[token.trim().toLowerCase()] || "Unknown address";
//   }
//   return addresses;
// };

// const sendTransaction = async (
//   protocol: any,
//   func: any,
//   tokensArray: any,
//   valuesArray: any,
//   addresses: any
// ) => {
//   if (protocol == "Sushiswap" || protocol == "Uniswap") {
//     const router = new ethers.Contract(
//       SUSHISWAP_ROUTER_ADDRESS,
//       SUSHISWAP_ROUTER_ABI,
//       wallet
//     );
//     const wmaticContract = new ethers.Contract(
//       addresses[tokensArray[0]],
//       ERC20_ABI,
//       wallet
//     );

//     // Define the trade parameters
//     const amountString = valuesArray[0];
//     const amountIn = ethers.utils.parseEther("0.001"); // Spend 0.001 WMATIC
//     const amountOutMin = ethers.utils.parseUnits(amountString, 6); // Get at least 100 USDC tokens
//     const path = [addresses[tokensArray[0]], addresses[tokensArray[1]]]; // Swap route
//     const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
//     const to = wallet.address; // Wallet address to receive USDC

//     // Approve the Router contract to spend WMATIC
//     const approveTx = await wmaticContract.approve(
//       SUSHISWAP_ROUTER_ADDRESS,
//       amountIn
//     );
//     await approveTx.wait();

//     // Make the swap
//     const swapFunction = router[func];
//     const tx = await swapFunction(amountIn, amountOutMin, path, to, deadline);

//     console.log("Transaction hash: " + tx.hash);

//     // Wait for the transaction to be mined
//     await tx.wait();

//     console.log("Swap executed successfully!");

//     return tx.hash;
//   } else if (protocol == "AAVE") {
//     const usdtDecimal = 6; // USDC has 6 decimals
//     const amountString = valuesArray[0];
//     const amount = ethers.utils.parseUnits(amountString, usdtDecimal);
//     const lendingPoolContract = new ethers.Contract(
//       AAVE_LENDING_POOL_ADDRESS,
//       AAVE_LENDING_POOL_ABI,
//       wallet
//     );
//     const aaveFunction = lendingPoolContract[func];

//     let tx: any;

//     if (func == "repay") {
//       const usdtContract = new ethers.Contract(
//         addresses[tokensArray[0]],
//         ERC20_ABI,
//         wallet
//       );
//       const approveTx = await usdtContract.approve(
//         AAVE_LENDING_POOL_ADDRESS,
//         amount
//       );
//       await approveTx.wait(); // Wait for approval to be mined
//       tx = await aaveFunction(
//         addresses[tokensArray[0]],
//         amount,
//         2, // 1 for Stable, 2 for Variable rate. Here we are selecting Variable rate.
//         wallet.address
//       );
//     } else if (func == "borrow") {
//       tx = await aaveFunction(
//         addresses[tokensArray[0]],
//         amount,
//         2, // 1 for Stable, 2 for Variable rate. Here we are selecting Variable rate.
//         0, // referral code
//         wallet.address
//       );
//     }

//     console.log(`Transaction hash: ${tx.hash}`);

//     const receipt = await tx.wait();
//     console.log(
//       `Transaction confirmed in block number: ${receipt.blockNumber}`
//     );
//     console.log(`${func} executed successful`);

//     return tx.hash;
//   }
// };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export const getGptCompletion = async (intentMsg: string) => {
  let txHash = "";

  const command = intentMsg;
  console.log("Command : ", command);
  const prompt = `Extract the tokens involved, protocol, parameters and their values in one line from the following command:${command}.Assume any suitable protocol like  Uniswap, AAVE, etc when not mentioned and from the protocols code, figure out which function is being executed
    Return the response in the following format-protocol:{{protocol}}\ntokens:[token1, token2, ..etc]\nfunction:{{function(param1, param2, ..etc)}}\nvalues:[value1,value2,etc]

    For example for the intent : I want to swap WMATIC for 0.00001USDC, the response would be strictly in the following format:
    protocol:Uniswap
    tokens:[WMATIC, USDC]
    functionName:exactInputSingle
    values:[0.0001]

    For example for the intent : I want to swap 0.00001WMATIC for USDC, the response would be strictly in the following format:
    protocol:Uniswap
    tokens:[WMATIC, USDC]
    functionName:exactOutputSingle
    values:[0.0001]

    For example for the intent : I want to lend/deposit 0.00001 USDT on AAVE, the response would be strictly in the following format:
    protocol:AAVE
    tokens:[USDT]
    functionName:deposit
    values:[0.0001]

    For example for the intent : I want to withdraw 0.00001 USDT from AAVE, the response would be strictly in the following format:
    protocol:AAVE
    tokens:[USDT]
    function:withdraw
    values:[0.0001]

    For example for the intent : I want to borrow 0.00001 USDT, the response would be strictly in the following format:
    protocol:AAVE
    tokens:[USDT]
    function:borrow(_asset, _amount, _interestRateMode, _referralCode, _onBehalfOf)
    values:[0.0001]

    For example for the intent : I want to repay 0.00001 USDT, the response would be strictly in the following format:
    protocol:AAVE
    tokens:[USDT]
    function:repay(_asset, _amount, _rateMode, _onBehalfOf)
    values:[0.0001]

    We currently only offer the following protocol and their respective functions.
    
    - UNISWAP : to swap tokens on Sepolia chain , the functions available are exactInputSingle , exactOutputSingle
    - AAVE :to lend , withdraw , borrow and repay tokens in the AAVE pools on Sepolia Chain, the functions available are deposit , withdraw, borrow & repay

    If the user demand for any other protocol or action , you can return back with the response that the request can't be fulfilled
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "How You can help me ?" },
      { role: "user", content: prompt },
    ],
  });

  let commandArray: Array<string> = [];
  const answer = completion.choices[0].message;
  console.log("Answer : ", answer);

  if (answer && answer.content) {
    commandArray = answer.content.split("\n");

    const protocolPart = commandArray[0];
    const protocol = protocolPart.split(":")[1].trim();
    console.log("Protocol Used : ", protocol);

    const tokensPart = commandArray[1];
    const tokensString = tokensPart
      .substring(tokensPart.indexOf("[") + 1, tokensPart.indexOf("]"))
      .trim();
    const tokensArray = tokensString.split(",").map((token) => token.trim());
    console.log("Tokens Involved : ", tokensArray);

    const functionPart = commandArray[2];
    const func = functionPart.split(":")[1].trim();
    const func_name = func.split("(")[0];
    console.log("Function executed : ", func_name);

    const valuesPart = commandArray[3];
    const valuesString = valuesPart
      .substring(valuesPart.indexOf("[") + 1, valuesPart.indexOf("]"))
      .trim();
    const valuesArray = valuesString.split(",").map((value) => value.trim());
    console.log("Values : ", valuesArray);

    // const addresses = getTokenAddresses(tokensArray);
    // console.log("Addresses : ", addresses);
    // console.log(addresses[tokensArray[0]]);

    // const data = { protocol, func_name, tokensArray, valuesArray, addresses };
  }
};

// // getGptCompletion("I want to repay 0.00001 USDT")
// // getGptCompletion("I want to swap WMATIC for 0.00001 USDC")

// app.post("/completion", async (req: any, res: any) => {
//   console.log(req.body.body);
//   const message = req.body.body;
//   try {
//     const response = await getGptCompletion(message);
//     console.log(response);
//     res.json(response);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send({ error: "An error occurred while processing your request." });
//   }
// });

// const port = process.env.PORT || 8000;
// app.listen(port, () =>
//   console.log(`Server running on http://localhost:${port}`)
// );
