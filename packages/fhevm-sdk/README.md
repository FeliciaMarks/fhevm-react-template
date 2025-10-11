# @fhevm/sdk

Universal SDK for building confidential dApps with FHEVM (Fully Homomorphic Encryption Virtual Machine).

## Features

- 🔐 **Framework Agnostic** - Works with React, Next.js, Vue, Node.js, or vanilla JavaScript
- 📦 **All-in-One** - Wraps all necessary packages for FHEVM development
- 🎣 **React Hooks** - wagmi-like API for React developers
- 🔑 **EIP-712 Signing** - Built-in support for decryption with user signatures
- ⚡ **TypeScript** - Full type safety and IntelliSense support

## Installation

```bash
npm install @fhevm/sdk ethers
```

## Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { FhevmClient, encryptRating } from '@fhevm/sdk';
import { BrowserProvider } from 'ethers';

// Initialize client
const client = new FhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
  }
});

// Connect with provider
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
await client.init(provider, signer);

// Encrypt values
const encrypted = client.encrypt8(42);
const encryptedRating = encryptRating(client, 8);

// Decrypt values (requires EIP-712 signature)
const decrypted = await client.requestDecrypt(contractAddress, handle);
```

### React/Next.js

```tsx
import { useFhevm, useContract } from '@fhevm/sdk/react';
import { BrowserProvider } from 'ethers';

function MyComponent() {
  const { client, isInitialized, encrypt8 } = useFhevm({
    network: {
      chainId: 11155111,
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
    }
  });

  const { call, read } = useContract({
    client,
    address: '0x...',
    abi: contractABI
  });

  const handleSubmit = async () => {
    // Encrypt value
    const encrypted = encrypt8(42);

    // Call contract
    await call('submitValue', [encrypted]);
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

## API Reference

### FhevmClient

Core client for encryption and decryption operations.

```typescript
const client = new FhevmClient(config: FhevmConfig);
await client.init(provider?, signer?);

// Encryption
client.encrypt8(value: number | bigint): Uint8Array
client.encrypt16(value: number | bigint): Uint8Array
client.encrypt32(value: number | bigint): Uint8Array
client.encrypt64(value: number | bigint): Uint8Array
client.encryptBool(value: boolean): Uint8Array

// Decryption (requires signer)
client.requestDecrypt(contractAddress: string, handle: string): Promise<bigint>
client.batchDecrypt(requests: DecryptionRequest[]): Promise<bigint[]>
```

### ContractHelper

Helper for contract interactions.

```typescript
const helper = new ContractHelper(client, {
  address: '0x...',
  abi: contractABI
});

// Call contract methods
await helper.call('methodName', [param1, param2]);
await helper.callAndWait('methodName', [param1, param2]);

// Read from contract
const result = await helper.read('viewMethod', [param1]);

// Decrypt values
const decrypted = await helper.decrypt(handle);
const batch = await helper.batchDecrypt([handle1, handle2]);
```

### Encryption Utilities

```typescript
import {
  encryptRating,      // Encrypt 1-10 rating
  encryptPercentage,  // Encrypt 0-100 percentage
  encryptScore,       // Encrypt numeric score
  encryptBoolean,     // Encrypt boolean
  encryptAmount,      // Encrypt token amount with decimals
  batchEncrypt,       // Encrypt multiple values
} from '@fhevm/sdk';

const encrypted = encryptRating(client, 8);
```

### Decryption Utilities

```typescript
import {
  decryptToNumber,
  decryptToBoolean,
  decryptRating,
  decryptAmount,
  batchDecryptFromContract,
  decryptWithRetry,
} from '@fhevm/sdk';

const rating = await decryptRating(client, contractAddress, handle);
const amount = await decryptAmount(client, contractAddress, handle, 18);
```

### React Hooks

#### useFhevm

```typescript
const {
  client,
  isInitialized,
  isInitializing,
  error,
  init,
  encrypt8,
  encrypt16,
  encrypt32,
  encrypt64,
  encryptBool,
  decrypt,
} = useFhevm({
  network: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
  },
  autoInit: true
});
```

#### useContract

```typescript
const {
  helper,
  call,
  read,
  decrypt,
  batchDecrypt,
  isLoading,
  error,
} = useContract({
  client,
  address: '0x...',
  abi: contractABI
});
```

## Examples

See the `/examples` directory for complete examples:

- `examples/nextjs` - Next.js application with FHEVM
- `examples/restaurant-rating` - Full restaurant rating dApp

## License

MIT
