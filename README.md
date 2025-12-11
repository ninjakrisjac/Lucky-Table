# Lucky Table

> Three boxes. One prize. Total privacy.

A privacy-first lottery where even the house can't peek at your fate.

## The Pitch

Traditional lotteries have a trust problem. The operator knows everything—who picked what, where the prize is, when you've won. With **Lucky Table**, that asymmetry dies.

Your choice? **Encrypted.** Prize location? **Encrypted.** Winner calculation? **Encrypted.** The only person who ever sees your result is *you*.

Built on [Zama's FHEVM](https://docs.zama.org/protocol)—Fully Homomorphic Encryption running natively on Ethereum.

## Features

- 🎲 **Blind Selection** — Pick 1 of 3 mystery boxes, encrypted client-side
- 🔐 **On-Chain Randomness** — Prize position derived from `block.prevrandao` *after* your encrypted choice
- ⚡ **FHE Comparison** — Win/loss computed entirely in ciphertext
- 🔑 **User-Only Reveal** — EIP-712 signature required to decrypt your result

## Prize Tiers

| Tier | Symbol | Odds |
|------|--------|------|
| Common | ◆ | ~33% |
| Rare | ✧ | ~33% |
| Legendary | ★ | ~33% |

*Each draw has ~33% chance to win one of the tiers, ~67% to hit empty.*

## Tech Stack

| Layer | Tech |
|-------|------|
| Contract | Solidity 0.8.24 + `@fhevm/solidity` |
| Frontend | Next.js 14, TypeScript, Tailwind |
| Wallet | RainbowKit + wagmi |
| FHE | `@zama-fhe/relayer-sdk` |
| Animation | Framer Motion |

## Contract

| Network | Address | Status |
|---------|---------|--------|
| Sepolia | [`0xfc3eDC004CEDe01Ca91314753669E5eE8ada64e7`](https://sepolia.etherscan.io/address/0xfc3eDC004CEDe01Ca91314753669E5eE8ada64e7#code) | ✅ Verified |

## Tests

```bash
cd contracts && npm test
```

```
  LuckyTable
    Deployment
      ✔ should deploy successfully
      ✔ should initialize totalDraws to 0
    State Management
      ✔ should report no result for new player
      ✔ should revert getResult for player without result
      ✔ should revert getResultHandle for player without result
      ✔ should return 0 timestamp for player without draw
    Result Clearing
      ✔ should allow clearing non-existent result without error
    Contract Interface
      ✔ should have draw function with correct signature
      ✔ should have getResultHandle function
      ✔ should have hasResult function
      ✔ should have clearResult function
      ✔ should have totalDraws function
    Events
      ✔ should define DrawStarted event
      ✔ should define DrawCompleted event

  14 passing
```

## Quick Start

```bash
# 1. Clone & install
git clone <repo>
cd contracts && npm install
cd ../frontend && npm install

# 2. Run frontend
cd frontend && npm run dev
```

Open [localhost:3000](http://localhost:3000), connect wallet, play.

## How FHE Protects You

```
┌─────────────────────────────────────────────────────────┐
│  Your Browser                                           │
│  ┌─────────────┐                                        │
│  │ Pick Box 2  │ ──encrypt──▶ [encrypted_choice]        │
│  └─────────────┘                                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Smart Contract (Sepolia)                               │
│                                                         │
│  [encrypted_choice] vs [encrypted_prize_pos]            │
│           │                                             │
│           ▼                                             │
│     FHE.eq() ──▶ [encrypted_bool]                       │
│           │                                             │
│           ▼                                             │
│  FHE.select() ──▶ [encrypted_result]                    │
│                                                         │
│  FHE.allow(result, player) ◀── only you can decrypt     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Your Browser                                           │
│                                                         │
│  Sign EIP-712 ──▶ Zama Relayer ──▶ Decrypt locally      │
│                                                         │
│  Result: "RARE_TIER" ★                                  │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
contracts/
├── contracts/LuckyTable.sol    # FHE lottery logic
├── test/LuckyTable.test.ts     # Unit tests
└── scripts/deploy.ts           # Deployment script

frontend/
├── src/app/                    # Next.js pages
├── src/components/             # UI components
├── src/lib/fhe.ts              # FHE encryption/decryption
└── src/store/                  # Zustand state
```

## Deploy Your Own

```bash
cd contracts

# Set your keys in hardhat.config.ts (gitignored)
npx hardhat run scripts/deploy.ts --network sepolia
npx hardhat verify --network sepolia <ADDRESS>

# Update frontend/src/config/wagmi.ts with new address
```

## License

MIT

---

*Built for the Zama Developer Program. Proving that privacy and fun aren't mutually exclusive.*
