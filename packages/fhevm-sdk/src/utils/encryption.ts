import { FhevmClient } from '../core/FhevmClient';

/**
 * Encryption utilities for common data types
 */

export interface EncryptedValue {
  data: Uint8Array;
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' | 'eaddress';
}

/**
 * Encrypt a rating value (1-10)
 */
export function encryptRating(client: FhevmClient, rating: number): Uint8Array {
  if (rating < 1 || rating > 10) {
    throw new Error('Rating must be between 1 and 10');
  }
  return client.encrypt8(rating);
}

/**
 * Encrypt a percentage value (0-100)
 */
export function encryptPercentage(client: FhevmClient, percentage: number): Uint8Array {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }
  return client.encrypt8(percentage);
}

/**
 * Encrypt a score value
 */
export function encryptScore(client: FhevmClient, score: number, bitSize: 8 | 16 | 32 | 64 = 32): Uint8Array {
  switch (bitSize) {
    case 8:
      return client.encrypt8(score);
    case 16:
      return client.encrypt16(score);
    case 32:
      return client.encrypt32(score);
    case 64:
      return client.encrypt64(score);
    default:
      throw new Error('Invalid bit size');
  }
}

/**
 * Encrypt a boolean flag
 */
export function encryptBoolean(client: FhevmClient, value: boolean): Uint8Array {
  return client.encryptBool(value);
}

/**
 * Encrypt an amount (with decimals consideration)
 */
export function encryptAmount(client: FhevmClient, amount: number, decimals: number = 18): Uint8Array {
  const amountInWei = BigInt(Math.floor(amount * Math.pow(10, decimals)));
  return client.encrypt64(amountInWei);
}

/**
 * Batch encrypt multiple values
 */
export function batchEncrypt(
  client: FhevmClient,
  values: Array<{ value: number | bigint | boolean; type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' }>
): EncryptedValue[] {
  return values.map(({ value, type }) => {
    let data: Uint8Array;

    switch (type) {
      case 'euint8':
        data = client.encrypt8(value as number | bigint);
        break;
      case 'euint16':
        data = client.encrypt16(value as number | bigint);
        break;
      case 'euint32':
        data = client.encrypt32(value as number | bigint);
        break;
      case 'euint64':
        data = client.encrypt64(value as number | bigint);
        break;
      case 'ebool':
        data = client.encryptBool(value as boolean);
        break;
      default:
        throw new Error(`Unknown type: ${type}`);
    }

    return { data, type };
  });
}

/**
 * Convert encrypted data to hex string for contract calls
 */
export function toHexString(data: Uint8Array): string {
  return '0x' + Array.from(data)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string back to Uint8Array
 */
export function fromHexString(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);

  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }

  return bytes;
}
