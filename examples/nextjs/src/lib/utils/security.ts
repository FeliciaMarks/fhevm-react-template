export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateNumericInput(input: string, max?: number): boolean {
  const num = Number(input);
  if (isNaN(num) || num < 0) return false;
  if (max !== undefined && num > max) return false;
  return true;
}

export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars * 2) return data;
  return `${data.substring(0, visibleChars)}...${data.substring(data.length - visibleChars)}`;
}

export const SECURITY_WARNINGS = {
  privateKey: 'Never share your private key or seed phrase',
  encryption: 'Always verify encryption before submitting to blockchain',
  decryption: 'Decryption requires wallet signature - verify the request',
  network: 'Ensure you are connected to the correct network',
};

export function checkBrowserSecurity(): {
  isSecure: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (typeof window === 'undefined') {
    return { isSecure: true, warnings: ['Running in server environment'] };
  }

  if (!window.crypto || !window.crypto.subtle) {
    warnings.push('Web Crypto API not available');
  }

  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    warnings.push('Not using HTTPS');
  }

  return {
    isSecure: warnings.length === 0,
    warnings,
  };
}
