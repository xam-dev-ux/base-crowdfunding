# Base Mini-App Deployment Checklist ✅

Quick checklist to ensure your app is ready for base.dev submission.

## 📁 Required Files

- [x] `public/farcaster.json` - Farcaster manifest
- [x] `public/icon.png` - App icon (512x512)
- [x] `public/splash.png` - Splash screen (1200x630)
- [x] `public/favicon.ico` - Browser favicon
- [x] `public/manifest.json` - PWA manifest
- [x] `public/robots.txt` - SEO configuration
- [x] `public/screenshots/` - App screenshots

## 🖼️ Images Generated

All images have been created as placeholders:

- ✅ Icon (512x512 PNG)
- ✅ Splash (1200x630 PNG)
- ✅ Favicon (32x32 ICO)
- ✅ Screenshots (4 placeholder images)
- ✅ SVG source files available

### To Generate Better Images:

```bash
# Option 1: Use Python script (placeholders)
npm run generate:images

# Option 2: Convert SVGs to PNG (requires ImageMagick)
./scripts/generate-images.sh

# Option 3: Use online converter
# Go to https://svgtopng.com/
# Upload public/icon.svg and public/splash.svg
```

## ⚙️ Configuration Status

### Smart Contract ✅
- [x] Deployed to Base Mainnet
- [x] Contract Address: `0x7eB03216212D6b9bE0BA85669DF1800F4BAb719E`
- [ ] Verified on Basescan (run: `npm run verify 0x7eB03216212D6b9bE0BA85669DF1800F4BAb719E`)

### Environment Variables ⏳
Before deploying to Vercel, set these variables:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7eB03216212D6b9bE0BA85669DF1800F4BAb719E
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_NETWORK_NAME=Base Mainnet
```

### URLs to Update ⏳
After deploying to Vercel, update these files:

1. **`public/farcaster.json`**
   - Line 10: `"url": "https://your-app.vercel.app"`
   - Line 17: `"homeUrl": "https://your-app.vercel.app"`
   - Line 19: `"webhookUrl": "https://your-app.vercel.app/api/webhook"`
   - Line 31: `"website": "https://your-app.vercel.app"`

2. **`public/robots.txt`**
   - Last line: `Sitemap: https://your-app.vercel.app/sitemap.xml`

## 🚀 Deployment Steps

### 1. Deploy to Vercel
```bash
# Via GitHub (Recommended)
git add .
git commit -m "feat: Add Base Mini-App configuration"
git push

# Then import repository in Vercel dashboard
```

### 2. Set Environment Variables
In Vercel → Settings → Environment Variables → Add all variables listed above

### 3. Update URLs
After deployment, update all `your-app.vercel.app` URLs with your actual domain

### 4. Test
- [ ] Visit app homepage
- [ ] Test wallet connection
- [ ] Create test campaign
- [ ] Verify Farcaster frame: https://warpcast.com/~/developers/frames

### 5. Submit to base.dev
- [ ] Go to https://base.dev/
- [ ] Submit your Mini-App
- [ ] Provide manifest URL: `https://your-app.vercel.app/farcaster.json`

## 📸 Post-Deployment Tasks

### Take Real Screenshots
1. Visit your deployed app
2. Screenshot these pages (1280x720):
   - Home page
   - Explore campaigns
   - Campaign detail
   - Create campaign wizard
3. Replace files in `public/screenshots/`
4. Redeploy to Vercel

### Optional Improvements
- [ ] Add custom domain
- [ ] Set up analytics
- [ ] Create tutorial/docs
- [ ] Share on social media

## 🔗 Important Links

- **Contract**: https://basescan.org/address/0x7eB03216212D6b9bE0BA85669DF1800F4BAb719E
- **GitHub**: https://github.com/xam-dev-ux/base-crowdfunding
- **Base Docs**: https://docs.base.org/mini-apps/
- **Frame Validator**: https://warpcast.com/~/developers/frames

## 📚 Documentation

Full guides available:
- `BASE_MINIAPP_GUIDE.md` - Complete deployment guide
- `DEPLOYMENT_GUIDE.md` - General deployment instructions
- `README.md` - Project overview
- `DEPLOYMENT_STATUS.md` - Current deployment status

---

**Status**: Ready for Vercel deployment! 🎉

All Base Mini-App requirements are met. Just deploy and update URLs!
