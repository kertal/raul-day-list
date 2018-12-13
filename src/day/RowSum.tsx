import * as React from 'react';
import css from './styles.module.css';
import { Task,TimeEntry} from '../react-app-env';
import { formatDuration } from '../lib/formatDuration';
import { sumDuration } from '../lib/sumDuration';
import {sumDurationByTaskId} from '../lib/sumDurationsByTask';

interface Props {
  timeEntryList: TimeEntry[];
}

interface State {
  showDetails: boolean;
}

export default class RowSum extends React.Component<Props, State> {
  public state = {
    showDetails: false,
  };

  public render() {
    const { timeEntryList } = this.props;
    const sum = sumDuration(timeEntryList);
    const sumByTask = sumDurationByTaskId(timeEntryList);
    return (
      <div className={css.sectionSum}>
        {this.state.showDetails && sumByTask
          ? this.renderDetails(sumByTask)
          : this.renderSummary(formatDuration(sum))}
      </div>
    );
  }
  private handleSelectChange = (ev: React.SyntheticEvent<HTMLSelectElement>) => {
    this.setState({ showDetails: ev.currentTarget.value === 'totalByTask' });
  };

  private renderSelect() {
    return (
      <select
        className={css.sectionSumSelect}
        onChange={this.handleSelectChange}
        value={this.state.showDetails ? 'totalByTask' : 'total'}
      >
        <option value="total">Total:</option>
        <option value="totalByTask">By Task:</option>
      </select>
    );
  }

  private renderDetails(sumByTask: Map<string, Task>) {
    return Array.from(sumByTask.values()).map(this.renderDetailsTask);
  }

  private renderDetailsTask = (task: Task, idx: number) => (
    <div className={css.row} key={task._id}>
      <div className={css.colIcon}>
        {idx === 0 && (
          <span role="img" aria-label="Statistics">
            📊
          </span>
        )}
      </div>
      <div className={css.colTime}>{idx === 0 && this.renderSelect()}</div>
      <div className={css.colDuration}>
        {task.duration ? formatDuration(task.duration) : 0}
      </div>
      <div className={css.colTask}>{task.taskName}</div>
      <div className={css.colAction} />
    </div>
  );

  private renderSummary(sum: string) {
    return (
      <div className={css.row} key="sum">
        <div className={css.colIcon}>
          <span role="img" aria-label="Statistics">
            📊
          </span>
        </div>
        <div className={css.colTime}>
          {!this.state.showDetails && this.renderSelect()}
        </div>
        <div className={css.colDuration}>
          <b>{sum}</b>
        </div>
        <div className={css.colTask} />
        <div className={css.colAction} />
      </div>
    );
  }
}
