export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptAPIRequest {
  value: number | bigint | boolean | string;
  type?: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
}

export interface EncryptAPIResponse {
  success: boolean;
  encrypted?: Uint8Array | string;
  type?: string;
  originalValue?: any;
  error?: string;
}

export interface DecryptAPIRequest {
  contractAddress: string;
  handle: string;
  signature?: string;
}

export interface DecryptAPIResponse {
  success: boolean;
  value?: bigint | number;
  contractAddress?: string;
  handle?: string;
  error?: string;
  message?: string;
}

export interface ComputeAPIRequest {
  operation: string;
  operands: any[];
}

export interface ComputeAPIResponse {
  success: boolean;
  result?: any;
  operation?: string;
  operandsCount?: number;
  hint?: string;
  error?: string;
  message?: string;
}

export interface KeyManagementAPIResponse {
  success: boolean;
  message?: string;
  info?: {
    publicKey?: string;
    privateKey?: string;
  };
  error?: string;
}

export interface FHEOperationRequest {
  operation: string;
  value?: any;
  type?: string;
}

export interface FHEOperationResponse {
  success: boolean;
  data?: any;
  error?: string;
}
