import Entity from "./Entity.js";
export default class Bullet extends Entity {
  constructor({x, y, isEnemy = false}) {
   
    super({ className: 'bullet' });
    this.isEnemy = isEnemy
    this.SPEED = 3;
    this.SettterX(x);
    this.SetterY(y);
  }
  update() {

    this.SetterY(this.y + (this.isEnemy? this.SPEED: -this.SPEED));
  }
}
