# Quick Start Guide

Get up and running with the FHEVM Universal SDK in less than 10 minutes!

## 📋 Prerequisites

- Node.js 18+ installed
- MetaMask or another Web3 wallet
- Basic knowledge of React/Next.js (for frontend examples)
- Sepolia testnet ETH (for deployment)

## ⚡ Installation

### From Root Directory

```bash
# Install all dependencies
npm run install:all

# Build the SDK
npm run build
```

### For Individual Examples

```bash
# Next.js example
cd examples/nextjs
npm install

# Restaurant rating example
cd examples/restaurant-rating
npm install
```

## 🚀 Running Examples

### 1. Next.js Basic Example

```bash
cd examples/nextjs
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**What you'll see:**
- Wallet connection interface
- Encryption demo with multiple data types
- Real-time encrypted value display

### 2. Restaurant Rating dApp

```bash
cd examples/restaurant-rating
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

**Features:**
- Register restaurants
- Submit encrypted reviews
- View aggregated ratings

## 🔨 Smart Contract Deployment

### 1. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### 2. Compile Contracts

```bash
npm run compile
```

### 3. Deploy

```bash
npm run deploy
```

### 4. Update Contract Address

Copy the deployed contract address and update:
- `examples/nextjs/.env.local`
- `examples/restaurant-rating/.env.local`

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

## 💻 Usage in Your Project

### Install SDK

```bash
npm install @fhevm/sdk ethers
```

### Basic Usage (Vanilla JS)

```javascript
import { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// Initialize
const client = new FhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
  }
});

const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
await client.init(provider, signer);

// Encrypt
const encrypted = client.encrypt8(42);

// Use in contract call
const contract = new Contract(address, abi, signer);
await contract.submitValue(encrypted);
```

### React/Next.js Usage

```jsx
import { useFhevm, useContract } from '@fhevm/sdk/react';

function MyComponent() {
  const { client, encrypt8, isInitialized } = useFhevm({
    network: {
      chainId: 11155111,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
    },
    autoInit: true
  });

  const { call } = useContract({
    client,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: contractABI
  });

  const handleSubmit = async () => {
    const encrypted = encrypt8(42);
    await call('submitValue', [encrypted]);
  };

  return (
    <button onClick={handleSubmit}>
      Submit Encrypted Value
    </button>
  );
}
```

## 🎯 Common Tasks

### Encrypt Different Types

```javascript
// 8-bit unsigned integer (0-255)
const encrypted8 = client.encrypt8(42);

// 16-bit unsigned integer
const encrypted16 = client.encrypt16(1000);

// 32-bit unsigned integer
const encrypted32 = client.encrypt32(1000000);

// Boolean
const encryptedBool = client.encryptBool(true);

// Using helper utilities
import { encryptRating, encryptPercentage } from '@fhevm/sdk';
const rating = encryptRating(client, 8);  // 1-10
const percent = encryptPercentage(client, 75);  // 0-100
```

### Decrypt Values

```javascript
// Single value
const decrypted = await client.requestDecrypt(
  contractAddress,
  handle  // Get this from contract
);

// Batch decrypt
const values = await client.batchDecrypt([
  { contractAddress, handle: handle1 },
  { contractAddress, handle: handle2 }
]);

// With helper utilities
import { decryptToNumber, decryptRating } from '@fhevm/sdk';
const score = await decryptToNumber(client, contractAddress, handle);
const rating = await decryptRating(client, contractAddress, handle);
```

### Contract Interactions

```javascript
import { ContractHelper } from '@fhevm/sdk';

const helper = new ContractHelper(client, {
  address: contractAddress,
  abi: contractABI
});

// Call method
await helper.call('submitValue', [encrypted]);

// Read view function
const result = await helper.read('getValue', []);

// Decrypt value from contract
const decrypted = await helper.decrypt(handle);
```

## 🐛 Troubleshooting

### "FHEVM client not initialized"
Make sure you call `await client.init()` before using encryption/decryption.

### "Provider not found"
Ensure MetaMask is installed and you've granted permission to connect.

### "Wrong network"
Switch to Sepolia testnet in MetaMask.

### Build errors in Next.js
Add webpack config to `next.config.js`:
```javascript
webpack: (config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
  };
  return config;
}
```

## 📚 Next Steps

- Read the [Full API Documentation](./packages/fhevm-sdk/README.md)
- Explore [Example Code](./examples/)
- Check out [Smart Contract Examples](./contracts/)
- Watch the [Video Demo](./demo.mp4)

## 💬 Need Help?

- Check the [FAQ](./docs/FAQ.md)
- Review [Example Code](./examples/)
- Read [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

---

**Happy Building! 🚀**
