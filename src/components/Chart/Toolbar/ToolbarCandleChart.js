import React from 'react';
import classes from '../Chart.module.css';

// Initialize the controls
const controls = [
  { type: '1h' },
  { type: '4h' },
  { type: '12h' },
  { type: '1D' },
];
// Add '1W' later on

const toolbarCandleChart = (props) => {
  return (
    <div className={classes.Toolbar}>
      {controls.map((ctrl) => (
        <button
          key={ctrl.type}
          onClick={() => props.clicked(ctrl.type)}
          disabled={props.disabled === ctrl.type ? 'disabled' : ''}
        >
          {ctrl.type}
        </button>
      ))}
    </div>
  );
};

export default toolbarCandleChart;
