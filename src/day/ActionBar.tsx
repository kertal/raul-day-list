import * as React from 'react';
import {Button} from '../shared/Button';
import {TimeEntry} from '../react-app-env';
import {getNewTimestamp} from '../lib/getNewTimestamp';

interface Props {
  date: number;
  disabled: boolean;
  onAddTimeEntry: (type: string, timestamp: string, task?: string) => Promise<TimeEntry>;
  timeEntryList: TimeEntry[];
}

export class ActionBar extends React.PureComponent<Props> {
  private handleAddTimeEntry(type: string, taskId: string = ''): Promise<TimeEntry> {
    const {date, timeEntryList} = this.props;

    const timestamp = getNewTimestamp(date, timeEntryList);
    return this.props.onAddTimeEntry(type, timestamp, taskId);
  }

  public render() {
    const {timeEntryList} = this.props;
    const lastEntry = timeEntryList[timeEntryList.length - 1];
    const lastEntryTaskId = lastEntry && lastEntry.taskId;

    const prevTask = timeEntryList[timeEntryList.length - 2];
    const prevTaskId = prevTask && prevTask.taskId ? prevTask.taskId : null;
    const style = {
      opacity: this.props.disabled ? 0.2 : 1,
      paddingLeft: '0.5em',
    };

    return (
      <div style={style}>
        <Button type="start" onClick={() => this.handleAddTimeEntry('new')}>
          {!lastEntryTaskId ? 'Start new Task' : 'Switch Task'}
        </Button>
        {lastEntryTaskId && (
          <Button type="stop" onClick={() => this.handleAddTimeEntry('stop')}>
            Stop Task
          </Button>
        )}
        {prevTaskId && (
          <Button onClick={() => this.handleAddTimeEntry('continue', prevTaskId)}>
            Continue previous task
          </Button>
        )}
      </div>
    );
  }
}
