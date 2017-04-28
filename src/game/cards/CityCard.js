import React, { Component } from 'react';

import Card from './Card';

import './CityCard.css';

export default class CityCard extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {

    };
  }

  render() {
    return (
      <Card style={{ top: 50, left: 50, backgroundColor: this.props.color }} className="CityCard">
        <div className="inner">
          <h1 style={{ color: this.props.color }}>{ this.props.name }</h1>
          <h2>{ this.props.country }</h2>
        </div>
      </Card>
    );
  }
}

CityCard.defaultProps = {
  name: 'Untitled'
};
