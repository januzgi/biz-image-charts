import React, { Component } from 'react';
import Header from './components/Header/Header';
import InfoContent from './components/InfoContent/InfoContent';
import Footer from './components/Footer/Footer';
import Chart from './components/Chart/Chart';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Chart />
        <InfoContent />
        <Footer />
      </div>
    );
  }
}

export default App;
