import { useState, useEffect, useCallback } from 'react';
import { FhevmClient } from '@fhevm/sdk';
import { EncryptedType } from '@/lib/fhe/types';

interface UseFHEOptions {
  network?: {
    chainId: number;
    rpcUrl: string;
  };
  autoInit?: boolean;
}

export function useFHE(options: UseFHEOptions = {}) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    if (isInitialized || isInitializing) return;

    setIsInitializing(true);
    setError(null);

    try {
      const fhevmClient = new FhevmClient({
        network: options.network || {
          chainId: 11155111,
          rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',
        },
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
  }, [isInitialized, isInitializing, options.network]);

  useEffect(() => {
    if (options.autoInit && !isInitialized && !isInitializing) {
      initialize();
    }
  }, [options.autoInit, isInitialized, isInitializing, initialize]);

  // Encryption methods
  const encrypt = useCallback(
    (value: number | bigint | boolean, type: EncryptedType = 'uint32'): Uint8Array | null => {
      if (!client || !isInitialized) {
        setError('FHEVM client not initialized');
        return null;
      }

      try {
        switch (type) {
          case 'uint8':
            return client.encrypt8(Number(value));
          case 'uint16':
            return client.encrypt16(Number(value));
          case 'uint32':
            return client.encrypt32(Number(value));
          case 'uint64':
            return client.encrypt64(BigInt(value));
          case 'bool':
            return client.encryptBool(Boolean(value));
          default:
            throw new Error(`Unsupported type: ${type}`);
        }
      } catch (err: any) {
        setError(err.message || 'Encryption failed');
        return null;
      }
    },
    [client, isInitialized]
  );

  const encrypt8 = useCallback((value: number) => encrypt(value, 'uint8'), [encrypt]);
  const encrypt16 = useCallback((value: number) => encrypt(value, 'uint16'), [encrypt]);
  const encrypt32 = useCallback((value: number) => encrypt(value, 'uint32'), [encrypt]);
  const encrypt64 = useCallback((value: bigint) => encrypt(value, 'uint64'), [encrypt]);
  const encryptBool = useCallback((value: boolean) => encrypt(value, 'bool'), [encrypt]);

  // Decryption method
  const decrypt = useCallback(
    async (contractAddress: string, handle: bigint): Promise<bigint | null> => {
      if (!client || !isInitialized) {
        setError('FHEVM client not initialized');
        return null;
      }

      try {
        const decrypted = await client.requestDecrypt(contractAddress, handle);
        return decrypted;
      } catch (err: any) {
        setError(err.message || 'Decryption failed');
        return null;
      }
    },
    [client, isInitialized]
  );

  return {
    client,
    isInitialized,
    isInitializing,
    error,
    initialize,
    encrypt,
    encrypt8,
    encrypt16,
    encrypt32,
    encrypt64,
    encryptBool,
    decrypt,
  };
}
