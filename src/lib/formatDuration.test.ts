import { formatDuration } from './formatDuration';

describe('formatDuration', () => {
  it('formats 0 seconds as 00h 00m', () => {
    expect(formatDuration(0)).toBe('00h 00m');
  });

  it('formats seconds into hours and minutes', () => {
    expect(formatDuration(3600)).toBe('01h 00m');
    expect(formatDuration(5400)).toBe('01h 30m');
    expect(formatDuration(300)).toBe('00h 05m');
  });

  it('rounds seconds to nearest minute', () => {
    expect(formatDuration(89)).toBe('00h 01m');
    expect(formatDuration(91)).toBe('00h 02m');
    expect(formatDuration(150)).toBe('00h 03m');
  });

  it('returns default for negative duration', () => {
    expect(formatDuration(-1)).toBe('00h 00m');
    expect(formatDuration(-100)).toBe('00h 00m');
  });
});
