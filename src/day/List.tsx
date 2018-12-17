import * as React from 'react';
import css from './styles.module.css';
import { ActionBar } from './ActionBar';
import RowSum from './RowSum';
import {
  Activity,
  Task,
  TimeEntry,
  UserSettingsProps,
} from '../react-app-env';
import RowView from './RowView';
import { RowEdit } from './RowEdit';

interface Props {
  activityList: Activity[];
  date: number;
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
          <div className={css.row}>
            <ActionBar
              disabled={!!this.state.editId}
              timeEntryList={timeEntryList}
            />
          </div>
        </div>
        <RowSum timeEntryList={this.props.timeEntryList} />
      </div>
    );
  }

  private renderEmpty() {
    return (
      <div className={css.wrapper}>
        <div className={`${css.row} ${css.rowNoActivities}`}>
          There are no activities logged for this day.
        </div>
        <div className={css.row}>
          <ActionBar disabled={!!this.state.editId} timeEntryList={[]} />
        </div>
      </div>
    );
  }

  private renderRow(timeEntry: TimeEntry) {
    const edit = this.state.editId && this.state.editId === timeEntry._id;

    if (edit) {
      return this.renderEditRow(timeEntry);
    } else {
      return this.renderViewRow(timeEntry);
    }
  }

  private renderViewRow(timeEntry: TimeEntry) {
    const disabled = !!this.state.editId && this.state.editId !== timeEntry._id;
    const handleEditClick = (id: string, focusId: string) =>
      this.setState(() => ({ editId: id, editFocusFieldId: focusId }));

    return (
      <RowView
        activityList={this.props.activityList}
        disabled={disabled}
        key={`rowView${timeEntry._id}`}
        onEditClick={handleEditClick}
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
        onSaveClick={async (newTimeEntry) => {
          try{
            await this.props.onSaveTimeEntry(newTimeEntry);
            this.setState(() => ({ editId: '' }));
            return Promise.resolve();
          } catch(e) {
            return Promise.reject(e)
          }
        }}
        taskList={this.props.taskList}
        timeEntry={timeEntry}
      />
    );
  }
}

export default List;
