import  Entity  from "./Entity.js"

export class Score extends Entity {
    constructor() {
        super()
        this.score = 0
    
        this.SettterX(innerWidth /2)
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