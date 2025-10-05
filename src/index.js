import Bullet from "./Bullet.js";
import Enemy from "./Enemy.js";
import Ship from "./Ship.js";
import { Score } from "./Score.js"; 
import { Lives } from "./Lives.js";
import Keyboard from "./Keyboard.js";
import lvls from "./lvl_sys.js"

const lvl_sys = new lvls({
  maxLevel: 5,
  onLevelUp: (level) => {
    // You could add level-specific behaviors here if needed
  }
})

const keyboard = new Keyboard(); // ✅ instance, not redeclare class
const scoreEl = new Score();
const livesEl = new Lives();

const bullets = [];
const allEnemies = [];
const e_g = [];

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

// ---- Enemy Grid Setup ----
for (let i = 0; i < 5; i++) {
  const row = [];
  for (let j = 0; j < 9; j++) {
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
  e_g.push(row);
}

// ---- Enemy Helpers ----
const getBottomEnemies = () => {
  const bottom = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 4; j >= 0; j--) {
      if (e_g[j][i]) {
        bottom.push(e_g[j][i]);
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

// fire every 1s
setInterval(enemyFire, 1000);

// ---- Edge Enemies ----
const getLeftMostEnemy = () =>
  allEnemies.reduce((min, cur) => (cur.x < min.x ? cur : min), allEnemies[0]);
const getRightMostEnemy = () =>
  allEnemies.reduce((max, cur) => (cur.x > max.x ? cur : max), allEnemies[0]);

// ---- Bullets ----
const createBullet = ({ x, y, isEnemy = false }) => {
  bullets.push(new Bullet({ x, y, isEnemy }));
};

// ---- Collision Check ----
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

// ---- Player ----
const ship = new Ship({
  removeLife: () => livesEl.removeALifz(),
  removeBullet,
  getOverlappingBullet,
});

// ---- Update Loop ----
const Update = () => {
  // Movement
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
  ship.update();

  bullets.forEach((b) => {
    b.update();
    if (b.y < 0) removeBullet(b);
  });

  allEnemies.forEach((e) => e.update());

  // Handle enemy movement and boundaries
  if (allEnemies.length > 0) {
    const leftMost = getLeftMostEnemy();
    const rightMost = getRightMostEnemy();

    if (leftMost && leftMost.x < 30) {
      allEnemies.forEach((e) => {
        e.setDirectionRight();
        e.movDown();
      });
    }

    if (rightMost && rightMost.x > window.innerWidth - 60) {
      allEnemies.forEach((e) => {
        e.setDirectionLeft();
        e.movDown();
      });
    }
  }
  
  // Check if level is complete (all enemies defeated)
  if (allEnemies.length === 0) {
    lvl_sys.nextLevel();
    spawnEnemiesForLevel(lvl_sys.currentLevel);
  }
};

// ---- Enemy Grid Setup Function ----
function spawnEnemiesForLevel(level) {
  e_g.length = 0;
  
  const rows = Math.min(5, 3 + Math.floor(level/2)); // More rows as levels increase
  const cols = Math.min(10, 6 + level);
  
  const e_s = 1 + (level * 0.2); // Enemy speed increases with level
  
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const e = new Enemy({
        x: j * 60 + 100, 
        y: i * 60 + 50, 
        getOverlappingBullet, 
        removeEnemy, 
        removeBullet,
        addTOScore: addToScore,
      });
      e.SPEED = e_s;
      allEnemies.push(e);
      row.push(e);
    }
    e_g.push(row);
  }
}

// ---- Main Game Loop ----
function gameLoop() {
  Update();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);