# FHEVM Next.js Example

This example demonstrates how to use the FHEVM SDK in a Next.js application.

## Features

- ✅ Wallet connection with MetaMask
- ✅ Encrypt values using FHEVM SDK
- ✅ Type-safe contract interactions
- ✅ Real-time encryption demo
- ✅ Tailwind CSS styling

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the values in `.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── WalletConnect.tsx    # Wallet connection component
│   │   └── EncryptionDemo.tsx   # Encryption demonstration
│   └── hooks/               # Custom React hooks (if needed)
├── public/                  # Static assets
└── package.json
```

## Usage Examples

### Initialize FHEVM Client

```tsx
import { useFhevm } from '@fhevm/sdk/react';

function MyComponent() {
  const { client, init, isInitialized } = useFhevm({
    network: {
      chainId: 11155111,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!
    }
  });

  // Initialize with wallet
  const handleConnect = async (provider, account) => {
    const signer = await provider.getSigner();
    await init(provider, signer);
  };
}
```

### Encrypt Values

```tsx
import { encryptRating, toHexString } from '@fhevm/sdk';

const encrypted = encryptRating(client, 8);
const hex = toHexString(encrypted);
```

### Contract Interactions

```tsx
import { useContract } from '@fhevm/sdk/react';

const { call, read } = useContract({
  client,
  address: contractAddress,
  abi: contractABI
});

// Submit encrypted value
const encrypted = client.encrypt8(42);
await call('submitValue', [encrypted]);
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)

## License

MIT
