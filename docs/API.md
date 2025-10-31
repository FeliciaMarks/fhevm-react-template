# FHEVM SDK - API Reference

Complete API documentation for the FHEVM Universal SDK.

## Table of Contents

- [Core Client](#core-client)
- [Encryption Methods](#encryption-methods)
- [Decryption Methods](#decryption-methods)
- [React Hooks](#react-hooks)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)

---

## Core Client

### `FhevmClient`

The main client for interacting with FHEVM.

#### Constructor

```typescript
import { FhevmClient } from '@fhevm/sdk';

const client = new FhevmClient({
  network: {
    chainId: number,
    rpcUrl: string,
  },
  provider?: BrowserProvider,
  signer?: Signer,
});
```

**Parameters:**
- `network.chainId` - The chain ID of the network
- `network.rpcUrl` - RPC endpoint URL
- `provider` (optional) - ethers.js BrowserProvider instance
- `signer` (optional) - ethers.js Signer instance

#### Methods

##### `init()`

Initialize the FHEVM client.

```typescript
await client.init();
```

**Returns:** `Promise<void>`

---

## Encryption Methods

### `encrypt8(value: number): Uint8Array`

Encrypt an 8-bit unsigned integer (0-255).

```typescript
const encrypted = client.encrypt8(42);
```

### `encrypt16(value: number): Uint8Array`

Encrypt a 16-bit unsigned integer (0-65535).

```typescript
const encrypted = client.encrypt16(1000);
```

### `encrypt32(value: number): Uint8Array`

Encrypt a 32-bit unsigned integer (0-4294967295).

```typescript
const encrypted = client.encrypt32(1000000);
```

### `encrypt64(value: bigint): Uint8Array`

Encrypt a 64-bit unsigned integer.

```typescript
const encrypted = client.encrypt64(BigInt('9999999999'));
```

### `encryptBool(value: boolean): Uint8Array`

Encrypt a boolean value.

```typescript
const encrypted = client.encryptBool(true);
```

---

## Decryption Methods

### `requestDecrypt(contractAddress: string, handle: string): Promise<bigint>`

Request decryption of an encrypted value. Requires EIP-712 signature from user wallet.

```typescript
const decrypted = await client.requestDecrypt(
  '0x1234...', // contract address
  '0xabcd...'  // handle
);
```

**Parameters:**
- `contractAddress` - The smart contract address
- `handle` - The encrypted value handle

**Returns:** `Promise<bigint>` - The decrypted value

### `batchDecrypt(requests: DecryptionRequest[]): Promise<bigint[]>`

Decrypt multiple values in a single batch.

```typescript
const values = await client.batchDecrypt([
  { contractAddress: '0x1234...', handle: '0xaaa...' },
  { contractAddress: '0x1234...', handle: '0xbbb...' },
]);
```

**Returns:** `Promise<bigint[]>` - Array of decrypted values

---

## React Hooks

### `useFhevm(config: FHEConfig)`

Main hook for using FHEVM in React applications.

```typescript
import { useFhevm } from '@fhevm/sdk/react';

function MyComponent() {
  const {
    client,
    isInitialized,
    isInitializing,
    error,
    init,
    reset
  } = useFhevm({
    network: {
      chainId: 11155111,
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    },
    autoInit: true, // Optional: auto-initialize on mount
  });

  // Use the client...
}
```

**Returns:**
- `client` - The FhevmClient instance (null if not initialized)
- `isInitialized` - Boolean indicating if client is ready
- `isInitializing` - Boolean indicating if initialization is in progress
- `error` - Error message if initialization failed
- `init()` - Function to manually initialize the client
- `reset()` - Function to reset the client state

### `useEncryption(client: FhevmClient | null)`

Hook for encryption operations.

```typescript
import { useEncryption } from '@fhevm/sdk/react';

const {
  encrypt,
  encrypt8,
  encrypt16,
  encrypt32,
  encrypt64,
  encryptBool,
  isEncrypting,
  error
} = useEncryption(client);

const encrypted = await encrypt8(42);
```

### `useContract(options)`

Hook for contract interactions with encrypted values.

```typescript
import { useContract } from '@fhevm/sdk/react';

const { call, read, isLoading } = useContract({
  client,
  address: '0x...',
  abi: contractABI,
});

await call('methodName', [arg1, arg2]);
```

---

## Utility Functions

### `encryptRating(client: FhevmClient, rating: number): Uint8Array`

Helper to encrypt a rating value (1-10).

```typescript
import { encryptRating } from '@fhevm/sdk';

const encrypted = encryptRating(client, 8);
```

### `encryptPercentage(client: FhevmClient, percentage: number): Uint8Array`

Helper to encrypt a percentage value (0-100).

```typescript
import { encryptPercentage } from '@fhevm/sdk';

const encrypted = encryptPercentage(client, 75);
```

### `decryptToNumber(client: FhevmClient, contractAddress: string, handle: string): Promise<number>`

Decrypt and convert to a number.

```typescript
import { decryptToNumber } from '@fhevm/sdk';

const value = await decryptToNumber(client, contractAddress, handle);
```

### `decryptToBoolean(client: FhevmClient, contractAddress: string, handle: string): Promise<boolean>`

Decrypt and convert to a boolean.

```typescript
import { decryptToBoolean } from '@fhevm/sdk';

const value = await decryptToBoolean(client, contractAddress, handle);
```

### `toHexString(data: Uint8Array): string`

Convert encrypted data to hex string.

```typescript
import { toHexString } from '@fhevm/sdk';

const hex = toHexString(encryptedData);
```

---

## Type Definitions

### `EncryptedType`

```typescript
type EncryptedType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
```

### `FHEConfig`

```typescript
interface FHEConfig {
  network: {
    chainId: number;
    rpcUrl: string;
    name?: string;
  };
  autoInit?: boolean;
  retryAttempts?: number;
}
```

### `DecryptionRequest`

```typescript
interface DecryptionRequest {
  contractAddress: string;
  handle: string;
}
```

### `EncryptedValue`

```typescript
interface EncryptedValue {
  data: Uint8Array;
  type: EncryptedType;
  originalValue?: number | bigint | boolean | string;
}
```

---

## Error Handling

All methods may throw errors. Always wrap in try-catch blocks:

```typescript
try {
  const encrypted = client.encrypt32(value);
  // Use encrypted value
} catch (error) {
  console.error('Encryption failed:', error.message);
}
```

---

## Best Practices

1. **Initialize Once**: Create one FhevmClient instance and reuse it
2. **Check Initialization**: Always check `isInitialized` before using the client
3. **Handle Errors**: Implement proper error handling for all operations
4. **Type Safety**: Use TypeScript for full type checking
5. **Batch Operations**: Use `batchDecrypt` for multiple decryption requests

---

## Examples

See the [examples directory](../examples/) for complete working examples:
- [Next.js Example](../examples/nextjs/)
- [Restaurant Rating dApp](../examples/restaurant-rating/)

For more information, visit the [main README](../README.md).
