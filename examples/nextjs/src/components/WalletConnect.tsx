'use client';

import { useState } from 'react';
import { BrowserProvider } from 'ethers';

interface WalletConnectProps {
  onConnect: (provider: BrowserProvider, account: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const provider = new BrowserProvider(window.ethereum);

      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];

      onConnect(provider, account);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </button>

      <p className="text-gray-500 text-sm mt-3 text-center">
        Make sure you're on Sepolia testnet
      </p>
    </div>
  );
}
