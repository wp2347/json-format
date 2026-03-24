const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 128, 512];

function generateIcon(size) {
    const canvas = require('canvas').createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const radius = size * 0.125;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = '#3B82F6';
    ctx.fill();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = size / 32;
    ctx.lineCap = 'round';

    const padding = size * 0.2;
    const lineHeight = size / 8;
    const lineLength = size * 0.6;

    for (let i = 0; i < 4; i++) {
        const y = padding + i * lineHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + lineLength, y);
        ctx.stroke();
    }

    const circleRadius = size * 0.15;
    const circleX = size - padding - circleRadius;
    const circleY = size - padding - circleRadius;

    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#10B981';
    ctx.fill();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = size / 48;
    ctx.beginPath();
    ctx.moveTo(circleX - circleRadius * 0.4, circleY);
    ctx.lineTo(circleX - circleRadius * 0.1, circleY + circleRadius * 0.4);
    ctx.lineTo(circleX + circleRadius * 0.5, circleY - circleRadius * 0.2);
    ctx.stroke();

    return canvas;
}

const distDir = path.join(__dirname, 'dist', 'icons');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

sizes.forEach(size => {
    const canvas = generateIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const filename = `icon-${size}.png`;
    const filepath = path.join(distDir, filename);
    fs.writeFileSync(filepath, buffer);
    console.log(`Generated ${filename}`);
});

console.log('All icons generated successfully!');
