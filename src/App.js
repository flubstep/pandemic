import React, { Component } from 'react';
import './App.css';

import Game from './game/Game';

class App extends Component {

  componentDidMount() {
    // Canvas.render(this.refs.canvas);
  }

  render() {
    return (
      <div className="App">
        <Game />
      </div>
    );
  }
}

export default App;
