import { FhevmClient } from '@fhevm/sdk';

export interface ServerFHEConfig {
  chainId: number;
  rpcUrl: string;
}

export async function initializeServerFHE(config: ServerFHEConfig): Promise<FhevmClient> {
  const client = new FhevmClient({
    network: config,
  });

  await client.init();
  return client;
}

export async function serverEncrypt(
  client: FhevmClient,
  value: number | bigint,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64'
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
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

export function validateEncryptedData(data: Uint8Array): boolean {
  return data && data.length > 0;
}

export function serializeEncryptedData(data: Uint8Array): string {
  return Buffer.from(data).toString('hex');
}

export function deserializeEncryptedData(hex: string): Uint8Array {
  return new Uint8Array(Buffer.from(hex, 'hex'));
}
