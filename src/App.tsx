import * as React from 'react';
import Day from './day';
import { Activity, Task, TimeEntry } from './react-app-env';
import { Db } from './db';

interface IState {
  activityList: Activity[];
  settings: {};
  taskList: Task[];
  timeEntryList: TimeEntry[];
}

const db = new Db();

export class App extends React.Component<any, IState> {
  public state = {
    activityList: [],
    settings: {},
    taskList: db.taskList,
    timeEntryList: db.timeEntryList,
  };

  public render() {
    return <Day {...this.state} onSaveTimeEntry={this.handleSaveTimeEntry} />;
  }

  private handleSaveTimeEntry = async (timeEntry: TimeEntry): Promise<TimeEntry> => {
    return new Promise(async(resolve, reject) => {
      try {
        const timeEntrySaved =  await db.saveTimeEntry(timeEntry);
        this.setState(
          () => ({
            timeEntryList: db.timeEntryList,
            taskList: db.taskList,
          }),
          () => {
            resolve(timeEntrySaved);
          }
        );
      } catch(e) {
        reject(e);
      }
    });
  };
}
