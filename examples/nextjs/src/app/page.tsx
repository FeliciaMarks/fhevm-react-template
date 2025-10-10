'use client';

import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { useFhevm } from '@fhevm/sdk/react';
import EncryptionDemo from '@/components/EncryptionDemo';
import WalletConnect from '@/components/WalletConnect';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');

  const { client, isInitialized, isInitializing, init } = useFhevm({
    network: {
      chainId: 11155111, // Sepolia testnet
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    },
  });

  const handleConnect = async (walletProvider: BrowserProvider, walletAccount: string) => {
    setProvider(walletProvider);
    setAccount(walletAccount);

    // Initialize FHEVM client with wallet provider
    const signer = await walletProvider.getSigner();
    await init(walletProvider, signer);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">FHEVM SDK Demo</h1>
          <p className="text-gray-600 text-lg">
            Build confidential dApps with Fully Homomorphic Encryption
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect onConnect={handleConnect} />
        </div>

        {/* Connection Status */}
        {account && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <p className="text-green-800">
              <span className="font-semibold">Connected:</span> {account}
            </p>
            <p className="text-green-700 text-sm mt-1">
              FHEVM Status: {isInitializing ? 'Initializing...' : isInitialized ? 'Ready' : 'Not initialized'}
            </p>
          </div>
        )}

        {/* Encryption Demo */}
        {isInitialized && client && (
          <div className="space-y-8">
            <EncryptionDemo client={client} />
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <InfoCard
            title="Framework Agnostic"
            description="Works with React, Next.js, Vue, or vanilla JavaScript"
            icon="🔧"
          />
          <InfoCard
            title="Type Safe"
            description="Full TypeScript support with comprehensive type definitions"
            icon="🛡️"
          />
          <InfoCard
            title="Developer Friendly"
            description="wagmi-like API that web3 developers already know"
            icon="💡"
          />
        </div>
      </div>
    </main>
  );
}

function InfoCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
