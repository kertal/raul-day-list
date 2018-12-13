import {TimeEntry} from '../react-app-env';

export function sumDuration(docs: TimeEntry[]): number {
  return docs.reduce((acc, doc) => {
    if (!doc.taskId || typeof doc.duration !== 'number') {
      return acc;
    }
    return acc + Math.round(doc.duration);
  }, 0);
}
