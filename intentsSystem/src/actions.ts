import { ActionSchema, SolidityType } from "@stackr/sdk";

// utility function to create a transfer schema
function generateSchemaFromBase(name: string) {
  return new ActionSchema(name, {
    to: SolidityType.ADDRESS,
    from: SolidityType.ADDRESS,
    amount: SolidityType.UINT,
  });
}

// createAccountSchema is a schema for creating an account
export const registerSolverSchema = new ActionSchema("register", {
  address: SolidityType.ADDRESS,
});

export const requestInentSchema = new ActionSchema("request", {
  requestId: SolidityType.UINT,
  userAddress: SolidityType.ADDRESS,
  intent: SolidityType.STRING,
});

export const solveInentSchema = new ActionSchema("solve", {
  requestId: SolidityType.UINT,
  solverAddress: SolidityType.ADDRESS,
  params: SolidityType.STRING,
  abi: SolidityType.STRING,
  protocolAddress: SolidityType.ADDRESS,
  txValue: SolidityType.UINT,
});

export const schemas = {
  register: registerSolverSchema,
  request: requestInentSchema,
  solve: solveInentSchema,
};

// register - register themselves as solver in the network , TODO: Possible addition of slashing / staking
// request -  request the intent solving , basically adding the intent in the pool
// solve - submitted an intent solution by a solver
