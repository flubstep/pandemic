import React, { Component } from 'react';

import './Card.css';

export default class Card extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {

    };
  }

  render() {
    return (
      <div style={this.props.style} className={'Card ' + this.props.className}>
        { this.props.children }
      </div>
    );
  }
}

Card.defaultProps = {

};
