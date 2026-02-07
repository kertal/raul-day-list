import { formatMinutes } from './formatMinutes';

describe('formatMinutes', () => {
  it('formats 0 minutes as 00h 00m', () => {
    expect(formatMinutes(0)).toBe('00h 00m');
  });

  it('formats minutes less than 60 with leading zero hours', () => {
    expect(formatMinutes(5)).toBe('00h 05m');
    expect(formatMinutes(30)).toBe('00h 30m');
    expect(formatMinutes(59)).toBe('00h 59m');
  });

  it('formats exactly 60 minutes as 1 hour', () => {
    expect(formatMinutes(60)).toBe('01h 00m');
  });

  it('formats minutes greater than 60', () => {
    expect(formatMinutes(90)).toBe('01h 30m');
    expect(formatMinutes(125)).toBe('02h 05m');
  });

  it('formats large values correctly', () => {
    expect(formatMinutes(600)).toBe('10h 00m');
    expect(formatMinutes(1440)).toBe('24h 00m');
  });

  it('pads single-digit hours and minutes with leading zeros', () => {
    expect(formatMinutes(1)).toBe('00h 01m');
    expect(formatMinutes(61)).toBe('01h 01m');
    expect(formatMinutes(69)).toBe('01h 09m');
  });
});
