# Arkiv Hello World

A simple decentralized message board powered by Arkiv. This is the starter template for the [Serverless DApp 101 tutorial](https://serverlessdapp101.vercel.app).

## What This Demonstrates

- **Read path:** Querying Arkiv entities via `createPublicClient` + query builder
- **Write path:** Server-signed writes via Next.js API routes (Phase 0)
- **Optimistic UI:** Handling "submitted vs indexed" states gracefully
- **Error handling:** Timeout, rate limit, and network error classification
- **Shared space:** Uses `SPACE_ID=ns` so all messages appear on the main demo page

## Quick Start

1. **Fork this repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/arkiv-hello-world.git
   cd arkiv-hello-world
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and set:
   # - SPACE_ID=ns (shared workshop space - already set)
   # - ARKIV_PRIVATE_KEY=0x... (your testnet wallet private key)
   ```

5. **Get testnet tokens:**
   - Generate a wallet using the [Arkiv Getting Started guide](https://arkiv.network/getting-started/typescript)
   - Get testnet tokens from the [Braga Testnet Faucet](https://braga.hoodi.arkiv.network/faucet/)
   - Add your private key to `.env`

6. **Run development server:**
   ```bash
   npm run dev
   ```

7. **Visit:**
   - Homepage: `http://localhost:3000`
   - Hello World Demo: `http://localhost:3000/hello-world`

## Important: Shared Workshop Space

This demo uses `SPACE_ID=ns` by default. This means:
- ✅ Messages from **any wallet** will appear on the main demo page
- ✅ All tutorial participants can see each other's messages
- ✅ Demonstrates the decentralized nature of Arkiv
- ✅ No central database - all data is on-chain

When you create a message from your local app, it will appear on:
- Your local app at `http://localhost:3000/hello-world`
- The main demo at `https://serverlessdapp101.vercel.app/hello-world`
- Any other app using `SPACE_ID=ns`

## Project Structure

```
arkiv-hello-world/
├── app/
│   ├── hello-world/page.tsx          # Message board UI
│   ├── api/serverless-dapp101/
│   │   └── messages/route.ts        # Messages API
│   ├── page.tsx                     # Homepage
│   └── layout.tsx                   # Root layout
├── lib/
│   ├── arkiv/
│   │   ├── client.ts                # Arkiv client utilities
│   │   └── transaction-utils.ts    # Transaction helpers
│   └── config.ts                    # Configuration (SPACE_ID, etc.)
├── .env.example                     # Environment variable template
└── README.md                        # This file
```

## How It Works

1. **Writing messages:** When you submit a message, it's sent to `/api/serverless-dapp101/messages` (POST)
2. **Creating entities:** The API creates a `workshop_message` entity on Arkiv with your message
3. **Shared space:** All entities use `spaceId='ns'`, so they're queryable by anyone
4. **Reading messages:** The page queries all `workshop_message` entities with `spaceId='ns'`
5. **Decentralized:** No central database - all data lives on Arkiv (Braga testnet)

## Verification

- **View on Explorer:** Each message has both Entity and Transaction links to verify on-chain:
  - **Entity link**: View the entity (data structure) on the explorer
  - **Transaction link**: View the transaction (blockchain operation) on the explorer
- **Shared visibility:** Your messages appear on the main demo page immediately
- **Independent verification:** Anyone can query the same data independently

## Resources

- [Serverless DApp 101 Tutorial](https://serverlessdapp101.vercel.app) - Full tutorial
- [Arkiv Network](https://arkiv.network) - Official documentation
- [Arkiv Getting Started](https://arkiv.network/getting-started/typescript) - Wallet generation
- [Braga Testnet Faucet](https://braga.hoodi.arkiv.network/faucet/) - Get testnet tokens

## License

MIT
