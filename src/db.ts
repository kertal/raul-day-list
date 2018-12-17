import data from './data.json';
import {Task, TimeEntry} from "./react-app-env";
import {generateUuid} from "./lib/generateUuid";

/**
 * Fake Db class to provide functionality in the development process
 */
export class Db {
  public timeEntryList:TimeEntry[] = [];
  public taskList:Task[] = [];

  constructor(){
    this.timeEntryList = data.timeEntryList;
    this.taskList = data.taskList;
  }

  public addTask(taskName: string): Task {

    const newTask: Task = {
      _id: generateUuid(),
      active: true,
      subject: taskName,
      type: 'internal',
    };
    this.taskList = this.taskList.concat([newTask]);
    return newTask;
  }

  public saveTimeEntry(timeEntry: TimeEntry): Promise<TimeEntry> {

    if (typeof timeEntry !== 'object') {
      return Promise.reject('Invalid timeEntry given, no object');
    } else if (!timeEntry._id) {
      return Promise.reject('Invalid timeEntry given, no _id');
    }

    if (timeEntry.taskId === 'new' && timeEntry.taskName) {
      const task = this.addTask(timeEntry.taskName);
      timeEntry.taskId = task._id;
    }

    const indexToReplace = this.timeEntryList.findIndex(
      te => te._id === timeEntry._id
    );
    this.timeEntryList =  Object.assign([], this.timeEntryList, {
      [indexToReplace]: timeEntry,
    });

    return Promise.resolve(timeEntry);
  }

}