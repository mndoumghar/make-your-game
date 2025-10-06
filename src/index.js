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

// ----- Container -----
const container = document.getElementById('game-container');
const GAME_WIDTH = container.clientWidth;
const GAME_HEIGHT = container.clientHeight;

// ----- Score, Lives, Keyboard -----
const keyboard = new Keyboard();    
const scoreEl = new Score();
const livesEl = new Lives();

// ----- Game Entities -----
const bullets = [];
const allEnemies = [];
const enemyGrid = [];


// ----- Pause -----

const pause = new Pause({
  onRestart: () => {
    levelSystem.currentLevel = 0 // akha hkak rah kayrj3 0 mais  f interface kayban bhala ma removich 
      
    resetGame.reset()
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') pause.toggle();
});



// ----- Utility Functions -----
const addToScore = (points) => scoreEl.addScore(points);

const removeEnemy = (enemy) => {
  allEnemies.splice(allEnemies.indexOf(enemy), 1);
  enemyGrid.forEach(row => {
    const idx = row.indexOf(enemy);
    if (idx > -1) row.splice(idx, 1);
  });
  enemy.remove();
};

const removeBullet = (b) => {
  bullets.splice(bullets.indexOf(b), 1);
  b.remove();
};

function isOverlappingBullet(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

function getOverlappingBullet(entity) {
  for (const bull of bullets) {
    if (isOverlappingBullet(entity, bull.el)) return bull;
  }
  return null;
}

// ----- Spawn Enemies -----
function spawnEnemies(level = 1) {
  enemyGrid.length = 0;
  allEnemies.length = 0;

  const rows = Math.min(1 + level, 10);
  const cols = 5;
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const enemy = new Enemy({
        x: j * 50 + 100,
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

// ----- Level System -----
const levelSystem = new LevelSystem({
  maxLevel: 5,
  onLevelUp: (level) => {
    spawnEnemies(level);
    allEnemies.forEach(e => e.speed = 1 + 0.2 * level);
    clearInterval(enemyFireInterval);
    enemyFireInterval = setInterval(enemyFire, Math.max(500, 1000 - level * 100));
  }
});

// ----- Enemy Helpers -----
const getBottomEnemies = () => {
  const bottom = [];
  for (let i = 0; i < 9; i++) {
    for (let j = enemyGrid.length - 1; j >= 0; j--) {
      if (enemyGrid[j][i]) { bottom.push(enemyGrid[j][i]); break; }
    }
  }
  return bottom;
};

const getRandomEnemy = (list) => list[Math.floor(Math.random() * list.length)];

const enemyFire = () => {
  const bottomEnemies = getBottomEnemies();
  if (!bottomEnemies.length) return;
  const randomEnemy = getRandomEnemy(bottomEnemies);
  createBullet({ x: randomEnemy.x + 15, y: randomEnemy.y + 33, isEnemy: true });
}

let enemyFireInterval;

// ----- Edge Enemies -----
const getLeftMostEnemy = () => allEnemies.reduce((min, cur) => (cur.x < min.x ? cur : min), allEnemies[0]);
const getRightMostEnemy = () => allEnemies.reduce((max, cur) => (cur.x > max.x ? cur : max), allEnemies[0]);

// ----- Bullets -----
const createBullet = ({ x, y, isEnemy = false }) => bullets.push(new Bullet({ x, y, isEnemy }));

// ----- Player -----
const ship = new Ship({
  removeLife: () => livesEl.removeALifz(),
  removeBullet,
  getOverlappingBullet,
});


let levelUpPending = false;

// ----- Update Loop -----

// |

const Update = () => {
  if (keyboard.isPressed('d') && ship.x < GAME_WIDTH - 50) ship.moveRight();
  if (keyboard.isPressed('a') && ship.x > 0) ship.moveLeft();
  if (keyboard.isPressed(' ')) { ship.fire({ creatBullet: createBullet }); keyboard.release(" "); }

  ship.update();

  bullets.forEach(b => { b.update(); if (b.y < 0 || b.y > GAME_HEIGHT) removeBullet(b); });
  allEnemies.forEach(e => e.update());

  allEnemies.forEach(ennmy => {
    if (isOverlappingBullet(ship.el, ennmy.el)) {
      livesEl.removeALifz();
      removeEnemy(ennmy);
    }
  });

  const leftMost = getLeftMostEnemy();
  const rightMost = getRightMostEnemy();
  if (leftMost && leftMost.x < 30) allEnemies.forEach(e => { e.setDirectionRight(); e.movDown(); });
  if (rightMost && rightMost.x > GAME_WIDTH - 60) allEnemies.forEach(e => { e.setDirectionLeft(); e.movDown(); });
  
  
  if (!allEnemies.length && !levelUpPending) {
    levelUpPending = true; 
    setTimeout(() => {
      levelSystem.nextLevel();

      

      levelUpPending = false; 
    }, 3000);
  }



};



const resetGame = new ResetGame({
    ship,
    bullets,
    allEnemies,
    enemyGrid,
    scoreEl,
    livesEl,
    enemyFireInterval,
    levelSystem
});










// ----- Game Loop -----
function gameLoop() {
  if (!pause.isPaused) Update();
  requestAnimationFrame(gameLoop);
}

// ----- Start Intro -----
const startIntro = new Intro(() => {
  spawnEnemies(); 
  enemyFireInterval = setInterval(enemyFire, 1000); // bdaw enemy firing men ba3d Start
  requestAnimationFrame(gameLoop); 
});
