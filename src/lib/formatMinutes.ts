/**
 * formats a give number of minutes in format 00h 00m
 * @param min
 * @returns {string}
 */
export function formatMinutes(min: number): string {
  const hours = Math.floor(min / 60);
  const minutes = min - hours * 60;

  const minutesStr = minutes < 10 ? `0${minutes}` : String(minutes);
  const hoursStr = hours < 10 ? `0${hours}` : String(hours);

  return `${hoursStr}h ${minutesStr}m`;
}


