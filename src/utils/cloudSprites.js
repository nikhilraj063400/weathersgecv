/**
 * Pre-renders realistic multi-puff cloud sprites onto offscreen canvases
 * to ensure maximum 60fps rendering performance.
 */

const spriteCache = new Map();

export function getCloudSprite(tintKey = 'day') {
  if (spriteCache.has(tintKey)) {
    return spriteCache.get(tintKey);
  }

  const canvas = document.createElement('canvas');
  const width = 420;
  const height = 220;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  let coreColor = 'rgba(255, 255, 255, 0.95)';
  let edgeColor = 'rgba(235, 245, 255, 0)';
  let rimColor = 'rgba(255, 255, 255, 0.4)';

  if (tintKey === 'golden') {
    coreColor = 'rgba(255, 245, 230, 0.92)';
    edgeColor = 'rgba(255, 180, 120, 0)';
    rimColor = 'rgba(255, 195, 135, 0.55)';
  } else if (tintKey === 'dusk') {
    coreColor = 'rgba(215, 220, 245, 0.85)';
    edgeColor = 'rgba(150, 158, 195, 0)';
    rimColor = 'rgba(195, 180, 225, 0.45)';
  } else if (tintKey === 'night') {
    coreColor = 'rgba(110, 135, 185, 0.7)';
    edgeColor = 'rgba(40, 65, 110, 0)';
    rimColor = 'rgba(145, 175, 225, 0.3)';
  } else if (tintKey === 'storm') {
    coreColor = 'rgba(75, 90, 120, 0.9)';
    edgeColor = 'rgba(35, 45, 70, 0)';
    rimColor = 'rgba(95, 115, 150, 0.4)';
  }

  // Puff cluster definition: [x, y, radius]
  const puffs = [
    [100, 130, 55],
    [150, 105, 75],
    [210, 95, 85],
    [270, 110, 70],
    [320, 135, 55],
    [180, 140, 60],
    [240, 145, 65],
    [130, 150, 45]
  ];

  ctx.clearRect(0, 0, width, height);

  // Draw radial puffs
  for (const [px, py, r] of puffs) {
    const grad = ctx.createRadialGradient(px, py, r * 0.15, px, py, r);
    grad.addColorStop(0, coreColor);
    grad.addColorStop(0.7, rimColor);
    grad.addColorStop(1, edgeColor);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  spriteCache.set(tintKey, canvas);
  return canvas;
}
