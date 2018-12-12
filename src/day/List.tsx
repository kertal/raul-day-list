import * as React from 'react';
import css from './styles.module.css';
import { ActionBar } from './ActionBar';
import RowSum from './RowSum';
import {
  IActivity,
  ITask,
  ITimeEntry,
  IUserSettingsProps,
} from '../react-app-env';
import RowView from './RowView';
import { RowEdit } from './RowEdit';

interface IProps {
  activityList: IActivity[];
  date: number;
  settings: IUserSettingsProps;
  taskList: ITask[];
  timeEntryList: ITimeEntry[];
}

interface IState {
  editFocusFieldId: string;
  editId: string;
  editTask: ITask | null;
}

export class List extends React.Component<IProps, IState> {
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

  private renderRow(timeEntry: ITimeEntry) {
    const edit = this.state.editId && this.state.editId === timeEntry._id;

    if (edit) {
      return this.renderEditRow(timeEntry);
    } else {
      return this.renderViewRow(timeEntry);
    }
  }

  private renderViewRow(timeEntry: ITimeEntry) {
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

  private renderEditRow(timeEntry: ITimeEntry) {
    return (
      <RowEdit
        activityList={this.props.activityList}
        focusField={this.state.editFocusFieldId}
        key={`rowEdit${timeEntry._id}`}
        onSaveClick={() => {
          this.setState(() => ({ editId: '' }));
        }}
        taskList={this.props.taskList}
        timeEntry={timeEntry}
      />
    );
  }
}

export default List;
