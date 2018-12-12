import { formatMinutes } from './formatMinutes';

/**
 * formats a given number of seconds to format 00m 00s
 * @param duration
 * @returns {string}
 */
export function formatDuration(duration: number) {
  if (typeof duration !== 'number' && duration <= 0) {
    return '00m 00s';
  }
  return formatMinutes(Math.round(duration / 60));
}
