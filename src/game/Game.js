import React, { Component } from 'react'
import Board from './Board';
import CityCard from './cards/CityCard';

import './Game.css';

export default class Game extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedCity: null
    }
  }

  render() {
    return (
      <div className="Game">
        <Board onSelectCity={(city) => this.setState({ selectedCity: city })} />
        { this.state.selectedCity ? (
          <CityCard
            name={this.state.selectedCity.name}
            country="The World"
            color={this.state.selectedCity.color}
          />
        ) : null}
      </div>
    )
  }
}