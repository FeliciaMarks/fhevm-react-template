/**
 * @fhevm/sdk - Universal SDK for building confidential dApps with FHEVM
 *
 * Framework-agnostic encryption and decryption utilities for Fully Homomorphic Encryption
 * on Ethereum Virtual Machine (FHEVM).
 *
 * @example
 * ```typescript
 * import { FhevmClient, encryptRating } from '@fhevm/sdk';
 *
 * const client = new FhevmClient({
 *   network: {
 *     chainId: 11155111,
 *     rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
 *   }
 * });
 *
 * await client.init();
 * const encrypted = encryptRating(client, 8);
 * ```
 */

// Core exports
export { FhevmClient } from './core/FhevmClient';
export type { FhevmConfig, EncryptionResult, DecryptionRequest } from './core/FhevmClient';

export { ContractHelper } from './core/ContractHelper';
export type { ContractConfig } from './core/ContractHelper';

// Encryption utilities
export {
  encryptRating,
  encryptPercentage,
  encryptScore,
  encryptBoolean,
  encryptAmount,
  batchEncrypt,
  toHexString,
  fromHexString,
} from './utils/encryption';
export type { EncryptedValue } from './utils/encryption';

// Decryption utilities
export {
  decryptToNumber,
  decryptToBoolean,
  decryptRating,
  decryptAmount,
  batchDecryptFromContract,
  decryptWithRetry,
  formatDecrypted,
} from './utils/decryption';
export type { DecryptedValue } from './utils/decryption';

// Version
export const VERSION = '1.0.0';
