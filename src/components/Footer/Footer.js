import React from 'react';
import classes from './Footer.module.css';

const Footer = () => {
  return (
    <div className={classes.footerContent}>
      <div className={classes.itemLeft}>
        <div>
          Powered by{' '}
          <a href='https://www.coindesk.com/coindesk-api'>Coindesk.</a>
        </div>
      </div>
      <div className={classes.itemRight}>
        <div>
          ©{' '}
          <a href='https://github.com/januzgi/biz-image-charts'>
            Jani Suoranta
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
