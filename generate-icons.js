const sharp = require('sharp');
const fs = require('fs');

async function createIcon(size, filename, padding = 0) {
  const innerSize = size - padding * 2;
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#0a0e17" />
    <circle cx="${size/2}" cy="${size/2}" r="${innerSize/2}" fill="#00f2fe" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${innerSize/2.5}" fill="#ffffff" font-weight="bold">OS</text>
  </svg>`;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(filename);
}

async function run() {
  await createIcon(192, 'public/pwa-192x192.png');
  await createIcon(512, 'public/pwa-512x512.png');
  await createIcon(512, 'public/pwa-maskable-512x512.png', 50);
  await createIcon(180, 'public/apple-touch-icon.png');
  console.log('Icons generated successfully.');
}

run().catch(console.error);
