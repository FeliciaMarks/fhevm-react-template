import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserProvider, Signer } from 'ethers';
import { FhevmClient, FhevmConfig } from '../../core/FhevmClient';

export interface UseFhevmOptions extends FhevmConfig {
  autoInit?: boolean;
}

export interface UseFhevmReturn {
  client: FhevmClient | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  init: (provider?: BrowserProvider, signer?: Signer) => Promise<void>;
  encrypt8: (value: number | bigint) => Uint8Array | null;
  encrypt16: (value: number | bigint) => Uint8Array | null;
  encrypt32: (value: number | bigint) => Uint8Array | null;
  encrypt64: (value: number | bigint) => Uint8Array | null;
  encryptBool: (value: boolean) => Uint8Array | null;
  decrypt: (contractAddress: string, handle: string) => Promise<bigint | null>;
}

/**
 * React hook for FHEVM client management
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, isInitialized, encrypt8, decrypt } = useFhevm({
 *     network: {
 *       chainId: 11155111,
 *       rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
 *     },
 *     autoInit: true
 *   });
 *
 *   const handleEncrypt = () => {
 *     const encrypted = encrypt8(42);
 *     console.log('Encrypted:', encrypted);
 *   };
 *
 *   return <button onClick={handleEncrypt}>Encrypt</button>;
 * }
 * ```
 */
export function useFhevm(options: UseFhevmOptions): UseFhevmReturn {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const clientRef = useRef<FhevmClient | null>(null);

  const init = useCallback(
    async (provider?: BrowserProvider, signer?: Signer) => {
      if (isInitializing) return;

      setIsInitializing(true);
      setError(null);

      try {
        const newClient = new FhevmClient(options);
        await newClient.init(provider, signer);

        clientRef.current = newClient;
        setClient(newClient);
        setIsInitialized(true);
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error('Failed to initialize FHEVM client:', error);
      } finally {
        setIsInitializing(false);
      }
    },
    [options, isInitializing]
  );

  // Auto-initialize if requested
  useEffect(() => {
    if (options.autoInit && !isInitialized && !isInitializing) {
      init();
    }
  }, [options.autoInit, isInitialized, isInitializing, init]);

  const encrypt8 = useCallback(
    (value: number | bigint): Uint8Array | null => {
      if (!clientRef.current) return null;
      try {
        return clientRef.current.encrypt8(value);
      } catch (err) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  const encrypt16 = useCallback(
    (value: number | bigint): Uint8Array | null => {
      if (!clientRef.current) return null;
      try {
        return clientRef.current.encrypt16(value);
      } catch (err) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  const encrypt32 = useCallback(
    (value: number | bigint): Uint8Array | null => {
      if (!clientRef.current) return null;
      try {
        return clientRef.current.encrypt32(value);
      } catch (err) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  const encrypt64 = useCallback(
    (value: number | bigint): Uint8Array | null => {
      if (!clientRef.current) return null;
      try {
        return clientRef.current.encrypt64(value);
      } catch (err) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  const encryptBool = useCallback(
    (value: boolean): Uint8Array | null => {
      if (!clientRef.current) return null;
      try {
        return clientRef.current.encryptBool(value);
      } catch (err) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  const decrypt = useCallback(
    async (contractAddress: string, handle: string): Promise<bigint | null> => {
      if (!clientRef.current) return null;
      try {
        return await clientRef.current.requestDecrypt(contractAddress, handle);
      } catch (err) {
        setError(err as Error);
        return null;
      }
    },
    []
  );

  return {
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
  };
}
