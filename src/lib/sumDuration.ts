import {ITimeEntry} from '../react-app-env';

export function sumDuration(docs: ITimeEntry[]): number {
  return docs.reduce((acc, doc) => {
    if (!doc.taskId || typeof doc.duration !== 'number') {
      return acc;
    }
    return acc + Math.round(doc.duration);
  }, 0);
}
