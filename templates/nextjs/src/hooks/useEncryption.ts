import { useState, useCallback } from 'react';
import { FhevmClient } from '@fhevm/sdk';
import { EncryptedType } from '@/lib/fhe/types';

export function useEncryption(client: FhevmClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(
    async (value: number | bigint | boolean, type: EncryptedType = 'uint32') => {
      if (!client) {
        setError('FHEVM client not initialized');
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        let encrypted: Uint8Array;

        switch (type) {
          case 'uint8':
            encrypted = client.encrypt8(Number(value));
            break;
          case 'uint16':
            encrypted = client.encrypt16(Number(value));
            break;
          case 'uint32':
            encrypted = client.encrypt32(Number(value));
            break;
          case 'uint64':
            encrypted = client.encrypt64(BigInt(value));
            break;
          case 'bool':
            encrypted = client.encryptBool(Boolean(value));
            break;
          default:
            throw new Error(`Unsupported type: ${type}`);
        }

        return encrypted;
      } catch (err: any) {
        setError(err.message || 'Encryption failed');
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const encrypt8 = useCallback((value: number) => encrypt(value, 'uint8'), [encrypt]);
  const encrypt16 = useCallback((value: number) => encrypt(value, 'uint16'), [encrypt]);
  const encrypt32 = useCallback((value: number) => encrypt(value, 'uint32'), [encrypt]);
  const encrypt64 = useCallback((value: bigint) => encrypt(value, 'uint64'), [encrypt]);
  const encryptBool = useCallback((value: boolean) => encrypt(value, 'bool'), [encrypt]);

  return {
    encrypt,
    encrypt8,
    encrypt16,
    encrypt32,
    encrypt64,
    encryptBool,
    isEncrypting,
    error,
  };
}
