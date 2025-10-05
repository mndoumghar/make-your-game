// nst7emlo l'Entity li katdir base dyal kol wahd fi l3ib
import Entity from "./Entity.js";

// direksyon dyal l'ennemi: left w right
const LEFT = 'left'
const RIGHT = 'right'

// class Enemy katwarri l'ennemi w t'khdem 3lih
export default class Enemy extends Entity {

  // constructor: kayn fihi l'ma3loumat li bghina n3tiw l'ennemi
  constructor({x, y, getOverlappingBullet, removeEnemy  , removeBullet, addTOScore }) {

    // n3mro l'element img li ghadi tbyn f l'écran

    super({ tag: 'img', className: 'enemy' });

    // list dyal sowar dyal l'ennemi
    const enemyImages = ['../images/enemy1.png', '../images/enemy2.png', '../images/enemy3.png']

    // nkhdmo random bash nkhtrso sora mn list

    const randomIndex = Math.floor(Math.random() * enemyImages.length)
    
    this.el.src = enemyImages[randomIndex];
    // speed dyal l'haraka l'orizontal
    this.SPEED = 1;
    // qdya dyal l'niqsa f l'height (mov down)
    this.DOWN_DISTANCESPEED =  10;
    // direksyon l'bidaya
    this.direction = LEFT;
    // callbacks li kaynin mn game manager
    this.removeEnemy = removeEnemy
    this.getOverlappingBullet = getOverlappingBullet 
    this.removeBullet = removeBullet
    this.addTOScore = addTOScore
    // n3tiw l'position l'awliya
    this.SettterX(x);
    
    this.SetterY(y);

  }

  // 7awel direksyon l'right
  setDirectionRight() {
    this.direction = RIGHT;
  }

  // 7awel direksyon l'left
  setDirectionLeft() {
    this.direction = LEFT;
  }

  // nqs l'ennemi taht (y increases)
  movDown() {
    this.SetterY(this.y + this.DOWN_DISTANCESPEED); 
  }

  // update katsir kolla frame: kat7rrk w katsawl 3la collisions
  update() {
    if (this.direction === LEFT) {
      // ila left, nqll mn x
      this.SettterX(this.x - this.SPEED);

    } else {
      // ila right, nzid f x
      this.SettterX(this.x + this.SPEED);
    }


    // nshufu ila kayn bullet li 3ando overlap m3a had enemy
    const bullettt = this.getOverlappingBullet(this.el);
    // ila l'bullettt mashy dyal ennemi (bgha yji mn player)
    if(bullettt && !bullettt.isEnemy) {
      // n7ydro ennemi w nms7o bullet w nzido score
      this.removeEnemy(this)
      this.removeBullet(bullettt)
      this.addTOScore(10)

    }
  }

}
