import { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider, Signer } from 'ethers';

export interface FHEClientConfig {
  network: {
    chainId: number;
    rpcUrl: string;
  };
  provider?: BrowserProvider;
  signer?: Signer;
}

export async function createFHEClient(config: FHEClientConfig): Promise<FhevmClient> {
  const client = new FhevmClient(config);
  await client.init();
  return client;
}

export async function encryptValue(
  client: FhevmClient,
  value: number | bigint | boolean,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' = 'uint32'
): Promise<Uint8Array> {
  switch (type) {
    case 'uint8':
      return client.encrypt8(Number(value));
    case 'uint16':
      return client.encrypt16(Number(value));
    case 'uint32':
      return client.encrypt32(Number(value));
    case 'uint64':
      return client.encrypt64(BigInt(value));
    case 'bool':
      return client.encryptBool(Boolean(value));
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

export async function decryptValue(
  client: FhevmClient,
  contractAddress: string,
  handle: string
): Promise<bigint> {
  return await client.requestDecrypt(contractAddress, handle);
}

export async function batchDecrypt(
  client: FhevmClient,
  requests: Array<{ contractAddress: string; handle: string }>
): Promise<bigint[]> {
  return await client.batchDecrypt(requests);
}
