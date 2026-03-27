import Entity from "./Entity.js";
import { Lives } from "./Lives.js";

export default class Map extends Entity {
    constructor({ removeBullet, getOverlappingBullet, allEnemies, removeEnemy}) {
        super({ tag: 'div', className: "tiles" });
        this.map = { NY: 20, NX: 14, tiles: [] };
        this.removeBullet = removeBullet;
        this.getOverlappingBullet = getOverlappingBullet;
        this.enemys = this.el.querySelectorAll(".enemy");
        this.allenemy = allEnemies;
        this.removeEnemy = removeEnemy;
        this.live = new Lives();

        for (let i = 0; i < this.map.NX * this.map.NY; i++) {
            this.map.tiles.push(0);
        }

        this.map.tiles[202] = 1
        this.map.tiles[203] = 1
        this.map.tiles[209] = 1
        this.map.tiles[210] = 1
        this.map.tiles[216] = 1
        this.map.tiles[217] = 1
        this.el.style.gridTemplateColumns = `repeat(${this.map.NY}, 1fr)`;
        this.el.style.gridTemplateRows = `repeat(${this.map.NX}, 1fr)`;
    }

    render(level) {
        this.el.innerHTML = '';
        this.map.tiles.forEach(nbr => {
            let tile = document.createElement('div');

            if (nbr == 0) {
                tile.style.background = ''
            } else {
                tile.className = "break";
                if (level== 1) {
                    tile.style.backgroundImage = "url(images/tile1.png)";
                }
                if (level== 2) {
                    tile.style.backgroundImage = "url(images/tile2.png)";
                }
                if (level== 3) {
                    tile.style.backgroundImage = "url(images/tile3.png)";
                }

                if (level== 4) {
                    tile.style.backgroundImage = "url(images/tile4.png)";
                }
                if (level== 5) {
                    tile.style.backgroundImage = "url(images/tile5.png)";
                }

                tile.style.backgroundSize = "cover";
            }
            this.el.append(tile);
        });
    }

    reset() {
        this.render();
    }


    update() {
        const breaks = this.el.querySelectorAll(".break");
        breaks.forEach(tile => {
            const bullet = this.getOverlappingBullet(tile);
            const e = this.getOverlappingEnemy(tile);
            if (e) {
                this.removeEnemy(e);
                this.live.gameOver();
               // throw new Error("error ");
            }

            if (bullet) {
                this.removeBullet(bullet);
            }
        });
    }


 isOverlapping(el1, el2) {
  if (!el1 || !el2) return false;
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

 getOverlappingEnemy(entity) {
  for (const  enemy of  this.allenemy) {
    if (this.isOverlapping(entity, enemy.el)) return enemy ;
  }

  return null;
}
}


