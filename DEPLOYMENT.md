# Deployment Guide

Complete guide for deploying the FHEVM Universal SDK and examples.

## 📋 Prerequisites

- Node.js 18+ installed
- Wallet with Sepolia testnet ETH
- Infura or Alchemy API key
- Etherscan API key (for verification)

## 🔐 Environment Setup

### 1. Create Environment File

```bash
cp .env.example .env
```

### 2. Configure Variables

Edit `.env`:

```env
# Network
CHAIN_ID=11155111
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Deployment Account
PRIVATE_KEY=your_private_key_here_without_0x_prefix

# Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# FHEVM Configuration (optional, uses defaults if not set)
GATEWAY_URL=https://gateway.zama.ai
ACL_ADDRESS=0x...
KMS_VERIFIER_ADDRESS=0x...
```

**⚠️ Security Warning:**
- Never commit `.env` to git
- Use a separate deployment wallet
- Keep private keys secure

## 🏗️ Smart Contract Deployment

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Compile Contracts

```bash
npm run compile
```

This will:
- Compile Solidity contracts
- Generate TypeScript types
- Create ABI files in `artifacts/`

### Step 3: Deploy to Sepolia

```bash
npm run deploy
```

**Expected Output:**
```
Deploying PrivateRestaurantRating...
Contract deployed to: 0x1234567890123456789012345678901234567890
Transaction hash: 0xabcdef...
```

### Step 4: Verify on Etherscan

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Step 5: Save Contract Address

Copy the deployed contract address and update:

**For Next.js Example:**
```bash
cd examples/nextjs
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

**For Restaurant Rating Example:**
```bash
cd examples/restaurant-rating
cp .env.example .env.local
```

Edit with same values as above.

## 🚀 Frontend Deployment

### Next.js Example on Vercel

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

#### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** `examples/nextjs`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

#### 3. Add Environment Variables

In Vercel dashboard, add:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

#### 4. Deploy

Click "Deploy" and wait for build to complete.

### Alternative: Netlify

```bash
cd examples/nextjs
npm run build
```

Upload the `.next` directory to Netlify.

### Alternative: IPFS (Decentralized)

```bash
cd examples/nextjs
npm run build
npx ipfs-deploy .next
```

## 📦 NPM Package Publishing (Optional)

To publish the SDK to NPM:

### 1. Update Package Info

Edit `packages/fhevm-sdk/package.json`:
```json
{
  "name": "@your-org/fhevm-sdk",
  "version": "1.0.0",
  "repository": "https://github.com/your-org/fhevm-sdk"
}
```

### 2. Build Package

```bash
cd packages/fhevm-sdk
npm run build
```

### 3. Publish

```bash
npm login
npm publish --access public
```

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Smart contract deployed and verified on Etherscan
- [ ] Contract address updated in all `.env.local` files
- [ ] Frontend builds without errors
- [ ] Wallet connection works
- [ ] Encryption functionality works
- [ ] Contract interactions successful
- [ ] Decryption with EIP-712 signature works

## 📊 Post-Deployment Testing

### 1. Test Smart Contract

```bash
npx hardhat test --network sepolia
```

### 2. Test Frontend

Visit your deployed URL and:
1. Connect MetaMask
2. Switch to Sepolia network
3. Try encrypting a value
4. Submit to contract
5. Verify transaction on Etherscan

### 3. Monitor Gas Usage

```bash
npx hardhat run scripts/gas-report.js --network sepolia
```

## 🐛 Troubleshooting

### Contract Deployment Fails

**Error: Insufficient funds**
- Get Sepolia ETH from faucet: https://sepoliafaucet.com/

**Error: Nonce too low**
```bash
npx hardhat clean
rm -rf cache artifacts
npm run compile
```

**Error: Contract already deployed**
- Use a different deployer address or
- Delete and redeploy

### Frontend Build Fails

**Webpack errors**
Check `next.config.js` has proper fallbacks:
```javascript
webpack: (config) => {
  config.resolve.fallback = {
    fs: false,
    net: false,
    tls: false,
  };
  return config;
}
```

**Environment variables not found**
- Ensure `.env.local` exists
- Variables must start with `NEXT_PUBLIC_`
- Restart dev server after adding variables

### Connection Issues

**MetaMask not connecting**
- Clear browser cache
- Reset MetaMask account
- Try different browser

**Wrong network**
- Add Sepolia network to MetaMask
- Switch to Sepolia manually

## 📈 Production Considerations

### Security

- [ ] Audit smart contracts before mainnet
- [ ] Use hardware wallet for production deployments
- [ ] Enable rate limiting on frontend
- [ ] Implement proper access controls

### Performance

- [ ] Enable caching for static assets
- [ ] Use CDN for frontend
- [ ] Optimize bundle size
- [ ] Lazy load components

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Monitor contract events
- [ ] Track gas usage
- [ ] Set up uptime monitoring

## 🔗 Deployment URLs

After deployment, update README.md with:

- **Smart Contract:** https://sepolia.etherscan.io/address/0x...
- **Frontend (Next.js):** https://your-app.vercel.app
- **Frontend (Restaurant):** https://restaurant-rating.vercel.app

## 📞 Support

For deployment issues:
- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review [Example Deployments](./examples/)
- Consult [Zama Documentation](https://docs.zama.ai/fhevm)

---

**Ready for Production? 🚀**
