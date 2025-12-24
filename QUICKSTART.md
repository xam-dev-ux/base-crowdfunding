# Quick Start Guide

Get your Base Crowdfunding Platform up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add:
# PRIVATE_KEY=your_private_key_here
# ETHERSCAN_API_KEY=your_etherscan_api_key (optional, for contract verification)
```

**Tip**: Get a free Etherscan API key that works for Basescan and 60+ chains: https://docs.etherscan.io/getting-an-api-key

## 3. Deploy Smart Contract

### Test on Sepolia Testnet First (Recommended)

```bash
# Get testnet ETH from Base Sepolia faucet
# Then deploy
npm run deploy:testnet
```

### Deploy to Base Mainnet

```bash
npm run deploy
```

The script will automatically:
- Deploy the contract
- Save the address to `.env.local`
- Verify the contract on Basescan

## 4. Configure Frontend

1. Get a WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

2. Add to `.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 6. Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push

# Deploy to Vercel
# Go to vercel.com and import your GitHub repo
# Add environment variables:
# - NEXT_PUBLIC_CONTRACT_ADDRESS
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# - NEXT_PUBLIC_CHAIN_ID=8453
```

## That's It!

Your crowdfunding platform is now live! 🎉

### Next Steps

- Create your first test campaign
- Share with friends
- Join the Base community

### Need Help?

- Check [README.md](./README.md) for full documentation
- Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed steps
- Open an issue on GitHub

---

**Happy Building! 🚀**
