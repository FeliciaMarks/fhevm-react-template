export type EncryptedType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export interface EncryptedValue {
  data: Uint8Array;
  type: EncryptedType;
  originalValue?: number | bigint | boolean | string;
}

export interface DecryptionRequest {
  contractAddress: string;
  handle: string;
}

export interface DecryptionResult {
  value: bigint;
  contractAddress: string;
  handle: string;
  timestamp: number;
}

export interface FHEOperation {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'compare' | 'min' | 'max' | 'and' | 'or' | 'xor';
  operands: EncryptedValue[];
  result?: EncryptedValue;
}

export interface FHEConfig {
  network: {
    chainId: number;
    rpcUrl: string;
    name?: string;
  };
  autoInit?: boolean;
  retryAttempts?: number;
}

export interface FHEClientStatus {
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  lastInitTime?: number;
}

export interface EncryptionMetadata {
  timestamp: number;
  type: EncryptedType;
  size: number;
  checksum?: string;
}

export interface DecryptionMetadata {
  timestamp: number;
  contractAddress: string;
  handle: string;
  signatureRequired: boolean;
}

export interface BatchEncryptionRequest {
  values: Array<{
    value: number | bigint | boolean;
    type: EncryptedType;
  }>;
}

export interface BatchDecryptionRequest {
  requests: DecryptionRequest[];
  timeout?: number;
}

export interface FHEErrorInfo {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}
