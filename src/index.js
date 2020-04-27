import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Route path='/' exact strict component={App} />
    <Redirect from='/*' to='/' />
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
