/*global PIXI*/

import _ from 'lodash';
import * as tween from 'es6-tween';
import cities from './cities.json';
import connections from './connections.json';

import worldMap from '../static/images/world-map@2x.png';
import waterTile from '../static/images/water-tile.jpg';
import character from '../static/images/character@2x.png';

import GameMap from './GameMap';

const render = (canvas) => {
  window.canvas = canvas;
  let scale = window.devicePixelRatio;
  let context = canvas.getContext('2d');
  context.scale(scale, scale);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let map = new GameMap(context);

  const update = (dt) => {
    map.update(dt);
  }

  const draw = () => {
    map.draw();
  }

  let previousTime = new Date().getTime();
  const loop = () => {
    let currentTime = new Date().getTime();
    let dt = (currentTime - previousTime) / 1000.0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    update(dt);
    draw();
    previousTime = currentTime;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};

export default {
  render
};