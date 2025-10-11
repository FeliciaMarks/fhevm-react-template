import { useState, useCallback, useEffect } from 'react';
import { ContractInterface } from 'ethers';
import { ContractHelper, ContractConfig } from '../../core/ContractHelper';
import { FhevmClient } from '../../core/FhevmClient';

export interface UseContractOptions extends ContractConfig {
  client: FhevmClient | null;
}

export interface UseContractReturn {
  helper: ContractHelper | null;
  call: (methodName: string, params?: any[]) => Promise<any>;
  read: (methodName: string, params?: any[]) => Promise<any>;
  decrypt: (handle: string) => Promise<bigint | null>;
  batchDecrypt: (handles: string[]) => Promise<bigint[] | null>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * React hook for contract interactions with FHEVM
 *
 * @example
 * ```tsx
 * function RestaurantRating() {
 *   const { client } = useFhevm({ ... });
 *   const { call, read, decrypt } = useContract({
 *     client,
 *     address: '0x...',
 *     abi: contractABI
 *   });
 *
 *   const submitRating = async (rating: number) => {
 *     const encrypted = client?.encrypt8(rating);
 *     await call('submitReview', [encrypted, restaurantId]);
 *   };
 *
 *   return <button onClick={() => submitRating(8)}>Submit</button>;
 * }
 * ```
 */
export function useContract(options: UseContractOptions): UseContractReturn {
  const [helper, setHelper] = useState<ContractHelper | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options.client && options.client.isInitialized()) {
      try {
        const contractHelper = new ContractHelper(options.client, {
          address: options.address,
          abi: options.abi,
        });
        setHelper(contractHelper);
      } catch (err) {
        setError(err as Error);
      }
    }
  }, [options.client, options.address, options.abi]);

  const call = useCallback(
    async (methodName: string, params: any[] = []): Promise<any> => {
      if (!helper) {
        throw new Error('Contract helper not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await helper.callAndWait(methodName, params);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [helper]
  );

  const read = useCallback(
    async (methodName: string, params: any[] = []): Promise<any> => {
      if (!helper) {
        throw new Error('Contract helper not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await helper.read(methodName, params);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [helper]
  );

  const decrypt = useCallback(
    async (handle: string): Promise<bigint | null> => {
      if (!helper) {
        console.error('Contract helper not initialized');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await helper.decrypt(handle);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [helper]
  );

  const batchDecrypt = useCallback(
    async (handles: string[]): Promise<bigint[] | null> => {
      if (!helper) {
        console.error('Contract helper not initialized');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await helper.batchDecrypt(handles);
        return results;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [helper]
  );

  return {
    helper,
    call,
    read,
    decrypt,
    batchDecrypt,
    isLoading,
    error,
  };
}
