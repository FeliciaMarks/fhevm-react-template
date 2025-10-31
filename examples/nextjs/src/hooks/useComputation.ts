import { useState, useCallback } from 'react';
import { FhevmClient } from '@fhevm/sdk';

export type ComputationOperation = 'add' | 'subtract' | 'multiply' | 'compare' | 'min' | 'max';

export function useComputation(client: FhevmClient | null) {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prepareComputation = useCallback(
    async (
      value1: number | bigint,
      value2: number | bigint,
      operation: ComputationOperation,
      type: 'uint8' | 'uint16' | 'uint32' | 'uint64' = 'uint32'
    ) => {
      if (!client) {
        setError('FHEVM client not initialized');
        return null;
      }

      setIsComputing(true);
      setError(null);

      try {
        let encrypted1: Uint8Array;
        let encrypted2: Uint8Array;

        switch (type) {
          case 'uint8':
            encrypted1 = client.encrypt8(Number(value1));
            encrypted2 = client.encrypt8(Number(value2));
            break;
          case 'uint16':
            encrypted1 = client.encrypt16(Number(value1));
            encrypted2 = client.encrypt16(Number(value2));
            break;
          case 'uint32':
            encrypted1 = client.encrypt32(Number(value1));
            encrypted2 = client.encrypt32(Number(value2));
            break;
          case 'uint64':
            encrypted1 = client.encrypt64(BigInt(value1));
            encrypted2 = client.encrypt64(BigInt(value2));
            break;
        }

        return {
          operand1: encrypted1,
          operand2: encrypted2,
          operation,
          type,
        };
      } catch (err: any) {
        setError(err.message || 'Computation preparation failed');
        return null;
      } finally {
        setIsComputing(false);
      }
    },
    [client]
  );

  const add = useCallback(
    (a: number | bigint, b: number | bigint, type?: 'uint8' | 'uint16' | 'uint32' | 'uint64') =>
      prepareComputation(a, b, 'add', type),
    [prepareComputation]
  );

  const subtract = useCallback(
    (a: number | bigint, b: number | bigint, type?: 'uint8' | 'uint16' | 'uint32' | 'uint64') =>
      prepareComputation(a, b, 'subtract', type),
    [prepareComputation]
  );

  const multiply = useCallback(
    (a: number | bigint, b: number | bigint, type?: 'uint8' | 'uint16' | 'uint32' | 'uint64') =>
      prepareComputation(a, b, 'multiply', type),
    [prepareComputation]
  );

  const compare = useCallback(
    (a: number | bigint, b: number | bigint, type?: 'uint8' | 'uint16' | 'uint32' | 'uint64') =>
      prepareComputation(a, b, 'compare', type),
    [prepareComputation]
  );

  return {
    prepareComputation,
    add,
    subtract,
    multiply,
    compare,
    isComputing,
    error,
  };
}
