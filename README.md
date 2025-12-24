# Base Crowdfunding Platform

A decentralized crowdfunding platform built on Base blockchain with milestone-based fund release, transparent transactions, and secure smart contracts.

## Features

### Smart Contract Features
- **Campaign Creation**: Create campaigns with customizable goals, deadlines, and contribution limits
- **Milestone-Based Funding**: Optional gradual fund release through predefined milestones
- **Contribution System**: Secure ETH contributions with min/max limits
- **Automatic Refunds**: Automatic refund mechanism for failed campaigns
- **Platform Fee**: Configurable platform fee (default 2.5%)
- **Security**: Built with OpenZeppelin contracts (Ownable, ReentrancyGuard, Pausable)
- **Transparency**: All transactions and campaign data stored on-chain

### Frontend Features
- **Wallet Integration**: Seamless connection with Coinbase Smart Wallet
- **Campaign Explorer**: Browse and filter campaigns by status, funding, etc.
- **Campaign Details**: Comprehensive campaign pages with progress tracking
- **Dashboard**: Personal dashboard for created and backed campaigns
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Live blockchain data with wagmi hooks
- **User Experience**: Intuitive multi-step campaign creation wizard

## Tech Stack

### Smart Contracts
- **Solidity**: 0.8.20
- **OpenZeppelin**: Security and access control
- **Hardhat**: Development and deployment framework

### Frontend
- **Next.js**: 14.x (React framework)
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **wagmi**: Ethereum interactions
- **viem**: Ethereum utilities
- **Coinbase Wallet SDK**: Smart Wallet integration
- **React Query**: Data fetching and caching

## Project Structure

```
crowdfunding-miniapp/
├── contracts/
│   └── CrowdfundingPlatform.sol      # Main smart contract
├── scripts/
│   └── deploy.js                      # Deployment script
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home page
│   │   ├── providers.tsx              # Wagmi providers
│   │   ├── explore/page.tsx           # Browse campaigns
│   │   ├── campaign/[id]/page.tsx     # Campaign details
│   │   ├── create/page.tsx            # Create campaign
│   │   └── dashboard/page.tsx         # User dashboard
│   ├── components/
│   │   ├── CampaignCard.tsx           # Campaign preview card
│   │   ├── ContributeModal.tsx        # Contribution modal
│   │   ├── CreateCampaignWizard.tsx   # Multi-step form
│   │   ├── FilterBar.tsx              # Campaign filters
│   │   ├── Header.tsx                 # Navigation header
│   │   ├── MilestoneTimeline.tsx      # Milestone display
│   │   └── ProgressBar.tsx            # Funding progress
│   ├── hooks/
│   │   ├── useCampaigns.ts            # Campaign queries
│   │   ├── useContribute.ts           # Transaction hooks
│   │   └── useContract.ts             # Contract interactions
│   └── lib/
│       ├── contract.ts                # Contract ABI & address
│       ├── utils.ts                   # Utility functions
│       └── wagmi.ts                   # Wagmi configuration
├── hardhat.config.js                  # Hardhat configuration
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- A wallet with ETH on Base mainnet (for deployment)

### Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Crowdfunding

# Install dependencies
npm install
```

## Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Required for deployment
PRIVATE_KEY=your_wallet_private_key_here

# Network RPCs (defaults provided)
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_SEPOLIA_RPC=https://sepolia.base.org

# Optional: For contract verification on Basescan and 60+ EVM chains
# Get from https://docs.etherscan.io/getting-an-api-key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Frontend configuration (auto-updated after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=8453
```

### 2. Get an Etherscan API Key (for contract verification)

**New**: Etherscan API V2 now supports Basescan and 60+ EVM chains with a single API key!

1. Visit [Etherscan](https://etherscan.io/) and create a free account
2. Navigate to API Keys → Create New API Key
3. This one key verifies contracts on:
   - Base Mainnet & Base Sepolia (Basescan)
   - Ethereum, Optimism, Arbitrum, Polygon
   - 60+ other EVM-compatible chains
4. Add to your `.env` file: `ETHERSCAN_API_KEY=your_key`

Learn more: https://docs.etherscan.io/getting-an-api-key

### 3. Get a WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID to `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## Smart Contract Deployment

### Compile the Contract

```bash
npm run compile
```

### Deploy to Base Sepolia (Testnet)

```bash
# Deploy to testnet first for testing
npm run deploy:testnet
```

### Deploy to Base Mainnet

```bash
# Deploy to production
npm run deploy
```

The deployment script will:
1. Deploy the CrowdfundingPlatform contract
2. Save deployment info to `deployments/` folder
3. Update `.env.local` with the contract address
4. Verify the contract on Basescan (if API key provided)

### Deployment Output

After successful deployment, you'll see:

```
🚀 Starting deployment to base
=====================================
📝 Deploying contracts with account: 0x...
💰 Account balance: 0.05 ETH
=====================================
📦 Deploying CrowdfundingPlatform...
✅ CrowdfundingPlatform deployed to: 0x...
=====================================
📄 Deployment info saved to: base-1234567890.json
✅ Updated .env.local with contract address
=====================================
```

### Estimated Gas Costs

- **Contract Deployment**: ~2-3M gas (~0.002-0.003 ETH on Base)
- **Create Campaign**: ~200-300k gas
- **Contribute**: ~80-100k gas
- **Withdraw Funds**: ~100-150k gas
- **Claim Refund**: ~80-100k gas

*Note: Base has significantly lower gas fees than Ethereum mainnet*

## Running the Frontend

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit: Base crowdfunding platform"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CHAIN_ID=8453`
4. Deploy

### 3. Alternative: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Using the Platform

### For Campaign Creators

1. **Connect Wallet**: Click "Connect Wallet" and connect your Coinbase Smart Wallet
2. **Create Campaign**:
   - Navigate to "Create Campaign"
   - Fill in campaign details (title, description, goal, duration)
   - Set optional contribution limits
   - Review and submit transaction
3. **Manage Campaign**:
   - View your campaign in the Dashboard
   - Withdraw funds when campaign succeeds
   - Cancel campaign if no contributions yet

### For Backers

1. **Connect Wallet**: Connect your wallet to the platform
2. **Browse Campaigns**:
   - Explore campaigns on the home page or "Explore" page
   - Use filters to find campaigns by status, funding, etc.
3. **Contribute**:
   - Click on a campaign to view details
   - Click "Back This Campaign"
   - Enter contribution amount and confirm
4. **Track Contributions**: View your backed campaigns in the Dashboard
5. **Claim Refund**: If a campaign fails, claim your refund from the campaign page

## Smart Contract Functions

### Main Functions

#### createCampaign
```solidity
function createCampaign(
    string memory _title,
    string memory _description,
    string memory _metadataURI,
    uint256 _fundingGoal,
    uint256 _durationInDays,
    uint256 _minContribution,
    uint256 _maxContribution
) external returns (uint256)
```

#### contribute
```solidity
function contribute(uint256 _campaignId) external payable
```

#### withdrawFunds
```solidity
function withdrawFunds(uint256 _campaignId, uint256 _milestoneIndex) external
```

#### claimRefund
```solidity
function claimRefund(uint256 _campaignId) external
```

### View Functions

- `getCampaign(uint256 _campaignId)`: Get campaign details
- `getCampaignMilestones(uint256 _campaignId)`: Get milestones
- `getUserCreatedCampaigns(address _user)`: Get user's campaigns
- `getUserContributions(address _user)`: Get campaigns user backed
- `getPlatformStats()`: Get platform-wide statistics

## Security Considerations

### Smart Contract Security
- ✅ ReentrancyGuard on all state-changing functions
- ✅ Access control with Ownable
- ✅ Emergency pause functionality
- ✅ Input validation and checks
- ✅ Safe ETH transfers

### Best Practices
- Never share your private key
- Test on testnet before mainnet
- Verify contract source code on Basescan
- Use hardware wallets for large amounts
- Audit smart contracts before production use

## Troubleshooting

### Common Issues

**Contract deployment fails:**
- Check you have enough ETH for gas
- Verify your private key is correct
- Ensure RPC endpoint is accessible

**Frontend can't connect to wallet:**
- Check WalletConnect Project ID is set
- Clear browser cache and cookies
- Try a different browser

**Transactions fail:**
- Ensure you're on the correct network (Base mainnet)
- Check you have enough ETH for transaction + gas
- Verify campaign is in correct state

**Build errors:**
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check Node.js version (18+)

## Development

### Running Tests

```bash
# Run Hardhat tests (create test files in /test)
npx hardhat test
```

### Local Blockchain

```bash
# Start local Hardhat node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### Contract Verification

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Resources

- [Base Documentation](https://docs.base.org/)
- [Base Mini-Apps](https://docs.base.org/mini-apps/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## Support

For issues and questions:
- Open an issue on GitHub
- Join the Base Discord community
- Check Base documentation

## Acknowledgments

- Built for Base blockchain
- Powered by Coinbase Smart Wallet
- UI inspired by modern crowdfunding platforms
- Smart contracts secured with OpenZeppelin

---

**Made with ❤️ for the Base ecosystem**
