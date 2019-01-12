import * as React from 'react';
import Day from './day';
import { Activity, Task, TimeEntry } from './react-app-env';
import { Db } from './db';

interface State {
  activityList: Activity[];
  settings: {};
  taskList: Task[];
  timeEntryList: TimeEntry[];
}

const db = new Db();

export class App extends React.Component<any, State> {
  public state = {
    activityList: [],
    settings: {},
    taskList: db.taskList,
    timeEntryList: db.timeEntryList,
  };

  public render() {
    return (
      <Day
        {...this.state}
        onAddTimeEntry={this.handleAddTimeEntry}
        onDeleteTimeEntry={this.handleDeleteTimeEntry}
        onSaveTimeEntry={this.handleSaveTimeEntry}
      />
    );
  }
  private handleAddTimeEntry = async (
    timestamp: string,
    taskId?: string
  ): Promise<TimeEntry> => {
    return new Promise(async (resolve, reject) => {
      try {
        const timeEntrySaved = await db.addTimeEntry(timestamp, taskId);
        const newState = {
          timeEntryList: db.timeEntryList,
          taskList: db.taskList,
        };
        this.setState(
          () => newState,
          () => {
            resolve(timeEntrySaved);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  };

  private handleDeleteTimeEntry = async (
    id: string,
  ): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const timeEntryDeleted = await db.deleteTimeEntryById(id);
        const newState = {
          timeEntryList: db.timeEntryList,
        };
        this.setState(
          () => newState,
          () => {
            resolve(timeEntryDeleted);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  };

  private handleSaveTimeEntry = async (
    timeEntry: TimeEntry
  ): Promise<TimeEntry> => {
    return new Promise(async (resolve, reject) => {
      try {
        const timeEntrySaved = await db.saveTimeEntry(timeEntry);
        const newState = {
          timeEntryList: db.timeEntryList,
          taskList: db.taskList,
        };
        this.setState(
          () => (newState),
          () => {
            resolve(timeEntrySaved);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  };

}
