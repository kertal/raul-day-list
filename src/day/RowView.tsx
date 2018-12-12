import * as React from 'react';
import css from './styles.module.css';
import { formatDuration } from '../lib/formatDuration';
import { Button } from '../shared/Button';
import { Tag } from '../shared/Tag';
import {IActivity, ITimeEntry,IUserSettingsProps} from '../react-app-env';

interface IProps {
  activityList: IActivity[];
  disabled: boolean;
  onEditClick: (id: string, focusId: string) => void;
  settings: IUserSettingsProps;
  style?: React.StyleHTMLAttributes<any>;
  timeEntry: ITimeEntry;
}

export default class RowView extends React.PureComponent<IProps> {
  public render() {
    const { timeEntry, disabled } = this.props;
    const { duration = 0 } = timeEntry;

    const style = Object.assign(
      {
        backgroundColor: timeEntry.taskId ? '' : '',
        color: timeEntry.taskId ? '' : '#AAA',
        opacity: disabled ? 0.2 : 1,
      },
      this.props.style
    );
    const activity = timeEntry.activityId
      ? this.props.activityList.find(
          act => String(act.id) === timeEntry.activityId
        )
      : null;

    const icon = timeEntry.taskId ? '⏱' : '';
    const timeStamp = new Date(timeEntry.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className={css.row} key={timeEntry._id} style={style}>
        <div className={css.colIcon}>{icon}️</div>
        <div
          role="button"
          tabIndex={0}
          className={css.colTime}
          onClick={() => this.props.onEditClick(timeEntry._id,'') }
          onKeyDown={(ev) => ev.key === 'Enter'}
        >
          <div className={css.cellOnClick}>
            {timeStamp}
          </div>
        </div>
        <div className={css.colDuration}>
          {duration > 0 ? formatDuration(duration) : ''}
        </div>
        <div className={css.colTask} style={{ paddingBottom: '8px' }}>
          <div
            role="button"
            tabIndex={0}
            className={css.cellOnClick}
            onClick={() => this.props.onEditClick(timeEntry._id,'task') }
          >
            {timeEntry.taskName ? timeEntry.taskName : 'Untracked time'}
          </div>
          {timeEntry.comment && (
            <div
              role="button"
              tabIndex={0}
              className={css.cellOnClick}
              onClick={() => this.props.onEditClick(timeEntry._id,'comment') }
              style={{
                color: '#999',
                padding: '2px 0 3px 3px',
              }}
            >
              {timeEntry.comment}
            </div>
          )}
          {this.renderRedminePart(timeEntry, activity)}
        </div>
        <div className={css.colAction}>
          <Button type="edit" onClick={() => this.props.onEditClick(timeEntry._id, '')}>
            Edit
          </Button>
          <Button type="remove" disabled async onClick={() => void(0)}>
            Remove
          </Button>
        </div>
      </div>
    );
  }

  private renderRedminePart(
    timeEntry: ITimeEntry,
    activity: IActivity | null | undefined,
    onEditClick?: (focusId: string) => void
  ) {
    if (!timeEntry.externalData) {
      return null;
    }

    return (
      <div>
        <Tag>
          Redmine #
          {timeEntry.externalData.issueId}
        </Tag>
        {timeEntry.externalData.syncError && (
          <div style={{ color: 'red', padding: '5px' }}>
            {timeEntry.externalData.syncError}
            Please change the activity for successful syncing to redmine!
          </div>
        )}
      </div>
    );
  }
}