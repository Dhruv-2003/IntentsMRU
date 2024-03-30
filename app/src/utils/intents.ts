import { Interface, ethers } from "ethers";
import OpenAI from "openai";
import {
  ERC20_ABI,
  SUSHISWAP_ROUTER_ABI,
  UNISWAP_ROUTER_ABI,
  AAVE_LENDING_POOL_ABI,
} from "@/constants";

const UNISWAP_V3ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const AAVE_LENDING_POOL_ADDRESS = "0xcC6114B983E4Ed2737E9BD3961c9924e6216c704";

const tokenAddresses: { [token: string]: string } = {
  matic: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  usdc: "0x0fa8781a83e46826621b3bc094ea2a0212e71b23",
  wmatic: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  weth: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
  usdt: "0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2",
};

// 0x0fa8781a83e46826621b3bc094ea2a0212e71b23

const getTokenAddresses = (tokens: string[]) => {
  const addresses: any = {};
  for (const token of tokens) {
    addresses[token] =
      tokenAddresses[token.trim().toLowerCase()] || "Unknown address";
  }
  return addresses;
};

const getProtocolAddress = (protocol: string) => {
  if (protocol == "UNISWAP") {
    return UNISWAP_V3ROUTER_ADDRESS;
  } else if (protocol == "AAVE") {
    return AAVE_LENDING_POOL_ADDRESS;
  } else {
    throw new Error("Invalid Protocol");
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export interface GPTOutput {
  protocol: string;
  functionName: string;
  tokens: string[];
  values: string[];
}

export const getGptCompletion = async (
  intentMsg: string
): Promise<GPTOutput | undefined> => {
  const command = intentMsg;
  console.log("Command : ", command);

  const prompt = `Extract the tokens involved, protocol, parameters and their values in one line from the following command:${command}.Assume any suitable protocol like  UNISWAP, AAVE, etc when not mentioned and from the protocols code, figure out which function is being executed
    Return the response strictly in the following format - protocol:{{protocol}}\ntokens:[token1, token2, ..etc]\nfunction:{{function(param1, param2, ..etc)}}\nvalues:[value1,value2,etc]

    For example for the intent : I want to swap WMATIC for 0.00001USDC, the response would be strictly in the following format:
    protocol:UNISWAP
    tokens:[WMATIC, USDC]
    function:exactInputSingle(struct ISwapRouter.ExactInputSingleParams params)
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
    
    Don't add anything else in the format , just give me protocol , tokens , functions & values in the mentioned format
    `;

  // We currently only offer the following protocol and their respective functions.

  // - UNISWAP : to swap tokens on Sepolia chain , the functions available are exactInputSingle , exactOutputSingle
  // - AAVE :to lend , withdraw , borrow and repay tokens in the AAVE pools on Sepolia Chain, the functions available are deposit , withdraw, borrow & repay

  // If the user demand for any other protocol or action , you can return back with the response that the request can't be fulfilled

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

    const data: GPTOutput = {
      protocol: protocol,
      functionName: func_name,
      tokens: tokensArray,
      values: valuesArray,
    };

    return data;
  }
};

export interface ParamsInput {
  protocol: string;
  functionName: string;
  tokens: string[];
  values: string[];
  userAddress: string;
}

export interface ParamsOutput {
  protocolAddress: string;
  params: any[];
  abiFunction: string;
  functionName: string;
  txValue: number;
}

export const prepareParams = async (
  input: ParamsInput
): Promise<ParamsOutput | undefined> => {
  try {
    try {
      // convert protocol Name into protocol address
      const protocolAddress = getProtocolAddress(input.protocol);
      console.log(protocolAddress);

      let abiFunction: string;
      let params: any[] = [];
      // create the functionABI , get the functionABI
      if (input.protocol == "UNISWAP") {
        const abiInterface = new Interface(UNISWAP_ROUTER_ABI);
        const _abiFunction = abiInterface.getFunction(input.functionName);
        console.log(_abiFunction);

        // convert to string
        abiFunction = JSON.stringify(_abiFunction);
        console.log(abiFunction);
      } else if (input.protocol == "AAVE") {
        const abiInterface = new Interface(AAVE_LENDING_POOL_ABI);
        const _abiFunction = abiInterface.getFunction(input.functionName);
        console.log(_abiFunction);

        // convert to string
        abiFunction = JSON.stringify(_abiFunction);
        console.log(abiFunction);
      } else {
        throw new Error("Invalid Protocol");
      }

      // prepare the params from tokens and value depending on the protocol
      const tokenAddresses = getTokenAddresses(input.tokens);
      // console.log("Addresses : ", addresses);
      // console.log(addresses[tokensArray[0]]);

      if (input.protocol == "UNISWAP") {
        //     struct ExactInputSingleParams {
        //     address tokenIn;
        //     address tokenOut;
        //     uint24 fee;
        //     address recipient;
        //     uint256 deadline;
        //     uint256 amountIn;
        //     uint256 amountOutMinimum;
        //     uint160 sqrtPriceLimitX96;
        // }
        // create the params acc to the function
        const deadline = Math.round(new Date().getTime() / 1000) + 86400;
        params = [
          {
            tokenIn: tokenAddresses[0],
            tokenOut: tokenAddresses[1],
            fee: 3000,
            recipient: input.userAddress,
            deadline: deadline,
            amountIn: input.values[0],
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0,
          },
        ];
      } else if (input.protocol == "AAVE") {
        // create the params acc to the function
        if (input.functionName == "borrow") {
          params = [
            tokenAddresses[0],
            input.values[0],
            1,
            0,
            input.userAddress,
          ];
        } else if (input.functionName == "repay") {
          params = [tokenAddresses[0], input.values[0], 1, input.userAddress];
        }
      }

      const data: ParamsOutput = {
        protocolAddress: protocolAddress,
        functionName: input.functionName,
        abiFunction: abiFunction,
        params: params,
        txValue: 0,
      };

      return data;
      // txValue if needed
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
