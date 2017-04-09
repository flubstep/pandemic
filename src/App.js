import React, { Component } from 'react';
import './App.css';
import Canvas from './canvas/Canvas';

class App extends Component {

  componentDidMount() {
    Canvas.render(this.refs.canvas);
  }

  render() {
    return (
      <div className="App">
        <div ref="canvas" />
      </div>
    );
  }
}

export default App;
