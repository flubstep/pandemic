import React, { Component } from 'react'
import Board from './Board';
import CityCard from './cards/CityCard';

import './Game.css';

export default class Game extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {

    }
  }

  render() {
    return (
      <div className="Game">
        <Board />
        <CityCard
          name="Los Angeles"
          country="United States"
          color="yellow"
        />
      </div>
    )
  }
}