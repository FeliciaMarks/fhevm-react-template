# Security Best Practices

Essential security guidelines for building with the FHEVM SDK.

## Overview

While FHE provides powerful encryption capabilities, proper implementation is crucial for maintaining security. This guide covers best practices for building secure confidential dApps.

---

## Client-Side Security

### 1. Key Management

**Private Keys Never Leave the Wallet**

```typescript
// ✅ Good: Keys managed by wallet
const client = new FhevmClient({
  network: config,
  provider,
  signer, // Wallet manages keys
});

// ❌ Bad: Never export or transmit private keys
// NEVER DO THIS
const privateKey = wallet.privateKey; // Don't access directly
```

**Best Practices:**
- Always use wallet signers (MetaMask, WalletConnect, etc.)
- Never log, store, or transmit private keys
- Use EIP-712 for all signature requests
- Implement proper session management

### 2. Encryption Validation

**Always Validate Before Sending**

```typescript
// ✅ Good: Validate encryption succeeded
try {
  const encrypted = client.encrypt32(value);
  if (!encrypted || encrypted.length === 0) {
    throw new Error('Encryption failed');
  }
  await contract.submitValue(encrypted);
} catch (error) {
  console.error('Encryption error:', error);
  // Handle error appropriately
}

// ❌ Bad: No validation
const encrypted = client.encrypt32(value);
await contract.submitValue(encrypted); // Might fail silently
```

### 3. Input Sanitization

**Sanitize All User Inputs**

```typescript
import { validateValueForType } from '@fhevm/sdk';

function handleEncrypt(userInput: string, type: string) {
  // ✅ Good: Validate before encrypting
  const value = Number(userInput);

  if (!validateValueForType(value, type)) {
    throw new Error(`Invalid value for type ${type}`);
  }

  return client.encrypt32(value);
}

// ❌ Bad: Trust user input directly
function badEncrypt(userInput: any) {
  return client.encrypt32(userInput); // No validation!
}
```

---

## Smart Contract Security

### 1. Access Control

**Implement Proper Permissions**

```solidity
// ✅ Good: Restrict decryption access
mapping(address => mapping(bytes32 => bool)) public canDecrypt;

function requestDecryption(bytes32 dataId) external {
    require(canDecrypt[msg.sender][dataId], "Unauthorized");
    // Proceed with decryption
}

// ❌ Bad: Anyone can decrypt
function badDecrypt(bytes32 dataId) external returns (uint32) {
    return TFHE.decrypt(encryptedData[dataId]); // No access control!
}
```

### 2. Re-encryption Best Practices

```solidity
// ✅ Good: Track re-encryption requests
mapping(bytes32 => uint256) public reencryptionCount;
uint256 public constant MAX_REENCRYPTIONS = 10;

function reencrypt(bytes32 dataId) external {
    require(reencryptionCount[dataId] < MAX_REENCRYPTIONS, "Limit reached");
    reencryptionCount[dataId]++;
    // Proceed
}
```

### 3. Prevent Timing Attacks

```solidity
// ✅ Good: Constant-time comparisons
function compareEncrypted(euint32 a, euint32 b) public returns (ebool) {
    return TFHE.eq(a, b); // Constant-time on encrypted values
}

// ❌ Bad: Timing-based comparison
function badCompare(uint32 a, uint32 b) public returns (bool) {
    return a == b; // Timing reveals information
}
```

---

## Network Security

### 1. HTTPS/WSS Only

```typescript
// ✅ Good: Secure connections
const config = {
  network: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/KEY', // HTTPS
  },
};

// ❌ Bad: Insecure connection
const badConfig = {
  network: {
    rpcUrl: 'http://insecure-rpc.com', // HTTP - vulnerable to MITM
  },
};
```

### 2. Verify Network

```typescript
// ✅ Good: Always verify chain ID
const provider = new BrowserProvider(window.ethereum);
const network = await provider.getNetwork();

if (network.chainId !== expectedChainId) {
  throw new Error('Wrong network');
}

// Initialize FHEVM client
```

---

## Data Handling

### 1. Minimize Plaintext Exposure

```typescript
// ✅ Good: Encrypt immediately
function handleSensitiveData(data: number) {
  const encrypted = client.encrypt32(data);
  // Clear plaintext from memory
  data = 0;
  return encrypted;
}

// ❌ Bad: Keep plaintext around
let sensitiveData = 42;
const encrypted = client.encrypt32(sensitiveData);
// sensitiveData still in memory!
```

### 2. Secure Decryption

```typescript
// ✅ Good: Decrypt only when necessary
async function processData(handle: string) {
  // Only decrypt if user authorized
  if (!userAuthorized) {
    throw new Error('Not authorized');
  }

  const decrypted = await client.requestDecrypt(address, handle);

  // Use decrypted value
  const result = processValue(decrypted);

  // Clear from memory
  decrypted = 0n;

  return result;
}
```

### 3. Avoid Logging Sensitive Data

```typescript
// ✅ Good: Log only metadata
console.log('Encrypted value submitted', {
  timestamp: Date.now(),
  type: 'uint32',
  // Don't log the encrypted data itself
});

// ❌ Bad: Log sensitive information
console.log('Encrypted:', encrypted); // Leaks information
console.log('Decrypted:', decrypted); // NEVER log decrypted values!
```

---

## Frontend Security

### 1. Content Security Policy

```html
<!-- ✅ Good: Strict CSP -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               connect-src 'self' https://sepolia.infura.io;">
```

### 2. Secure State Management

```typescript
// ✅ Good: Never store sensitive data in state
function MyComponent() {
  // Store only encrypted values
  const [encrypted, setEncrypted] = useState<Uint8Array | null>(null);

  // Don't store plaintext
  // const [plaintext, setPlaintext] = useState(0); // ❌
}
```

### 3. XSS Prevention

```typescript
// ✅ Good: Sanitize all inputs
import DOMPurify from 'dompurify';

function DisplayUserData({ data }: { data: string }) {
  const clean = DOMPurify.sanitize(data);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

---

## Common Vulnerabilities

### 1. Replay Attacks

**Prevention:**

```solidity
// ✅ Good: Use nonces
mapping(address => uint256) public nonces;

function submitEncrypted(euint32 value, uint256 nonce) external {
    require(nonce == nonces[msg.sender] + 1, "Invalid nonce");
    nonces[msg.sender] = nonce;
    // Process value
}
```

### 2. Front-Running

**Prevention:**

```solidity
// ✅ Good: Use commit-reveal pattern
mapping(bytes32 => uint256) public commits;

function commit(bytes32 hash) external {
    commits[hash] = block.timestamp;
}

function reveal(euint32 value, bytes32 salt) external {
    bytes32 hash = keccak256(abi.encode(value, salt));
    require(commits[hash] > 0, "Not committed");
    require(block.timestamp > commits[hash] + 10, "Too early");
    // Process value
}
```

### 3. Side-Channel Attacks

**Prevention:**

```typescript
// ✅ Good: Constant-time operations
function secureCompare(a: bigint, b: bigint): boolean {
  // Use FHE comparison on-chain
  return await contract.compareEncrypted(a, b);
}

// ❌ Bad: Timing-based comparison
function insecureCompare(a: bigint, b: bigint): boolean {
  return a === b; // Timing leaks information
}
```

---

## Audit Checklist

Before deploying:

- [ ] All sensitive data encrypted before transmission
- [ ] Private keys never exposed or transmitted
- [ ] Input validation on all user inputs
- [ ] Access control on all decryption functions
- [ ] HTTPS/WSS for all network connections
- [ ] No sensitive data in logs or error messages
- [ ] CSP headers configured
- [ ] Rate limiting on decryption requests
- [ ] Nonce/timestamp to prevent replay attacks
- [ ] Smart contracts audited by security professionals

---

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Smart Contract Security](https://consensys.github.io/smart-contract-best-practices/)
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)
- [Zama FHEVM Security](https://docs.zama.ai/fhevm)

---

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email security reports to: security@your-domain.com
3. Include detailed reproduction steps
4. Allow time for patch before disclosure

---

## Regular Updates

Keep dependencies updated:

```bash
npm update @fhevm/sdk
npm audit fix
```

Monitor for security advisories:
- Subscribe to GitHub security alerts
- Follow Zama security announcements
- Review dependency vulnerabilities regularly

---

**Remember: Security is an ongoing process, not a one-time task. Stay vigilant and keep learning!**
