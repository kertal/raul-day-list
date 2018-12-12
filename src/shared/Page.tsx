import React, { Component } from 'react';
import css from './Page.module.css';

interface IProps {
  children: any;
  pathname: any;
  headerRight: any;
}

/**
 * this component is responsible for the layout
 */
export class Page extends Component<IProps> {
  public render() {
    return (
      <div className={css.container}>
        <header>
          <nav className={css.left}>
            <span className={css.circle} />
            <select defaultValue={this.props.pathname}>
              <option value="/day">by Day</option>
              <option value="/settings" disabled>
                Settings
              </option>
            </select>
          </nav>
          <div className={css.right}>{this.props.headerRight}</div>
        </header>
        <main>{this.props.children}</main>
      </div>
    );
  }
}
