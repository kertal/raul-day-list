import * as React from 'react';
import css from './styles.module.css';
import { ActionBar } from './ActionBar';
import RowSum from './RowSum';
import { Activity, Task, TimeEntry, UserSettingsProps } from '../react-app-env';
import RowView from './RowView';
import { RowEdit } from './RowEdit';

interface Props {
  activityList: Activity[];
  date: number;
  onAddTimeEntry: (timestamp: string, taskId?: string) => Promise<TimeEntry>;
  onDeleteTimeEntry: (id: string) => Promise<boolean>;
  onSaveTimeEntry: (timeEntry: TimeEntry) => Promise<TimeEntry>;
  settings: UserSettingsProps;
  taskList: Task[];
  timeEntryList: TimeEntry[];
}

interface State {
  editFocusFieldId: string;
  editId: string;
  editTask: Task | null;
}

export class List extends React.Component<Props, State> {
  public state = {
    editFocusFieldId: '',
    editId: '',
    editTask: null,
  };

  public render() {
    const { timeEntryList } = this.props;
    if (timeEntryList.length === 0) {
      return this.renderEmpty();
    }

    return (
      <div className={css.wrapper}>
        <div className={css.headerRow}>
          <div className={css.colIcon} />
          <div className={css.colTime}>Start</div>
          <div className={css.colDuration}>Duration</div>
          <div className={css.colTask}>Task</div>
          <div className={css.colAction}>Actions</div>
        </div>
        <div className={css.body}>
          {timeEntryList.map(timeEntry => this.renderRow(timeEntry))}
          <div className={css.row}>{this.renderActionBar(timeEntryList)}</div>
        </div>
        <RowSum timeEntryList={this.props.timeEntryList} />
      </div>
    );
  }

  private renderActionBar(list: TimeEntry[]) {
    return (
      <ActionBar
        date={this.props.date}
        disabled={!!this.state.editId}
        onAddTimeEntry={async (
          type: string,
          timestamp: string,
          taskId?: string
        ) => {
          const result = await this.props.onAddTimeEntry(timestamp, taskId);
          if (type !== 'stop') {
            this.setState(() => ({ editId: result._id }));
          }
          return result;
        }}
        timeEntryList={list}
      />
    );
  }

  private renderEmpty() {
    return (
      <div className={css.wrapper}>
        <div className={`${css.row} ${css.rowNoActivities}`}>
          There are no activities logged for this day.
        </div>
        <div className={css.row}>{this.renderActionBar([])}</div>
      </div>
    );
  }

  private renderRow(timeEntry: TimeEntry) {

    if (this.state.editId === timeEntry._id) {
      return this.renderEditRow(timeEntry);
    } else {
      return this.renderViewRow(timeEntry);
    }
  }

  private renderViewRow(timeEntry: TimeEntry) {
    const {editId} = this.state;

    return (
      <RowView
        activityList={this.props.activityList}
        disabled={!!editId && editId !== timeEntry._id}
        key={`rowView${timeEntry._id}`}
        onEditClick={(id: string, focusId: string) =>
          this.setState(() => ({
            editId: id,
            editFocusFieldId: focusId,
          }))
        }
        onDeleteClick={(id: string) => this.props.onDeleteTimeEntry(id)}
        settings={this.props.settings}
        timeEntry={timeEntry}
      />
    );
  }

  private renderEditRow(timeEntry: TimeEntry) {
    return (
      <RowEdit
        activityList={this.props.activityList}
        focusField={this.state.editFocusFieldId}
        key={`rowEdit${timeEntry._id}`}
        onSaveClick={async newTimeEntry => {
          try {
            await this.props.onSaveTimeEntry(newTimeEntry);
            this.setState(() => ({ editId: '' }));
            return Promise.resolve();
          } catch (e) {
            return Promise.reject(e);
          }
        }}
        taskList={this.props.taskList}
        timeEntry={timeEntry}
      />
    );
  }
}
