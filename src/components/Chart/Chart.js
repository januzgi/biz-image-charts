import React, { Component } from 'react';
import classes from './Chart.module.css';
import ApexChart from 'react-apexcharts';
import axios from 'axios';
import ToolbarLineChart from './Toolbar/ToolbarLineChart';
import ToolbarCandleChart from './Toolbar/ToolbarCandleChart';

const ApexCharts = window.ApexCharts;
const chartTitleFontSize = window.innerWidth * 0.015;
const chartSubtitleFontSize = window.innerHeight * 0.0125;
let candlestickData = { '1h': [], '4h': [], '12h': [], '1D': [] };

class Chart extends Component {
  // Set up the state
  constructor(props) {
    super(props);

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
          id: 'chart',
          height: 350,
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
          fontSize: '20px',
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
      chartDrawingMode: 'line',
      lineTimeframe: 'all',
      candlestickTimeframe: '1h',
      disableToggle: true,
    };
  }

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

        // Update the state with the new data
        this.updateLineSeries(priceDataset, greenImgDataset, redImgDataset);

        // Update the state with the new options
        this.updateLineOptions(
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

  // Receives the amount of 5m datapoints to be bundled together
  calculatePriceAverages = (dataRange) => {
    // Calculate the new data in [lastDatapointTimestamp, priceAverage] format
    let priceDataAverages = [];

    // Get price dataset from state
    let oldBTCPriceData = this.state.series[0].data;
    // Initialize avgPrice and timestamp variables
    let avgPrice = 0;
    let timestamp = 0;

    // Go through dataRange amount of datapoints, calculate the avg price
    // Go in packs of dataRange datapoints (k + dataRange)
    for (
      let k = 0;
      k < oldBTCPriceData.length - dataRange - 1;
      k = k + dataRange
    ) {
      // Go through each of the datapoints inside the range
      for (let i = 0; i < dataRange; i++) {
        // Add price to sum for calculating the avgPrice
        avgPrice += oldBTCPriceData[k + i][1];
      }
      // Calculate the avgPrice
      avgPrice = Math.floor(avgPrice / dataRange);

      // Get the timestamp which is the latest datapoints timestamp
      timestamp = oldBTCPriceData[k + dataRange - 1][0];

      // Save this ranges calculated data
      priceDataAverages.push([timestamp, avgPrice]);

      // Reset dataRange specific variables
      avgPrice = 0;
      timestamp = 0;
    }

    return priceDataAverages;
  };

  // Calculate OHLC from existing img datapoints
  imgDataOHLC = (data, dataRange) => {
    let imgDataInOHLC = [];
    // Initialize open, high, low, close and timestamp variables
    let open = 0;
    let high = 0;
    let low = 0;
    let close = 0;
    let timestamp = 0;
    // Calculate the new data in [timestamp, O,H,L,C] format

    // Go through dataRange amount of datapoints, calculate the avg price
    // Go in packs of dataRange datapoints (k + dataRange)
    for (let k = 0; k < data.length - dataRange - 1; k = k + dataRange) {
      // Set open as the first value of range
      open = data[k][1];
      // Set assumed values
      high = data[k][1];
      low = data[k][1];

      // Go through each of the datapoints inside the range
      for (let i = 0; i < dataRange; i++) {
        // Update high when count is higher
        if (high < data[k + i][1]) {
          high = data[k + i][1];
        }
        // Update low when count is lower
        if (low > data[k + i][1]) {
          low = data[k + i][1];
        }
      }

      // Get the timestamp which is the last datapoint's timestamp
      timestamp = data[k + dataRange - 1][0];
      // Set close as the last value of range
      close = data[k + dataRange - 1][1];

      // Save the green img range's calculated data
      imgDataInOHLC.push([timestamp, open, high, low, close]);

      // Reset dataRange specific variables
      open = 0;
      high = 0;
      low = 0;
      close = 0;
      timestamp = 0;
    }

    // Return the newly calculated data
    return imgDataInOHLC;
  };

  // Receives the amount of 5m datapoints to be bundled together as dataRange
  calculateImgOHLC = (dataRange) => {
    // Get datasets from state
    let oldGreenImgData = this.state.series[1].data;
    let oldRedImgData = this.state.series[2].data;
    // [0] for green and [1] for red/pink data
    let imgDataInOHLC = [[], []];

    // Both datasets exact same length so use a joint function
    imgDataInOHLC[0] = this.imgDataOHLC(oldGreenImgData, dataRange);
    imgDataInOHLC[1] = this.imgDataOHLC(oldRedImgData, dataRange);

    return imgDataInOHLC;
  };

  // Toggle between candlestick and line img data modes
  toggleChartMode = () => {
    console.log('State in toggleChartMode()');
    console.log(this.state);

    if (this.state.chartDrawingMode === 'line') {
      // Set the chart to use candlesticks
      this.updateCandlestickZoom(this.state.candlestickTimeframe);
    } else {
      // Set the data series with line data
      this.updateLineSeries(this.state.lineTimeframe);
      // Set the state options with line data
      this.updateLineOptions(this.state.lineTimeframe);
    }

    console.log('State in toggleChartMode() after changes');
    console.log(this.state);
  };

  // Update the line chart dataseries
  updateLineSeries = (priceSerie, greenSerie, redSerie) => {
    console.log('updateLineSeries()');

    this.setState({
      // Data has been fetched so enable toggling button
      disableToggle: false,
      // For later use save the dataseries in state too
      savedSeries: [priceSerie, greenSerie, redSerie],
      series: [
        {
          data: priceSerie,
        },
        {
          data: greenSerie,
        },
        {
          data: redSerie,
        },
      ],
    });
  };

  // Update line chart options
  updateLineOptions = (
    imgCountMax,
    imgCountMin,
    priceMin,
    priceMax,
    firstDate,
    lastDate
  ) => {
    console.log('updateLineOptions()');

    this.setState({
      chartDrawingMode: 'line',
      options: {
        title: {
          text: 'Image color averages and BTC price (timezone: GMT+3/UTC+3)',
          style: {
            fontSize: chartTitleFontSize,
          },
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
                fontSize: chartSubtitleFontSize,
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
            min: imgCountMin,
            max: imgCountMax,
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
                fontSize: chartSubtitleFontSize,
                color: '#008000',
              },
            },
          },
          {
            seriesName: 'Red/pink count',
            opposite: true,
            min: imgCountMin,
            max: imgCountMax,
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
                fontSize: chartSubtitleFontSize,
                color: '#cc0033',
              },
            },
          },
        ],
      },
    });
  };

  // Update line chart timeframe
  updateLineZoom = (timeframe) => {
    console.log('updateLineZoom()');

    // Update to the selected timeframe
    this.setState({
      lineTimeframe: timeframe,
    });

    switch (timeframe) {
      case 'all':
        ApexCharts.exec(
          'chart',
          'zoomX',
          this.state.options.xaxis.min,
          this.state.options.xaxis.max
        );
        break;
      case 'one_day':
        ApexCharts.exec(
          'chart',
          'zoomX',
          this.state.options.xaxis.min,
          this.state.options.xaxis.min + 86400000
        );
        break;
      // Include 'one_week' 604800000, 'one_month' 2419200000 and 'ytd' 29030400000 later on
      default:
    }
  };

  // https://apexcharts.com/react-chart-demos/candlestick-charts/basic/

  // Update to candlestick chart with the chosen timeframe
  updateCandlestickZoom = (timeframe) => {
    console.log('updateToCandlestickZoom()');

    // Set the state to be the chosen timeframe and candlestick type
    this.setState({
      chartDrawingMode: 'candlestick',
      candlestickTimeframe: timeframe,
    });

    // Save the data to candlestickData so it won't be recalculated later
    switch (timeframe) {
      case '1h':
        // Check if the data isn't already calculated
        if (candlestickData['1h'].length === 0) {
          // Calculate missing data for type price and 1h candles from 5m datapoints
          // Calculate BTC price data and add it to the global variable
          candlestickData['1h'].push(this.calculatePriceAverages(12));
          // Calculate green and red img data
          candlestickData['1h'].push(this.calculateImgOHLC(12));
        }
        break;
      case '4h':
        // Check if the data isn't already calculated
        if (candlestickData['4h'].length === 0) {
          // Calculate missing data for type price and 4h candles from 5m datapoints
          // Calculate BTC price data and add it to the global variable
          candlestickData['4h'].push(this.calculatePriceAverages(48));
          // Calculate green and red img data
          candlestickData['4h'].push(this.calculateImgOHLC(48));
        }
        break;
      case '12h':
        // Check if the data isn't already calculated
        if (candlestickData['12h'].length === 0) {
          // Calculate missing data for type price and 12h candles from 5m datapoints
          // Calculate BTC price data and add it to the global variable
          candlestickData['12h'].push(this.calculatePriceAverages(144));
          // Calculate green and red img data
          candlestickData['12h'].push(this.calculateImgOHLC(144));
        }
        break;
      case '1D':
        // Check if the data isn't already calculated
        if (candlestickData['1D'].length === 0) {
          // Calculate missing data for type price and 1D candles from 5m datapoints
          // Calculate BTC price data and add it to the global variable
          candlestickData['1D'].push(this.calculatePriceAverages(288));
          // Calculate green and red img data
          candlestickData['1D'].push(this.calculateImgOHLC(288));
        }
        break;
      // Include '1W' later on
      default:
    }

    // Set the state series with candlestick data
    this.updateCandlestickSeries(timeframe);
    // Set the state options with candlestick data
    this.updateCandlestickOptions(timeframe);
  };

  // Update candlestick series
  updateCandlestickSeries = (timeframe) => {
    console.log('updateCandlestickSeries() and candlestickdata: ');
    console.log(candlestickData);

    // Update the chart state with the new data
    // this.setState({
    //   // Set the state according to selected timeframe
    //   candlestickTimeframe: timeframe,
    //   chartDrawingMode: 'candlestick',
    //   series: [
    //     {
    //       // BTC price data with the timestamp being the close
    //       // and price being the average of the chosen timeframe
    //       // [Timestamp, C_Average]
    //       name: 'BTC price',
    //       type: 'area',
    //       data: candlestickData[timeframe][0],
    //     },
    //     {
    //       // [Timestamp, O, H, L, C]
    //       name: 'Green count',
    //       type: 'candlestick',
    //       data: candlestickData[timeframe][1][0],
    //     },
    //     {
    //       // [Timestamp, O, H, L, C]
    //       name: 'Red/pink count',
    //       type: 'candlestick',
    //       data: candlestickData[timeframe][1][1],
    //     },
    //   ],
    // });
  };

  // Update candlestick options
  updateCandlestickOptions = (timeframe) => {
    console.log('updateCandlestickOptions()');

    // Get the required state variables
    // let imgCountMax = parseInt(this.state.options.yaxis[1].max);
    // let imgCountMin = parseInt(this.state.options.yaxis[1].min);
    // let priceMin = this.state.options.yaxis[0].min;
    // let priceMax = this.state.options.yaxis[0].max;
    // let firstDate = parseInt(this.state.options.xaxis.min);
    // let lastDate = parseInt(this.state.options.xaxis.max);

    // // Update the chart state with the new data
    // this.setState({
    // chartDrawingMode: 'candlestick',
    //   options: {
    // chart: {
    //   type: 'candlestick',
    //   height: 350
    // },
    // title: {
    //   text: 'CandleStick Chart',
    //   align: 'left'
    // },
    // xaxis: {
    //   type: 'datetime'
    // },
    // yaxis: {
    //   tooltip: {
    //     enabled: true
    //   }
    // },
    //     plotOptions: {
    //       candlestick: {
    //         colors: {
    //           upward: '#008000',
    //           downward: '#cc0033',
    //         },
    //         wick: {
    //           useFillColor: true,
    //         },
    //       },
    //     },
    //     title: {
    //       text: 'Image color averages and BTC price (timezone: GMT+3/UTC+3)',
    //       style: {
    //         fontSize: chartTitleFontSize,
    //       },
    //       align: 'left',
    //       offsetX: 0,
    //     },
    //     xaxis: {
    //       // X axis first datapoint date
    //       min: firstDate,
    //       // X axis last datapoint date
    //       max: lastDate,
    //     },
    //     yaxis: [
    //       {
    //         seriesName: 'BTC price',
    //         min: priceMin,
    //         max: priceMax,
    //         axisTicks: {
    //           show: true,
    //         },
    //         axisBorder: {
    //           show: true,
    //           color: '#f2a900',
    //         },
    //         labels: {
    //           style: {
    //             colors: '#f2a900',
    //           },
    //         },
    //         title: {
    //           text: 'price $USD',
    //           style: {
    //             fontSize: chartSubtitleFontSize,
    //             color: '#f2a900',
    //           },
    //         },
    //         tooltip: {
    //           enabled: true,
    //         },
    //       },
    //       {
    //         seriesName: 'Green count',
    //         opposite: true,
    //         min: imgCountMin,
    //         max: imgCountMax,
    //         tickAmount: 4,
    //         axisTicks: {
    //           show: true,
    //         },
    //         axisBorder: {
    //           show: true,
    //           color: '#008000',
    //         },
    //         labels: {
    //           style: {
    //             colors: '#008000',
    //           },
    //         },
    //         title: {
    //           text: 'Green images count',
    //           style: {
    //             fontSize: chartSubtitleFontSize,
    //             color: '#008000',
    //           },
    //         },
    //       },
    //       {
    //         seriesName: 'Red/pink count',
    //         opposite: true,
    //         min: imgCountMin,
    //         max: imgCountMax,
    //         tickAmount: 4,
    //         axisTicks: {
    //           show: true,
    //         },
    //         axisBorder: {
    //           show: true,
    //           color: '#cc0033',
    //         },
    //         labels: {
    //           style: {
    //             colors: '#cc0033',
    //           },
    //         },
    //         title: {
    //           text: 'Red/pink images count',
    //           style: {
    //             fontSize: chartSubtitleFontSize,
    //             color: '#cc0033',
    //           },
    //         },
    //       },
    //     ],
    //   },
    // });
  };

  render() {
    return (
      <div className={classes.ChartContainer}>
        <div className={classes.Toolbar}>
          <button
            style={{ outline: 'none' }}
            onClick={this.toggleChartMode}
            disabled={this.state.disableToggle}
          >
            Toggle candlestick / line
          </button>
        </div>
        {/* Check chartDrawingMode and draw line or candle chart toolbar accordingly */}
        {this.state.chartDrawingMode === 'candlestick' ? (
          <ToolbarCandleChart
            disabled={this.state.candlestickTimeframe}
            clicked={this.updateCandlestickZoom}
          />
        ) : (
          <ToolbarLineChart
            disabled={this.state.lineTimeframe}
            clicked={this.updateLineZoom}
          />
        )}
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
