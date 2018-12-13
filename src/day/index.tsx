import * as React from 'react';
import { DaySelect } from './DaySelect';
import { List } from './List';
import { Page } from '../shared/Page';
import {Activity, Task, TimeEntry} from '../react-app-env';

interface IProps {
  activityList: Activity[],
  settings: {},
  taskList: Task[],
  timeEntryList: TimeEntry[],
}

interface IState {
  activityList: Activity[],
  date: number;
  settings: {},
  taskList: Task[],
  timeEntryList: TimeEntry[]
}

class Day extends React.Component<IProps, IState> {
  public state = {
    activityList: this.props.activityList,
    date: Date.now(),
    settings: this.props.settings,
    taskList: this.props.taskList,
    timeEntryList: this.props.timeEntryList,
  };

  public render() {
    const dateObj = new Date(this.state.date);
    const dateStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const dateEnd = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23,59,59,999);
    const dateStartJSON = dateStart.toJSON();
    const dateEndJSON = dateEnd.toJSON();

    const timeEntryList = this.state.timeEntryList.filter(te =>
       te.timestamp >= dateStartJSON && te.timestamp <= dateEndJSON
    );

    return (
      <Page pathname={'/day'} headerRight={this.renderDaySelect()}>
        <List
          activityList={this.state.activityList}
          timeEntryList={timeEntryList}
          date={this.state.date}
          taskList={this.state.taskList}
          settings={this.state.settings}
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
