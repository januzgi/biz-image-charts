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
let lineData = {
  '5m': [],
  '15m': [],
  '30m': [],
  '1h': [],
  '2h': [],
  '4h': [],
  '12h': [],
};

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
            speed: 2000,
            animateGradually: {
              enabled: false,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 2000,
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
          min: '1581120048900',
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
      lineTimeframe: 'past_week',
      lineDataDensity: 'data_5m',
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
      .get('https://biz-charts.s3.eu-north-1.amazonaws.com/results.txt', {
        timeout: 4000,
      })
      .then((response) => {
        // Put the results into an array, so it becomes an array of strings
        let resultsArray = response.data.split('\n');

        // // Set firstDate and lastDate
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

        // Calculate and save datasets for line chart's different data densities
        this.calculateDataDensity(priceDataset, greenImgDataset, redImgDataset);

        // Update the state with the new data
        this.updateLineSeries(priceDataset, greenImgDataset, redImgDataset);

        // Save the datasets as original ones which will be used
        // later on to calculate the candlestick data
        lineData['5m'] = [priceDataset, greenImgDataset, redImgDataset];

        // Update the state with the new options
        this.updateLineOptions(
          parseInt(imgCountMax),
          parseInt(imgCountMin),
          priceMin,
          priceMax,
          parseInt(firstDate),
          parseInt(lastDate)
        );

        // Set the default line timeframe to be past_week
        this.updateLineZoom('past_week');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Receives the amount of 5m datapoints to be bundled together
  calculatePriceAverages = (dataRange) => {
    // Calculate the new data in [lastDatapointTimestamp, priceAverage] format
    let priceDataAverages = [];

    // Get original price dataset
    let oldBTCPriceData = lineData['5m'][0];

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
    // Get the original datasets
    let originalGreenImgData = lineData['5m'][1];
    let originalRedImgData = lineData['5m'][2];

    // [0] for green and [1] for red/pink data
    let imgDataInOHLC = [[], []];

    // Both datasets exact same length so use a joint function
    imgDataInOHLC[0] = this.imgDataOHLC(originalGreenImgData, dataRange);
    imgDataInOHLC[1] = this.imgDataOHLC(originalRedImgData, dataRange);

    return imgDataInOHLC;
  };

  // Calculates the original data (5m) with 15m, 30m etc. data density
  calculateDataDensity = (priceDataset, greenImgDataset, redImgDataset) => {
    // Put datasets into array for more readable looping
    let datasets = [priceDataset, greenImgDataset, redImgDataset];

    // Calculate all datapoint densities as defined in ToolbarLineChart
    // Except for '5m' which is calculated at startup
    // The value is the increment, how many 5m datapoints need to be calculated for this density
    let datapointControls = {
      '12h': 144,
      '4h': 48,
      '2h': 24,
      '1h': 12,
      '30m': 6,
      '15m': 3,
    };

    // Initialize variables
    let average = 0;
    let timestamp = 0;
    // Loop through each dataset
    for (let i = 0; i < datasets.length; i++) {
      // Loop through and calculate each data density selection
      for (var key in datapointControls) {
        if (datapointControls.hasOwnProperty(key)) {
          // Temp array for each dataset
          let tempArray = [];
          // Loop through all datapoints of the dataset
          for (
            let j = 0;
            j < datasets[i].length - datapointControls[key] - 1;
            j = j + datapointControls[key]
          ) {
            // Loop through as many datapoints as required for the chosen data density
            for (let k = 0; k < datapointControls[key]; k++) {
              average = average + datasets[i][j + k][1];
            }

            // Take the last timestamp as the timestamp of these new datapoints
            timestamp = datasets[i][j + 2][0];
            // Count the average value of the datapoints
            average = parseInt(average / datapointControls[key]);
            // Push the data into temp array
            tempArray.push([timestamp, average]);

            // Reset variables
            average = 0;
            timestamp = 0;
          }
          // Add the calculated values to global object
          lineData[key].push(tempArray);
        }
      }
    }
  };

  // Toggle between candlestick and line img data modes
  toggleChartMode = () => {
    if (this.state.chartDrawingMode === 'line') {
      // Set the chart to use candlesticks
      this.updateCandlestickZoom(this.state.candlestickTimeframe);
    } else {
      // Using the default 'all' with '5m'
      this.setState({ lineTimeframe: 'all', lineDataDensity: 'data_5m' });

      // Set the data series with saved line series
      this.updateLineSeries(
        this.state.savedLineSeries[0],
        this.state.savedLineSeries[1],
        this.state.savedLineSeries[2]
      );

      // Set the state options using the saved line options
      this.updateLineOptions(
        this.state.savedLineOptions[0],
        this.state.savedLineOptions[1],
        this.state.savedLineOptions[2],
        this.state.savedLineOptions[3],
        this.state.savedLineOptions[4],
        this.state.savedLineOptions[5]
      );
    }
  };

  // Update the line chart dataseries
  updateLineSeries = (priceSerie, greenSerie, redSerie) => {
    this.setState({
      // For later use save the dataseries in state too
      savedLineSeries: [priceSerie, greenSerie, redSerie],
      series: [
        {
          name: 'BTC price',
          type: 'area',
          data: priceSerie,
        },
        {
          name: 'Green count',
          type: 'line',
          data: greenSerie,
        },
        {
          name: 'Red/pink count',
          type: 'line',
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
    this.setState({
      // Data has been fetched so enable toggling button
      disableToggle: false,
      // Update drawing mode to line
      chartDrawingMode: 'line',
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
          text: 'Image color averages and BTC price (timezone: GMT+3/UTC+3)',
          style: {
            fontSize: chartTitleFontSize,
          },
          align: 'left',
          offsetX: 0,
        },
        xaxis: {
          type: 'datetime',
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
    });
  };

  // Update line chart timeframe
  updateLineZoom = (timeframe) => {
    // Update to the selected timeframe
    this.setState({
      lineTimeframe: timeframe,
    });

    switch (timeframe) {
      case 'past_week':
        ApexCharts.exec(
          'chart',
          'zoomX',
          this.state.options.xaxis.max - 604800000,
          this.state.options.xaxis.max
        );
        break;
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

  // Update line chart datapoint density by chosen timeframe
  updateLineDataDensity = (timeframe) => {
    let priceSerie = [];
    let greenSerie = [];
    let redSerie = [];

    switch (timeframe) {
      case 'data_5m':
        priceSerie = lineData['5m'][0];
        greenSerie = lineData['5m'][1];
        redSerie = lineData['5m'][2];
        break;

      case 'data_15m':
        priceSerie = lineData['15m'][0];
        greenSerie = lineData['15m'][1];
        redSerie = lineData['15m'][2];
        break;

      case 'data_30m':
        priceSerie = lineData['30m'][0];
        greenSerie = lineData['30m'][1];
        redSerie = lineData['30m'][2];
        break;

      case 'data_1h':
        priceSerie = lineData['1h'][0];
        greenSerie = lineData['1h'][1];
        redSerie = lineData['1h'][2];
        break;

      case 'data_2h':
        priceSerie = lineData['2h'][0];
        greenSerie = lineData['2h'][1];
        redSerie = lineData['2h'][2];
        break;

      case 'data_4h':
        priceSerie = lineData['4h'][0];
        greenSerie = lineData['4h'][1];
        redSerie = lineData['4h'][2];
        break;

      case 'data_12h':
        priceSerie = lineData['12h'][0];
        greenSerie = lineData['12h'][1];
        redSerie = lineData['12h'][2];
        break;
      default:
    }

    // Redraw the chart and re-animate
    ApexCharts.exec(
      'chart',
      'updateSeries',
      [
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
      true
    );

    // Update the line chart's zoom as it was in the state
    this.updateLineZoom(this.state.lineTimeframe);

    // Update the line series according to the timeframe
    this.setState({
      // Update to the chosen timeframe
      lineDataDensity: timeframe,
    });
  };

  // Update to candlestick chart with the chosen timeframe
  updateCandlestickZoom = (timeframe) => {
    // Save the timeframe data to candlestickData so it won't be recalculated later
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
    // Update the chart state with the new data
    this.setState({
      // Set the state according to selected timeframe
      candlestickTimeframe: timeframe,
      chartDrawingMode: 'candlestick',
      series: [
        {
          // BTC price data with the timestamp being the close
          // and price being the average of the chosen timeframe
          // [Timestamp, C_Average]
          name: 'BTC price',
          type: 'area',
          data: candlestickData[timeframe][0],
        },
        {
          // [Timestamp, O, H, L, C]
          name: 'Green count close',
          type: 'candlestick',
          data: candlestickData[timeframe][1][0],
        },
        {
          // [Timestamp, O, H, L, C]
          name: 'Red/pink count close',
          type: 'candlestick',
          data: candlestickData[timeframe][1][1],
        },
      ],
    });
  };

  // Update candlestick options
  updateCandlestickOptions = (timeframe) => {
    // Get the required state variables
    let imgCountMax = parseInt(this.state.options.yaxis[1].max);
    let imgCountMin = parseInt(this.state.options.yaxis[1].min);
    let priceMin = this.state.options.yaxis[0].min;
    let priceMax = this.state.options.yaxis[0].max;
    let firstDate = parseInt(this.state.options.xaxis.min);
    let lastDate = parseInt(this.state.options.xaxis.max);

    // Update the chart state with the new data
    this.setState({
      // Update to candlestick drawing mode
      chartDrawingMode: 'candlestick',
      // Save the line chart options for reuse later
      savedLineOptions: [
        imgCountMax,
        imgCountMin,
        priceMin,
        priceMax,
        firstDate,
        lastDate,
      ],
      // Set the state to be the chosen timeframe and candlestick type
      candlestickTimeframe: timeframe,
      options: {
        chart: {
          type: 'candlestick',
          height: 350,
        },
        title: {
          text: 'Image color averages and BTC price (timezone: GMT+3/UTC+3)',
          style: {
            fontSize: chartTitleFontSize,
          },
          align: 'left',
          offsetX: 0,
        },
        xaxis: {
          type: 'datetime',
          min: firstDate,
          max: lastDate,
        },
        colors: ['#f2a900', '#000080', '#cc0033'],
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
            axisBorder: {
              show: true,
              color: '#000080',
            },
            labels: {
              style: {
                colors: '#000080',
              },
            },
            title: {
              text: 'Green images count',
              style: {
                fontSize: chartSubtitleFontSize,
                color: '#000080',
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
        plotOptions: {
          candlestick: {
            colors: {
              upward: '#008000',
              downward: '#cc0033',
            },
            wick: {
              useFillColor: false,
            },
          },
        },
      },
    });
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
            disabledTimeframe={this.state.lineTimeframe}
            disabledDataDensity={this.state.lineDataDensity}
            clicked={this.updateLineZoom}
            changeView={this.updateLineDataDensity}
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
