import * as React from 'react';
import Select from 'react-select/lib/Creatable';
import { ValueType } from 'react-select/lib/types';
import { Task } from '../react-app-env';

interface Props {
  focus: boolean;
  onChangeTask: (taskId: string, taskName: string) => void;
  taskId?: string;
  taskList: Task[];
}

export class TaskSelect extends React.PureComponent<Props> {
  private taskInput = React.createRef<
    Select<{ label: string; value: string }>
  >();

  public componentDidMount() {
    if (this.props.focus) {
      this.focus();
    }
  }

  public render() {
    const options = this.getOptions();
    const selectedTask = this.props.taskId
      ? options.find(t => t.value === this.props.taskId)
      : options[0];

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
  public focus() {
    const taskInput = this.taskInput.current!;
    return taskInput.focus();
  }

  private getOptions() {
    let options = this.props.taskList.map(t => ({
      label: t.subject,
      value: t._id,
    }));

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

    if (actionMeta.action === 'create-option') {
      this.props.onChangeTask('new', newValue.label.substring(0, 124));
    } else {
      this.props.onChangeTask(newValue.value, newValue.label);
    }
  };
}
