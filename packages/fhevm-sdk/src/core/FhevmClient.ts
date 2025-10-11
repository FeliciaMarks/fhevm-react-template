import { createInstance, FhevmInstance, Keypair } from 'fhevmjs';
import { BrowserProvider, JsonRpcProvider, Signer } from 'ethers';

export interface FhevmConfig {
  network: {
    chainId: number;
    rpcUrl: string;
    gatewayUrl?: string;
    aclAddress?: string;
  };
  kmsVerifierAddress?: string;
}

export interface EncryptionResult {
  data: Uint8Array;
  handles: string[];
}

export interface DecryptionRequest {
  contractAddress: string;
  handle: string;
}

/**
 * Core FHEVM Client - Framework agnostic encryption/decryption utilities
 *
 * @example
 * ```typescript
 * const client = new FhevmClient({
 *   network: {
 *     chainId: 11155111,
 *     rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
 *   }
 * });
 *
 * await client.init();
 * const encrypted = await client.encrypt8(42);
 * ```
 */
export class FhevmClient {
  private instance: FhevmInstance | null = null;
  private config: FhevmConfig;
  private provider: JsonRpcProvider | BrowserProvider | null = null;
  private signer: Signer | null = null;
  private keypair: Keypair | null = null;

  constructor(config: FhevmConfig) {
    this.config = config;
  }

  /**
   * Initialize the FHEVM client with provider and signer
   */
  async init(provider?: JsonRpcProvider | BrowserProvider, signer?: Signer): Promise<void> {
    if (provider) {
      this.provider = provider;
    } else {
      this.provider = new JsonRpcProvider(this.config.network.rpcUrl);
    }

    if (signer) {
      this.signer = signer;
    }

    // Create FHEVM instance
    this.instance = await createInstance({
      chainId: this.config.network.chainId,
      publicKey: await this.getPublicKey(),
      gatewayUrl: this.config.network.gatewayUrl,
      aclAddress: this.config.network.aclAddress,
      kmsVerifierAddress: this.config.kmsVerifierAddress,
    });

    // Generate keypair for decryption
    if (this.signer) {
      const signerAddress = await this.signer.getAddress();
      this.keypair = this.instance.generateKeypair();
    }
  }

  /**
   * Get the public encryption key from the network
   */
  private async getPublicKey(): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    // In production, this would fetch from the ACL contract
    // For now, return a placeholder that createInstance will handle
    return '';
  }

  /**
   * Check if the client is initialized
   */
  isInitialized(): boolean {
    return this.instance !== null;
  }

  /**
   * Get the FHEVM instance
   */
  getInstance(): FhevmInstance {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized. Call init() first.');
    }
    return this.instance;
  }

  /**
   * Encrypt an 8-bit unsigned integer
   */
  encrypt8(value: number | bigint): Uint8Array {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }
    return this.instance.encrypt8(value);
  }

  /**
   * Encrypt a 16-bit unsigned integer
   */
  encrypt16(value: number | bigint): Uint8Array {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }
    return this.instance.encrypt16(value);
  }

  /**
   * Encrypt a 32-bit unsigned integer
   */
  encrypt32(value: number | bigint): Uint8Array {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }
    return this.instance.encrypt32(value);
  }

  /**
   * Encrypt a 64-bit unsigned integer
   */
  encrypt64(value: number | bigint): Uint8Array {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }
    return this.instance.encrypt64(value);
  }

  /**
   * Encrypt a boolean value
   */
  encryptBool(value: boolean): Uint8Array {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }
    return this.instance.encrypt8(value ? 1 : 0);
  }

  /**
   * Encrypt an address
   */
  encryptAddress(address: string): Uint8Array {
    if (!this.instance) {
      throw new Error('FHEVM client not initialized');
    }
    // Convert address to bigint
    const addressBigInt = BigInt(address);
    return this.instance.encrypt64(addressBigInt);
  }

  /**
   * Request decryption of an encrypted value using EIP-712 signature
   */
  async requestDecrypt(
    contractAddress: string,
    handle: string
  ): Promise<bigint> {
    if (!this.instance || !this.signer) {
      throw new Error('FHEVM client not fully initialized');
    }

    const signerAddress = await this.signer.getAddress();

    // Create EIP-712 message for decryption request
    const eip712Message = this.instance.createEIP712(
      handle,
      contractAddress
    );

    // Sign the message
    const signature = await this.signer.signTypedData(
      eip712Message.domain,
      { Reencrypt: eip712Message.types.Reencrypt },
      eip712Message.message
    );

    // Request decryption from gateway
    const decryptedValue = await this.instance.reencrypt(
      handle,
      contractAddress,
      signerAddress,
      signature
    );

    return decryptedValue;
  }

  /**
   * Batch decrypt multiple values
   */
  async batchDecrypt(
    requests: DecryptionRequest[]
  ): Promise<bigint[]> {
    const results: bigint[] = [];

    for (const request of requests) {
      const decrypted = await this.requestDecrypt(
        request.contractAddress,
        request.handle
      );
      results.push(decrypted);
    }

    return results;
  }

  /**
   * Get the user's keypair for decryption
   */
  getKeypair(): Keypair | null {
    return this.keypair;
  }

  /**
   * Set a custom signer
   */
  setSigner(signer: Signer): void {
    this.signer = signer;
  }

  /**
   * Get the current signer
   */
  getSigner(): Signer | null {
    return this.signer;
  }

  /**
   * Get the provider
   */
  getProvider(): JsonRpcProvider | BrowserProvider | null {
    return this.provider;
  }
}
