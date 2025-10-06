import Entity from "./Entity.js";
import { Score } from "./Score.js";


export default class LevelSystem extends Entity   {
    constructor({ maxLevel = 5, onLevelUp } = {}) {
        super({ className: 'level-system' });
        this.SettterX(innerWidth / 4 - 70);
        this.SetterY(20);
        this.currentLevel = 5 ;
        this.maxLevel = maxLevel;
        this.onLevelUp = onLevelUp;
        this.refreshText()
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel >this.maxLevel) {
           // alert('You win the game!');

            /////////////////////::::::

    const win = document.createElement("div");
        win.style.position = "fixed";
        win.innerHTML  = '<h1> Winner </h1>'
        document.body.appendChild(win)
        return     
        
                        /////////////////////
           
        }
        console.log('Level Up!', this.currentLevel);
        this.refreshText();
        if (this.onLevelUp) this.onLevelUp(this.currentLevel);
    }

    refreshText() {
        this.el.textContent = `Level: ${this.currentLevel}`;
    } 
}
