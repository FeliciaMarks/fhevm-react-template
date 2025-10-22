# FHEVM Universal SDK

> Build confidential dApps with ease - A framework-agnostic SDK for Fully Homomorphic Encryption on EVM

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)

## 🎯 Overview

The FHEVM Universal SDK is the next generation of confidential dApp development tools. Built to be **framework-agnostic**, **developer-friendly**, and **production-ready**, it provides everything you need to build privacy-preserving applications on FHEVM.

### Why This SDK?

- **🔧 Framework Agnostic** - Works seamlessly with React, Next.js, Vue, Node.js, or vanilla JavaScript
- **📦 All-in-One Package** - No more scattered dependencies - everything you need in one package
- **🎣 wagmi-like API** - Familiar interface for web3 developers with React hooks and utilities
- **🔐 Complete Encryption Flow** - Built-in support for encryption, decryption, and EIP-712 signing
- **⚡ TypeScript First** - Full type safety with comprehensive type definitions
- **📚 Well Documented** - Clear examples and comprehensive documentation

### Smart Contract
Built on fhEVM (Fully Homomorphic Encryption Virtual Machine) using Zama's encryption library.

**Contract Address**: `0x0f3e553484dF29aF3423AD6E301b571a255b1142`

## 🎬 Demo

**Live Application**: [https://fhe-restaurant-rating.vercel.app/](https://fhe-restaurant-rating.vercel.app/)

**demo.mp4**: See the platform in action with a complete walkthrough of restaurant registration, review submission, and privacy features.

## 🚀 Quick Start

### Installation

```bash
# Install the SDK
npm install @fhevm/sdk ethers

# Or with yarn
yarn add @fhevm/sdk ethers
```

### 5 Lines to Encrypt

```typescript
import { FhevmClient } from '@fhevm/sdk';

const client = new FhevmClient({ network: { chainId: 11155111, rpcUrl: 'YOUR_RPC' }});
await client.init();
const encrypted = client.encrypt8(42);
// Done! Ready to send to your contract
```

### React/Next.js (Even Easier!)

```tsx
import { useFhevm } from '@fhevm/sdk/react';

function MyApp() {
  const { encrypt8, isInitialized } = useFhevm({
    network: { chainId: 11155111, rpcUrl: 'YOUR_RPC' },
    autoInit: true
  });

  return <button onClick={() => encrypt8(42)}>Encrypt</button>;
}
```

## 📁 Project Structure

```
fhevm-universal-sdk/
├── packages/
│   └── fhevm-sdk/              # 🎯 Core SDK Package
│       ├── src/
│       │   ├── core/           # Core client and helpers
│       │   ├── utils/          # Encryption/decryption utilities
│       │   ├── react/          # React hooks
│       │   ├── index.ts        # Main entry point
│       │   └── react.ts        # React entry point
│       └── README.md
│
├── examples/
│   ├── nextjs/                 # 📱 Next.js Example (Required)
│   │   ├── src/
│   │   │   ├── app/            # Next.js 14 app directory
│   │   │   └── components/     # Reusable components
│   │   └── README.md
│   │
│   └── restaurant-rating/      # 🍽️ Full dApp Example
│       ├── src/
│       └── README.md
│
├── contracts/                  # Smart Contracts
│   └── PrivateRestaurantRating.sol
│
├── scripts/                    # Deployment Scripts
│   └── deploy.js
│
├── demo.mp4                    # Video Demonstration
└── README.md                   # This file
```

## 🎬 Features Showcase

### ✅ Framework Agnostic Core

The SDK works anywhere JavaScript runs:

```typescript
// Vanilla JS/TS
import { FhevmClient, encryptRating } from '@fhevm/sdk';

// React
import { useFhevm } from '@fhevm/sdk/react';

// Vue (use core client)
import { FhevmClient } from '@fhevm/sdk';

// Node.js Backend
const { FhevmClient } = require('@fhevm/sdk');
```

### ✅ Complete Encryption/Decryption Flow

```typescript
// Encryption
const encrypted8 = client.encrypt8(42);
const encrypted16 = client.encrypt16(1000);
const encrypted32 = client.encrypt32(1000000);
const encrypted64 = client.encrypt64(BigInt('9999999999'));
const encryptedBool = client.encryptBool(true);

// Decryption (with EIP-712 signature)
const decrypted = await client.requestDecrypt(contractAddress, handle);

// Batch decryption
const values = await client.batchDecrypt([
  { contractAddress, handle: handle1 },
  { contractAddress, handle: handle2 }
]);
```

### ✅ Helper Utilities

```typescript
import {
  encryptRating,      // 1-10 ratings
  encryptPercentage,  // 0-100 percentages
  encryptAmount,      // Token amounts with decimals
  decryptToNumber,
  decryptToBoolean
} from '@fhevm/sdk';

// Encrypt a restaurant rating
const rating = encryptRating(client, 8);

// Decrypt with automatic type conversion
const score = await decryptToNumber(client, contractAddress, handle);
```

### ✅ React Hooks (wagmi-style)

```tsx
import { useFhevm, useContract } from '@fhevm/sdk/react';

function MyComponent() {
  // Initialize FHEVM
  const { client, encrypt8, decrypt, isInitialized } = useFhevm({
    network: { chainId: 11155111, rpcUrl: 'YOUR_RPC' },
    autoInit: true
  });

  // Contract interaction
  const { call, read, isLoading } = useContract({
    client,
    address: '0x...',
    abi: contractABI
  });

  const submitValue = async () => {
    const encrypted = encrypt8(42);
    await call('submitValue', [encrypted]);
  };

  return <button onClick={submitValue}>Submit</button>;
}
```

## 📚 Examples

### 1. Next.js Example (Required)

A comprehensive Next.js application demonstrating the SDK in action.

**Location:** `examples/nextjs/`

**Features:**
- Wallet connection with MetaMask
- Real-time encryption demo
- Interactive UI with Tailwind CSS
- Type-safe contract interactions

**Run:**
```bash
cd examples/nextjs
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 2. Restaurant Rating dApp

A complete privacy-preserving restaurant rating system.

**Location:** `examples/restaurant-rating/`

**Features:**
- Private ratings using FHEVM
- Register restaurants on-chain
- Submit encrypted reviews
- Aggregated ratings without revealing individual scores

**Smart Contract:** `contracts/PrivateRestaurantRating.sol`

## 🛠️ Development

### Install All Dependencies

```bash
npm run install:all
```

### Build the SDK

```bash
npm run build
```

### Compile Smart Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

### Deploy Contracts

```bash
npm run deploy
```

### Run Examples

```bash
# Next.js example
npm run dev:nextjs

# Restaurant rating example
npm run dev:restaurant
```

## 📖 Documentation

### SDK Documentation

See [`packages/fhevm-sdk/README.md`](./packages/fhevm-sdk/README.md) for complete API reference.

### Example Documentation

- [Next.js Example](./examples/nextjs/README.md)
- [Restaurant Rating](./examples/restaurant-rating/README.md)

## 🎯 Design Philosophy

This SDK follows these core principles:

1. **Simplicity First** - Common operations should take <10 lines of code
2. **Framework Agnostic** - Core functionality works everywhere, React hooks are optional
3. **Type Safety** - Full TypeScript support with zero `any` types
4. **Developer Experience** - Familiar APIs inspired by wagmi and ethers.js
5. **Production Ready** - Error handling, retries, and edge cases covered

## 🔐 Security

- All encryption happens client-side
- Private keys never leave the user's device
- EIP-712 signatures for decryption requests
- No plaintext values sent to the blockchain

## 📹 Video Demonstration

See `demo.mp4` for a complete walkthrough of:
- SDK installation and setup
- Encryption/decryption demos
- Contract interactions
- Full dApp example

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with:
- [fhevmjs](https://github.com/zama-ai/fhevmjs) - Core FHEVM JavaScript library
- [ethers.js](https://github.com/ethers-io/ethers.js/) - Ethereum interactions
- [Zama](https://zama.ai/) - FHEVM technology

## 🔗 Links

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [fhevmjs GitHub](https://github.com/zama-ai/fhevmjs)
- [Example Deployment](#) <!-- Add your deployment link here -->

---

**Built with ❤️ for the FHEVM community**

*Ready to build confidential dApps? Get started in 5 minutes!*
