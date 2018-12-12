import {ITask, ITimeEntry} from '../react-app-env';


export function sumDurationByTaskId(
  docs: ITimeEntry[]
): Map<string, ITask> {
  return docs.reduce((acc, timeEntry) => {
    if (!timeEntry.taskId || typeof timeEntry.duration !== 'number') {
      return acc;
    }
    const duration = Math.round(timeEntry.duration);

    if (!acc.get(timeEntry.taskId)) {
      return acc.set(timeEntry.taskId, Object.assign({}, timeEntry, {duration}));
    }
    const summary = acc.get(timeEntry.taskId);
    summary.duration += duration;
    return acc.set(timeEntry.taskId, summary);
  }, new Map());
}