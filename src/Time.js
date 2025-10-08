import Entity from "./Entity.js";

export class Time extends Entity {
  constructor() {
    super();
    this.time = 0; // time in seconds
    this.running = false; // control timer state
    
    const container = document.getElementById('game-container');
    this.setX(container.clientWidth /4);
    this.setY(50); // position below score
    this.el.style.transform = `translate(50%, 0)`;
    this.el.style.fontSize = '20px';
    
    this.refreshText();
  }
  
  start() {
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  reset() {
    this.time = 0;
    this.refreshText();
  }

update(deltaTime) {
  if (typeof deltaTime !== "number" || isNaN(deltaTime)) {
    return;
  }
  this.time += deltaTime;
  if (isNaN(this.time)) {
  }
  this.refreshText();
}

  formatTime() {
    const totalSeconds = Math.floor(this.time);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  refreshText() {
    this.el.textContent = `Time: ${this.formatTime()}`;
    this.setX(20);
    this.setY(50);
  }
}
