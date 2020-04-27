import React from 'react';
import classes from '../Chart.module.css';

// Initialize the controls
const controls = [
  { label: '1D', type: 'one_day' },
  { label: 'ALL', type: 'all' },
];

const toolbarLineChart = (props) => {
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
      {/* Also 1W, 1M and YTD buttons later on */}
    </div>
  );
};

export default toolbarLineChart;
