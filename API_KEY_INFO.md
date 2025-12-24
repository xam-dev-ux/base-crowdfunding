# Etherscan API V2 - Multi-Chain Support

## What's New?

Etherscan API V2 now provides **multi-chain support**, allowing you to use a **single API key** to verify smart contracts on **Basescan and 60+ other EVM-compatible chains**.

## Why This Matters

Previously, you needed separate API keys for:
- ❌ Etherscan (Ethereum)
- ❌ Basescan (Base)
- ❌ Optimistic Etherscan (Optimism)
- ❌ Arbiscan (Arbitrum)
- ❌ Polygonscan (Polygon)
- ❌ And many more...

**Now with Etherscan API V2:**
- ✅ **One API key for everything**
- ✅ Works across 60+ EVM chains
- ✅ Simpler configuration
- ✅ Easier multi-chain development

## Supported Chains

Your single Etherscan API key works on:

### Major L2s
- **Base Mainnet** (our platform!)
- **Base Sepolia** (testnet)
- Optimism
- Arbitrum One
- Arbitrum Nova
- zkSync Era
- Polygon
- Polygon zkEVM

### Ethereum Networks
- Ethereum Mainnet
- Goerli Testnet
- Sepolia Testnet

### Other EVM Chains
- Avalanche
- BNB Chain
- Fantom
- Gnosis Chain
- Moonbeam
- Celo
- And 40+ more!

Full list: https://docs.etherscan.io/etherscan-v2/getting-started/supported-chains

## How to Get Your API Key

1. **Visit Etherscan.io** (not Basescan)
   - Go to: https://etherscan.io/

2. **Create a Free Account**
   - Sign up with your email
   - Verify your account

3. **Generate API Key**
   - Go to "API Keys" section
   - Click "Add" to create new API key
   - Give it a name (e.g., "My DApp Projects")

4. **Use Everywhere**
   - Add to your `.env` file as `ETHERSCAN_API_KEY`
   - Same key works for all supported chains

## Usage in This Project

This crowdfunding platform uses Etherscan API V2 for:

- ✅ Verifying contracts on **Base Mainnet**
- ✅ Verifying contracts on **Base Sepolia** (testnet)
- ✅ Future-proof for multi-chain deployment

## Configuration

In your `.env` file:

```env
# Works for Basescan, Etherscan, and 60+ other chains
ETHERSCAN_API_KEY=your_api_key_here
```

In `hardhat.config.js`:

```javascript
etherscan: {
  apiKey: {
    "base": ETHERSCAN_API_KEY,
    "base-sepolia": ETHERSCAN_API_KEY,
    // Can add more chains here with the same key
  }
}
```

## Rate Limits

Free tier includes:
- **5 requests/second**
- **100,000 requests/day**

More than enough for development and small to medium production apps!

For higher limits, upgrade to a paid plan.

## Benefits for Developers

1. **Simplified Setup**: One API key in your `.env`
2. **Multi-Chain Ready**: Deploy to multiple chains without reconfiguration
3. **Cost Effective**: Free tier is generous
4. **Better DX**: Less key management, fewer configuration errors

## Learn More

- 📖 [Etherscan API V2 Documentation](https://docs.etherscan.io/etherscan-v2)
- 🔑 [Getting an API Key Guide](https://docs.etherscan.io/getting-an-api-key)
- 🌐 [Supported Chains List](https://docs.etherscan.io/etherscan-v2/getting-started/supported-chains)
- 💬 [Etherscan Discord](https://discord.gg/etherscan)

## Migration Guide

If you're updating from the old `BASESCAN_API_KEY`:

1. Get your Etherscan API key (if you don't have one)
2. Replace in `.env`:
   ```diff
   - BASESCAN_API_KEY=xxx
   + ETHERSCAN_API_KEY=xxx
   ```
3. Update `hardhat.config.js`:
   ```diff
   - const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY
   + const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
   ```

That's it! Your verification will continue to work seamlessly.

---

**This project is already configured to use Etherscan API V2!** Just add your API key and deploy. 🚀
