import React from 'react';
import classes from './InfoContent.module.css';

const InfoContent = () => {
  return (
    <div className={classes.content}>
      <div className={classes.column}>
        <h2>Why</h2>
        <p>
          Analyzing image average color, meaning the memes being posted, we can
          draw some further ideas about the active emotional state of the pleb
          masses posting memes to 4chan/biz/.
        </p>
        <p>
          This is an experiment whether we can trade BTC based on this data.
          Sell for green memes (certainty, euphoria) and buy when memes have
          turned to pink wojaks and red bears (fud).
        </p>
      </div>
      <div className={classes.column}>
        <h2>How</h2>
        <p>
          Using JS and Python as the backend, /biz/ image board is scraped once
          every 15 minutes. With the resulting images of all the threads, their
          average color is analyzed. Summing the colors, whether{' '}
          <span className={classes.green}>green</span> or{' '}
          <span className={classes.red}>red</span>/
          <span className={classes.pink}>pink</span>, we draw the chart.
        </p>
        <p>The chart has three different graphs:</p>
        <div>
          <ul>
            <li>
              BTC/USD price from{' '}
              <a href='https://www.coindesk.com/coindesk-api'>Coindesk API</a>
            </li>
            <li>Green images sum from 4chan/biz/</li>
            <li>Red/pink images sum from 4chan/biz/</li>
          </ul>
        </div>
      </div>
      <div className={classes.column}>
        <h2>What's missing?</h2>
        <p>
          When you get an idea how to build on this idea, contact me in Telegram{' '}
          <a href='https://t.me/januzgi'>@januzgi</a>.
        </p>
      </div>
    </div>
  );
};

export default InfoContent;
