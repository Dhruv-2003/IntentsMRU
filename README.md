## Intents-MRU

<!-- Translating intents into on-chain actions. -->

Translating intents into on-chain actions - Briging the power of blockchain with natural language interactions, enabled by Intents-MRU's decentralized solver network.

<img width="1261" alt="Screenshot 2024-03-31 at 7 37 24 AM" src="https://github.com/Dhruv-2003/IntentsMRU/assets/91938348/a424942d-7d38-472a-8272-896842cb19c4">

## Problem we are trying to solve:

<!-- Intents-MRU solves a significant problem in the blockchain ecosystem:  -->

There's a very high barrier to entry for non-technical users due to the complexity of interacting with smart contracts.

Currently, engaging with dApps and executing on-chain transactions requires a deep understanding of blockchain technology, smart contract interfaces, and the ability to construct complex transaction data.

With Intents-MRU, users can seamlessly interact with blockchain protocols and dApps without needing to understand the intricacies of smart contract execution. The platform enables users to express their intentions or desired actions in natural language, effectively bridging the gap between human communication and the technical requirements of on-chain interactions.

## Possible use cases:

**DeFi Interactions**: Express intentions like "swap 1 ETH for DAI" or "provide liquidity to Uniswap ETH-USDC pool," and let Intents-MRU handle the complex transaction details.

**NFT Transactions**: Simply state "mint NFT from CryptoPunks" or "list Bored Ape NFT on OpenSea," and the platform will execute the desired NFT actions seamlessly.

**Decentralized Governance**: Participate in on-chain governance by conveying "vote in favor of protocol upgrade proposal" or "delegate voting power," without needing technical expertise.

**Wallet Management**: Effortlessly manage your crypto assets by expressing intentions like "send 0.5 BTC to this address" or "stake MATIC tokens for yield."

**Decentralized Marketplaces**: Interact with decentralized marketplaces by stating "buy digital art from SuperRare" or "list my service on Openzeppelin," and let Intents-MRU facilitate the transactions.

**Gaming and Metaverse**: Engage with blockchain-based games and metaverse platforms by expressing intentions like "mint in-game assets" or "purchase virtual land parcels."

## Project Structure

```
│
├── intentSystem ( Micro rollup )
│   │   |
│   │   src
│   │   ├── solver.ts
│   │   ├── state.ts
│   │   ├── machine.ts
│   │   ├── actions.ts
│   │   ├── transitions.ts
│   │   ├── index.ts
│   │
│   │── stackr.config.ts
│   │── deployment.json
│
├── app ( frontend application )
│
├── backend ( syncer service b/w MRU & solver )
```

## How to run ?

## Step 1 Run the Micro rollup

### Run using Node.js :rocket:

```bash
npm start
```

### Run using Docker :whale:

- Build the image using the following command:

```bash
# For Linux
docker build -t {{projectName}}:latest .

# For Mac with Apple Silicon chips
docker buildx build --platform linux/amd64,linux/arm64 -t {{projectName}}:latest .
```

- Run the Docker container using the following command:

```bash
# If using SQLite as the datastore
docker run -v ./db.sqlite:/app/db.sqlite -p <HOST_PORT>:<CONTAINER_PORT> --name={{projectName}} -it {{projectName}}:latest

# If using other URI based datastores
docker run -p <HOST_PORT>:<CONTAINER_PORT> --name={{projectName}} -it {{projectName}}:latest
```

## Step 2 Run backend service

### Run backend using command :

```bash
cd backend
bun run src/index.ts
```

## Setp 3 Run frontend

### Run backend using command :

```bash
bun run start
```

## Challenges we ran into

**Front-end Challenges:**

We wanted to make the UX for this project so smooth that anyone without extensive knowledge of blockchain and concepts revolving around it could use it. We spent a lot of time figuring out the best approach to solve this and ultimately settled on a conversational UI that mimics a single input interface. This allowed users to input their intents in a natural language format, making the experience intuitive and user-friendly.

However, translating the user's input into a format that could be processed by our backend solvers presented its own set of challenges. We had to implement natural language processing techniques to extract the relevant information from the user's input, such as the desired action, the target protocol, and any necessary parameters.

Another front-end challenge we faced was displaying the translated transaction data in a way that was easily understandable by the user. We had to strike a balance between providing enough information for the user to verify the transaction details while keeping the interface clean and uncluttered.

**Backend Challenges:**

On the back-end, one of the biggest challenges was designing and implementing the solver network. We had to create a decentralized and incentivized system where solvers could compete to provide the most accurate translations of user intents into executable transactions.

**Integration Challenges:**

Integrating with various blockchain protocols and decentralized applications was a non-trivial task. Each protocol and dApp has its own unique set of smart contracts, interfaces, and execution requirements.

## Tech Used

Stackr, Avail, Next.Js, TypeScript, Tailwind CSS, Shadcn-UI, Wagmi, Viem, GPT's Processing Model

## Team

- [Dhruv Agarwal](https://bento.me/0xdhruv) - Backend and Integration
- [Kushagra Sarathe](https://bento.me/kushagrasarathe) - Frontend Designing and Development
