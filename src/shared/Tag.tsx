import React, { Component } from 'react';
import css from './Tag.module.css';

interface IProps {
  children: any;
  onClick?: () => void;
}

export class Tag extends Component<IProps> {
  public render() {
    return (
      <div
        role="button"
        className={css.button}
        onClick={this.props.onClick}
        tabIndex={0}
        onKeyDown={this.props.onClick}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Tag;
