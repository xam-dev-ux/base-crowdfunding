#!/bin/bash

# Script to generate PNG images from SVG files for Base Mini-App
# Requires: imagemagick (convert command) or inkscape

echo "🎨 Generating images for Base Mini-App..."

# Check if convert (ImageMagick) is available
if command -v convert &> /dev/null; then
    echo "✅ Using ImageMagick to convert SVGs to PNGs"

    # Convert icon.svg to icon.png (512x512)
    echo "📦 Generating icon.png (512x512)..."
    convert -background none -resize 512x512 public/icon.svg public/icon.png

    # Convert splash.svg to splash.png (1200x630)
    echo "🖼️  Generating splash.png (1200x630)..."
    convert -background none -resize 1200x630 public/splash.svg public/splash.png

    # Generate favicon.ico from icon
    echo "🎯 Generating favicon.ico..."
    convert public/icon.svg -define icon:auto-resize=16,32,48 public/favicon.ico

    echo "✅ All images generated successfully!"

elif command -v inkscape &> /dev/null; then
    echo "✅ Using Inkscape to convert SVGs to PNGs"

    # Convert icon.svg to icon.png (512x512)
    echo "📦 Generating icon.png (512x512)..."
    inkscape public/icon.svg --export-type=png --export-filename=public/icon.png -w 512 -h 512

    # Convert splash.svg to splash.png (1200x630)
    echo "🖼️  Generating splash.png (1200x630)..."
    inkscape public/splash.svg --export-type=png --export-filename=public/splash.png -w 1200 -h 630

    # Generate favicon
    echo "🎯 Generating favicon.ico..."
    inkscape public/icon.svg --export-type=png --export-filename=public/favicon-temp.png -w 32 -h 32
    convert public/favicon-temp.png public/favicon.ico
    rm public/favicon-temp.png

    echo "✅ All images generated successfully!"

else
    echo "❌ Error: Neither ImageMagick nor Inkscape found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - ImageMagick: sudo apt-get install imagemagick"
    echo "  - Inkscape: sudo apt-get install inkscape"
    echo ""
    echo "Alternatively, you can use online tools:"
    echo "  1. Go to https://svgtopng.com/"
    echo "  2. Upload public/icon.svg and convert to 512x512 PNG"
    echo "  3. Upload public/splash.svg and convert to 1200x630 PNG"
    echo "  4. Save as icon.png and splash.png in the public/ folder"
    exit 1
fi

# List generated files
echo ""
echo "📁 Generated files:"
ls -lh public/*.png public/*.ico 2>/dev/null || echo "No PNG/ICO files found yet"

echo ""
echo "✨ Next steps:"
echo "1. Review the generated images in the public/ folder"
echo "2. Update farcaster.json with your actual Vercel URL"
echo "3. Create screenshots of your app (1280x720 recommended)"
echo "4. Deploy to Vercel and submit to base.dev"
