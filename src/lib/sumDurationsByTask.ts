import { TimeEntry } from '../react-app-env';

export interface TaskSummary {
  _id: string;
  taskId: string;
  taskName: string;
  duration: number;
}

export function sumDurationByTaskId(
  docs: TimeEntry[]
): Map<string, TaskSummary> {
  return docs.reduce((acc: Map<string, TaskSummary>, timeEntry) => {
    if (!timeEntry.taskId || typeof timeEntry.duration !== 'number') {
      return acc;
    }
    const duration = Math.round(timeEntry.duration);

    const existing = acc.get(timeEntry.taskId);
    if (!existing) {
      return acc.set(timeEntry.taskId, {
        _id: timeEntry.taskId,
        taskId: timeEntry.taskId,
        taskName: timeEntry.taskName || '',
        duration,
      });
    }
    existing.duration += duration;
    return acc;
  }, new Map());
}
