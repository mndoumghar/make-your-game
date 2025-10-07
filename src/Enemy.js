import Entity from "./Entity.js";

const LEFT = 'left';
const RIGHT = 'right';

export default class Enemy extends Entity {
  constructor({ x, y, getOverlappingBullet, removeEnemy, removeBullet, addToScore }) {
    super({ tag: 'img', className: 'enemy' });

    // Corrected image paths
    const enemyImages = ['images/enemy1.png', 'images/enemy2.png', 'images/enemy3.png'];
    const randomIndex = Math.floor(Math.random() * enemyImages.length);
    this.el.src = enemyImages[randomIndex];

    this.SPEED = 1;
    this.DOWN_DISTANCE_SPEED = 10;
    this.direction = RIGHT;
    
    this.removeEnemy = removeEnemy;
    this.getOverlappingBullet = getOverlappingBullet;
    this.removeBullet = removeBullet;
    this.addToScore = addToScore;

    this.setX(x);
    this.setY(y);
  }

  setDirectionRight() {
    this.direction = RIGHT;
  }

  setDirectionLeft() {
    this.direction = LEFT;
  }

  moveDown() {
    this.setY(this.y + this.DOWN_DISTANCE_SPEED);
  }

  update() {
    if (this.direction === LEFT) {
      this.setX(this.x - this.SPEED);
    } else {
      this.setX(this.x + this.SPEED);
    }

    const bullet = this.getOverlappingBullet(this.el);
    if (bullet && !bullet.isEnemy) {
      this.removeEnemy(this);
      this.removeBullet(bullet);
      this.addToScore(10);
    }
  }
}