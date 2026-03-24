import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createSimplePNG(size, filename) {
    const distDir = path.join(__dirname, 'dist', 'icons');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    const filepath = path.join(distDir, filename);
    
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563EB;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="url(#bg)"/>
  
  <g stroke="white" stroke-width="${size / 32}" stroke-linecap="round">
    <line x1="${size * 0.2}" y1="${size * 0.25}" x2="${size * 0.8}" y2="${size * 0.25}" />
    <line x1="${size * 0.2}" y1="${size * 0.375}" x2="${size * 0.8}" y2="${size * 0.375}" />
    <line x1="${size * 0.2}" y1="${size * 0.5}" x2="${size * 0.8}" y2="${size * 0.5}" />
    <line x1="${size * 0.2}" y1="${size * 0.625}" x2="${size * 0.8}" y2="${size * 0.625}" />
  </g>
  
  <circle cx="${size * 0.8}" cy="${size * 0.8}" r="${size * 0.15}" fill="#10B981"/>
  <path d="M${size * 0.74},${size * 0.8} L${size * 0.77},${size * 0.84} L${size * 0.87},${size * 0.76}" 
        stroke="white" stroke-width="${size / 48}" stroke-linecap="round" fill="none"/>
</svg>`;

    fs.writeFileSync(filepath, svgContent);
    console.log(`Created ${filename}`);
}

const sizes = [
    { size: 16, file: 'icon-16.svg' },
    { size: 32, file: 'icon-32.svg' },
    { size: 48, file: 'icon-48.svg' },
    { size: 128, file: 'icon-128.svg' },
    { size: 512, file: 'icon-512.svg' }
];

console.log('Creating SVG icon files...');
sizes.forEach(({ size, file }) => {
    createSimplePNG(size, file);
});

console.log('\n✅ SVG icons created successfully!');
console.log('📝 Note: These are SVG files. For PNG files, please:');
console.log('   1. Open generate-icons-browser.html in your browser');
console.log('   2. Click "Download All" to get PNG files');
console.log('   3. Move the downloaded PNG files to dist/icons/');
