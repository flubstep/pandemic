import React, { Component } from 'react';

import { CityColors } from '../Colors';
import Card from './Card';

import './CityCard.css';

export default class CityCard extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {

    };
  }

  render() {
    let color = CityColors[this.props.color] || this.props.color;
    return (
      <Card style={{ top: 50, left: 50, backgroundColor: color }} className="CityCard">
        <div className="inner">
          <h1 style={{
            color: color,
            textShadow: this.props.color === 'yellow' ? '2px 2px black': undefined
          }}>{ this.props.name }</h1>
          <h2>{ this.props.country }</h2>
        </div>
      </Card>
    );
  }
}

CityCard.defaultProps = {
  name: 'Untitled'
};
