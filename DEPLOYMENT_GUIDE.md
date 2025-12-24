# Deployment Guide - Base Crowdfunding Platform

Complete step-by-step guide to deploy your crowdfunding platform to Base mainnet and Vercel.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] GitHub account
- [ ] Vercel account (free tier is fine)
- [ ] Wallet with Base ETH (~0.01 ETH for deployment + testing)
- [ ] WalletConnect Project ID
- [ ] Etherscan API Key (optional but recommended for verification)

> **💡 Pro Tip**: Etherscan API V2 now works for Basescan and 60+ EVM chains with a single free API key!
> Get yours at: https://docs.etherscan.io/getting-an-api-key

## Part 1: Smart Contract Deployment

### Step 1: Get Base ETH

1. **Option A: Bridge from Ethereum**
   - Go to [Base Bridge](https://bridge.base.org/)
   - Connect your wallet
   - Bridge ETH from Ethereum mainnet to Base

2. **Option B: Buy on Exchange**
   - Use Coinbase or other exchanges that support Base
   - Withdraw directly to Base network

### Step 2: Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Get your wallet private key:
   - **MetaMask**: Settings → Security & Privacy → Reveal Private Key
   - **Important**: NEVER share this key or commit it to git!

3. Edit `.env` file:
```env
PRIVATE_KEY=your_actual_private_key_here_without_0x_prefix
BASE_MAINNET_RPC=https://mainnet.base.org
```

### Step 3: Get Etherscan API Key (Optional but Recommended)

**Important**: Etherscan API V2 now works for Basescan and 60+ EVM chains with a single API key!

1. Go to [Etherscan](https://etherscan.io/) (yes, etherscan.io, not basescan.org)
2. Sign up for a free account
3. Go to API Keys section → Create new API key
4. This single key works for:
   - Base Mainnet (Basescan)
   - Base Sepolia
   - Ethereum
   - Optimism, Arbitrum, Polygon, and 60+ more chains
5. Add to `.env`:
```env
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Learn more: https://docs.etherscan.io/getting-an-api-key

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Compile Contract

```bash
npm run compile
```

You should see:
```
Compiled 1 Solidity file successfully
```

### Step 6: Test on Testnet (Recommended)

1. Get Base Sepolia testnet ETH from [faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

2. Deploy to testnet:
```bash
npm run deploy:testnet
```

3. Test the contract on testnet before mainnet deployment

### Step 7: Deploy to Base Mainnet

```bash
npm run deploy
```

**Expected output:**
```
🚀 Starting deployment to base
=====================================
📝 Deploying contracts with account: 0x...
💰 Account balance: 0.05 ETH
=====================================
📦 Deploying CrowdfundingPlatform...
✅ CrowdfundingPlatform deployed to: 0xYourContractAddress
=====================================
📄 Deployment info saved to: base-1234567890.json
✅ Updated .env.local with contract address
=====================================
⏳ Waiting for 5 block confirmations...
✅ Confirmations completed
=====================================
🔍 Verifying contract on Basescan...
✅ Contract verified successfully
=====================================
```

### Step 8: Save Contract Address

The deployment script automatically saves the contract address to `.env.local`.

**Important**: Copy this address - you'll need it for Vercel deployment!

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

### Step 9: Verify Contract (if not auto-verified)

If automatic verification failed:

```bash
npx hardhat verify --network base 0xYourContractAddress
```

## Part 2: WalletConnect Setup

### Step 1: Create WalletConnect Project

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Click "Create New Project"
4. Enter project details:
   - Name: "Base Crowdfunding"
   - Description: Your app description
5. Copy the **Project ID**

### Step 2: Add to Environment

Add to `.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## Part 3: Frontend Deployment to Vercel

### Step 1: Prepare GitHub Repository

1. Initialize git (if not already):
```bash
git init
git add .
git commit -m "Initial commit: Base crowdfunding platform"
```

2. Create repository on GitHub:
   - Go to [GitHub](https://github.com/)
   - Click "New Repository"
   - Name: "base-crowdfunding"
   - Make it public or private
   - Don't initialize with README (we already have one)

3. Push to GitHub:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/base-crowdfunding.git
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Website (Recommended for Beginners)

1. Go to [Vercel](https://vercel.com/)
2. Sign up or log in (use GitHub account for easy integration)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

6. Add Environment Variables:
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS = 0xYourContractAddress
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = your_wc_project_id
   NEXT_PUBLIC_CHAIN_ID = 8453
   NEXT_PUBLIC_NETWORK_NAME = Base Mainnet
   ```

7. Click "Deploy"

8. Wait for deployment (usually 2-3 minutes)

#### Option B: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow prompts and add environment variables when asked

5. Deploy to production:
```bash
vercel --prod
```

### Step 3: Verify Deployment

1. Visit your Vercel URL (e.g., `your-app.vercel.app`)
2. Test wallet connection
3. Try creating a test campaign
4. Verify transactions on [Basescan](https://basescan.org/)

### Step 4: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 24 hours)

## Part 4: Post-Deployment Testing

### Test Checklist

- [ ] Website loads correctly
- [ ] Wallet connects successfully
- [ ] Can view existing campaigns
- [ ] Can create a new campaign
- [ ] Can contribute to a campaign
- [ ] Campaign data displays correctly
- [ ] Dashboard shows user's campaigns
- [ ] All buttons and links work
- [ ] Mobile responsive design works
- [ ] No console errors

### Create Test Campaign

1. Connect your wallet on the deployed site
2. Go to "Create Campaign"
3. Fill in test data:
   - Title: "Test Campaign"
   - Description: At least 50 characters
   - Goal: 0.01 ETH
   - Duration: 7 days
4. Submit and wait for confirmation
5. Verify campaign appears in explore page

### Test Contribution Flow

1. Use a different wallet
2. Navigate to the test campaign
3. Click "Back This Campaign"
4. Enter a small amount (e.g., 0.001 ETH)
5. Confirm transaction
6. Verify contribution shows up

## Part 5: Monitoring and Maintenance

### Monitor Contract Activity

1. Add contract to Basescan watchlist
2. Set up notifications for:
   - New campaigns
   - Large contributions
   - Unusual activity

### Update Frontend

When you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically redeploy!

### Update Contract

**Important**: You cannot update a deployed contract. If you need changes:

1. Deploy a new contract version
2. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in Vercel
3. Redeploy frontend
4. Notify users of new contract address

## Troubleshooting

### Deployment Fails

**Error: Insufficient funds**
- Solution: Add more ETH to your deployment wallet

**Error: Network not found**
- Solution: Check RPC URL in `.env`
- Try alternative RPC: `https://base.llamarpc.com`

**Error: Nonce too low/high**
- Solution: Reset account in wallet or wait a few minutes

### Vercel Build Fails

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: Environment variables not found**
- Solution: Double-check all env vars in Vercel dashboard
- Redeploy after adding missing variables

### Contract Not Verified

```bash
# Try manual verification
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

### Wallet Won't Connect

- Clear browser cache
- Try different browser
- Check WalletConnect Project ID is correct
- Ensure you're on Base network

## Security Best Practices

### For Smart Contract

- ✅ Contract verified on Basescan
- ✅ Run tests before mainnet deployment
- ✅ Start with small test campaign
- ✅ Monitor for unusual activity
- ⚠️ Consider professional audit for production use

### For Keys and Secrets

- ❌ NEVER commit `.env` to git
- ❌ NEVER share private keys
- ❌ NEVER expose private keys in code
- ✅ Use separate wallets for deployment vs personal funds
- ✅ Keep private keys in secure password manager

### For Production

- Use hardware wallet for contract ownership
- Set up multi-sig for admin functions
- Implement rate limiting if needed
- Set up error monitoring (Sentry, etc.)
- Regular security audits

## Cost Breakdown

### One-Time Costs
- Contract Deployment: ~0.002-0.003 ETH (~$5-$8)
- Contract Verification: Free
- Initial Testing: ~0.001 ETH (~$2-$3)

### Ongoing Costs
- Vercel Hosting: Free (Hobby tier) or $20/month (Pro)
- RPC Calls: Free with public RPCs
- Domain: ~$10-15/year (optional)

### Per Transaction (Users Pay)
- Create Campaign: ~$0.50-$1.50
- Contribute: ~$0.20-$0.50
- Withdraw/Refund: ~$0.30-$0.80

*Prices based on Base gas fees as of 2024*

## Next Steps

After successful deployment:

1. 📱 Share your dApp URL
2. 📝 Write announcement post
3. 🐦 Share on social media
4. 💬 Join Base community Discord
5. 🚀 Start promoting your platform!

## Support Resources

- [Base Documentation](https://docs.base.org/)
- [Base Discord](https://discord.gg/buildonbase)
- [Hardhat Documentation](https://hardhat.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Congratulations!

You've successfully deployed a decentralized crowdfunding platform on Base! 🎉

For issues or questions, please open a GitHub issue or reach out in the Base community.

---

**Made with ❤️ for the Base ecosystem**
