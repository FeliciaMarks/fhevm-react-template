import { Contract, ContractInterface, Signer } from 'ethers';
import { FhevmClient } from './FhevmClient';

export interface ContractConfig {
  address: string;
  abi: ContractInterface;
}

/**
 * Helper class for interacting with FHEVM contracts
 *
 * @example
 * ```typescript
 * const helper = new ContractHelper(fhevmClient, {
 *   address: '0x...',
 *   abi: contractABI
 * });
 *
 * const tx = await helper.callWithEncryption(
 *   'submitRating',
 *   [encryptedRating, restaurantId]
 * );
 * ```
 */
export class ContractHelper {
  private fhevmClient: FhevmClient;
  private contract: Contract;
  private config: ContractConfig;

  constructor(fhevmClient: FhevmClient, config: ContractConfig) {
    this.fhevmClient = fhevmClient;
    this.config = config;

    const signer = fhevmClient.getSigner();
    if (!signer) {
      throw new Error('Signer not available in FhevmClient');
    }

    this.contract = new Contract(config.address, config.abi, signer);
  }

  /**
   * Call a contract method
   */
  async call(methodName: string, params: any[] = []): Promise<any> {
    return await this.contract[methodName](...params);
  }

  /**
   * Call a contract method and wait for transaction
   */
  async callAndWait(methodName: string, params: any[] = []): Promise<any> {
    const tx = await this.contract[methodName](...params);
    return await tx.wait();
  }

  /**
   * Read from contract (view/pure functions)
   */
  async read(methodName: string, params: any[] = []): Promise<any> {
    return await this.contract[methodName](...params);
  }

  /**
   * Get the contract instance
   */
  getContract(): Contract {
    return this.contract;
  }

  /**
   * Get the contract address
   */
  getAddress(): string {
    return this.config.address;
  }

  /**
   * Request decryption of a value from this contract
   */
  async decrypt(handle: string): Promise<bigint> {
    return await this.fhevmClient.requestDecrypt(
      this.config.address,
      handle
    );
  }

  /**
   * Batch decrypt multiple values from this contract
   */
  async batchDecrypt(handles: string[]): Promise<bigint[]> {
    const requests = handles.map(handle => ({
      contractAddress: this.config.address,
      handle,
    }));
    return await this.fhevmClient.batchDecrypt(requests);
  }

  /**
   * Update the contract signer
   */
  updateSigner(signer: Signer): void {
    this.contract = new Contract(this.config.address, this.config.abi, signer);
  }
}
