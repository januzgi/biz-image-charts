import React, { Component } from 'react';
import classes from './Chart.module.css';
import ApexChart from 'react-apexcharts';

class Chart extends Component {
  // Set up the state
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: 'BTC price',
          type: 'line',
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
        },
        {
          name: 'Green count',
          type: 'line',
          data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
        },
        {
          name: 'Red count',
          type: 'line',
          data: [20, 29, 37, 36, 44, 45, 50, 58],
        },
      ],
      options: {
        chart: {
          height: 350,
          type: 'line',
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [1, 1, 4],
        },
        title: {
          text: 'Image color averages and BTC price',
          align: 'left',
          offsetX: 110,
        },
        xaxis: {
          categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#008FFB',
            },
            labels: {
              style: {
                colors: '#008FFB',
              },
            },
            title: {
              text: 'Income (thousand crores)',
              style: {
                color: '#008FFB',
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: 'Income',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00E396',
            },
            labels: {
              style: {
                colors: '#00E396',
              },
            },
            title: {
              text: 'Operating Cashflow (thousand crores)',
              style: {
                color: '#00E396',
              },
            },
          },
          {
            seriesName: 'Revenue',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#FEB019',
            },
            labels: {
              style: {
                colors: '#FEB019',
              },
            },
            title: {
              text: 'Revenue (thousand crores)',
              style: {
                color: '#FEB019',
              },
            },
          },
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60,
          },
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40,
        },
      },
    };
  }

  // Sync state to props from the server
  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  // Decide whether to continue or not
  shouldComponentUpdate(nextProps, nextState) {
    return null;
  }

  render() {
    return (
      <div className={classes.chartContainer}>
        <ApexChart
          options={this.state.options}
          series={this.state.series}
          type='line'
          height={window.innerHeight - window.innerHeight * 0.2}
        />
      </div>
    );
  }
}

export default Chart;
