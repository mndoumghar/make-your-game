import Entity from "./Entity.js";

const LEFT = 'left'
const RIGHT = 'right'

export default class Enemy extends Entity {

  constructor({x, y, getOverlappingBullet, removeEnemy  , removeBullet, addTOScore }) {

    super({ tag: 'img', className: 'enemy' });
    const enemyImages = ['../images/enemy1.png', '../images/enemy2.png', '../images/enemy3.png'];
    const randomIndex = Math.floor(Math.random() * enemyImages.length);
    this.el.src = enemyImages[randomIndex];
    this.SPEED = 1;
    this.DOWN_DISTANCESPEED =  3;
    this.direction = LEFT;
    this.removeEnemy = removeEnemy
    this.getOverlappingBullet = getOverlappingBullet 
    this.removeBullet = removeBullet
  this.addTOScore = addTOScore
    this.SettterX(x);
    this.SetterY(y);
  }

  setDirectionRight() {
    this.direction = RIGHT;
  }

  setDirectionLeft() {
    this.direction = LEFT;
  }

  movDown() {
    this.SetterY(this.y + this.DOWN_DISTANCESPEED); 
  }

  update() {
    if (this.direction === LEFT) {
      this.SettterX(this.x - this.SPEED);
    } else {
      this.SettterX(this.x + this.SPEED);
    }


const bullettt = this.getOverlappingBullet(this.el);
    if(bullettt && !bullettt.isEnemy) {
      this.removeEnemy(this)
     this.removeBullet(bullettt)
     this.addTOScore(10)

    }
  }

}
