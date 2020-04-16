import React, { Component } from 'react';
import classes from './Chart.module.css';
import ApexChart from 'react-apexcharts';
import './Chart.module.css';

class Chart extends Component {
  // Set up the state
  constructor(props) {
    super(props);

    // A time-series graph is a data viz tool that plots data
    // values at progressive intervals of time. With ApexCharts,
    //a time-series is created if you provide timestamp values in
    // the series as shown below and set xaxis.type to ‘datetime’.

    // series: [{
    //   data: [{
    //     x: new Date('2018-02-12').getTime(),
    //     y: 76
    //   }, {
    //     x: new Date('2018-02-12').getTime(),
    //     y: 76
    //   }]
    // }],
    // xaxis: {
    //   type: 'datetime'
    // }

    this.state = {
      series: [
        {
          name: 'BTC price',
          type: 'line',
          data: [5600, 6000, 5842, 7912, 8273, 7329, 6482, 7938],
        },
        {
          name: 'Green count',
          type: 'line',
          data: [21, 32, 36, 44, 54, 49, 53, 25],
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
          fontFamily: 'Roboto',
          zoom: {
            autoScaleYaxis: true,
          },
          background: '#fefefe',
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#f2a900', '#008000', '#cc0033'],
        stroke: {
          width: [5, 2, 2],
          curve: 'smooth',
        },
        fill: {
          type: ['solid', 'solid', 'gradient'],
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 1,
            colorStops: [
              {
                offset: 0,
                color: '#cc0033',
                opacity: 1,
              },
              {
                offset: 100,
                color: '#ff8da1',
                opacity: 1,
              },
            ],
          },
        },
        title: {
          text: 'Image color averages and BTC price',
          align: 'left',
          offsetX: 0,
        },
        xaxis: {
          categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
        },
        yaxis: [
          {
            min: 4000,
            max: 9000,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#f2a900',
            },
            labels: {
              style: {
                colors: '#f2a900',
              },
            },
            title: {
              text: 'price $USD',
              style: {
                color: '#f2a900',
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: 'Green count',
            opposite: true,
            min: 20,
            max: 80,
            tickAmount: 6,
            forceNiceScale: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#008000',
            },
            labels: {
              style: {
                colors: '#008000',
              },
            },
            title: {
              text: 'Green images count',
              style: {
                color: '#008000',
              },
            },
          },
          {
            seriesName: 'Red/pink count',
            opposite: true,
            min: 20,
            max: 80,
            tickAmount: 6,
            forceNiceScale: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#cc0033',
            },
            labels: {
              style: {
                colors: '#cc0033',
              },
            },
            title: {
              text: 'Red/pink images count',
              style: {
                color: '#cc0033',
              },
            },
          },
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: 'bottomRight',
            offsetY: -50,
            offsetX: -130,
          },
        },
        legend: {
          horizontalAlign: 'center',
          offsetY: 5,
          height: 20,
          onItemClick: {
            toggleDataSeries: false,
          },
          onItemHover: {
            highlightDataSeries: true,
          },
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
