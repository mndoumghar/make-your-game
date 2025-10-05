import Entity from "./Entity.js";


export default class LevelSystem extends Entity   {
    constructor({ maxLevel = 5, onLevelUp } = {}) {
        super({ className: 'level-system' });
        this.SettterX(innerWidth / 4 - 70);
        this.SetterY(20);
        this.currentLevel = 1;
        this.maxLevel = maxLevel;
        this.onLevelUp = onLevelUp;
        this.refreshText()
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel >this.maxLevel) {
            alert('You win the game!');
            window.location.reload();
            return;
        }
        console.log('Level Up!', this.currentLevel);
        this.refreshText();
        if (this.onLevelUp) this.onLevelUp(this.currentLevel);
    }

    refreshText() {
        this.el.textContent = `Level: ${this.currentLevel}`;
    } 
}
