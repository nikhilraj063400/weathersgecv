import React, { useMemo } from 'react';
import { TIME_PHASES } from '../../constants/config';
import morningImg from '../../assets/backgrounds/morning.jpg';
import afternoonImg from '../../assets/backgrounds/afternoon.jpg';
import dawnSvg from '../../assets/backgrounds/dawn.svg';
import goldenSvg from '../../assets/backgrounds/golden.svg';
import duskSvg from '../../assets/backgrounds/dusk.svg';
import nightSvg from '../../assets/backgrounds/night.svg';
import morningSvg from '../../assets/backgrounds/morning.svg';
import afternoonSvg from '../../assets/backgrounds/afternoon.svg';
import './SkyBackground.css';

const PHASE_BACKGROUNDS = {
  [TIME_PHASES.DAWN]: dawnSvg,
  [TIME_PHASES.MORNING]: morningImg || morningSvg,
  [TIME_PHASES.AFTERNOON]: afternoonImg || afternoonSvg,
  [TIME_PHASES.GOLDEN]: goldenSvg,
  [TIME_PHASES.DUSK]: duskSvg,
  [TIME_PHASES.NIGHT]: nightSvg
};

export function SkyBackground({ phase = TIME_PHASES.AFTERNOON, weatherCode = 0 }) {
  const currentBg = PHASE_BACKGROUNDS[phase] || morningImg;

  // Determine weather effects from WMO code
  const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  const isHeavyRain = [65, 82, 99].includes(weatherCode);
  const isThunder = [95, 96, 99].includes(weatherCode);
  const isFog = [45, 48].includes(weatherCode);
  const isSnow = [71, 73, 75, 77, 85, 86].includes(weatherCode);

  // Generate deterministic rain droplet positions
  const droplets = useMemo(() => {
    if (!isRain) return [];
    const count = isHeavyRain ? 32 : 18;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 100) / count + (Math.sin(i * 99) * 3)}%`,
      top: `${(i * 13) % 80}%`,
      height: `${14 + (i % 6) * 5}px`,
      width: `${2 + (i % 3) * 0.8}px`,
      delay: `${(i * 0.35) % 4}s`,
      duration: `${1.4 + ((i * 7) % 15) / 10}s`
    }));
  }, [isRain, isHeavyRain]);

  return (
    <div className={`sky-background-root phase-${phase} ${isFog ? 'effect-fog' : ''} ${isSnow ? 'effect-snow' : ''}`}>
      {/* Background Image Layer with Crossfade */}
      <div
        className="sky-image-layer"
        style={{ backgroundImage: `url(${currentBg})` }}
        aria-hidden="true"
      />

      {/* Atmospheric Deep Blue Contrast Overlay */}
      <div className="sky-contrast-overlay" aria-hidden="true" />

      {/* Lightning Flash Layer for Thunderstorms */}
      {isThunder && <div className="sky-lightning-flash" aria-hidden="true" />}

      {/* Animated Rain Droplets sliding down the glass */}
      {isRain && (
        <div className="rain-glass-layer" aria-hidden="true">
          {droplets.map((d) => (
            <div
              key={d.id}
              className="rain-droplet"
              style={{
                left: d.left,
                width: d.width,
                height: d.height,
                animationDelay: d.delay,
                animationDuration: d.duration
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
