import Entity from "./Entity.js";

export class Score extends Entity {
  constructor() {
    super();
    this.score = 0;
    
    const container = document.getElementById('game-container');
    this.setX(container.clientWidth / 2);
    this.setY(20);
    
    this.el.style.transform = `translate(50%, 0)`;
    this.el.style.fontSize = '20px';

    this.refreshText();
  }

  addScore(points) {
    this.score += points;
    this.refreshText();
  }

  refreshText() {
    
  
      const container = document.getElementById('game-container')
    const GAME_WIDTH = container.clientWidth;
    const GAME_HEIGHT = container.clientHeight;

    
    this.setX(20);
    this.setY(20);
    
    
  
    this.el.textContent = `Score: ${this.score}`;
  }

  // Added reset method
  reset() {
    this.score = 0;
    this.refreshText();
  }
}