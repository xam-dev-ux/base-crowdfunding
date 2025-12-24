# Base Mini-App Deployment Guide

This guide will help you deploy your crowdfunding platform as an official Base Mini-App.

## ✅ What's Already Configured

Your project is **already set up** to be a Base Mini-App! Here's what we've included:

### 1. Farcaster Manifest (`public/farcaster.json`)
- ✅ Frame configuration for Farcaster
- ✅ App metadata and description
- ✅ Icon and splash screen references
- ✅ Social links and developer info

### 2. Images and Assets
- ✅ `public/icon.png` (512x512) - App icon
- ✅ `public/splash.png` (1200x630) - Splash screen/preview
- ✅ `public/favicon.ico` - Browser favicon
- ✅ `public/screenshots/` - App screenshots
- ✅ SVG source files for regeneration

### 3. Metadata Configuration
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card support
- ✅ Farcaster Frame metadata
- ✅ PWA manifest.json

## 📋 Pre-Deployment Checklist

Before deploying to base.dev, complete these steps:

### 1. Update Environment Variables

Edit your `.env.local` (or Vercel environment variables):

```env
NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7eB03216212D6b9bE0BA85669DF1800F4BAb719E
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=8453
```

### 2. Update Farcaster Manifest

Edit `public/farcaster.json` and replace these values:

```json
{
  "frame": {
    "button": {
      "action": {
        "url": "https://your-actual-domain.vercel.app"  // ← Update this
      }
    }
  },
  "homeUrl": "https://your-actual-domain.vercel.app",  // ← Update this
  "webhookUrl": "https://your-actual-domain.vercel.app/api/webhook",  // ← Update this
  "socialLinks": {
    "website": "https://your-actual-domain.vercel.app"  // ← Update this
  }
}
```

### 3. Improve Images (Optional but Recommended)

The current images are placeholders. For best results:

#### Option A: Use Online Converter
1. Go to https://svgtopng.com/
2. Upload `public/icon.svg`
3. Set size to 512x512
4. Download and replace `public/icon.png`
5. Repeat for `public/splash.svg` (1200x630)

#### Option B: Install ImageMagick
```bash
sudo apt-get install imagemagick
./scripts/generate-images.sh
```

### 4. Take Real Screenshots

After deploying to Vercel:

1. Visit your deployed app
2. Take screenshots of:
   - Home page (landing)
   - Explore page (campaign grid)
   - Campaign detail page
   - Create campaign wizard
3. Save as 1280x720 PNG files
4. Replace files in `public/screenshots/`

## 🚀 Deployment Steps

### Step 1: Deploy to Vercel

```bash
# Option A: Using Vercel CLI
npm install -g vercel
vercel --prod

# Option B: Via GitHub
# Push to GitHub and import in Vercel dashboard
git add .
git commit -m "feat: Configure for Base Mini-App deployment"
git push
```

### Step 2: Configure Vercel Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7eB03216212D6b9bE0BA85669DF1800F4BAb719E
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_wc_project_id
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_NETWORK_NAME=Base Mainnet
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 3: Verify Deployment

Visit these URLs to verify everything works:

1. **App Homepage**: `https://your-app.vercel.app/`
2. **Manifest**: `https://your-app.vercel.app/farcaster.json`
3. **Icon**: `https://your-app.vercel.app/icon.png`
4. **Splash**: `https://your-app.vercel.app/splash.png`
5. **Robots**: `https://your-app.vercel.app/robots.txt`

### Step 4: Test Farcaster Frame

1. Go to https://warpcast.com/~/developers/frames
2. Enter your app URL: `https://your-app.vercel.app`
3. Click "Validate Frame"
4. Verify the preview looks correct

### Step 5: Submit to Base Mini-Apps Directory

1. Visit https://base.dev/
2. Click "Submit Mini-App" (or similar)
3. Fill in the submission form:
   - **App Name**: Base Crowdfunding
   - **App URL**: `https://your-app.vercel.app`
   - **Manifest URL**: `https://your-app.vercel.app/farcaster.json`
   - **Category**: Finance/DeFi
   - **Description**: Your app description
4. Submit and wait for review

## 🔧 Advanced Configuration

### Custom Domain (Recommended)

1. In Vercel → Settings → Domains
2. Add your custom domain (e.g., `crowdfund.base.app`)
3. Update DNS records as instructed
4. Update all URLs in `farcaster.json` and `.env`

### Account Association (Optional)

For official verification, you need to add account association:

1. Get your Farcaster FID (Farcaster ID)
2. Generate signature proof
3. Update `accountAssociation` in `farcaster.json`

See: https://docs.base.org/mini-apps/farcaster/account-association

### Analytics and Monitoring

Add analytics to track usage:

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 📱 Testing Your Mini-App

### Test on Warpcast

1. Open Warpcast mobile app
2. Create a cast with your app URL
3. Verify the frame preview appears
4. Click "Launch" button
5. Test wallet connection and features

### Test on Desktop

1. Open your app in browser
2. Connect Coinbase Wallet
3. Create a test campaign
4. Make a test contribution
5. Verify all features work

## 🐛 Troubleshooting

### Frame Not Showing in Warpcast

**Problem**: Frame preview doesn't appear

**Solutions**:
- Verify `public/farcaster.json` is accessible
- Check Open Graph meta tags in page source
- Validate frame at https://warpcast.com/~/developers/frames
- Clear Warpcast cache (share link in DM to yourself)

### Images Not Loading

**Problem**: Icon or splash not displaying

**Solutions**:
- Verify files exist in `public/` folder
- Check file sizes (icon: 512x512, splash: 1200x630)
- Ensure proper CORS headers
- Test direct URLs in browser

### Wallet Connection Fails

**Problem**: Can't connect Coinbase Wallet

**Solutions**:
- Verify WalletConnect Project ID is correct
- Check you're on Base network (chain ID 8453)
- Update wagmi configuration
- Test in incognito mode

## 📚 Resources

- **Base Mini-Apps Docs**: https://docs.base.org/mini-apps/
- **Farcaster Frames Spec**: https://docs.farcaster.xyz/developers/frames/
- **Base Developer Portal**: https://base.dev/
- **Your Contract**: https://basescan.org/address/0x7eB03216212D6b9bE0BA85669DF1800F4BAb719E

## ✨ Post-Launch Checklist

After your app is live:

- [ ] Share on Farcaster/Warpcast
- [ ] Tweet about launch
- [ ] Join Base Discord and share
- [ ] Add to Base ecosystem lists
- [ ] Monitor analytics and user feedback
- [ ] Create documentation/tutorial
- [ ] Consider adding more features

## 🎯 Next Steps

1. **Deploy to Vercel** following Step 1 above
2. **Update all URLs** with your actual domain
3. **Test thoroughly** on desktop and mobile
4. **Submit to base.dev** for review
5. **Share with community** and get users!

---

**Your Base Mini-App is ready to launch!** 🚀

Need help? Check the resources above or open an issue on GitHub.
