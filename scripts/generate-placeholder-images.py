#!/usr/bin/env python3
"""
Generate placeholder PNG images for Base Mini-App
These are temporary placeholders - replace with actual images from SVGs
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(output_path, size=512):
    """Create app icon placeholder"""
    # Create image with Base blue gradient background
    img = Image.new('RGB', (size, size), '#0052FF')
    draw = ImageDraw.Draw(img)

    # Draw gradient effect (simple)
    for i in range(size):
        alpha = int(255 * (1 - i/size))
        color = f'#{max(0, 0x00 - alpha//4):02x}{max(0, 0x52 - alpha//4):02x}{min(255, 0xFF):02x}'
        draw.line([(0, i), (size, i)], fill=color, width=1)

    # Draw circle for coin
    center_x, center_y = size // 2, size // 2
    coin_radius = size // 3

    # Draw 3 coins (stack)
    for offset in [60, 30, 0]:
        y = center_y + offset
        # Coin body
        draw.ellipse([center_x - coin_radius, y - 30,
                     center_x + coin_radius, y + 30],
                     fill='white', outline='white', width=4)

    # Draw arrow
    arrow_y = center_y - 80
    arrow_width = 16
    # Arrow shaft
    draw.rectangle([center_x - arrow_width//2, arrow_y,
                   center_x + arrow_width//2, arrow_y + 100],
                   fill='white')
    # Arrow head
    draw.polygon([
        (center_x, arrow_y - 30),
        (center_x - 30, arrow_y),
        (center_x + 30, arrow_y)
    ], fill='white')

    # Add letter C
    try:
        # Try to use default font, fallback to basic if not available
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
    except:
        font = ImageFont.load_default()

    draw.text((size - 120, size - 150), "C", fill=(255, 255, 255, 80), font=font)

    img.save(output_path)
    print(f"✅ Created {output_path}")

def create_splash(output_path, width=1200, height=630):
    """Create splash screen placeholder"""
    # Create image with gradient
    img = Image.new('RGB', (width, height), '#0052FF')
    draw = ImageDraw.Draw(img)

    # Gradient background
    for i in range(height):
        progress = i / height
        r = int(0x00 * (1 - progress) + 0x00 * progress)
        g = int(0x52 * (1 - progress) + 0x2E * progress)
        b = int(0xFF * (1 - progress) + 0x99 * progress)
        draw.line([(0, i), (width, i)], fill=f'#{r:02x}{g:02x}{b:02x}', width=1)

    # Decorative circles
    draw.ellipse([50, 50, 200, 200], fill=(255, 255, 255, 15))
    draw.ellipse([950, 450, 1150, 650], fill=(255, 255, 255, 15))

    # Draw icon elements
    icon_x, icon_y = 250, height // 2
    coin_radius = 50

    # Mini coins
    for offset in [40, 20, 0]:
        y = icon_y + offset
        draw.ellipse([icon_x - coin_radius, y - 20,
                     icon_x + coin_radius, y + 20],
                     fill=(255, 255, 255, 100))

    # Arrow
    arrow_y = icon_y - 50
    draw.rectangle([icon_x - 6, arrow_y, icon_x + 6, arrow_y + 60], fill='white')
    draw.polygon([
        (icon_x, arrow_y - 20),
        (icon_x - 20, arrow_y),
        (icon_x + 20, arrow_y)
    ], fill='white')

    # Text
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
        badge_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
    except:
        title_font = subtitle_font = badge_font = ImageFont.load_default()

    draw.text((400, 250), "Base Crowdfunding", fill='white', font=title_font)
    draw.text((400, 320), "Decentralized Fundraising on Base Blockchain",
              fill='white', font=subtitle_font)

    # Badges
    badges = ["🔒 Secure", "⚡ Fast", "🌐 Transparent"]
    badge_x = 400
    for badge in badges:
        badge_width = 180
        draw.rounded_rectangle([badge_x, 400, badge_x + badge_width, 450],
                               radius=25, fill=(255, 255, 255, 40))
        draw.text((badge_x + 20, 415), badge, fill='white', font=badge_font)
        badge_x += badge_width + 20

    img.save(output_path)
    print(f"✅ Created {output_path}")

def create_favicon(output_path, size=32):
    """Create favicon placeholder"""
    # Simple icon version
    img = Image.new('RGB', (size, size), '#0052FF')
    draw = ImageDraw.Draw(img)

    # Simple "C" letter
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size - 4)
    except:
        font = ImageFont.load_default()

    draw.text((2, 0), "C", fill='white', font=font)

    img.save(output_path, 'ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"✅ Created {output_path}")

def create_screenshot_placeholder(output_path, title, width=1280, height=720):
    """Create screenshot placeholder"""
    img = Image.new('RGB', (width, height), '#F3F4F6')
    draw = ImageDraw.Draw(img)

    # Border
    draw.rectangle([0, 0, width-1, height-1], outline='#D1D5DB', width=3)

    # Title
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    except:
        font = ImageFont.load_default()

    # Center text
    text_bbox = draw.textbbox((0, 0), title, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (width - text_width) // 2

    draw.text((text_x, height//2 - 50), title, fill='#6B7280', font=font)
    draw.text((text_x - 100, height//2 + 20),
              "Screenshot will be generated after deployment",
              fill='#9CA3AF', font=ImageFont.load_default())

    img.save(output_path)
    print(f"✅ Created {output_path}")

if __name__ == "__main__":
    print("🎨 Generating placeholder images for Base Mini-App...")
    print("⚠️  These are temporary placeholders. Replace with actual images from SVGs.\n")

    # Create main images
    create_icon("public/icon.png", 512)
    create_splash("public/splash.png", 1200, 630)
    create_favicon("public/favicon.ico", 32)

    # Create screenshot placeholders
    screenshots = [
        ("home.png", "Home Page"),
        ("explore.png", "Explore Campaigns"),
        ("campaign.png", "Campaign Detail"),
        ("create.png", "Create Campaign")
    ]

    for filename, title in screenshots:
        create_screenshot_placeholder(f"public/screenshots/{filename}", title)

    print("\n✨ All placeholder images created!")
    print("\n📝 Important notes:")
    print("1. These are temporary placeholder images")
    print("2. For best results, convert the SVG files to PNG:")
    print("   - Use https://svgtopng.com/ to convert icon.svg (512x512)")
    print("   - Use https://svgtopng.com/ to convert splash.svg (1200x630)")
    print("3. Take actual screenshots after deploying your app")
    print("4. Update farcaster.json with your Vercel URL")
