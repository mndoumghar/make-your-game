import Entity from "./Entity.js";

export default class Bullet extends Entity {
  constructor({ x, y, isEnemy = false }) {
    super({ className: 'bullet' });
    this.isEnemy = isEnemy;
    this.SPEED = 5;
    
    this.setX(x);
    this.setY(y);
    
    this.el.style.backgroundColor = isEnemy ? '#ff4444' : '#00ffcc';
  }

  update() {
    this.setY(this.y + (this.isEnemy ? this.SPEED : -this.SPEED));
  }
}