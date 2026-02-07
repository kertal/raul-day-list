import data from './data.json';
import { Task, TimeEntry } from './react-app-env';
import { generateUuid } from './lib/generateUuid';

interface PrevNextTimeEntry {
  prev?: TimeEntry;
  next?: TimeEntry;
}

/**
 * Fake Db class to provide functionality in the development process
 */
export class Db {
  public timeEntryList: TimeEntry[] = [];
  public taskList: Task[] = [];

  constructor() {
    this.timeEntryList = data.timeEntryList;
    this.taskList = data.taskList;
  }

  /**
   * calc delta of 2 timestamps in seconds, returns -1 if that's not possible
   */
  private static calcDuration(start?: string, end?: string): number {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return Math.round((endDate.getTime() - startDate.getTime()) / 1000);
    }
    return -1;
  }

  private static sortByTimestamp(list: TimeEntry[]): TimeEntry[] {
    return list.slice().sort((a, b) => {
      if (a.timestamp < b.timestamp) { return -1; }
      if (a.timestamp > b.timestamp) { return 1; }
      return 0;
    });
  }

  public getTimeEntryList(): Promise<TimeEntry[]> {
    return Promise.resolve(Db.sortByTimestamp(this.timeEntryList));
  }

  public async getTimeEntryListByDay(
    year: number,
    month: number,
    day: number
  ): Promise<TimeEntry[]> {
    const dateStart = new Date(year, month, day);

    if (
      dateStart.getFullYear() !== year ||
      dateStart.getMonth() !== month ||
      dateStart.getDate() !== day
    ) {
      return Promise.reject('Invalid Date');
    }

    const dateEnd = new Date(year, month, day, 23, 59, 59, 999);
    const dateStartJSON = dateStart.toJSON();
    const dateEndJSON = dateEnd.toJSON();

    const filteredList = this.timeEntryList.filter(
      te => te.timestamp >= dateStartJSON && te.timestamp <= dateEndJSON
    );

    return Promise.resolve(filteredList);
  }

  public async addTask(taskName: string): Promise<Task> {
    const newTask: Task = {
      _id: generateUuid(),
      active: true,
      subject: taskName,
      type: 'internal',
    };
    this.taskList = this.taskList.concat([newTask]);
    return newTask;
  }

  public async getTaskNameById(taskId: string): Promise<string> {
    const task = this.taskList.find(e => e._id === taskId);
    return task ? task.subject : '';
  }

  public async addTimeEntry(
    timestamp: string,
    taskId?: string
  ): Promise<TimeEntry> {

    const taskName = taskId ? await this.getTaskNameById(taskId) : '';

    const newEntry: TimeEntry = {
      _id: generateUuid(),
      comment: '',
      duration: 0,
      taskId: taskId || '',
      taskName,
      timestamp,
    };

    await this.saveTimeEntry(newEntry, true);

    return newEntry;
  }

  private async getTimeEntryById(id: string): Promise<TimeEntry> {
    const timeEntry = this.timeEntryList.find(te => te._id === id);
    if (timeEntry) {
      return timeEntry;
    }
    return Promise.reject(`No time entry available with id ${id}`);
  }

  /**
   * find the sibling time entries of the given timeEntry
   */
  private async getPrevAndNextTimeEntry(
    timeEntry: TimeEntry
  ): Promise<PrevNextTimeEntry> {
    const sorted = await this.getTimeEntryList();
    const result: PrevNextTimeEntry = {};

    sorted.some(e => {
      if (e._id !== timeEntry._id) {
        if (e.timestamp <= timeEntry.timestamp) {
          result.prev = e;
        } else if (!result.next) {
          result.next = e;
          return true;
        }
      }
      return false;
    });
    return result;
  }

  /**
   * persist given timeEntry, updates duration of related time entries
   */
  public async saveTimeEntry(timeEntry: TimeEntry, add: boolean = false): Promise<TimeEntry> {
    // Work on a copy to avoid mutating the caller's object
    const entry = { ...timeEntry };
    const docsToUpdate: TimeEntry[] = [];

    if (!add) {
      const entryInDb = await this.getTimeEntryById(entry._id);

      if (entry.taskId === 'new' && entry.taskName) {
        const task = await this.addTask(entry.taskName);
        entry.taskId = task._id;
      }

      // If the timestamp moved outside the range of its original neighbors,
      // recalculate the predecessor's duration to bridge the gap
      const {
        prev: prevInDb,
        next: nextInDb,
      } = await this.getPrevAndNextTimeEntry(entryInDb);

      if (prevInDb && (prevInDb.timestamp > entry.timestamp || (nextInDb && nextInDb.timestamp < entry.timestamp))) {
        const updatedPrev = { ...prevInDb };
        updatedPrev.duration = (prevInDb && nextInDb) ? Db.calcDuration(
          prevInDb.timestamp,
          nextInDb.timestamp
        ) : -1;
        docsToUpdate.push(updatedPrev);
      }
    }

    const { prev, next } = await this.getPrevAndNextTimeEntry(entry);
    if (prev) {
      const updatedPrev = { ...prev };
      updatedPrev.duration = Db.calcDuration(prev.timestamp, entry.timestamp);
      docsToUpdate.push(updatedPrev);
    }

    entry.duration = next
      ? Db.calcDuration(entry.timestamp, next.timestamp)
      : -1;

    let timeEntryList = this.timeEntryList;
    if (add) {
      timeEntryList = timeEntryList.concat(entry);
    } else {
      docsToUpdate.push(entry);
    }

    docsToUpdate.forEach(e => {
      const indexToReplace = timeEntryList.findIndex(te => te._id === e._id);
      timeEntryList = Object.assign([], timeEntryList, {
        [indexToReplace]: e,
      });
    });

    this.timeEntryList = Db.sortByTimestamp(timeEntryList);

    // Copy mutations back to the caller's object so it stays in sync
    Object.assign(timeEntry, entry);

    return entry;
  }

  public async deleteTimeEntryById(id: string): Promise<boolean> {
    const timeEntry = await this.getTimeEntryById(id);

    const { prev } = await this.getPrevAndNextTimeEntry(timeEntry);
    if (prev) {
      const updatedPrev = { ...prev };
      updatedPrev.duration =
        timeEntry.duration && timeEntry.duration > 0
          ? (prev.duration || 0) + timeEntry.duration
          : -1;

      const indexToReplace = this.timeEntryList.findIndex(te => te._id === prev._id);
      this.timeEntryList = Object.assign([], this.timeEntryList, {
        [indexToReplace]: updatedPrev,
      });
    }

    this.timeEntryList = this.timeEntryList.filter(te => te._id !== id);
    return true;
  }
}
