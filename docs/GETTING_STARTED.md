# Getting Started with FHEVM SDK

Quick start guide to building confidential dApps with the FHEVM Universal SDK.

## Installation

### NPM

```bash
npm install @fhevm/sdk ethers
```

### Yarn

```bash
yarn add @fhevm/sdk ethers
```

## Quick Start

### 1. Basic Usage (Vanilla JavaScript/TypeScript)

```typescript
import { FhevmClient } from '@fhevm/sdk';

// Create and initialize client
const client = new FhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
  },
});

await client.init();

// Encrypt a value
const encrypted = client.encrypt32(42);

// Send to your smart contract
const tx = await contract.submitEncryptedValue(encrypted);
```

### 2. React/Next.js Usage

```tsx
import { useFhevm } from '@fhevm/sdk/react';

function MyApp() {
  const { client, encrypt32, isInitialized } = useFhevm({
    network: {
      chainId: 11155111,
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    },
    autoInit: true,
  });

  const handleEncrypt = async () => {
    if (!isInitialized) return;

    const encrypted = encrypt32(42);
    // Use encrypted value
  };

  return (
    <button onClick={handleEncrypt} disabled={!isInitialized}>
      Encrypt Value
    </button>
  );
}
```

### 3. With Wallet Connection

```typescript
import { BrowserProvider } from 'ethers';
import { FhevmClient } from '@fhevm/sdk';

// Connect wallet
const provider = new BrowserProvider(window.ethereum);
await provider.send('eth_requestAccounts', []);
const signer = await provider.getSigner();

// Initialize with wallet
const client = new FhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
  },
  provider,
  signer,
});

await client.init();
```

## Core Concepts

### 1. Encryption

Encrypt values before sending to smart contracts:

```typescript
// Different types
const encrypted8 = client.encrypt8(42);        // 0-255
const encrypted16 = client.encrypt16(1000);    // 0-65535
const encrypted32 = client.encrypt32(1000000); // 0-4294967295
const encrypted64 = client.encrypt64(BigInt('9999999999'));
const encryptedBool = client.encryptBool(true);
```

### 2. Decryption

Decrypt values from smart contracts (requires wallet signature):

```typescript
const decrypted = await client.requestDecrypt(
  contractAddress,
  handle // obtained from contract
);

console.log(decrypted); // bigint
```

### 3. Homomorphic Operations

Perform computations on encrypted data (on-chain):

```solidity
// In your smart contract
function addEncrypted(euint32 a, euint32 b) public returns (euint32) {
    return TFHE.add(a, b); // Addition on encrypted values
}
```

## Network Configuration

### Supported Networks

```typescript
// Sepolia Testnet
const config = {
  network: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
  },
};

// Custom Network
const config = {
  network: {
    chainId: YOUR_CHAIN_ID,
    rpcUrl: 'YOUR_RPC_URL',
  },
};
```

## Complete Example

```typescript
import { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider, Contract } from 'ethers';

// 1. Setup
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const client = new FhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
  },
  provider,
  signer,
});

await client.init();

// 2. Encrypt
const secretValue = 42;
const encrypted = client.encrypt32(secretValue);

// 3. Send to contract
const contract = new Contract(contractAddress, abi, signer);
const tx = await contract.submitValue(encrypted);
await tx.wait();

// 4. Read encrypted result
const handle = await contract.getEncryptedResult();

// 5. Decrypt
const decrypted = await client.requestDecrypt(contractAddress, handle);
console.log('Decrypted value:', decrypted.toString());
```

## Next Steps

- Read the [API Documentation](./API.md)
- Explore [Examples](../examples/)
- Check out [Use Cases](./USE_CASES.md)
- Learn about [Security Best Practices](./SECURITY.md)

## Common Issues

### Client not initializing

Make sure to await the init call:
```typescript
await client.init(); // Don't forget await!
```

### Type errors

Ensure you're using the correct type for each value:
```typescript
client.encrypt64(BigInt(value)); // Use BigInt for uint64
client.encrypt32(Number(value));  // Use Number for smaller types
```

### Decryption requires signature

Decryption requires the user to sign an EIP-712 message. Make sure a wallet is connected.

## Support

- [GitHub Issues](https://github.com/your-repo/issues)
- [Documentation](../README.md)
- [Examples](../examples/)
