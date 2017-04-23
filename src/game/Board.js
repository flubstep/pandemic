import React, { Component } from 'react';

import './Board.css';

import worldMap from '../static/images/worldmap-green.svg';
import cities from '../data/cities.json';
import connections from '../data/connections.json';

const MAP_WIDTH = 2599;
const MAP_HEIGHT = 1707;

let CITIES = {};
for (let city of cities) {
  CITIES[city.name] = city;
}

const CITY_COLORS = {
  blue: '#1e88e5',
  yellow: '#fdd835',
  red: '#e53935',
  black: '#000000'
};

const Colors = {
  red: '#e57373',
  yellow: '#fdd835',
  darkBlue: '#1a237e'
};

export default class Board extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      highlightCity: null
    };
  }

  onCityOver = (city) => {
    this.setState({ highlightCity: city });
  }

  onCityOut = () => {
    this.setState({ highlightCity: null });
  }

  render() {
    return (
      <div
        style={{
          height: MAP_HEIGHT,
          width: MAP_WIDTH
        }}
        className="Board"
        >
        <div
          className="map"
          style={{
            height: '100%',
            width: '100%',
            background: `url(${worldMap})`,
            backgroundSize: `${MAP_WIDTH}px ${MAP_HEIGHT}px`,
          }}
          >
          <svg height={MAP_HEIGHT} width={MAP_WIDTH}>
            {
              connections.map(connection => {
                let city1 = CITIES[connection[0]];
                let city2 = CITIES[connection[1]];
                let [x1, y1] = city1.position;
                let [x2, y2] = city2.position;
                let highlight = this.state.highlightCity === connection[0] || this.state.highlightCity === connection[1];
                return (
                  <line
                    className="connection autoanimate"
                    x1={x1} y1={y1}
                    x2={x2} y2={y2}
                    stroke={highlight ? Colors.yellow : '#666'}
                    strokeWidth={highlight ? 2 : 2}
                  />
                );
              })
            }
            { cities.map(city => {
                let [cx, cy] = city.position;
                let highlight = city.name === this.state.highlightCity;
                let color = CITY_COLORS[city.color];
                return (
                  <g key={'circle-' + city.name}>
                    <circle
                      onMouseOver={() => this.onCityOver(city.name)}
                      onMouseOut={this.onCityOut}
                      className="city autoanimate"
                      cx={cx} cy={cy} r={highlight ? 16 : 12}
                      fill={color}
                      stroke={'white'}
                      strokeWidth={highlight ? 6 : 2}
                    />
                  </g>
                );
              })
            }
            { cities.map(city => {
                let [cx, cy] = city.position;
                let highlight = city.name === this.state.highlightCity;
                let color = CITY_COLORS[city.color];
                let dx, dy, anchor;
                switch (city.textPosition) {
                  case 'top':
                    dx = 0;
                    dy = -20;
                    anchor = 'middle';
                    break;
                  case 'bottom':
                    dx = 0;
                    dy = 32;
                    anchor = 'middle';
                    break;
                  case 'left' :
                    dx = -20;
                    dy = 6;
                    anchor = 'end';
                    break;
                  case 'right':
                  default:
                    dx = 20;
                    dy = 6;
                    anchor = 'start';
                }
                let translateX = highlight ? dx * 0.5 : 0;
                let translateY = highlight ? dy * 0.2 : 0;
                return (
                  <g key={'name-' + city.name}>
                    <text
                      className={'city-name autoanimate' + (highlight ? ' highlight' : '')}
                      style={{
                        transform: `translate(${translateX}px, ${translateY}px)`
                      }}
                      textAnchor={anchor}
                      x={cx + dx}
                      y={cy + dy}
                      >
                      {city.name}
                    </text>
                  </g>
                );
              })
            }
          </svg>
        </div>
      </div>
    );
  }
}
