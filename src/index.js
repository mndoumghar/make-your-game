import Bullet from "./Bullet.js";
import Enemy from "./Enemy.js";
import Ship from "./Ship.js";
import { Score } from "./Score.js"; 
import { Lives } from "./Lives.js";
import Keyboard from "./Keyboard.js";
import LevelSystem from './LevelSystem.js';

// ---- Score, Lives, Keyboard ----
const keyboard = new Keyboard();    
const scoreEl = new Score();
const livesEl = new Lives();

// ---- Game Entities ----
const bullets = [];
const allEnemies = [];
const enemyGrid = [];

// ---- Utility Functions ----
const addToScore = (points) => scoreEl.addScore(points);

const removeEnemy = (enemy) => {
  allEnemies.splice(allEnemies.indexOf(enemy), 1);
  enemy.remove();
};

const removeBullet = (b) => {
  bullets.splice(bullets.indexOf(b), 1);
  b.remove();
};

// ---- Collision Detection ----
function isOverlappingBullet(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}

function getOverlappingBullet(entity) {
  for (const bull of bullets) {
    if (isOverlappingBullet(entity, bull.el)) return bull;
  }
  return null;
}

// ---- Spawn Enemies ----
function spawnEnemies(level = 1) {
  enemyGrid.length = 0;
  allEnemies.length = 0;

  const rows = Math.min(1+ level, 10); // more rows per level
  const cols = 9;

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const enemy = new Enemy({
        x: j * 60 + 100,
        y: i * 60 + 50,
        getOverlappingBullet,
        removeEnemy,
        removeBullet,
        addTOScore: addToScore,
      });
      allEnemies.push(enemy);
      row.push(enemy);
    }
    enemyGrid.push(row);
  }
}

// ---- Level System ----
const levelSystem = new LevelSystem({
  maxLevel: 5,
  onLevelUp: (level) => {
    console.log('Level Up! Now Level:', level);
    spawnEnemies(level);

    // Scale difficulty
    allEnemies.forEach(e => e.speed = 1 + 0.2 * level);
    clearInterval(enemyFireInterval);
    enemyFireInterval = setInterval(enemyFire, Math.max(500, 1000 - level * 100));
  }
});

// ---- Enemy Helpers ----
const getBottomEnemies = () => {
  const bottom = [];
  for (let i = 0; i < 9; i++) {
    for (let j = enemyGrid.length - 1; j >= 0; j--) {
      if (enemyGrid[j][i]) {
        bottom.push(enemyGrid[j][i]);
        break;
      }
    }
  }
  return bottom;
};

const getRandomEnemy = (list) =>
  list[Math.floor(Math.random() * list.length)];

const enemyFire = () => {
  const bottomEnemies = getBottomEnemies();
  if (bottomEnemies.length === 0) return;

  const randomEnemy = getRandomEnemy(bottomEnemies);
  createBullet({
    x: randomEnemy.x + 15,
    y: randomEnemy.y + 33,
    isEnemy: true,
  });
};

let enemyFireInterval = setInterval(enemyFire, 1000);

// ---- Edge Enemies ----
const getLeftMostEnemy = () =>
  allEnemies.reduce((min, cur) => (cur.x < min.x ? cur : min), allEnemies[0]);
const getRightMostEnemy = () =>
  allEnemies.reduce((max, cur) => (cur.x > max.x ? cur : max), allEnemies[0]);

// ---- Bullets ----
const createBullet = ({ x, y, isEnemy = false }) => {
  bullets.push(new Bullet({ x, y, isEnemy }));
};

// ---- Player ----
const ship = new Ship({
  removeLife: () => livesEl.removeALifz(),
  removeBullet,
  getOverlappingBullet,
});

// ---- Initial Spawn ----
spawnEnemies(1);

// ---- Update Loop ----
const Update = () => {
  // Ship movement
  if (keyboard.isPressed('d') && ship.x < window.innerWidth - 50) {
    ship.moveRight();
  } else if (keyboard.isPressed('a') && ship.x > 0) {
    ship.moveLeft();
  }

  // Fire
  if (keyboard.isPressed(' ')) {
    ship.fire({ creatBullet: createBullet });
    keyboard.release(" "); // prevent infinite hold
  }

  // Update Ship
  ship.update();

  // Update Bullets
  bullets.forEach((b) => {
    b.update();
    if (b.y < 0 || b.y > window.innerHeight) removeBullet(b);
  });

  // Update Enemies
  allEnemies.forEach((e) => e.update());

  // Check screen edges
  const leftMost = getLeftMostEnemy();
  const rightMost = getRightMostEnemy();

  if (leftMost && leftMost.x < 30) {
    allEnemies.forEach((e) => { e.setDirectionRight(); e.movDown(); });
  }
  if (rightMost && rightMost.x > window.innerWidth - 60) {
    allEnemies.forEach((e) => { e.setDirectionLeft(); e.movDown(); });
  }

  // Check level-up
  if (allEnemies.length === 0) {
    levelSystem.nextLevel();
  }
};

// ---- Main Game Loop ----
function gameLoop() {
  Update();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
