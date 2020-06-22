import React, { Component } from 'react';
import { Divider } from '@material-ui/core';

import Header from './components/Header'
import Body from './components/Body'
import './App.css'

class App extends Component {
  render() {
    return (
      <div >
        <Header />
        <Divider style={{ backgroundColor: '#707070', height: '3px', marginTop: '20px' }} />
        <Body />
      </div>
    );
  }
}

export default App;