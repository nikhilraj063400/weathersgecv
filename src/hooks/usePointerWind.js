import { useEffect, useRef, useCallback } from 'react';

/**
 * Tracks pointer movement, drag momentum, click bursts, and device orientation
 * to drive wind physics on the cloud canvas.
 */
export function usePointerWind() {
  const windState = useRef({
    pointerX: -9999,
    pointerY: -9999,
    prevPointerX: -9999,
    prevPointerY: -9999,
    velocityX: 0,
    velocityY: 0,
    isDown: false,
    tiltX: 0,
    tiltY: 0,
    bursts: [] // [{ x, y, radius, force, progress }]
  });

  const handlePointerMove = useCallback((e) => {
    const state = windState.current;
    const x = e.clientX;
    const y = e.clientY;

    if (state.pointerX !== -9999) {
      // Calculate instantaneous pointer velocity
      state.velocityX = (x - state.pointerX) * 0.4;
      state.velocityY = (y - state.pointerY) * 0.4;
    }

    state.prevPointerX = state.pointerX;
    state.prevPointerY = state.pointerY;
    state.pointerX = x;
    state.pointerY = y;
  }, []);

  const handlePointerDown = useCallback((e) => {
    windState.current.isDown = true;
    // Create an immediate soft puff burst on click/tap
    windState.current.bursts.push({
      x: e.clientX,
      y: e.clientY,
      radius: 30,
      maxRadius: 180,
      force: 2.2,
      progress: 0
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    windState.current.isDown = false;
  }, []);

  const handlePointerLeave = useCallback(() => {
    windState.current.pointerX = -9999;
    windState.current.pointerY = -9999;
    windState.current.velocityX = 0;
    windState.current.velocityY = 0;
    windState.current.isDown = false;
  }, []);

  // Device orientation tilt for mobile parallax
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        // Clamp gamma (-30 to 30) and beta (-30 to 30)
        const tiltX = Math.max(-30, Math.min(30, e.gamma)) / 30;
        const tiltY = Math.max(-30, Math.min(30, e.beta - 45)) / 30; // normalized around typical 45deg holding angle
        windState.current.tiltX = tiltX;
        windState.current.tiltY = tiltY;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerDown, handlePointerUp, handlePointerLeave]);

  return windState;
}
