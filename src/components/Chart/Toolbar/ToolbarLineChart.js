import React from 'react';
import classes from '../Chart.module.css';

// Initialize the controls
const controls = [
  { label: '1D', type: 'one_day' },
  { label: 'ALL', type: 'all' },
  { label: 'Past Week', type: 'past_week' },
];

// Initialize the controls
const datapointControls = [
  { label: '12h', type: 'data_12h' },
  { label: '4h', type: 'data_4h' },
  { label: '2h', type: 'data_2h' },
  { label: '1h', type: 'data_1h' },
  { label: '30m', type: 'data_30m' },
  { label: '15m', type: 'data_15m' },
  { label: '5m', type: 'data_5m' },
];

const toolbarLineChart = (props) => {
  return (
    <div className={classes.Toolbar}>
      {controls.map((ctrl) => (
        <button
          key={ctrl.type}
          onClick={() => props.clicked(ctrl.type)}
          disabled={props.disabledTimeframe === ctrl.type ? 'disabled' : ''}
        >
          {ctrl.label}
        </button>
      ))}
      {/* Also 1W, 1M and YTD buttons later on */}
      <div>
        {datapointControls.map((ctrl) => (
          <button
            key={ctrl.type}
            onClick={() => props.changeView(ctrl.type)}
            disabled={props.disabledDataDensity === ctrl.type ? 'disabled' : ''}
          >
            {ctrl.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default toolbarLineChart;
