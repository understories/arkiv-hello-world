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

## Network and Migration

This template targets **Braga**, Arkiv's current public testnet. Snapshots, entities, and funded balances do not port between Arkiv testnets, so anyone running this code (and any agent helping with maintenance) should confirm the current network before assuming the configuration below is still up to date.

### Current configuration

| Setting | Value |
| --- | --- |
| Chain export | `braga` from `@arkiv-network/sdk/chains` |
| Chain ID | `60138453102` |
| HTTP RPC | `https://braga.hoodi.arkiv.network/rpc` |
| WebSocket RPC | `wss://braga.hoodi.arkiv.network/rpc/ws` |
| Explorer | `https://explorer.braga.hoodi.arkiv.network` |
| Faucet | `https://braga.hoodi.arkiv.network/faucet/` |
| Native gas token | test GLM |
| SDK requirement | `@arkiv-network/sdk@^0.6.7` (the `braga` export requires `>= 0.6.5`) |

### Testnet history

Arkiv has rotated its public testnet as the protocol matured:

1. **Mendoza** (early testnet, ETH gas token)
2. **Kaolin** (deprecated, scheduled to stop responding on May 15, 2026, ETH gas token)
3. **Braga** (current, GLM gas token)

Official references:

- Braga overview: https://docs.arkiv.network/networks/braga/
- Kaolin to Braga migration notes: https://docs.arkiv.network/networks/migrate-from-kaolin/

### Migrating this template to a future testnet

The next time Arkiv announces a new testnet, the changes below are what this repository needs. The same checklist works whether you are a human maintainer or an AI assistant. Replace `braga` with the new chain name wherever it appears.

1. Confirm the new chain is exported from `@arkiv-network/sdk/chains`. Run `npm view @arkiv-network/sdk version` to see the latest published SDK and check the release notes for the minimum version that includes the new chain.
2. Bump `@arkiv-network/sdk` in `package.json` to that version and run `npm install` so `package-lock.json` updates.
3. Edit `lib/arkiv/client.ts`:
   - Replace the `import { braga } from "@arkiv-network/sdk/chains"` line.
   - Replace both `chain: braga` references in `getPublicClient` and `getWalletClientFromPrivateKey`.
   - Update the JSDoc comment that names the testnet.
4. Edit `app/hello-world/page.tsx`:
   - Two `href` templates point at `https://explorer.braga.hoodi.arkiv.network/entity/${...}` and `/tx/${...}`.
   - One copy line reads `Connected to Braga Testnet`.
5. Edit `scripts/generate-wallet.mjs` (one faucet URL in a `console.log`).
6. Edit this `README.md` (Quick Start step 5, the "How It Works" line, the Resources list, and this Network and Migration section).
7. Refund the deployment signing wallet on the new faucet, since balances do not port across testnets. Update the `ARKIV_PRIVATE_KEY` environment variable in your hosting provider if you rotate the wallet.
8. Run `npm run typecheck` to confirm the new chain export resolves.
9. Smoke test locally with `npm run dev` and post a message at `/hello-world`. Verify the entity and transaction links open the new explorer.

Final check, useful as both the first and last step of a migration:

```bash
grep -rin "braga\|mendoza\|kaolin" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.mjs" --include="*.json"
```

Any hits outside this Network and Migration section indicate stragglers that still need to be updated.

## License

MIT
