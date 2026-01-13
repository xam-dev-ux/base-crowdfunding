# Account Association Setup

Your manifest has been corrected and is now valid, but it's missing the `accountAssociation` field which must be generated through one of these official tools.

## How to Generate Account Association

### Option 1: Base Developer Portal (Recommended)
1. Visit: https://www.base.dev/preview?tab=account&url=https://base-crowdfunding.vercel.app/
2. Connect your wallet with the owner address: `0xB3e4Eb6dC22540128Ce2D5C13C213D9d9EAaFa38`
3. Follow the prompts to sign the account association
4. Copy the generated JSON including `header`, `payload`, and `signature`
5. Add it to your manifest (see below)

### Option 2: Farcaster Developer Tools
1. Visit: https://farcaster.xyz/~/developers/mini-apps/manifest?domain=base-crowdfunding.vercel.app
2. Connect your wallet
3. Sign the message
4. Copy the generated account association
5. Add it to your manifest (see below)

## How to Add Account Association to Your Manifest

Once you have generated the account association, add it to your `/public/.well-known/farcaster.json` file:

```json
{
  "accountAssociation": {
    "header": "YOUR_GENERATED_HEADER",
    "payload": "YOUR_GENERATED_PAYLOAD",
    "signature": "YOUR_GENERATED_SIGNATURE"
  },
  "miniapp": {
    "version": "1",
    "name": "Base Crowdfunding",
    ...
  }
}
```

## Current Manifest Status

✅ Valid JSON structure
✅ All required fields present (version, name, iconUrl, homeUrl)
✅ All field length constraints met
✅ All URLs are HTTPS
✅ Tags count: 5/5 (max)
✅ Screenshots count: 3/3 (max)
❌ Missing accountAssociation (must be generated via tools above)

## Next Steps

1. Generate account association using one of the tools above
2. Add it to the manifest at `/public/.well-known/farcaster.json`
3. Deploy your changes
4. Verify the manifest at: https://base-crowdfunding.vercel.app/.well-known/farcaster.json
5. Test your mini app in the Base preview environment

## Manifest Validation

Your current manifest passes all validation rules:

- ✓ Name: 17/32 characters
- ✓ Subtitle: 23/30 characters
- ✓ Description: 134/170 characters
- ✓ Tagline: 21/30 characters
- ✓ OG Title: 26/30 characters
- ✓ OG Description: 86/100 characters
- ✓ All tags < 20 characters
- ✓ All URLs < 1024 characters
- ✓ All URLs use HTTPS
- ✓ Required chains specified: Base mainnet (eip155:8453)
- ✓ Required capabilities specified
- ✓ Canonical domain set

Once you add the account association, your manifest will be complete and ready for Base indexing.
