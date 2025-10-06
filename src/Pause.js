import Entity from "./Entity.js";

export class Pause extends Entity {
    constructor() {
        super(); // khllina default div
        this.isPaused = false;
        this.SettterX(innerWidth/2);
        this.SetterY(innerHeight / 2);
    this.el.innerHTML = '<h1>Paused</h1>'
        this.hide();
    }

    show() {
        this.isPaused = true;
        this.el.style.display = 'flex';
    }

    hide() {
        this.isPaused = false;
        this.el.style.display = 'none';
    }

    toggle() {
        if (this.isPaused) {
            this.hide();
        } else {
            this.show();
        }
    }
}
