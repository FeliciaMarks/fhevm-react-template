import { FhevmClient } from '../core/FhevmClient';

/**
 * Decryption utilities for encrypted values
 */

export interface DecryptedValue<T = bigint> {
  value: T;
  handle: string;
}

/**
 * Decrypt and convert to number
 */
export async function decryptToNumber(
  client: FhevmClient,
  contractAddress: string,
  handle: string
): Promise<number> {
  const decrypted = await client.requestDecrypt(contractAddress, handle);
  return Number(decrypted);
}

/**
 * Decrypt and convert to boolean
 */
export async function decryptToBoolean(
  client: FhevmClient,
  contractAddress: string,
  handle: string
): Promise<boolean> {
  const decrypted = await client.requestDecrypt(contractAddress, handle);
  return decrypted !== BigInt(0);
}

/**
 * Decrypt a rating value
 */
export async function decryptRating(
  client: FhevmClient,
  contractAddress: string,
  handle: string
): Promise<number> {
  const rating = await decryptToNumber(client, contractAddress, handle);
  if (rating < 1 || rating > 10) {
    console.warn('Decrypted rating outside expected range:', rating);
  }
  return rating;
}

/**
 * Decrypt an amount with decimal conversion
 */
export async function decryptAmount(
  client: FhevmClient,
  contractAddress: string,
  handle: string,
  decimals: number = 18
): Promise<number> {
  const decrypted = await client.requestDecrypt(contractAddress, handle);
  return Number(decrypted) / Math.pow(10, decimals);
}

/**
 * Batch decrypt multiple handles from the same contract
 */
export async function batchDecryptFromContract(
  client: FhevmClient,
  contractAddress: string,
  handles: string[]
): Promise<DecryptedValue[]> {
  const requests = handles.map(handle => ({
    contractAddress,
    handle,
  }));

  const values = await client.batchDecrypt(requests);

  return handles.map((handle, index) => ({
    handle,
    value: values[index],
  }));
}

/**
 * Decrypt with retry logic
 */
export async function decryptWithRetry(
  client: FhevmClient,
  contractAddress: string,
  handle: string,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<bigint> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.requestDecrypt(contractAddress, handle);
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw new Error(
    `Failed to decrypt after ${maxRetries} attempts: ${lastError?.message}`
  );
}

/**
 * Convert decrypted bigint to formatted string
 */
export function formatDecrypted(value: bigint, decimals: number = 0): string {
  if (decimals === 0) {
    return value.toString();
  }

  const divisor = BigInt(10 ** decimals);
  const whole = value / divisor;
  const fraction = value % divisor;

  return `${whole}.${fraction.toString().padStart(decimals, '0')}`;
}
