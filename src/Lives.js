import Entity from "./Entity.js";

export class Lives extends Entity {
  constructor() {
    super();
    this.lives = 1;
    
    this.setX(38);
    this.setY(28);
    this.el.style.fontSize = '20px';

    this.refreshText();
  }

  // Corrected function name
  removeALife() {
    if (this.lives <= 0) return;
    
    this.lives -= 1;
    this.refreshText();

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  refreshText() {
    this.el.textContent = `Lives: ${new Array(this.lives).fill('❤️').join('')}`;
  }

  gameOver() {
    const msg = document.createElement("div");
          msg.textContent = "GAME OVER";

    setTimeout(()=> {
      msg.textContent = "";

    },1000)
    Object.assign(msg.style, {
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)", fontSize: "80px",
      color: "#ff4444", fontFamily: "Arial, sans-serif",
      textShadow: "0 0 20px #ff0000",
    });
    
    document.body.appendChild(msg);
    throw new Error("");
  }

  // Added reset method
  reset() {
    this.lives = 3;
    this.refreshText();
  }
}