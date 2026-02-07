import { getNewTimestamp } from './getNewTimestamp';
import { TimeEntry } from '../react-app-env';

function makeEntry(overrides: Partial<TimeEntry> = {}): TimeEntry {
  return {
    _id: 'test-id',
    timestamp: '2019-01-15T08:00:00.000Z',
    ...overrides,
  };
}

describe('getNewTimestamp', () => {
  // Use a fixed "now" time to avoid flakiness
  const jan15_10am = new Date('2019-01-15T10:00:00.000Z').getTime();
  const jan15_date = new Date('2019-01-15T00:00:00.000Z').getTime();

  it('returns current time as ISO string when no previous entries exist', () => {
    const result = getNewTimestamp(jan15_date, [], 1, jan15_10am);
    expect(result).toBeTruthy();
    const parsed = new Date(result);
    expect(parsed.getTime()).toBeGreaterThan(0);
  });

  it('returns a valid ISO date string', () => {
    const result = getNewTimestamp(jan15_date, [], 1, jan15_10am);
    expect(() => new Date(result)).not.toThrow();
    expect(new Date(result).toJSON()).toBe(result);
  });

  it('rounds minutes down when previous entry has no task (floor rounding)', () => {
    const entries = [makeEntry({ taskId: '' })];
    const nowTime = new Date('2019-01-15T10:07:00.000Z').getTime();
    const result = getNewTimestamp(jan15_date, entries, 5, nowTime);
    const resultDate = new Date(result);
    expect(resultDate.getMinutes() % 5).toBe(0);
  });

  it('rounds minutes up when previous entry has a task (ceil rounding)', () => {
    const entries = [makeEntry({ taskId: 'task-1' })];
    const nowTime = new Date('2019-01-15T10:07:00.000Z').getTime();
    const result = getNewTimestamp(jan15_date, entries, 5, nowTime);
    const resultDate = new Date(result);
    expect(resultDate.getMinutes() % 5).toBe(0);
  });

  it('uses margin when date is not today or timestamp is after last entry', () => {
    const pastDate = new Date('2019-01-10T00:00:00.000Z').getTime();
    const entries = [
      makeEntry({ timestamp: '2019-01-10T08:00:00.000Z', taskId: 'task-1' }),
    ];
    const result = getNewTimestamp(pastDate, entries, 5, jan15_10am);
    const resultDate = new Date(result);
    // Should be 5 minutes after the previous entry
    expect(resultDate.getTime()).toBe(
      new Date('2019-01-10T08:00:00.000Z').getTime() + 5 * 60000
    );
  });

  it('defaults to 5 minute margin when defaultTimeUnitInMin < 5', () => {
    const pastDate = new Date('2019-01-10T00:00:00.000Z').getTime();
    const entries = [
      makeEntry({ timestamp: '2019-01-10T08:00:00.000Z', taskId: 'task-1' }),
    ];
    const result = getNewTimestamp(pastDate, entries, 1, jan15_10am);
    const resultDate = new Date(result);
    expect(resultDate.getTime()).toBe(
      new Date('2019-01-10T08:00:00.000Z').getTime() + 5 * 60000
    );
  });
});
