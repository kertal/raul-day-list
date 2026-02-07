import { sumDuration } from './sumDuration';
import { TimeEntry } from '../react-app-env';

function makeEntry(overrides: Partial<TimeEntry> = {}): TimeEntry {
  return {
    _id: 'test-id',
    timestamp: '2019-01-01T08:00:00.000Z',
    taskId: 'task-1',
    duration: 3600,
    ...overrides,
  };
}

describe('sumDuration', () => {
  it('returns 0 for an empty list', () => {
    expect(sumDuration([])).toBe(0);
  });

  it('sums durations of entries with taskIds', () => {
    const entries = [
      makeEntry({ duration: 1800 }),
      makeEntry({ duration: 3600 }),
    ];
    expect(sumDuration(entries)).toBe(5400);
  });

  it('excludes entries without a taskId (untracked time)', () => {
    const entries = [
      makeEntry({ duration: 1800, taskId: '' }),
      makeEntry({ duration: 3600 }),
    ];
    expect(sumDuration(entries)).toBe(3600);
  });

  it('excludes entries without a numeric duration', () => {
    const entries = [
      makeEntry({ duration: undefined }),
      makeEntry({ duration: 3600 }),
    ];
    expect(sumDuration(entries)).toBe(3600);
  });

  it('rounds durations before summing', () => {
    const entries = [
      makeEntry({ duration: 1800.7 }),
      makeEntry({ duration: 3600.3 }),
    ];
    expect(sumDuration(entries)).toBe(5401);
  });
});
