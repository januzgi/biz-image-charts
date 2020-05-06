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
          turned to pink wojaks and red shirted bears (fud).
        </p>
      </div>
      <div className={classes.column}>
        <h2>How</h2>
        <p>
          Using JS and Python as the backend, /biz/ image board is scraped once
          every 5 minutes. With all images of all threads, each image's average
          color is determined by using HSV color ranges. By summing counts of
          both <span className={classes.greenLine}>green</span> and{' '}
          <span className={classes.redLine}>red</span>/
          <span className={classes.pink}>pink</span> images, we draw the chart.
        </p>
        <p>The chart includes three different graphs:</p>
        <div>
          <ul>
            <li>
              <span className={classes.BTC}>BTC/USD </span>
              price from{' '}
              <a href='https://blockchain.info/ticker'>Blockchain.info</a>
            </li>
            <li>
              <span className={classes.greenLine}>Green images count </span>
              from /biz/
            </li>
            <li>
              <span className={classes.redLine}>Red/pink images count </span>{' '}
              from /biz/
            </li>
          </ul>
        </div>
      </div>
      <div className={classes.column}>
        <h2>What's missing?</h2>
        <p>
          If you have an idea how to build on this, contact me in Telegram{' '}
          <a href='https://t.me/januzgi'>@januzgi</a>.
        </p>
      </div>
    </div>
  );
};

export default InfoContent;
