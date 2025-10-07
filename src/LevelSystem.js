import Entity from "./Entity.js";

export default class LevelSystem extends Entity {
  constructor({ maxLevel = 5, onLevelUp } = {}) {
    super({ className: 'level-system' });
    
    const container = document.getElementById('game-container');
    this.setX(container.clientWidth - 80);
    this.setY(20);
    this.el.style.transform = `translate(950%, 0)`;
    this.el.style.fontSize = '20px';

    this.currentLevel = 5; 
    this.maxLevel = maxLevel;
    this.onLevelUp = onLevelUp;
    this.refreshText();
  }

  nextLevel() {
    this.currentLevel++;
    if (this.currentLevel > this.maxLevel) {
      this.winGame();
      return;
    }
    this.refreshText();
    if (this.onLevelUp) this.onLevelUp(this.currentLevel);
  }

  winGame() {
    const msg = document.createElement("div");
    msg.textContent = "YOU WIN!";
    Object.assign(msg.style, {
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)", fontSize: "80px",
      color: "#00ffcc", fontFamily: "Arial, sans-serif",
      textShadow: "0 0 20px #00ffff",
    });
    
    document.body.appendChild(msg);
    throw new Error("Game Won"); // Stops the game loop
  }

  refreshText() {
    this.el.textContent = `Level: ${this.currentLevel}`;
  }

  // Added reset method
  reset() {
    this.currentLevel = 1;
    this.refreshText();
  }
}