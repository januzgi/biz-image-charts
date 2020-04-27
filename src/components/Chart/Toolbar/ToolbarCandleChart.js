import React from 'react';
import classes from '../Chart.module.css';

// Initialize the controls
const controls = [
  { label: '1h', type: 'candlestick_one_hour' },
  { label: '4h', type: 'candlestick_four_hours' },
  { label: '12h', type: 'candlestick_twelve_hours' },
  { label: '1D', type: 'candlestick_one_day' },
];
// Add 'candlestick_one_week' later on

const toolbarCandleChart = (props) => {
  return (
    <div className={classes.Toolbar}>
      {controls.map((ctrl) => (
        <button
          key={ctrl.type}
          onClick={() => props.clicked(ctrl.type)}
          disabled={props.disabled === ctrl.type ? 'disabled' : ''}
        >
          {ctrl.label}
        </button>
      ))}
    </div>
  );
};

export default toolbarCandleChart;
