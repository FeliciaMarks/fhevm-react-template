export type EncryptedType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export interface EncryptedValue {
  data: Uint8Array;
  type: EncryptedType;
}

export interface DecryptionRequest {
  contractAddress: string;
  handle: string;
}

export interface DecryptionResult {
  value: bigint;
  contractAddress: string;
  handle: string;
}

export interface FHEOperation {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'compare' | 'min' | 'max';
  operands: EncryptedValue[];
}

export interface ContractCallParams {
  contractAddress: string;
  methodName: string;
  args: any[];
  encryptedArgs?: EncryptedValue[];
}

export interface FHENetworkConfig {
  chainId: number;
  rpcUrl: string;
  contractAddress?: string;
}

export interface FHEClientState {
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  network?: FHENetworkConfig;
}

export interface EncryptionOptions {
  type?: EncryptedType;
  padding?: boolean;
  batch?: boolean;
}

export interface DecryptionOptions {
  batch?: boolean;
  timeout?: number;
}
