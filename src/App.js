import React from 'react';
import classes from './App.module.css';
import Header from './components/Header/Header';
import InfoContent from './components/InfoContent/InfoContent';
import Footer from './components/Footer/Footer';
import Chart from './components/Chart/Chart';

function App() {
  return (
    <div className={classes.App}>
      <Header />
      <Chart />
      <InfoContent />
      <Footer />
    </div>
  );
}

export default App;
