#!/usr/bin/env python3
"""
Generate embed image with 3:2 aspect ratio (1200x800) for Farcaster mini app
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Image dimensions (3:2 aspect ratio)
WIDTH = 1200
HEIGHT = 800

# Colors
BG_COLOR = "#0052FF"  # Base blue
TEXT_COLOR = "#FFFFFF"
ACCENT_COLOR = "#00D4FF"

def create_embed_image():
    # Create image
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Try to use a nice font, fallback to default
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
        tagline_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        tagline_font = ImageFont.load_default()

    # Add decorative elements
    # Top-left accent
    draw.rectangle([0, 0, 400, 8], fill=ACCENT_COLOR)
    # Bottom-right accent
    draw.rectangle([WIDTH-400, HEIGHT-8, WIDTH, HEIGHT], fill=ACCENT_COLOR)

    # Add circles as decorative elements
    draw.ellipse([50, 50, 150, 150], outline=ACCENT_COLOR, width=4)
    draw.ellipse([WIDTH-150, HEIGHT-150, WIDTH-50, HEIGHT-50], outline=ACCENT_COLOR, width=4)

    # Add title
    title = "Base Crowdfunding"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2
    draw.text((title_x, 250), title, fill=TEXT_COLOR, font=title_font)

    # Add subtitle
    subtitle = "Fund the Future on Base"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    draw.text((subtitle_x, 370), subtitle, fill=TEXT_COLOR, font=subtitle_font)

    # Add tagline
    tagline = "Transparent • Secure • Decentralized"
    tagline_bbox = draw.textbbox((0, 0), tagline, font=tagline_font)
    tagline_width = tagline_bbox[2] - tagline_bbox[0]
    tagline_x = (WIDTH - tagline_width) // 2
    draw.text((tagline_x, 480), tagline, fill=ACCENT_COLOR, font=tagline_font)

    return img

def main():
    # Output path
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'public')
    output_path = os.path.join(output_dir, 'embed.png')

    # Create embed image
    print(f"Generating embed image (1200x800 - 3:2 aspect ratio)...")
    img = create_embed_image()

    # Save with optimization
    img.save(output_path, 'PNG', optimize=True)

    # Get file size
    file_size = os.path.getsize(output_path)
    file_size_mb = file_size / (1024 * 1024)

    print(f"✓ Created: {output_path}")
    print(f"  Dimensions: {WIDTH}x{HEIGHT} (3:2 aspect ratio)")
    print(f"  File size: {file_size_mb:.2f} MB")

    if file_size_mb > 10:
        print("  ⚠ Warning: File size exceeds 10MB limit!")
    else:
        print("  ✓ File size is within 10MB limit")

if __name__ == '__main__':
    main()
