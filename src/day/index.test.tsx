import React from 'react';
import ReactDOM from 'react-dom';
import DayView from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DayView />, div);
  ReactDOM.unmountComponentAtNode(div);
});
