import Entity from "./Entity.js";

export class Pause extends Entity {
    constructor() {
        super(); // khllina default div
        this.isPaused = false;
        this.SettterX(0);
        this.SetterY(0);
        this.el.style.width = `${innerWidth}px`;
        this.el.style.height = `${innerHeight}px`;
        this.el.style.backgroundColor = 'rgba(0,0,0,0.7)';
        this.el.style.color = 'white';
        this.el.style.fontSize = '40px';
        this.el.style.display = 'flex';
        this.el.style.justifyContent = 'center';
        this.el.style.alignItems = 'center';
        this.el.style.position = 'absolute';
        this.el.style.zIndex = 9999;
        this.el.textContent = 'PAUSED';
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
