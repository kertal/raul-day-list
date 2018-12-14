// note: ongoing refactoring of the Task Select to a seperate component to reduce complexity
import * as React from 'react';
import css from './styles.module.css';
import { Button } from '../shared/Button';
import { Activity, Task, TimeEntry, TimeEntryPersist } from '../react-app-env';
import { TaskSelect } from './TaskSelect';

interface Props {
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

interface State {
  comment: string;
  timestamp: string;
  task?: Task;
  taskId: string;
  taskName: string;
  activityId: string;
}

export class RowEdit extends React.Component<Props, State> {
  public static defaultProps = {
    focusField: '',
  };
  private activityInput = React.createRef<HTMLSelectElement>();
  private commentInput = React.createRef<HTMLInputElement>();
  private timeInput = React.createRef<HTMLInputElement>();
  private taskInput = React.createRef<TaskSelect>();

  constructor(props: Props) {
    super(props);
    const timeEntry = props.timeEntry || {};

    this.state = {
      activityId: timeEntry.activityId || '',
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
          <TaskSelect
            ref={this.taskInput}
            focus={this.props.focusField === 'task'}
            onChangeTask={(taskId, taskName) => {
              this.setState({ taskId, taskName });
            }}
            taskId={this.state.taskId}
            taskList={this.props.taskList}
          />
          <input
            style={{
              margin: '2px 0 4px 0',
              width: '100%',
            }}
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
          <Button
            disabled
            type="remove"
            async
            onClick={this.props.onRemoveClick}
          >
            Remove
          </Button>
        </div>
      </div>
    );
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
