import Entity from "./Entity.js";

export default class Bullet extends Entity {
  
  constructor({x, y, isEnemy = false}) {
   
    super({ className: 'bullet' });
    this.isEnemy = isEnemy
    this.SPEED = 1.5
    this.SettterX(x);
    this.SetterY(y);
  }

  update() {
    /// ila kan player raha isEnemy = false  
    /// ila kan enemy raha isEnemy = true
    this.SetterY(this.y + (this.isEnemy? this.SPEED: -this.SPEED));
  }
}
