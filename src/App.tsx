import * as React from 'react';
import Day from './day';
import { Task, TimeEntry } from './react-app-env';
import { Db } from './db';

interface State {
  taskList: Task[];
  timeEntryList: TimeEntry[];
}

const db = new Db();

export class App extends React.Component<{}, State> {
  public state = {
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
    const timeEntrySaved = await db.addTimeEntry(timestamp, taskId);
    return new Promise(resolve => {
      this.setState(
        () => ({
          timeEntryList: db.timeEntryList,
          taskList: db.taskList,
        }),
        () => resolve(timeEntrySaved)
      );
    });
  };

  private handleDeleteTimeEntry = async (
    id: string,
  ): Promise<boolean> => {
    const timeEntryDeleted = await db.deleteTimeEntryById(id);
    return new Promise(resolve => {
      this.setState(
        () => ({
          timeEntryList: db.timeEntryList,
        }),
        () => resolve(timeEntryDeleted)
      );
    });
  };

  private handleSaveTimeEntry = async (
    timeEntry: TimeEntry
  ): Promise<TimeEntry> => {
    const timeEntrySaved = await db.saveTimeEntry(timeEntry);
    return new Promise(resolve => {
      this.setState(
        () => ({
          timeEntryList: db.timeEntryList,
          taskList: db.taskList,
        }),
        () => resolve(timeEntrySaved)
      );
    });
  };

}
