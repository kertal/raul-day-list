import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import DayView from './day';
import data from './data.json';

ReactDOM.render(
  <DayView
    activityList={data.activityList}
    timeEntryList={data.timeEntryList}
    taskList={data.taskList}
    settings={data.settings}
  />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
