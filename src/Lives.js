import Entity from "./Entity.js"

export class Lives extends Entity {
    constructor() {
        super()
        this.lives = 3
       this.SettterX(innerWidth /4)
        this.SetterY(20)
        this.refrachText();
    }

    removeALifz() {   // ← نفس الاسم اللي مستعمل ف index.js
        this.lives -= 1;
        this.refrachText();

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    refrachText() {
        this.el.textContent = new Array(this.lives).fill('❤️').join('');
    }

    gameOver() {
        const msg = document.createElement("div");
        msg.textContent = "GAME OVER";
        msg.style.position = "fixed";
        msg.style.top = "50%";
        msg.style.left = "50%";
        msg.style.transform = "translate(-50%, -50%)";
        msg.style.fontSize = "80px";
        msg.style.color = "red";
        msg.style.fontFamily = "Arial, sans-serif";
        document.body.appendChild(msg)
        throw new Error("Game Over");

    }
}
