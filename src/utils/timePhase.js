import { TIME_PHASES } from '../constants/config';

/**
 * Converts "YYYY-MM-DDTHH:MM" string to minutes from midnight
 */
function parseTimeToMinutes(isoStr) {
  if (!isoStr) return null;
  const timePart = isoStr.includes('T') ? isoStr.split('T')[1] : isoStr;
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  return h * 60 + m;
}

/**
 * Determines the time phase (dawn, morning, afternoon, golden, dusk, night)
 * strictly using the city's local time and sunrise/sunset.
 */
export function calculateTimePhase(currentTimeIso, sunriseIso, sunsetIso, isDay = 1) {
  const nowMin = parseTimeToMinutes(currentTimeIso);
  const riseMin = parseTimeToMinutes(sunriseIso);
  const setMin = parseTimeToMinutes(sunsetIso);

  // If sunrise/sunset are missing, fallback to standard hour approximation
  if (nowMin === null || riseMin === null || setMin === null) {
    if (nowMin === null) return isDay ? TIME_PHASES.AFTERNOON : TIME_PHASES.NIGHT;
    const hour = Math.floor(nowMin / 60);
    if (hour >= 5 && hour < 7) return TIME_PHASES.DAWN;
    if (hour >= 7 && hour < 12) return TIME_PHASES.MORNING;
    if (hour >= 12 && hour < 17) return TIME_PHASES.AFTERNOON;
    if (hour >= 17 && hour < 19) return TIME_PHASES.GOLDEN;
    if (hour >= 19 && hour < 21) return TIME_PHASES.DUSK;
    return TIME_PHASES.NIGHT;
  }

  const middayMin = Math.round((riseMin + setMin) / 2);

  // 1. Dawn: sunrise - 45m to sunrise + 30m
  if (nowMin >= riseMin - 45 && nowMin < riseMin + 30) {
    return TIME_PHASES.DAWN;
  }

  // 2. Morning: sunrise + 30m to midday - 60m
  if (nowMin >= riseMin + 30 && nowMin < middayMin - 60) {
    return TIME_PHASES.MORNING;
  }

  // 3. Afternoon: midday - 60m to sunset - 90m
  if (nowMin >= middayMin - 60 && nowMin < setMin - 90) {
    return TIME_PHASES.AFTERNOON;
  }

  // 4. Golden hour: sunset - 90m to sunset + 15m
  if (nowMin >= setMin - 90 && nowMin < setMin + 15) {
    return TIME_PHASES.GOLDEN;
  }

  // 5. Dusk: sunset + 15m to sunset + 60m
  if (nowMin >= setMin + 15 && nowMin < setMin + 60) {
    return TIME_PHASES.DUSK;
  }

  // 6. Night: all other hours
  return TIME_PHASES.NIGHT;
}

/**
 * Returns a warm contextual greeting based on local time phase
 */
export function getTimeOfDayGreeting(phase, currentTimeIso) {
  if (phase === TIME_PHASES.DAWN || phase === TIME_PHASES.MORNING) {
    return 'Good morning';
  }
  if (phase === TIME_PHASES.AFTERNOON || phase === TIME_PHASES.GOLDEN) {
    return 'Good afternoon';
  }
  if (phase === TIME_PHASES.DUSK) {
    return 'Good evening';
  }
  // Night: past 10 PM can be "Good night" or "Good evening"
  if (currentTimeIso) {
    const min = parseTimeToMinutes(currentTimeIso);
    if (min !== null && min >= 22 * 60) return 'Good night';
  }
  return 'Good evening';
}
