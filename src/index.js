
import Bullet from "./Bullet.js";
import Enemy from "./Enemy.js";
import Ship from "./Ship.js";
import { Score } from "./Score.js"; 
import  {Lives}  from "./Lives.js";

const scoreEl = new Score()    
const livesEl = new Lives()


const keys = {
  a: false,
  d: false,
  [' ']: false,
};
const bullet = []
const Allenemys = []
const enemyGrid = []

const addTOScore = (maintentent) => {
  scoreEl.addScore(maintentent)    
}

const removeEnemy = (enmey) => {
  Allenemys.splice(Allenemys.indexOf(enmey), 1 );
  enmey.remove()  
  
}

const removeBullet = (bulletttt) => {
  bullet.splice(bullet.indexOf(bulletttt), 1 );
  bulletttt.remove()  

}


for (let i = 0; i < 5; i++) {
  const enmyy = []
  for (let j = 0; j < 9; j++) { 
    const Allenemy = new Enemy({
      x: j * 60 +100 ,
      y: i * 60 + 50,
      getOverlappingBullet,
      removeEnemy,
      removeBullet,
      addTOScore,
    })

    Allenemys.push(Allenemy)
    enmyy.push(Allenemy)
  }
  enemyGrid.push(enmyy)
}


const getBottoMEnemy = () => {
const botomEnemy = []
  for (let i = 0; i < 9; i++) {
    for (let j = 5-1; j >= 0 ; j--) {
      if(enemyGrid[j][i]) {
        botomEnemy.push(enemyGrid[j][i])
        break;
      }
    }    
  }
  return botomEnemy;
}

// li ghaychoot f enemy kol mra kaybdl 
const getRandomEnemy = (listEnemy) => {
  return listEnemy[Math.floor(Math.random() * listEnemy.length)];
}

const enemeyFire = () => {
  const botomEnemy = getBottoMEnemy();
  const randomEnemy = getRandomEnemy(botomEnemy);

  creatBullet({x: randomEnemy.x + 15,
     y: randomEnemy.y  + 33,
     isEnemy: true
    
    
    })

}
setInterval(() => {
  enemeyFire();
}, 1000); 


console.log(getBottoMEnemy());





const getLeftMostEnemy = () => {

  return Allenemys.reduce((min, current)=> {
  
    return current.x < min.x ? current : min
  })

}

const getRightMostEnemy = () => {

  return Allenemys.reduce((max, current)=> {
  
    return current.x > max.x ? current : max
  })

}

const creatBullet = ({x, y, isEnemy = false}) => {
  
    bullet.push(new Bullet(
      {
        x,y,isEnemy
      }
    )); 
}

 

document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});


// hna kacheck ila 3ndo joj dyal domat t9aso
function isOverlappingBullet(el1, el2) {

        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);     
}


function getOverlappingBullet (entity) {
  for (const bull of bullet) {
    if (isOverlappingBullet(entity, bull.el)) {
      return bull;
    }  
  }
  return null;
}



const ship = new Ship(
  {
    removeLife: () => livesEl.removeALifz(),
    removeBullet,
    getOverlappingBullet,
    

  }
);

const Update = () => {
  if (keys['d'] && ship.x < window.innerHeight-50)  {
    
    ship.moveRight();
  } else if (keys['a'] && ship.x>0) {
    ship.moveLeft();
  }
  if(keys[' ']) {

    ship.fire({creatBullet})
      
  }

      ship.update()

     bullet.forEach(shoot => {
      shoot.update()

      if(shoot.y<0) {
        shoot.remove()

        bullet.splice(bullet.indexOf(shoot), 1 );
      }
     });

     Allenemys.forEach(enemey => enemey.update())

     const getLeftMostEnemys = getLeftMostEnemy();

     if(getLeftMostEnemys.x < 30 ) {
      Allenemys.forEach(enemey =>  {
        enemey.setDirectionRight()
      enemey.movDown()

      })
     }


      const getRightMostEnemys = getRightMostEnemy();

     if(getRightMostEnemys.x >window.innerWidth - 60 ) {
      Allenemys.forEach(enemey =>  {
        enemey.setDirectionLeft()
        enemey.movDown()
      })
     }


}


function gameLoop() {
  Update()
  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)


