import _ from 'lodash';
import GameObject from './GameObject';

import worldMap from '../static/images/world-map.svg';

class BouncingRectangle extends GameObject {

  initialize() {
    this.position = [0, 0];
    this.velocity = [Math.random() * 100, Math.random() * 100];
    let r = _.random(0,255);
    let g = _.random(0,255);
    let b = _.random(0,255);
    this.color = `rgb(${r},${g},${b})`;
  }

  update(dt) {
    this.position = [
      this.position[0] + this.velocity[0] * dt,
      this.position[1] + this.velocity[1] * dt
    ];
  }

  draw() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.position[0], this.position[1], 20, 20);
  }

}

export default class Map extends GameObject {

  initialize() {
    this.image = new Image();
    this.image.src = worldMap;
    this.offset = [0, 0];
    this.rectangles = []; // _.range(10000).map(() => new BouncingRectangle(this.context));
  }

  update(dt) {
    this.rectangles.forEach(r => r.update(dt));
  }

  draw() {
    this.context.drawImage(this.image, this.offset[0], this.offset[1], 2000, 1400);
    this.rectangles.forEach(r => r.draw());
  }
}