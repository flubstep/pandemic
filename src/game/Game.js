import React, { Component } from 'react'
import Board from './Board';

import './Game.scss'

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
      </div>
    )
  }
}