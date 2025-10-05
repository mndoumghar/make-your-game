import  Entity  from "./Entity.js"

export class Score extends Entity {
    constructor() {
        super()
        this.score = 0
        this.SettterX(innerWidth /1.3)
        this.SetterY(20)
        this.refrachText();
    }

    addScore(points) {
        this.score += points;
        this.refrachText();
  
    }

    refrachText() {
        this.el.textContent = `Score: ${this.score}`;
    }


}