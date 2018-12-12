import * as React from 'react';
import { Button } from '../shared/Button';
import { ITimeEntry } from '../react-app-env';

interface IProps {
  disabled: boolean;
  timeEntryList: ITimeEntry[];
}

export class ActionBar extends React.PureComponent<IProps> {
  public render() {
    const { timeEntryList } = this.props;
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
        <Button type="start" disabled onClick={() => void 0}>
          {!lastEntryTaskId ? 'Start new Task' : 'Switch Task'}
        </Button>
        {lastEntryTaskId && (
          <Button type="stop" disabled onClick={() => void 0}>
            Stop Task
          </Button>
        )}
        {prevTaskId && (
          <Button disabled onClick={() => void 0}>
            Continue previous task
          </Button>
        )}
      </div>
    );
  }
}

export default ActionBar;
