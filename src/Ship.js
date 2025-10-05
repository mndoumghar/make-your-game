import Entity from "./Entity.js";

export default class Ship extends Entity {
  constructor({ removeLife, removeBullet, getOverlappingBullet }) {
    super({ tag: 'img' }); 
    this.el.src = 'images/player.png'; 

    // 🔥 خليه يتزاد داخل الإطار ماشي فـ body
    const container = document.getElementById('game-container');
    container.appendChild(this.el);

    this.SPEED = 5;
    this.SIZEIMAGE = 50;
    this.firee = true;
    this.removeLife = removeLife;
    this.removeBullet = removeBullet;
    this.getOverlappingBullet = getOverlappingBullet;
    this.isAlive = true;

    this.spawn();
  }

  SettterX(x) {
    this.x = x;
    this.el.style.left = `${this.x}px`; 
  }

  SetterY(y) {
    this.y = y;
    this.el.style.top = `${this.y}px`;
  }

  spawn() {
    this.isAlive = true;
    this.el.style.opacity = 1;

    // 🧭 خلي الإحداثيات داخل الإطار
    const container = document.getElementById('game-container');
    this.SettterX(container.clientWidth / 2 - this.SIZEIMAGE / 2);
    this.SetterY(container.clientHeight - 80);
  }

  moveRight() {
    if (!this.isAlive) return;
    this.SettterX(this.x + this.SPEED);
  }

  moveLeft() {
    if (!this.isAlive) return;
    this.SettterX(this.x - this.SPEED);
  }

  fire({ creatBullet }) {
    if (this.firee) {
      this.firee = false;
      creatBullet({
        x: this.x + this.SIZEIMAGE / 2,
        y: this.y,
      });
      setTimeout(() => {
        this.firee = true;
      }, 1000 / 60);
    }
  }

  death() {
    this.isAlive = false;
    this.el.style.opacity = 0;

    setTimeout(() => {
      this.spawn();
    }, 3000);
  }

  update() {
    const bullet = this.getOverlappingBullet(this.el);
    if (bullet && bullet.isEnemy && this.isAlive) {
      this.removeBullet(bullet);
      this.removeLife();
      this.death();
    }
  }
}
