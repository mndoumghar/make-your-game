export default class ResetGame {
  constructor({ ship, bullets, allEnemies, enemyGrid, scoreEl, livesEl, levelSystem, onResetComplete }) {
    this.ship = ship;
    this.bullets = bullets;
    this.allEnemies = allEnemies;
    this.enemyGrid = enemyGrid;
    this.scoreEl = scoreEl;
    this.livesEl = livesEl;
    this.levelSystem = levelSystem;
    this.onResetComplete = onResetComplete;
  }

  reset() {
    // Clear all existing game objects
    this.bullets.forEach(b => b.remove());
    this.bullets.length = 0;

    this.allEnemies.forEach(e => e.remove());
    this.allEnemies.length = 0;
    this.enemyGrid.length = 0;

    // Reset UI and game state by calling their reset methods
    this.ship.reset();
    this.scoreEl.reset();
    this.livesEl.reset();
    this.levelSystem.reset();

    // Remove any leftover "Game Over" or "Winner" messages
    const gameOverMsg = document.querySelector('div[style*="GAME OVER"]');
    const winMsg = document.querySelector('div[style*="YOU WIN"]');
    if (gameOverMsg) gameOverMsg.remove();
    if (winMsg) winMsg.remove();

    if (this.onResetComplete) {
      this.onResetComplete();
    }
  }
}