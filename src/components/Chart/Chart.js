import React, { Component } from 'react';
import classes from './Chart.module.css';
import ApexChart from 'react-apexcharts';
import axios from 'axios';

class Chart extends Component {
  componentDidMount() {
    // Save the highest and lowest price for the yaxis scaling
    let priceMax = 0;
    let priceMin = 10000;
    let priceDataset = [];
    // Save the first and last dates for x axis scaling
    let firstDate = 0;
    let lastDate = 0;
    // Green count dataset
    let greenImgDataset = [];
    let gCountMax = 0;
    let gCountMin = 100;
    // Red count dataset
    let redImgDataset = [];
    let rCountMax = 0;
    let rCountMin = 100;
    // Highest and lowest imgCount
    let imgCountMax = 0;
    let imgCountMin = 0;

    // Get the latest price and images data from the server
    axios
      .get('http://199.247.30.86:8000/results.txt', { timeout: 4000 })
      .then((response) => {
        // Put the results into an array, so it becomes an array of strings
        let resultsArray = response.data.split('\n');

        // Set firstDate and lastDate
        let firstUnset = true;
        let lastUnset = true;
        let j = 0;
        // Set the first valid date
        while (firstUnset) {
          // Create a datapoint object
          let datapoint = JSON.parse(resultsArray[j]);
          // If the img count is 0 on either, move to the next datapoint
          if (datapoint.gCount === '0' || datapoint.rCount === '0') {
            j += 1;
            continue;
          } else {
            // If a valid datapoint, grab the timestamp to be the firstDate
            firstDate = datapoint.timestamp;
            firstUnset = false;
          }
        }

        // -2 because last line of resultsArray is a /newline char
        j = resultsArray.length - 2;
        // Set the last valid date
        while (lastUnset) {
          // Create a datapoint object
          let datapoint = JSON.parse(resultsArray[j]);
          // If the img count is 0 on either, move to the next datapoint
          if (datapoint.gCount === '0' || datapoint.rCount === '0') {
            j -= 1;
            continue;
          } else {
            // If a valid datapoint, grab the timestamp to be the lastDate
            lastDate = datapoint.timestamp;
            lastUnset = false;
          }
        }

        // Loop through the results and form valid dataset arrays
        for (let i = 0; i < resultsArray.length - 1; i++) {
          // Create a datapoint object
          let datapoint = JSON.parse(resultsArray[i]);

          // If the img count is 0 on either, move to the next datapoint
          if (datapoint.gCount === '0' || datapoint.rCount === '0') {
            continue;
          }

          // Get BTC price
          // Save the highest and lowest prices to use it for the yaxis scaling with a $500 excess
          if (+priceMax - +100 < datapoint.price) {
            priceMax = parseInt(datapoint.price) + +100;
          }
          if (+priceMin + +100 > datapoint.price) {
            priceMin = parseInt(datapoint.price) - +100;
          }

          // Add the prices to priceDataset
          // Take the datapoint's date and price from the data
          priceDataset.push([
            parseInt(datapoint.timestamp),
            parseInt(datapoint.price),
          ]);

          // Save the highest and lowest gCount
          if (gCountMax < datapoint.gCount) {
            gCountMax = datapoint.gCount;
          } else if (gCountMin > datapoint.gCount) {
            gCountMin = datapoint.gCount;
          }

          // Form green count dataset
          greenImgDataset.push([
            parseInt(datapoint.timestamp),
            parseInt(datapoint.gCount),
          ]);

          // Save the highest rCount
          if (rCountMax < datapoint.rCount) {
            rCountMax = datapoint.rCount;
          } else if (rCountMin > datapoint.rCount) {
            rCountMin = datapoint.rCount;
          }
          // Form red/pink count dataset
          redImgDataset.push([
            parseInt(datapoint.timestamp),
            parseInt(datapoint.rCount),
          ]);
        }

        // Match green and red counts to determine the highest point in yaxis, and +10 extra space
        // imgCountMax is the higher one of gCountMax and rCountMax
        imgCountMax = +gCountMax + +10;
        if (+imgCountMax < +rCountMax + +10) {
          imgCountMax = +rCountMax + +10;
        }

        // Match green and red counts to determine the lowest point in yaxis, and -10 extra space
        // imgCountMin is the lower one of gCountMax and rCountMax
        imgCountMin = +gCountMin - +10;
        if (+imgCountMin > +rCountMin - +10) {
          imgCountMin = +rCountMin - +10;
        }

        // Update the state with the new series
        this.updateChartData(priceDataset, greenImgDataset, redImgDataset);

        // Update the state with the new options
        this.updateChartOptions(
          parseInt(imgCountMax),
          parseInt(imgCountMin),
          priceMin,
          priceMax,
          parseInt(firstDate),
          parseInt(lastDate)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Update each dataset's state
  updateChartData(priceDataset, greenImgDataset, redImgDataset) {
    // Update the state with all the new series
    this.setState({
      series: [
        {
          data: priceDataset,
        },
        {
          data: greenImgDataset,
        },
        {
          data: redImgDataset,
        },
      ],
    });
  }

  // Update the options according to newest data
  updateChartOptions(
    imgCountMax,
    imgCountMin,
    priceMin,
    priceMax,
    firstDate,
    lastDate
  ) {
    this.setState({
      options: {
        title: {
          text: 'Image color averages and BTC price (timezone: GMT+3/UTC+3)',
          align: 'left',
          offsetX: 0,
        },
        xaxis: {
          // X axis first datapoint date
          min: firstDate,
          // X axis last datapoint date
          max: lastDate,
        },
        yaxis: [
          {
            seriesName: 'BTC price',
            min: priceMin,
            max: priceMax,
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
            min: parseInt(imgCountMin),
            max: parseInt(imgCountMax),
            tickAmount: 4,
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
            min: parseInt(imgCountMin),
            max: parseInt(imgCountMax),
            tickAmount: 4,
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
      },
    });
  }

  // Set up the state
  constructor(props) {
    super(props);

    // Bind the chart data updating function
    this.updateChartData = this.updateChartData.bind(this);
    // Bind the chart options updating function
    this.updateChartOptions = this.updateChartOptions.bind(this);

    this.state = {
      series: [
        {
          name: 'BTC price',
          type: 'area',
          data: [
            [1581120048900, 3500],
            [1587130048900, 9000],
          ],
        },
        {
          name: 'Green count',
          type: 'line',
          data: [
            [1581120048900, 25],
            [1587130048900, 30],
          ],
        },
        {
          name: 'Red/pink count',
          type: 'line',
          data: [
            [1581120048900, 20],
            [1587130048900, 40],
          ],
        },
      ],
      options: {
        chart: {
          height: 350,
          type: 'line',
          stacked: false,
          fontFamily: 'Roboto',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 500,
            animateGradually: {
              enabled: true,
              delay: 500,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 500,
            },
          },
          background: '#fefefe',
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#f2a900', '#008000', '#cc0033'],
        stroke: {
          width: [2, 4, 4],
          curve: 'smooth',
        },
        fill: {
          type: ['gradient', 'solid', 'solid'],
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 1,
            opacityFrom: 1,
            opacityTo: 0.2,
            stops: [0, 100],
          },
        },
        title: {
          text: 'SERVER OFFLINE',
          align: 'left',
          offsetX: 0,
        },
        xaxis: {
          type: 'datetime',
          // Starting date of the data in ms
          min: '1581120048900',
          // Ending date of the data in ms
          max: '1587130048900',
        },
        yaxis: [
          {
            seriesName: 'BTC price',
            min: '3000',
            max: '10000',
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
            min: 10,
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
          x: {
            format: 'd.M.yyyy H:mm',
          },
          fixed: {
            enabled: true,
            position: 'bottomRight',
            offsetY: -40,
            offsetX: -140,
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

  render() {
    return (
      <div className={classes.chartContainer}>
        <ApexChart
          options={this.state.options}
          series={this.state.series}
          height={window.innerHeight - window.innerHeight * 0.2}
        />
      </div>
    );
  }
}

export default Chart;
