import Entity from "./Entity.js";

export class Pause extends Entity {
  constructor({ onRestart }) {
    super();
    this.isPaused = false;
    this.onRestart = onRestart;

    Object.assign(this.el.style, {
      position: "absolute",
      top: '0',
      left: '0',
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontFamily: '"Press Start 2P", Arial, sans-serif',
      zIndex: '100',
      textAlign: "center",
      gap: "30px",
    });

    const title = document.createElement("h1");
    title.textContent = "PAUSED";
    Object.assign(title.style, {
      fontSize: "40px",
      color: "#00ffcc",
      textShadow: "0 0 20px #00ffff, 0 0 40px #00ffff",
    });

    const continueBtn = document.createElement("button");
    continueBtn.textContent = "CONTINUE";
    Object.assign(continueBtn.style, this.buttonStyle());
    continueBtn.addEventListener("click", () => this.hide());

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "RESTART";
    Object.assign(restartBtn.style, this.buttonStyle(true));
    restartBtn.addEventListener("click", () => {
      this.hide();
      this.onRestart();
    });

    this.el.appendChild(title);
    this.el.appendChild(continueBtn);
    this.el.appendChild(restartBtn);

    this.hide();
  }

  buttonStyle(isRed = false) {
    return {
      fontSize: "18px",
      padding: "12px 40px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      letterSpacing: "2px",
      backgroundColor: isRed ? "#ff4444" : "#00ffcc",
      color: "#000",
      boxShadow: `0 0 20px ${isRed ? "#ff4444" : "#00ffff"}`,
      transition: "transform 0.2s ease",
    };
  }

  show() {
    this.isPaused = true;
    this.el.style.display = "flex";
  }

  hide() {
    this.isPaused = false;
    this.el.style.display = "none";
  }

  toggle() {
    if (this.isPaused) this.hide();
    else this.show();
  }
}