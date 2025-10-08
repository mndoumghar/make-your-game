import Entity from "./Entity.js";

export default class Ship extends Entity {
  
  constructor({ removeLife, removeBullet, getOverlappingBullet }) {
    super({ tag: 'img' });
    this.el.src = 'images/player.png';
    this.SPEED = 3;
    this.IMAGE_SIZE = 50;
    this.canFire = true;
    this.removeLife = removeLife;
    this.removeBullet = removeBullet;
    this.getOverlappingBullet = getOverlappingBullet;
    this.isAlive = true;
    this.spawn();
  }

  spawn() {
    this.isAlive = true;
    this.el.style.opacity = 1;
    this.el.style.transition = 'opacity 0.5s';
    const container = document.getElementById('game-container');
    this.setX(container.clientWidth / 2 - this.IMAGE_SIZE / 2);
    this.setY(container.clientHeight - 80);
  }

  moveRight() {
    if (!this.isAlive) return;
    this.setX(this.x + this.SPEED);
  }

  moveLeft() {
    if (!this.isAlive) return;
    this.setX(this.x - this.SPEED);
  }

  fire({ createBullet }) {
    if (this.canFire && this.isAlive) {
      this.canFire = false;
      createBullet({
        x: this.x + this.IMAGE_SIZE / 2 - 2,
        y: this.y,
      });
      setTimeout(() => {
        this.canFire = true;
      }, 400);
    }
  }

  death() {
    if (!this.isAlive) return;
    
    this.isAlive = false;
    this.el.style.opacity = 0.5;
    this.removeLife();

    setTimeout(() => {
      this.spawn();
    }, 2000);
  }

  update() {
    const bullet = this.getOverlappingBullet(this.el);
    if (bullet && bullet.isEnemy && this.isAlive) {
      this.removeBullet(bullet);
      this.death();
    }
  }

  // Added reset method for restarting the game
  reset() {
    this.spawn();
  }
}