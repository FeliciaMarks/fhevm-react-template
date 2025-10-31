'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider, Signer } from 'ethers';

interface FHEContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  init: (provider?: BrowserProvider, signer?: Signer) => Promise<void>;
  reset: () => void;
}

const FHEContext = createContext<FHEContextValue | undefined>(undefined);

interface FHEProviderProps {
  children: ReactNode;
  network?: {
    chainId: number;
    rpcUrl: string;
  };
  autoInit?: boolean;
}

export function FHEProvider({ children, network, autoInit = false }: FHEProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const init = async (provider?: BrowserProvider, signer?: Signer) => {
    if (isInitialized || isInitializing) return;

    setIsInitializing(true);
    setError(null);

    try {
      const fhevmClient = new FhevmClient({
        network: network || {
          chainId: 11155111,
          rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
        },
        provider,
        signer,
      });

      await fhevmClient.init();
      setClient(fhevmClient);
      setIsInitialized(true);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize FHEVM client');
      console.error('FHEVM initialization error:', err);
    } finally {
      setIsInitializing(false);
    }
  };

  const reset = () => {
    setClient(null);
    setIsInitialized(false);
    setError(null);
  };

  useEffect(() => {
    if (autoInit && !isInitialized) {
      init();
    }
  }, [autoInit]);

  return (
    <FHEContext.Provider
      value={{
        client,
        isInitialized,
        isInitializing,
        error,
        init,
        reset,
      }}
    >
      {children}
    </FHEContext.Provider>
  );
}

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHEContext must be used within a FHEProvider');
  }
  return context;
}
