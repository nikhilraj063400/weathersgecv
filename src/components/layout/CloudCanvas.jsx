import React, { useEffect, useRef } from 'react';
import { getCloudSprite } from '../../utils/cloudSprites';
import { TIME_PHASES } from '../../constants/config';
import { usePointerWind } from '../../hooks/usePointerWind';
import './CloudCanvas.css';

export function CloudCanvas({
  cloudCover = 40,
  windSpeed = 10,
  windDirection = 240,
  timePhase = TIME_PHASES.AFTERNOON,
  weatherCode = 0
}) {
  const canvasRef = useRef(null);
  const windState = usePointerWind();

  // Pick sprite tint based on weather and time phase
  const isStorm = [65, 82, 95, 96, 99].includes(weatherCode);
  let tintKey = 'day';
  if (isStorm) {
    tintKey = 'storm';
  } else if (timePhase === TIME_PHASES.GOLDEN) {
    tintKey = 'golden';
  } else if (timePhase === TIME_PHASES.DUSK) {
    tintKey = 'dusk';
  } else if (timePhase === TIME_PHASES.NIGHT) {
    tintKey = 'night';
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let lastTime = performance.now();
    let isVisible = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Handle resolution & resizing
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          width = canvas.width = Math.floor(w * dpr);
          height = canvas.height = Math.floor(h * dpr);
          ctx.scale(dpr, dpr);
          width = w;
          height = h;
        }
      }
    });
    resizeObserver.observe(canvas);

    // Initial setup with DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    // Cloud count based on cloud_cover and screen size
    const isMobile = window.innerWidth < 768;
    const maxClouds = isMobile ? 7 : 13;
    const count = Math.max(3, Math.min(maxClouds, Math.round((cloudCover / 100) * maxClouds)));

    // Drift vector derived from wind direction and speed
    const rad = ((windDirection + 180) * Math.PI) / 180; // Wind blows towards opposite direction
    const speedFactor = Math.max(0.18, Math.min(1.8, (windSpeed || 10) * 0.05));
    const driftVx = Math.cos(rad) * speedFactor;
    const driftVy = Math.sin(rad) * speedFactor * 0.4; // clouds drift primarily horizontally

    // Initialize 3-layer parallax clouds
    const clouds = [];
    const layers = [
      { name: 'far', scale: 0.55, opacity: 0.38, speedMult: 0.45, blur: 'blur(3px)' },
      { name: 'mid', scale: 0.9, opacity: 0.65, speedMult: 0.8, blur: 'blur(1px)' },
      { name: 'near', scale: 1.25, opacity: 0.9, speedMult: 1.2, blur: 'none' }
    ];

    for (let i = 0; i < count; i++) {
      const layer = layers[i % layers.length];
      const w = 420 * layer.scale;
      const h = 220 * layer.scale;
      clouds.push({
        layer,
        x: Math.random() * (width + w) - w * 0.5,
        y: Math.random() * (height * 0.65) - 30, // mostly in upper 65% of sky
        width: w,
        height: h,
        // Spring physics displacement from mouse wind
        dx: 0,
        dy: 0,
        vx: 0,
        vy: 0,
        baseScale: layer.scale
      });
    }

    // Visibility listener to pause RAF when tab is hidden
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation render loop
    function render(now) {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.1); // clamp delta-time
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const sprite = getCloudSprite(tintKey);
      const wind = windState.current;

      // Update bursts
      for (let b = wind.bursts.length - 1; b >= 0; b--) {
        const burst = wind.bursts[b];
        burst.progress += dt * 2.5;
        burst.radius += (burst.maxRadius - burst.radius) * 0.15;
        if (burst.progress >= 1) {
          wind.bursts.splice(b, 1);
        }
      }

      // Render each cloud
      for (let i = 0; i < clouds.length; i++) {
        const cloud = clouds[i];

        if (!prefersReducedMotion) {
          // 1. Environmental drift
          cloud.x += driftVx * cloud.layer.speedMult * 60 * dt;
          cloud.y += driftVy * cloud.layer.speedMult * 60 * dt;

          // Wrap edges
          if (cloud.x > width + 100) cloud.x = -cloud.width - 80;
          if (cloud.x < -cloud.width - 100) cloud.x = width + 80;
          if (cloud.y > height * 0.75) cloud.y = -cloud.height;
          if (cloud.y < -cloud.height - 40) cloud.y = height * 0.6;

          // 2. Interactive Wind Physics from pointer
          if (wind.pointerX !== -9999) {
            const centerX = cloud.x + cloud.dx + cloud.width * 0.5;
            const centerY = cloud.y + cloud.dy + cloud.height * 0.5;
            const distX = centerX - wind.pointerX;
            const distY = centerY - wind.pointerY;
            const dist = Math.sqrt(distX * distX + distY * distY);

            const pushRadius = 240 * cloud.layer.scale;
            if (dist < pushRadius && dist > 1) {
              const force = (1 - dist / pushRadius) * 4.5 * cloud.layer.speedMult;
              // Push cloud along pointer distance vector + drag velocity
              cloud.vx += (distX / dist) * force + wind.velocityX * 0.08;
              cloud.vy += (distY / dist) * force * 0.5 + wind.velocityY * 0.08;
            }
          }

          // 3. Click / Tap bursts
          for (const burst of wind.bursts) {
            const centerX = cloud.x + cloud.dx + cloud.width * 0.5;
            const centerY = cloud.y + cloud.dy + cloud.height * 0.5;
            const distX = centerX - burst.x;
            const distY = centerY - burst.y;
            const dist = Math.sqrt(distX * distX + distY * distY);

            if (dist < burst.radius && dist > 1) {
              const impulse = (1 - dist / burst.radius) * burst.force * 6;
              cloud.vx += (distX / dist) * impulse;
              cloud.vy += (distY / dist) * impulse * 0.6;
            }
          }

          // 4. Spring relaxation toward equilibrium
          const springK = 2.2;
          const damping = 0.88;
          cloud.vx += -cloud.dx * springK * dt;
          cloud.vy += -cloud.dy * springK * dt;
          cloud.vx *= damping;
          cloud.vy *= damping;

          cloud.dx += cloud.vx;
          cloud.dy += cloud.vy;
        }

        // Tilt parallax offset
        const parallaxX = wind.tiltX * 25 * cloud.layer.speedMult;
        const parallaxY = wind.tiltY * 15 * cloud.layer.speedMult;

        const drawX = cloud.x + cloud.dx + parallaxX;
        const drawY = cloud.y + cloud.dy + parallaxY;

        ctx.save();
        ctx.globalAlpha = cloud.layer.opacity;
        ctx.drawImage(sprite, drawX, drawY, cloud.width, cloud.height);
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cloudCover, windSpeed, windDirection, tintKey]);

  return (
    <canvas
      ref={canvasRef}
      id="cloud-canvas"
      className="cloud-canvas-layer"
      aria-hidden="true"
    />
  );
}
