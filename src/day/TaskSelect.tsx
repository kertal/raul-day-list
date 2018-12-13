// note: refactoring of the Task Select used in RowEdit for better modularisation
import * as React from 'react';
import Select from 'react-select/lib/Creatable';
import { ValueType } from 'react-select/lib/types';
import { Task, TimeEntry } from '../react-app-env';

interface Props {
  onChangeTask: (task: any) => void;
  task?: Task;
  taskList: Task[];
  timeEntry: TimeEntry;
}

interface State {
  activityId: string;
  task?: Task;
  taskId: string;
  taskName: string;
}

export class TaskSelect extends React.Component<Props, State> {
  public static defaultProps = {
    focusField: '',
    style: {},
  };
  private taskInput = React.createRef<
    Select<{ label: string; value: string }>
  >();

  constructor(props: Props) {
    super(props);
    const timeEntry = props.timeEntry || {};

    this.state = {
      activityId: '',
      task: props.task,
      taskId: timeEntry.taskId ? timeEntry.taskId : '',
      taskName: '',
    };
  }

  public componentDidMount() {
    if (this.focus) {
      this.focus();
    }
  }

  public render() {
    const options = this.getOptions();
    const selectedTask = this.state.taskId
      ? options.find(t => t.value === this.state.taskId)
      : options[0];

    // an expanding text area for the comments might be an option
    // https://alistapart.com/article/expanding-text-areas-made-elegant

    return (
      <Select
        ref={this.taskInput}
        options={options}
        value={selectedTask}
        styles={this.getSelectStyle()}
        onChange={this.handleTaskChange}
      />
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

  /**
   * Explicitly focus inputs using the raw DOM API
   * Note: we're accessing "current" to get the DOM node
   */
  private focus() {
    const taskInput = this.taskInput.current!;
    return taskInput.focus();
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
        }
      }
    }
    this.props.onChangeTask(state);

  };
}
