import { sumDurationByTaskId } from './sumDurationsByTask';
import { TimeEntry } from '../react-app-env';

function makeEntry(overrides: Partial<TimeEntry> = {}): TimeEntry {
  return {
    _id: 'test-id',
    timestamp: '2019-01-01T08:00:00.000Z',
    taskId: 'task-1',
    taskName: 'Task One',
    duration: 3600,
    ...overrides,
  };
}

describe('sumDurationByTaskId', () => {
  it('returns an empty map for an empty list', () => {
    const result = sumDurationByTaskId([]);
    expect(result.size).toBe(0);
  });

  it('groups durations by task id', () => {
    const entries = [
      makeEntry({ _id: '1', taskId: 'task-1', duration: 1800 }),
      makeEntry({ _id: '2', taskId: 'task-2', taskName: 'Task Two', duration: 3600 }),
      makeEntry({ _id: '3', taskId: 'task-1', duration: 900 }),
    ];
    const result = sumDurationByTaskId(entries);
    expect(result.size).toBe(2);
    expect(result.get('task-1')!.duration).toBe(2700);
    expect(result.get('task-2')!.duration).toBe(3600);
  });

  it('excludes entries without a taskId', () => {
    const entries = [
      makeEntry({ taskId: '', duration: 1800 }),
      makeEntry({ taskId: 'task-1', duration: 3600 }),
    ];
    const result = sumDurationByTaskId(entries);
    expect(result.size).toBe(1);
    expect(result.get('task-1')!.duration).toBe(3600);
  });

  it('excludes entries without a numeric duration', () => {
    const entries = [
      makeEntry({ taskId: 'task-1', duration: undefined }),
      makeEntry({ _id: '2', taskId: 'task-1', duration: 3600 }),
    ];
    const result = sumDurationByTaskId(entries);
    expect(result.size).toBe(1);
    expect(result.get('task-1')!.duration).toBe(3600);
  });
});
