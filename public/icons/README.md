# Icon Generation Guide

This directory should contain PNG icons in the following sizes:

- icon-16.png (16x16)
- icon-32.png (32x32)
- icon-48.png (48x48)
- icon-128.png (128x128)
- icon-512.png (512x512)

## How to Generate Icons

1. Use the provided `icon.svg` as a base
2. Convert SVG to PNG using any of these methods:

### Method 1: Online Tools

- Visit https://convertio.co/svg-png/
- Upload icon.svg
- Download in required sizes

### Method 2: Using ImageMagick (if installed)

```bash
magick icon.svg -resize 16x16 icon-16.png
magick icon.svg -resize 32x32 icon-32.png
magick icon.svg -resize 48x48 icon-48.png
magick icon.svg -resize 128x128 icon-128.png
magick icon.svg -resize 512x512 icon-512.png
```

### Method 3: Using Figma/Sketch

1. Open icon.svg in Figma
2. Export as PNG in different sizes

## Icon Design

- Blue background (#3B82F6)
- White JSON representation lines
- Green checkmark circle (#10B981) indicating validation
- Rounded corners for modern look
