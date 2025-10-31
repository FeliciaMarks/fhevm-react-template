export function validateEncryptionType(type: string): boolean {
  return ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'].includes(type);
}

export function validateValueForType(value: any, type: string): boolean {
  switch (type) {
    case 'uint8':
      return Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 255;
    case 'uint16':
      return Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 65535;
    case 'uint32':
      return Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 4294967295;
    case 'uint64':
      try {
        const bigIntValue = BigInt(value);
        return bigIntValue >= 0n && bigIntValue <= 18446744073709551615n;
      } catch {
        return false;
      }
    case 'bool':
      return typeof value === 'boolean' || value === 'true' || value === 'false' || value === 0 || value === 1;
    case 'address':
      return /^0x[a-fA-F0-9]{40}$/.test(String(value));
    default:
      return false;
  }
}

export function getTypeRange(type: string): { min: bigint; max: bigint } | null {
  switch (type) {
    case 'uint8':
      return { min: 0n, max: 255n };
    case 'uint16':
      return { min: 0n, max: 65535n };
    case 'uint32':
      return { min: 0n, max: 4294967295n };
    case 'uint64':
      return { min: 0n, max: 18446744073709551615n };
    default:
      return null;
  }
}

export function formatEncryptedData(data: Uint8Array, maxLength: number = 40): string {
  const hex = Buffer.from(data).toString('hex');
  if (hex.length <= maxLength) return `0x${hex}`;
  return `0x${hex.substring(0, maxLength)}...`;
}

export function validateContractAddress(address: string): {
  valid: boolean;
  error?: string;
} {
  if (!address) {
    return { valid: false, error: 'Address is required' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid address format' };
  }

  if (address === '0x0000000000000000000000000000000000000000') {
    return { valid: false, error: 'Cannot use zero address' };
  }

  return { valid: true };
}

export function validateChainId(chainId: number): boolean {
  return Number.isInteger(chainId) && chainId > 0;
}

export function validateRpcUrl(url: string): {
  valid: boolean;
  error?: string;
} {
  if (!url) {
    return { valid: false, error: 'RPC URL is required' };
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:', 'ws:', 'wss:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'Invalid protocol' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}
