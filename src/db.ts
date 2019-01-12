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
   * @param start
   * @param end
   * @returns {number}
   */
  private static calcDuration(start?: string, end?: string): number {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return Math.round((endDate.getTime() - startDate.getTime()) / 1000);
    }
    return -1;
  }

  public getTimeEntryList(): Promise<TimeEntry[]> {
    const timeList = this.timeEntryList.sort((a, b) => {
      return a.timestamp > b.timestamp ? 1 : -1;
    });
    return Promise.resolve(timeList);
  }

  public async getTimeEntryListByDay(
    year: number,
    month: number,
    day: number
  ): Promise<TimeEntry[]> {
    const dateStart = new Date(year, month, day);

    if (
      dateStart.getFullYear() !== year ||
      dateStart.getMonth() !== month + 1 ||
      dateStart.getDay() !== day + 1
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

  public async getTaskNameById(taskId : string) {
    const task = this.taskList.find(e =>
       e._id === taskId
    );
   return Promise.resolve(task ? task.subject : '');
  }

  public async addTimeEntry(
    timestamp: string,
    taskId?: string
  ): Promise<TimeEntry> {

    const taskName =  taskId ? await this.getTaskNameById(taskId) :'';

    const newEntry: TimeEntry = {
      _id: generateUuid(),
      comment: '',
      duration: 0,
      taskId: taskId || '',
      taskName: taskName,
      timestamp: timestamp,
    };

    await this.saveTimeEntry(newEntry, true);

    return Promise.resolve(newEntry);
  }

  private async getTimeEntryById(id: string): Promise<TimeEntry> {
    const timeEntry = this.timeEntryList.find(te => te._id === id);
    if (timeEntry) {
      return Promise.resolve(timeEntry);
    } else {
      return Promise.reject(`No time entry available with id ${id}`);
    }
  }

  /**
   * find the sibling time entries of the given timeEntry
   */
  private async getPrevAndNextTimeEntry(
    timeEntry: TimeEntry
  ): Promise<PrevNextTimeEntry> {
    const timeEntryList = await this.getTimeEntryList();
    const result: PrevNextTimeEntry = {};

    timeEntryList.some(e => {
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
    const docsToUpdate = [];
    if(!add) {
      const entryInDb = await this.getTimeEntryById(timeEntry._id);

      if (timeEntry.taskId === 'new' && timeEntry.taskName) {
        const task = await this.addTask(timeEntry.taskName);
        timeEntry.taskId = task._id;
      }

      // change the time entry of the timeEntries previous entry
      // given the new timestamp is lt the previous entry, or gt the next entry
      // so the user set a timestamp out of the range between the persists prev/next entries
      const {
        prev: prevInDb,
        next: nextInDb,
      } = await this.getPrevAndNextTimeEntry(entryInDb);

      if (prevInDb && (prevInDb.timestamp > timeEntry.timestamp || (nextInDb && nextInDb.timestamp < timeEntry.timestamp))) {
        prevInDb.duration = (prevInDb && nextInDb) ? Db.calcDuration(
          prevInDb.timestamp,
          nextInDb.timestamp
        ) : -1;
        docsToUpdate.push(prevInDb);
      }
    }


    const { prev, next } = await this.getPrevAndNextTimeEntry(timeEntry);
    if (prev) {
      prev.duration = Db.calcDuration(prev.timestamp, timeEntry.timestamp);
      docsToUpdate.push(prev);
    }

    timeEntry.duration = next
      ? Db.calcDuration(timeEntry.timestamp, next.timestamp)
      : -1;

    let timeEntryList = this.timeEntryList;
    if(add) {
      timeEntryList = timeEntryList.concat(timeEntry);
    } else {
      docsToUpdate.push(timeEntry);
    }

    docsToUpdate.forEach(e => {
      const indexToReplace = timeEntryList.findIndex(te => te._id === e._id);
      timeEntryList = Object.assign([], timeEntryList, {
        [indexToReplace]: e,
      });
    });

    this.timeEntryList = timeEntryList.sort((a,b) => {
      return a.timestamp > b.timestamp ? 1 : -1
    });

    return Promise.resolve(timeEntry);
  }

  public async deleteTimeEntryById(id: string): Promise<boolean> {
    let timeEntryList = this.timeEntryList;

    const timeEntry = await this.getTimeEntryById(id);
    if (!timeEntry) {
      return Promise.reject(`No timeEntry with the given id ${id}`);
    }

    const { prev } = await this.getPrevAndNextTimeEntry(timeEntry);
    if (prev) {
      prev.duration =
        timeEntry.duration && timeEntry.duration > 0
          ? (prev.duration || 0) + timeEntry.duration
          : -1;

      const indexToReplace = timeEntryList.findIndex(te => te._id === prev._id);
      timeEntryList = Object.assign([], timeEntryList, {
        [indexToReplace]: prev,
      });
    }

    this.timeEntryList = timeEntryList
      .filter(te => te._id !== id);
    return Promise.resolve(true);
  }
}
