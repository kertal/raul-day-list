import * as React from 'react';
import { DaySelect } from './DaySelect';
import { List } from './List';
import { Page } from '../shared/Page';
import { Task, TimeEntry } from '../react-app-env';

interface Props {
  onAddTimeEntry: (time: string, taskId?: string) => Promise<TimeEntry>;
  onDeleteTimeEntry: (id: string) => Promise<boolean>;
  onSaveTimeEntry: (timeEntry: TimeEntry) => Promise<TimeEntry>;
  taskList: Task[];
  timeEntryList: TimeEntry[];
}

interface State {
  date: number;
}

class Day extends React.Component<Props, State> {
  public state = {
    date: Date.now(),
  };

  public render() {
    const dateObj = new Date(this.state.date);
    const dateStart = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate()
    );
    const dateEnd = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      23,
      59,
      59,
      999
    );
    const dateStartJSON = dateStart.toJSON();
    const dateEndJSON = dateEnd.toJSON();

    const timeEntryList = this.props.timeEntryList.filter(
      te => te.timestamp >= dateStartJSON && te.timestamp <= dateEndJSON
    );

    return (
      <Page pathname={'/day'} headerRight={this.renderDaySelect()}>
        <List
          date={this.state.date}
          onAddTimeEntry={this.props.onAddTimeEntry}
          onDeleteTimeEntry={this.props.onDeleteTimeEntry}
          onSaveTimeEntry={this.props.onSaveTimeEntry}
          taskList={this.props.taskList}
          timeEntryList={timeEntryList}
        />
      </Page>
    );
  }

  private renderDaySelect() {
    return (
      <DaySelect
        date={this.state.date}
        onChange={value => this.setState({ date: value })}
      />
    );
  }
}

export default Day;
