import Bullet from "./Bullet.js";
import Enemy from "./Enemy.js";
import Ship from "./Ship.js";
import { Score } from "./Score.js";
import { Lives } from "./Lives.js";
import Keyboard from "./Keyboard.js";
import LevelSystem from './LevelSystem.js';
import Intro from "./Intro.js";
import { Pause } from './Pause.js';
import ResetGame from "./ResetGame.js";
import { Time } from "./Time.js";  // <-- Import Time class

// ----- Game Setup -----

const container = document.getElementById('game-container');
const GAME_WIDTH = container.clientWidth;
const GAME_HEIGHT = container.clientHeight;

const keyboard = new Keyboard();
const scoreEl = new Score();
const livesEl = new Lives();
const time = new Time();  // <-- Initialize Time instance
time.reset();
time.start();

/// initial variables
const bullets = [];
const allEnemies = [];
const enemyGrid = [];

let enemyFireInterval;
let gameLoopId;
let lastTimestamp = null;  // For deltaTime calculation

// ----- Player Ship -----

const ship = new Ship({
  removeLife: () => livesEl.removeALife(), // Corrected function call
  removeBullet,
  getOverlappingBullet,
});

// ----- Level System -----
const levelSystem = new LevelSystem({
  maxLevel: 5,
  onLevelUp: (level) => {
    spawnEnemies(level);
    clearInterval(enemyFireInterval);
    enemyFireInterval = setInterval(enemyFire, Math.max(400, 1200 - level * 150));
  }
});

// ----- Reset Game Logic -----
// This must be defined BEFORE the Pause menu that uses it.
const resetGame = new ResetGame({
  ship,
  bullets,
  allEnemies,
  enemyGrid,
  scoreEl,
  livesEl,
  levelSystem,
  onResetComplete: () => {
    time.reset();    // Reset timer on game reset
    time.start();    // Restart timer
    startGameFlow(); // Restart the game after everything is cleared
  }
});

// ----- Pause Logic -----
const pause = new Pause({
  onRestart: () => {
    resetGame.reset();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') pause.toggle();
});

// ----- Core Game Functions -----
function startGameFlow() {
  cancelAnimationFrame(gameLoopId);
  spawnEnemies(levelSystem.currentLevel);

  clearInterval(enemyFireInterval);
  enemyFireInterval = setInterval(enemyFire, 1200);
  lastTimestamp = null;  // Reset timestamp when starting game
  gameLoop();
}

function spawnEnemies(level = 1) {
  // Clear previous enemies before spawning new ones
  allEnemies.forEach(e => e.remove());
  allEnemies.length = 0;
  enemyGrid.length = 0;

  const rows = Math.min(2 + level, 7);
  const cols = Math.min(5 + level, 10);

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const enemy = new Enemy({
        x: j * 60 + 50,
        y: i * 50 + 50,
        getOverlappingBullet,
        removeEnemy,
        removeBullet,
        addToScore: (points) => scoreEl.addScore(points),
      });
      allEnemies.push(enemy);
      row.push(enemy);
    }
    enemyGrid.push(row);
  }
}

// ----- Entity Management & Collision -----
function removeEnemy(enemy) {
  const index = allEnemies.indexOf(enemy);
  if (index > -1) allEnemies.splice(index, 1);
  if (enemy.el) enemy.remove();
}

function removeBullet(bullet) {
  const index = bullets.indexOf(bullet);
  if (index > -1) bullets.splice(index, 1);
  if (bullet.el) bullet.remove();
}

function isOverlapping(el1, el2) {

  if (!el1 || !el2) return false;
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

function getOverlappingBullet(entity) {
  for (const bull of bullets) {
    if (isOverlapping(entity, bull.el)) return bull;
  }
  return null;
}

// ----- Enemy AI -----

const getBottomEnemies = () => {
  const bottomEnemies = [];
  if (!enemyGrid[0]) return [];
  const numCols = enemyGrid[0].length;
  for (let col = 0; col < numCols; col++) {
    for (let row = enemyGrid.length - 1; row >= 0; row--) {
      if (enemyGrid[row] && enemyGrid[row][col] && allEnemies.includes(enemyGrid[row][col])) {
        bottomEnemies.push(enemyGrid[row][col]);
        break;
      }
    }
  }
  return bottomEnemies;
};

const getRandomEnemy = (list) => list[Math.floor(Math.random() * list.length)];

const enemyFire = () => {
  if (pause.isPaused || allEnemies.length === 0) return;
  const shooters = getBottomEnemies();
  if (shooters.length === 0) return;
  const randomEnemy = getRandomEnemy(shooters);
  bullets.push(new Bullet({
    x: randomEnemy.x + 24, y: randomEnemy.y + 30, isEnemy: true
  }));
};

// ----- Main Update Function -----
let levelUpPending = false;

function Update(deltaTime) {
  if ((keyboard.isPressed('d') || keyboard.isPressed('ArrowRight')) && ship.x < GAME_WIDTH - ship.IMAGE_SIZE) ship.moveRight();
  if ((keyboard.isPressed('a') || keyboard.isPressed('ArrowLeft')) && ship.x > 0) ship.moveLeft();
  if (keyboard.isPressed(' ')) {
    ship.fire({ createBullet: (props) => bullets.push(new Bullet(props)) });
  }

  ship.update();
  bullets.forEach(b => {
    b.update();

    if (b.y < -10 || b.y > GAME_HEIGHT + 10) removeBullet(b);
  });
  
  allEnemies.forEach(e => e.update());

  allEnemies.forEach(enemy => {
    if (isOverlapping(ship.el, enemy.el)) {
      ship.death();
      removeEnemy(enemy);
    }
  });

  if (allEnemies.length > 0) {
    const leftMost = allEnemies.reduce((min, cur) => (cur.x < min.x ? cur : min));
    const rightMost = allEnemies.reduce((max, cur) => (cur.x > max.x ? cur : max));
    if (leftMost.x < 20) allEnemies.forEach(e => { e.setDirectionRight(); e.moveDown(); });
    if (rightMost.x > GAME_WIDTH - 50) allEnemies.forEach(e => { e.setDirectionLeft(); e.moveDown(); });
  }
  
  if (allEnemies.length === 0 && !levelUpPending) {
    levelUpPending = true;
    setTimeout(() => {
      levelSystem.nextLevel();
      levelUpPending = false;
    }, 2000);
  }

  time.update(deltaTime);  // <-- Update timer every frame
}

// ----- Game Loop -----
function gameLoop(timestamp) {
  try {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000; // ms to seconds
    lastTimestamp = timestamp;

    if (!pause.isPaused) Update(deltaTime);

    gameLoopId = requestAnimationFrame(gameLoop);
  } catch (e) {
    if (e.message === "Game Over" || e.message === "Game Won") {
      console.log(e.message);
      cancelAnimationFrame(gameLoopId);
      clearInterval(enemyFireInterval);
    } else { 
      throw e; 
    }
  }
}

// ----- Start the Game -----
new Intro(() => {
  startGameFlow();
});
