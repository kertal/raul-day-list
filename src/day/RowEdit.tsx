// note: ongoing refactoring of the Task Select to a seperate component to reduce complexity
import * as React from 'react';
import Select from 'react-select/lib/Creatable';
import css from './styles.module.css';
import { Button } from '../shared/Button';
import { ValueType } from 'react-select/lib/types';
import { Activity, Task, TimeEntry, TimeEntryPersist } from '../react-app-env';

interface IProps {
  activityList: Activity[];
  focusField?: string;
  onChangeTask?: (taskId: string) => Task;
  onRemoveClick?: () => void;
  onSaveClick: (
    newTimeEntry: TimeEntryPersist,
    prevTimeEntry: TimeEntry
  ) => void;
  task?: Task;
  taskList: Task[];
  timeEntry: TimeEntry;
}

interface IState {
  comment: string;
  timestamp: string;
  task?: Task;
  taskId: string;
  taskName: string;
  activityId: string;
}

export class RowEdit extends React.Component<IProps, IState> {
  public static defaultProps = {
    focusField: '',
    style: {},
  };
  private activityInput = React.createRef<HTMLSelectElement>();
  private commentInput = React.createRef<HTMLInputElement>();
  private timeInput = React.createRef<HTMLInputElement>();
  private taskInput = React.createRef<
    Select<{ label: string; value: string }>
  >();

  constructor(props: IProps) {
    super(props);
    const timeEntry = props.timeEntry || {};

    this.state = {
      activityId: this.getActivityId(timeEntry, props.activityList),
      comment: timeEntry.comment || '',
      task: props.task,
      taskId: timeEntry.taskId ? timeEntry.taskId : '',
      taskName: '',
      timestamp: timeEntry.timestamp,
    };
  }

  public componentDidMount() {
    this.focus();
  }

  public render() {
    const time = this.state.timestamp
      ? new Date(this.state.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    const options = this.getOptions();
    const selectedTask = this.state.taskId
      ? options.find(t => t.value === this.state.taskId)
      : options[0];

    // an expanding text area for the comments might be an option
    // https://alistapart.com/article/expanding-text-areas-made-elegant

    return (
      <div className={css.row}>
        <div className={css.colIcon}>
          <span>⏱</span>
        </div>
        <div className={css.colTime}>
          <input
            ref={this.timeInput}
            type="time"
            style={{ width: '75px' }}
            required
            value={time}
            step="300"
            onChange={ev => this.handleTimeChange(ev)}
            onKeyDown={({ keyCode }) => {
              if (keyCode === 13) {
                this.handleSaveClick();
              }
            }}
          />
        </div>
        <div className={css.colDuration} />
        <div className={css.colTask}>
          {!selectedTask && this.props.task ? (
            this.props.task.subject
          ) : (
            <Select
              ref={this.taskInput}
              options={options}
              value={selectedTask}
              styles={this.getSelectStyle()}
              onChange={this.handleTaskChange}
            />
          )}
          <input
            style={{
              margin: '2px 0 4px 0',
              width: '100%',
            }}
            ref={this.commentInput}
            onKeyDown={({ keyCode }) => {
              if (keyCode === 13) {
                this.handleSaveClick();
              }
            }}
            onChange={({ target }) => {
              this.setState({ comment: target.value });
            }}
            placeholder="Your comment"
            value={this.state.comment}
            type="text"
            maxLength={255}
          />
          {this.renderActivitySelect()}
        </div>

        <div className={css.colAction}>
          <Button type="save" async onClick={() => this.handleSaveClick()}>
            Save
          </Button>
          <Button disabled type="remove" async onClick={this.props.onRemoveClick}>
            Remove
          </Button>
        </div>
      </div>
    );
  }

  private getSelectStyle = () => ({
    control: (styles: object) => ({
      ...styles,
      backgroundColor: 'white',
      borderRadius: '0',
      margin: '0 0 3px 0',
      minHeight: '20px',
      padding: '0px 0px',
    }),
    dropdownIndicator: (styles: object) => ({
      ...styles,
      padding: '1px 1px',
    }),
    option: (styles: object) => ({
      ...styles,
    }),
    singleValue: (styles: object) => ({
      ...styles,
      minHeight: '18px',
      padding: '1px 4px',
    }),
    valueContainer: (styles: object) => ({
      ...styles,
      minHeight: '20px',
      padding: '0px 0px',
    }),
  });

  private getActivityId(timeEntry: TimeEntry, activityList: Activity[]) {
    if (timeEntry && timeEntry.activityId) {
      return String(timeEntry.activityId);
    }

    if (activityList && activityList.length) {
      return String(activityList[0].id);
    }
    return '';
  }

  /**
   * Explicitly focus inputs using the raw DOM API
   * Note: we're accessing "current" to get the DOM node
   */
  private focus() {

    switch (this.props.focusField) {
      case 'activity':
        const activityInput = this.activityInput.current!;
        return activityInput.focus();
      case 'comment':
        const commentInput = this.commentInput.current!;
        return commentInput.focus();
      case 'task':
        const taskInput = this.taskInput.current!;
        return taskInput.focus();
      default:
        const timeInput = this.timeInput.current!;
        return timeInput.focus();
    }
  }

  private getOptions() {
    let options = this.props.taskList.map(t => ({
      label: t.subject,
      value: t._id,
    }));

    if (this.state.taskId === 'new') {
      options.push({ value: 'new', label: this.state.taskName });
    }
    options = options.sort((a, b) => (a.label > b.label ? 1 : -1));
    options.unshift({ value: '', label: '- (Untracked Time)' });
    return options;
  }

  private async handleSaveClick() {
    const { timeEntry } = this.props;

    const newTimeEntry = {
      _id: timeEntry._id,
      activityId: String(this.state.activityId),
      comment: this.state.comment,
      taskId: '',
      taskName: '',
      timestamp: this.state.timestamp,
    };

    if (this.state.taskId === 'new') {
      newTimeEntry.taskName = this.state.taskName;
    } else {
      newTimeEntry.taskId = this.state.taskId;
    }
    this.props.onSaveClick(newTimeEntry, timeEntry);
  }

  private handleTimeChange(ev: React.FormEvent<HTMLInputElement>): void {
    const { value } = ev.currentTarget;
    const { timestamp } = this.state;
    if (value) {
      const valueSplitted = value.split(':');
      const date = new Date(timestamp);
      date.setHours(Number(valueSplitted[0]), Number(valueSplitted[1]), 0, 0);
      this.setState({ timestamp: date.toJSON() });
    }
  }

  private handleTaskChange = async (
    newValue: ValueType<{ label: string; value: string }>,
    actionMeta: { action: string }
  ) => {
    if (!newValue || typeof newValue !== 'object') {
      return;
    }

    if (Array.isArray(newValue)) {
      newValue = newValue[0];
    }

    const state: {
      activityId: string;
      taskId: string;
      taskName: string;
      task?: Task;
    } = {
      activityId: this.state.activityId,
      taskId: '',
      taskName: '',
    };

    if (actionMeta.action === 'create-option') {
      state.taskId = 'new';
      state.taskName = newValue.label.substring(0, 124);
      state.activityId = '';
    } else {
      state.taskId = newValue.value;
      if (state.taskId && typeof this.props.onChangeTask === 'function') {
        const task = await this.props.onChangeTask(state.taskId);
        if (typeof task === 'object') {
          state.task = task;
          if (state.task.activityInput && state.task.activityInput.defaultId) {
            state.activityId = state.task.activityInput.defaultId;
          }
        }
      }
    }

    this.setState(prevState => Object.assign({}, prevState, state));
  };
  /**
   * the activity select is currently just rendered for redmine data
   * this might change in the future, but needs an internal activity
   * administration (currently it's just imported from redmine)
   * @returns {*}
   */
  private renderActivitySelect() {
    if (
      !this.state.task ||
      !this.state.task.activityInput ||
      !this.state.task.activityInput.list
    ) {
      return null;
    }

    return (
      <select
        ref={this.activityInput}
        onChange={ev => {
          this.setState({
            activityId: ev.target.value,
          });
        }}
        value={this.state.activityId}
      >
        {this.state.task.activityInput.list.map(e => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
    );
  }
}
