import React, { Component } from 'react';
import classes from './Chart.module.css';
import ApexChart from 'react-apexcharts';
import axios from 'axios';

class Chart extends Component {
  componentDidMount() {
    // Get the latest price and images data from the server
    axios
      .get('http://199.247.30.86:8000/results.txt')
      .then((response) => {
        // Put the results into an array, so it becomes an array of objects
        let resultsArray = response.data.split('\n');

        // Loop through the results and form valid dataset arrays
        // If the img count is 0 on either, move to the next datapoint

        // start from here
        // https://apexcharts.com/javascript-chart-demos/area-charts/datetime-x-axis/

        // Form the date as milliseconds time
        // timestampsData

        // Form BTC price dataset
        // priceData
        // Save the highest and lowest prices to use it for the yaxis scaling with a $500 excess
        // priceMax + 500, priceMin + 500

        // Form green count dataset
        // greenImgData
        // Save the highest green count to use it for the yaxis scaling
        // gCountMax

        // Form red/pink count dataset
        // redImgData
        // Save the highest red count to use it for the yaxis scaling
        // rCountMax

        // Match green and red counts to determine the highest point in yaxis
        // imgCountMax is the higher one of gCountMax and rCountMax

        // Set the state after parsing all data
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
      // Initialize axis scales
      // priceMax, priceMin, gCountMax, rCountMax
      series: [
        {
          name: 'BTC price',
          type: 'line',
          data: [5600, 6000, 5842, 7912, 8273, 7329, 6482, 7938], // priceData
        },
        {
          name: 'Green count',
          type: 'line',
          data: [21, 32, 36, 44, 54, 49, 53, 25], // greenImgData
        },
        {
          name: 'Red/pink count',
          type: 'line',
          data: [20, 29, 37, 36, 44, 45, 50, 58], // redImgData
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
          // Timestamps for the date data
          categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016], // use timestampsData
        },
        yaxis: [
          {
            min: 4000, // use priceMin
            max: 9000, // use priceMax
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
            min: 10,
            max: 80, // use imgCountMax
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
            min: 10,
            max: 80, // use imgCountMax
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
