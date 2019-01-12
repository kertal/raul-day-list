import * as React from 'react';
import css from './styles.module.css';
import { formatDuration } from '../lib/formatDuration';
import { Button } from '../shared/Button';
import { Activity, TimeEntry, UserSettingsProps } from '../react-app-env';

interface Props {
  activityList: Activity[];
  disabled: boolean;
  onEditClick: (id: string, focusId: string) => void;
  onDeleteClick: (id: string) => Promise<boolean>;
  settings: UserSettingsProps;
  style?: React.StyleHTMLAttributes<any>;
  timeEntry: TimeEntry;
}

export default class RowView extends React.PureComponent<Props> {
  public render() {
    const { timeEntry, disabled, onEditClick, onDeleteClick } = this.props;
    const { duration = 0 } = timeEntry;

    const style = Object.assign(
      {
        backgroundColor: timeEntry.taskId ? '' : '',
        color: timeEntry.taskId ? '' : '#AAA',
        opacity: disabled ? 0.2 : 1,
      },
      this.props.style
    );

    const icon = timeEntry.taskId ? '⏱' : null;
    const timeStamp = new Date(timeEntry.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const tabIndex = this.props.disabled ? undefined : 0;

    return (
      <div className={css.row} key={timeEntry._id} style={style}>
        <div className={css.colIcon}>{icon}️</div>
        <div
          role="button"
          tabIndex={tabIndex}
          className={css.colTime}
          onClick={() => this.props.onEditClick(timeEntry._id, '')}
          onKeyDown={({ keyCode }) => {
            if (keyCode === 13) {
              this.props.onEditClick(timeEntry._id, '');
            }
          }}
        >
          <div className={css.cellOnClick}>{timeStamp}</div>
        </div>
        <div className={css.colDuration}>
          {duration > 0 ? formatDuration(duration) : ''}
        </div>
        <div className={css.colTask} style={{ paddingBottom: '8px' }}>
          <div
            role="button"
            tabIndex={tabIndex}
            className={css.cellOnClick}
            onClick={() => onEditClick(timeEntry._id, 'task')}
            onKeyDown={({ keyCode }) => {
              if (keyCode === 13) {
                onEditClick(timeEntry._id, 'task');
              }
            }}
          >
            {timeEntry.taskName ? timeEntry.taskName : 'Untracked time'}
          </div>
          {timeEntry.comment && (
            <div
              role="button"
              tabIndex={tabIndex}
              className={css.cellOnClick}
              onClick={() => onEditClick(timeEntry._id, 'comment')}
              onKeyDown={({ keyCode }) =>
                keyCode === 13 && onEditClick(timeEntry._id, 'comment')
              }
              style={{
                color: '#999',
                padding: '2px 0 3px 3px',
              }}
            >
              {timeEntry.comment}
            </div>
          )}
        </div>
        <div className={css.colAction}>
          <Button type="edit" onClick={() => onEditClick(timeEntry._id, '')}>
            Edit
          </Button>
          <Button
            type="remove"
            async
            onClick={() => onDeleteClick(timeEntry._id)}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }
}
