import React, { Component } from 'react';

import './Board.css';

import worldMap from '../static/images/worldmap-teal@2x.png';
import cities from '../data/cities.json';
import connections from '../data/connections.json';

const MAP_WIDTH = 2599;
const MAP_HEIGHT = 1707;

let CITIES = {};
for (let city of cities) {
  CITIES[city.name] = city;
}

const CityColors = {
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

class CityConnections extends Component {

  render() {
    return (
      <g>
      {
        this.props.connections.map(connection => {
          let city1 = CITIES[connection[0]];
          let city2 = CITIES[connection[1]];
          let [x1, y1] = city1.position;
          let [x2, y2] = city2.position;
          let highlight =
            this.props.highlightCity === connection[0] ||
            this.props.highlightCity === connection[1];
          return (
            <line
              key={connection[0] + '-' + connection[1]}
              className="connection autoanimate"
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke={highlight ? Colors.yellow : '#666'}
              strokeWidth={highlight ? 2 : 2}
            />
          );
        })
      }
      </g>
    );
  }
}

class CityCircles extends Component {

  render() {
    return (
      <g>
      {
        this.props.cities.map(city => {
          let [cx, cy] = city.position;
          let highlight = city.name === this.props.highlightCity;
          let color = CityColors[city.color];
          return (
            <g key={'circle-' + city.name}>
              <circle
                onClick={() => this.props.onCityClick(city)}
                onMouseOver={() => this.props.onCityOver(city)}
                onMouseOut={() => this.props.onCityOut(city)}
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
      </g>
    );
  }
}

class CityNames extends Component {

  render() {
    return (
      <g>
      {
        this.props.cities.map(city => {
          let [cx, cy] = city.position;
          let highlight = city.name === this.props.highlightCity;
          let color = CityColors[city.color];
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
      </g>
    );
  }
}

class GameMap extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      highlightCity: null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.highlightCity !== nextState.highlightCity);
  }

  onCityOver = (city) => {
    this.setState({ highlightCity: city.name });
  }

  onCityOut = () => {
    this.setState({ highlightCity: null });
  }

  render() {
    return (
      <div
        className="map"
        style={{
          height: MAP_HEIGHT,
          width: MAP_WIDTH,
          background: `url(${worldMap})`,
          backgroundSize: `${MAP_WIDTH}px ${MAP_HEIGHT}px`,
        }}
        >
        <svg height={MAP_HEIGHT} width={MAP_WIDTH}>
          <CityConnections
            connections={connections}
            highlightCity={this.state.highlightCity}
            />
          <CityCircles
            cities={cities}
            onCityClick={this.props.onCityClick}
            onCityOver={this.onCityOver}
            onCityOut={this.onCityOut}
            highlightCity={this.state.highlightCity}
            />
          <CityNames
            cities={cities}
            highlightCity={this.state.highlightCity}
            />
        </svg>
      </div>
    )
  }
}

export default class Board extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      offset: [0, 0],
      dragOffset: [0, 0],
      dragStart: null,
      dragging: false,
      autoScrolling: false
    };
  }

  onMouseDown = (e) => {
    this.setState({
      dragStart: [e.clientX, e.clientY],
      dragging: true
    });
  }

  onMouseMove = (e) => {
    if (this.state.dragging) {
      e.stopPropagation();
      e.preventDefault();
      let [x, y] = [e.clientX, e.clientY];
      let [x0, y0] = this.state.dragStart;
      this.setState({
        dragOffset: [x0 - x, y0 - y]
      });
    }
  }

  onMouseUp = (e) => {
    if (this.state.dragging) {
      let offsetX = this.state.offset[0] + this.state.dragOffset[0];
      let offsetY = this.state.offset[1] + this.state.dragOffset[1];
      this.setState({
        offset: [offsetX, offsetY],
        dragOffset: [0, 0],
        dragStart: null,
        dragging: false
      });
    }
  }

  centerOnCity = (city) => {
    let x = city.position[0] - window.innerWidth / 2;
    let y = city.position[1] - window.innerHeight / 2;
    this.setState({
      offset: [x, y],
      autoScrolling: true
    });
    setTimeout(() => this.setState({ autoScrolling: false }), 500);
  }

  render() {
    let offsetX = this.state.offset[0] + this.state.dragOffset[0];
    let offsetY = this.state.offset[1] + this.state.dragOffset[1];
    return (
      <div className="Board">
        <div className="inner"
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          style={{
            transform: `translate(${-offsetX}px, ${-offsetY}px)`,
            transition: this.state.autoScrolling ? 'transform 0.5s ease-in-out' : undefined
          }}>
          <GameMap onCityClick={this.centerOnCity} />
        </div>
      </div>
    );
  }
}
