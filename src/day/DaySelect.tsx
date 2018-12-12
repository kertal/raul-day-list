import * as React from 'react';
import css from './DaySelect.module.css';
import { formatDate } from '../lib/formatDate';

interface IProps {
  date: number;
  onChange: (sec: number) => void;
}

export class DaySelect extends React.PureComponent<IProps> {
  public render() {
    const d = new Date(this.props.date);
    const dayname = d.toLocaleString(window.navigator.language, {
      weekday: 'long',
    });

    return (
      <span>
        {dayname},
        <input
          className={css.daySelect}
          type="date"
          required
          value={formatDate(this.props.date)}
          onChange={this.handleChange}
        />
      </span>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(ev.target.value);
    const time = d.getTime();

    if (time > 0) {
      this.props.onChange(time);
    }
  };
}
