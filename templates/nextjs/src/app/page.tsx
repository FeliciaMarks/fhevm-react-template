'use client';

import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { useFhevm } from '@fhevm/sdk/react';
import EncryptionDemo from '@/components/EncryptionDemo';
import WalletConnect from '@/components/WalletConnect';
import ComputationDemo from '@/components/fhe/ComputationDemo';
import KeyManager from '@/components/fhe/KeyManager';
import BankingExample from '@/components/examples/BankingExample';
import MedicalExample from '@/components/examples/MedicalExample';

export default function Home() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'encryption' | 'computation' | 'keys' | 'examples'>('encryption');

  const { client, isInitialized, isInitializing, init } = useFhevm({
    network: {
      chainId: 11155111, // Sepolia testnet
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FHEVM SDK Demo
            </h1>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Build confidential dApps with Fully Homomorphic Encryption -
              Framework-agnostic, developer-friendly, and production-ready
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8">
            <WalletConnect onConnect={handleConnect} />
          </div>

          {/* Connection Status */}
          {account && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-800">
                    <span className="font-semibold">Connected:</span> {account.substring(0, 10)}...{account.substring(account.length - 8)}
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    FHEVM Status: {isInitializing ? '🔄 Initializing...' : isInitialized ? '✅ Ready' : '⏸️ Not initialized'}
                  </p>
                </div>
                {isInitialized && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-700 font-medium">Live</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          {isInitialized && client && (
            <>
              <div className="bg-white rounded-lg shadow-md p-2 mb-6">
                <div className="flex gap-2">
                  <TabButton
                    active={activeTab === 'encryption'}
                    onClick={() => setActiveTab('encryption')}
                    icon="🔐"
                  >
                    Encryption
                  </TabButton>
                  <TabButton
                    active={activeTab === 'computation'}
                    onClick={() => setActiveTab('computation')}
                    icon="⚡"
                  >
                    Computation
                  </TabButton>
                  <TabButton
                    active={activeTab === 'keys'}
                    onClick={() => setActiveTab('keys')}
                    icon="🔑"
                  >
                    Key Management
                  </TabButton>
                  <TabButton
                    active={activeTab === 'examples'}
                    onClick={() => setActiveTab('examples')}
                    icon="📱"
                  >
                    Use Cases
                  </TabButton>
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-8">
                {activeTab === 'encryption' && (
                  <div className="animate-fadeIn">
                    <EncryptionDemo client={client} />
                  </div>
                )}

                {activeTab === 'computation' && (
                  <div className="animate-fadeIn">
                    <ComputationDemo client={client} />
                  </div>
                )}

                {activeTab === 'keys' && (
                  <div className="animate-fadeIn">
                    <KeyManager />
                  </div>
                )}

                {activeTab === 'examples' && (
                  <div className="animate-fadeIn grid md:grid-cols-2 gap-6">
                    <BankingExample client={client} />
                    <MedicalExample client={client} />
                  </div>
                )}
              </div>
            </>
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

          {/* Footer Info */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">About FHEVM SDK</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Complete encryption/decryption flow</li>
                  <li>Homomorphic computation support</li>
                  <li>EIP-712 signature integration</li>
                  <li>React hooks for easy integration</li>
                  <li>TypeScript-first design</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Use Cases</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Private financial transactions</li>
                  <li>Confidential medical records</li>
                  <li>Secret voting systems</li>
                  <li>Privacy-preserving DeFi</li>
                  <li>Encrypted data marketplaces</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function TabButton({
  children,
  active,
  onClick,
  icon
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-4 py-3 rounded-lg font-medium transition-all
        ${active
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
        }
      `}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </button>
  );
}

function InfoCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
