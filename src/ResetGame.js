export default class ResetGame {
    constructor({ ship, bullets, allEnemies, enemyGrid, scoreEl, livesEl, enemyFireInterval, levelSystem }) {
        this.ship = ship;
        this.bullets = bullets;
        this.allEnemies = allEnemies;
        this.enemyGrid = enemyGrid;
        this.scoreEl = scoreEl;
        this.livesEl = livesEl;
        this.enemyFireInterval = enemyFireInterval;
        this.levelSystem = levelSystem;
    }

    reset() {
        // Stop enemy firing
        clearInterval(this.enemyFireInterval);

        // Remove bullets
        this.bullets.forEach(b => b.remove());
        this.bullets.length = 0;

        // Remove enemies
        this.allEnemies.forEach(e => e.remove());
        this.allEnemies.length = 0;
        this.enemyGrid.length = 0;

        // Reset player position & state
        this.ship.reset(); // katdir méthode reset f Ship.js li t3awdh position w ammo w fire state

        // Reset score & lives
        this.scoreEl.reset();
        this.livesEl.reset();

        // Reset level system
        this.levelSystem.reset();

        // Respawn enemies
        spawnEnemies(1); // bda men level 1

        // Restart enemy firing
        this.enemyFireInterval = setInterval(enemyFire, 1000);
    }
}
