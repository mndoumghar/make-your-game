export default class lvls {
    constructor({ maxLevel = 5, onLevelUp } = {}) {
        this.currentLevel = 1;
        this.maxLevel = maxLevel;
        this.onLevelUp = onLevelUp;
        this.isTransitioning = false; // Add flag to prevent multiple level transitions
        this.showLevel();
    }

    nextLevel() {
        // Prevent multiple transitions
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentLevel++;
        
        // Show level transition message
        this.showLevelTransition(() => {
            if (this.currentLevel > this.maxLevel) {
                this.showWinOverlay();
                return;
            }
            
            this.showLevel();
            if (this.onLevelUp) this.onLevelUp(this.currentLevel);
            this.isTransitioning = false;
        });
    }
    
    showLevelTransition(callback) {
        // Create a level transition overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.color = 'white';
        overlay.style.fontSize = '48px';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';
        
        // If this is the last level, show win message, otherwise show level completion
        if (this.currentLevel >= this.maxLevel) {
            overlay.textContent = 'FINAL LEVEL COMPLETE!';
        } else {
            overlay.textContent = `LEVEL ${this.currentLevel} COMPLETE!`;
        }
        
        document.body.appendChild(overlay);
        
        // Remove overlay after 2 seconds
        setTimeout(() => {
            overlay.remove();
            if (callback) callback();
        }, 2000);
    }

    showLevel() {
        // Show level somewhere in UI
        let el = document.getElementById('level-display');
        if (!el) {
            el = document.createElement('div');
            el.id = 'level-display';
            el.style.position = 'fixed';
            el.style.top = '10px';
            el.style.left = '50%';
            el.style.transform = 'translateX(-50%)';
            el.style.color = 'yellow';
            el.style.fontSize = '22px';
            el.style.fontFamily = 'Arial, sans-serif';
            el.style.zIndex = '1000';
            document.body.appendChild(el);
        }
        el.textContent = `Level: ${this.currentLevel}`;
    }

    showWinOverlay() {
        const winMsg = document.createElement('div');
        winMsg.textContent = '🎉 YOU WON! 🎉';
        winMsg.style.position = 'fixed';
        winMsg.style.top = '50%';
        winMsg.style.left = '50%';
        winMsg.style.transform = 'translate(-50%, -50%)';
        winMsg.style.fontSize = '64px';
        winMsg.style.color = 'lime';
        winMsg.style.fontFamily = 'Arial, sans-serif';
        winMsg.style.background = 'rgba(0,0,0,0.85)';
        winMsg.style.padding = '32px 48px';
        winMsg.style.borderRadius = '20px';
        winMsg.style.zIndex = '9999';
        document.body.appendChild(winMsg);

        // Show final score
        const scoreDisplay = document.createElement('div');
        const scoreElement = document.querySelector('.score') || { textContent: 'Score: 0' };
        scoreDisplay.textContent = `Final ${scoreElement.textContent}`;
        scoreDisplay.style.fontSize = '36px';
        scoreDisplay.style.textAlign = 'center';
        scoreDisplay.style.marginTop = '20px';
        winMsg.appendChild(scoreDisplay);

        const btn = document.createElement('button');
        btn.textContent = 'Play Again';
        btn.style.display = 'block';
        btn.style.margin = '32px auto 0';
        btn.style.fontSize = '28px';
        btn.style.background = '#222';
        btn.style.color = 'white';
        btn.style.border = '2px solid lime';
        btn.style.borderRadius = '12px';
        btn.style.padding = '10px 24px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => window.location.reload();
        winMsg.appendChild(btn);
    }
}