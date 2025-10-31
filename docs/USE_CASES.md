# FHEVM SDK Use Cases

Real-world applications and examples of building confidential dApps.

## Overview

The FHEVM SDK enables privacy-preserving applications across various industries. This document showcases practical use cases and implementation patterns.

---

## 1. Private Financial Transactions

### Banking and Payments

**Problem:** Traditional blockchain transactions expose all financial data publicly.

**Solution:** Encrypt account balances and transaction amounts.

```typescript
import { FhevmClient } from '@fhevm/sdk';

// Encrypt account balance
const balance = 1000000; // $1M
const encryptedBalance = client.encrypt64(BigInt(balance));

// Private transfer
const transferAmount = 50000; // $50k
const encryptedAmount = client.encrypt64(BigInt(transferAmount));

await bankContract.transfer(recipientAddress, encryptedAmount);
```

**Benefits:**
- Account balances remain confidential
- Transaction amounts are private
- Regulatory compliance with auditability
- Prevents front-running attacks

### DeFi Privacy

```typescript
// Private lending
const collateralAmount = 100000;
const encryptedCollateral = client.encrypt64(BigInt(collateralAmount));

await lendingContract.depositCollateral(encryptedCollateral);

// Private yield farming
const stakingAmount = 50000;
const encryptedStake = client.encrypt64(BigInt(stakingAmount));

await yieldContract.stake(encryptedStake);
```

---

## 2. Healthcare and Medical Records

### Patient Data Privacy

**Problem:** Sensitive health data needs to be on-chain but must remain confidential.

**Solution:** Encrypt medical records and vitals.

```typescript
// Encrypt vital signs
const bloodPressure = 120;
const heartRate = 75;
const glucoseLevel = 95;

const encryptedBP = client.encrypt16(bloodPressure);
const encryptedHR = client.encrypt8(heartRate);
const encryptedGlucose = client.encrypt16(glucoseLevel);

await medicalContract.recordVitals(
  patientId,
  encryptedBP,
  encryptedHR,
  encryptedGlucose
);
```

**Benefits:**
- HIPAA compliance
- Patient privacy protection
- Secure data sharing between providers
- Privacy-preserving medical research

### Clinical Trials

```typescript
// Encrypt patient outcomes
const treatmentResponse = 8; // Scale 1-10
const encryptedResponse = client.encrypt8(treatmentResponse);

await trialContract.submitOutcome(trialId, encryptedResponse);

// Aggregate encrypted results without revealing individual data
const aggregateResult = await trialContract.getAggregateResults(trialId);
```

---

## 3. Voting and Governance

### Secret Ballot Voting

**Problem:** Public votes can be influenced or coerced.

**Solution:** Encrypt votes during voting period.

```typescript
// Cast encrypted vote
const vote = true; // Yes/No
const encryptedVote = client.encryptBool(vote);

await votingContract.castVote(proposalId, encryptedVote);

// Results revealed only after voting ends
const result = await votingContract.tallyVotes(proposalId);
```

**Use Cases:**
- DAO governance
- Corporate shareholder voting
- Political elections
- Community polls

### Weighted Voting

```typescript
// Vote with encrypted weight (token holdings)
const votingPower = 1000;
const encryptedPower = client.encrypt32(votingPower);

await governanceContract.voteWithWeight(
  proposalId,
  encryptedVote,
  encryptedPower
);
```

---

## 4. Gaming and NFTs

### Private Game State

**Problem:** Game strategy can be copied if all moves are public.

**Solution:** Encrypt game moves and reveal strategically.

```typescript
// Poker example
const cardValue = 13; // King
const encryptedCard = client.encrypt8(cardValue);

await pokerContract.playCard(gameId, encryptedCard);

// Reveal at end of round
const revealed = await client.requestDecrypt(
  pokerContract.address,
  cardHandle
);
```

### Blind Auctions

```typescript
// Submit sealed bid
const bidAmount = 5000;
const encryptedBid = client.encrypt64(BigInt(bidAmount));

await auctionContract.submitBid(auctionId, encryptedBid);

// Bids revealed after auction closes
```

---

## 5. Supply Chain Privacy

### Confidential Pricing

**Problem:** Competitors can see supplier pricing.

**Solution:** Encrypt prices and quantities.

```typescript
// Encrypt order details
const quantity = 1000;
const pricePerUnit = 50;

const encryptedQty = client.encrypt32(quantity);
const encryptedPrice = client.encrypt32(pricePerUnit);

await supplyChainContract.createOrder(
  supplierId,
  encryptedQty,
  encryptedPrice
);
```

### Private Inventory

```typescript
// Track inventory without revealing stock levels
const stockLevel = 5000;
const encryptedStock = client.encrypt32(stockLevel);

await inventoryContract.updateStock(productId, encryptedStock);

// Only authorized parties can decrypt
```

---

## 6. Privacy-Preserving Analytics

### Encrypted Data Aggregation

```typescript
// Submit encrypted metrics
const userEngagement = 85; // percentage
const encryptedMetric = client.encrypt8(userEngagement);

await analyticsContract.submitMetric(userId, encryptedMetric);

// Compute statistics on encrypted data
const avgEngagement = await analyticsContract.getAverage();
```

### A/B Testing

```typescript
// Record encrypted conversion rates
const conversionRate = 12; // 12%
const encryptedRate = client.encrypt8(conversionRate);

await abTestContract.recordConversion(
  experimentId,
  variantId,
  encryptedRate
);
```

---

## 7. Real Estate and Property

### Private Property Valuations

```typescript
// Encrypt property price
const propertyValue = 500000;
const encryptedValue = client.encrypt64(BigInt(propertyValue));

await realEstateContract.listProperty(
  propertyId,
  encryptedValue
);
```

### Confidential Offers

```typescript
// Submit private offer
const offerAmount = 480000;
const encryptedOffer = client.encrypt64(BigInt(offerAmount));

await realEstateContract.makeOffer(
  propertyId,
  encryptedOffer
);

// Only property owner can decrypt offers
```

---

## 8. Identity and Credentials

### Private Age Verification

```typescript
// Verify age without revealing exact birthdate
const age = 25;
const encryptedAge = client.encrypt8(age);

const isAdult = await verificationContract.checkMinimumAge(
  encryptedAge,
  18 // minimum age
);
```

### Confidential Credit Scores

```typescript
// Store encrypted credit score
const creditScore = 750;
const encryptedScore = client.encrypt16(creditScore);

await creditContract.updateScore(userId, encryptedScore);

// Lender verifies score meets threshold without seeing exact value
```

---

## Implementation Patterns

### Pattern 1: Encrypt-Store-Decrypt

```typescript
// 1. Encrypt on client
const encrypted = client.encrypt32(value);

// 2. Store on-chain
await contract.storeValue(encrypted);

// 3. Decrypt when needed
const handle = await contract.getValue();
const decrypted = await client.requestDecrypt(contract.address, handle);
```

### Pattern 2: Compute on Encrypted Data

```typescript
// Submit encrypted inputs
const a = client.encrypt32(10);
const b = client.encrypt32(20);

// Contract computes on encrypted values
await contract.addEncrypted(a, b); // Returns encrypted result

// Decrypt result
const result = await client.requestDecrypt(contract.address, resultHandle);
```

### Pattern 3: Threshold Decryption

```solidity
// Multiple parties must approve decryption
function requestDecryption(bytes32 dataId) external {
    require(approvals[dataId] >= threshold, "Need more approvals");
    // Allow decryption
}
```

---

## Best Practices

1. **Minimize Decryption**: Only decrypt when absolutely necessary
2. **Batch Operations**: Use `batchDecrypt` for multiple values
3. **Access Control**: Implement proper permissions for decryption
4. **Type Selection**: Use smallest type that fits your data
5. **Error Handling**: Always handle encryption/decryption failures

---

## Next Steps

- Review [API Documentation](./API.md)
- Explore [Code Examples](../examples/)
- Read [Security Best Practices](./SECURITY.md)

For complete working examples, see:
- [Banking Example](../examples/nextjs/src/components/examples/BankingExample.tsx)
- [Medical Example](../examples/nextjs/src/components/examples/MedicalExample.tsx)
