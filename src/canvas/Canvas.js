/*global PIXI*/

import _ from 'lodash';
import * as tween from 'es6-tween';
import cities from './cities.json';
import connections from './connections.json';

import worldMap from '../static/images/world-map@2x.png';
import waterTile from '../static/images/water-tile.jpg';
import character from '../static/images/character@2x.png';

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

const COLORS = {
  blue: 0x000694,
  yellow: 0xF8E81C,
  red: 0xD0011B,
  black: 0x000000,
  white: 0xFFFFFF
};

let CITIES = {};
for (let city of cities) {
  CITIES[city.name] = city;
}

let app;
let map;
const vh = window.innerHeight;
const vw = window.innerWidth;

const LABEL = new PIXI.TextStyle({
    fontFamily: 'Avenir',
    fontSize: 18,
    fontWeight: 'bold',
    fill: COLORS.white,
    letterSpacing: 1.8,
    stroke: COLORS.black,
    strokeThickness: 4
});

const draggable = (element, label = "Element") => {
  let dragging = false;
  let dragStart = {};
  let elementStart = {};

  element.interactive = true;
  element.buttonMode = true;

  element.on('pointerdown', (event) => {
    event.stopPropagation();
    dragging = true;
    dragStart = Object.assign({}, event.data.global);
    elementStart = { x: element.x, y: element.y };
  });
  element.on('pointermove', (event) => {
    if (dragging) {
      let dragCurrent = event.data.global;
      let dx = dragCurrent.x - dragStart.x;
      let dy = dragCurrent.y - dragStart.y;
      element.x = elementStart.x + dx;
      element.y = elementStart.y + dy;
    }
  });
  element.on('pointerup', (event) => {
    console.log(`${label} at "position": [${element.x}, ${element.y}],`);
    dragging = false;
    dragStart = {};
  });
  return element;
};

let previous = null;
let output = [];
window.output = output;

const labelling = (element, label, map) => {
  element.interactive = true;
  element.on('pointerdown', (event) => {
    event.stopPropagation();
    if (!previous) {
      console.log('Queueing up', previous);
      previous = label;
    }
    else {
      console.log(`["${previous}", "${label}"],`);
      output.push([previous, label]);
      let city1 = CITIES[previous];
      let city2 = CITIES[label];
      let line = new PIXI.Graphics();
      console.log(city1, city2);
      line.beginFill(COLORS.white);
      line.lineStyle(4, 0xffd900, 1);
      line.moveTo(city1.position[0], city1.position[1]);
      line.lineTo(city2.position[0], city2.position[1]);
      line.endFill();
      map.addChild(line);
      previous = null;
    }
  });
  return element;
};

const createDraggableCity = (city, map) => {
  let container = new PIXI.Container();
  let text = new PIXI.Text(city.name, LABEL);
  let textPosition = city.textPosition || 'top';
  let margin = 4;
  let r = 12;

  if (textPosition === 'top') {
    text.x = -text.width / 2;
    text.y = -text.height - r - margin;
  } else if (textPosition === 'left') {
    text.x = -text.width - r - margin;
    text.y = -text.height / 2;
  } else if (textPosition === 'right') {
    text.x = r + margin;
    text.y = -text.height / 2;
  } else if (textPosition === 'bottom') {
    text.x = -text.width / 2;
    text.y = text.height / 2 + margin;
  }

  let circle = new PIXI.Graphics();
  circle.lineStyle(2, COLORS.white);
  circle.beginFill(COLORS[city.color], 0.8);
  circle.drawCircle(0, 0, r);
  circle.endFill();

  let [x, y] = city.position ? city.position : [2166, 683];
  container.addChild(circle);
  container.addChild(text);
  container.x = x;
  container.y = y;

  container.interactive = true;
  container.on('pointerover', (e) => {
    container.scale.set(1.5);
  });
  container.on('pointerout', (e) => {
    container.scale.set(1.0);
  });
  container.on('pointerdown', (e) => {
    e.stopPropagation();
    moveToCity(city);
  });

  return container;
}

const tweenUpdate = (dt) => {
  requestAnimationFrame(tweenUpdate);
  tween.update(dt);
}
requestAnimationFrame(tweenUpdate);

let moveTween = null;
const moveToCity = (city) => {
  let [x, y] = city.position;
  let cityX = -x + vw/2;
  let cityY = -y + vh/2;
  if (moveTween) {
    moveTween.stop();
  }
  moveTween = new tween.Tween({ x: map.x, y: map.y })
    .to({ x: cityX, y: cityY })
    .easing(tween.Easing.Quadratic.InOut)
    .on('update', ({ x, y }) => {
      map.x = x;
      map.y = y;
    })
    .duration(500)
    .start();
};

const createBackground = (width, height) => {
  let texture = PIXI.Texture.fromImage(waterTile);
  let tilingSprite = new PIXI.extras.TilingSprite(texture, width, height);
  return tilingSprite;
};

const createCharacter = () => {
  let texture = PIXI.Texture.fromImage(character);
  let sprite = new PIXI.Sprite(texture);
  sprite.scale.set(0.35);
  return sprite;
};

const createMap = (width, height) => {
  let texture = PIXI.Texture.fromImage(worldMap);
  let base = texture.baseTexture;
  let container = new PIXI.Container();
  let map = new PIXI.Sprite(texture);

  let background = createBackground(base.width, base.height);
  container.addChild(background);
  container.addChild(map);

  let connectionLines = new PIXI.Graphics();
  connectionLines.beginFill(COLORS.black);
  connectionLines.lineStyle(2, COLORS.white, 1);
  for (let connection of connections) {
    let [name1, name2] = connection;
    let city1 = CITIES[name1];
    let city2 = CITIES[name2];
    let [x0, y0] = city1.position;
    let [x1, y1] = city2.position;
    connectionLines.moveTo(x0, y0);
    connectionLines.lineTo(x1, y1);
  }
  connectionLines.endFill();
  container.addChild(connectionLines);

  for (let cityDefinition of cities) {
    let city = createDraggableCity(cityDefinition, container);
    container.addChild(city);
  }

  let character = createCharacter();
  character = draggable(character);
  container.addChild(character);

  return draggable(container, "Map");
};

const render = (el, scale = 1) => {
  PIXI.loader
    .add('waterTile', waterTile)
    .add('worldMap', worldMap)
    .add('character', character)
    .once('complete', () => {
      app = new PIXI.Application(vw, vh, { backgroundColor: COLORS.white });
      map = createMap(vw, vh);
      app.stage.addChild(map);

      el.appendChild(app.view);
    })
    .load();
};

export default {
  render
};
