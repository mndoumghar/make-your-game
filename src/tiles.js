import Entity from "./Entity.js";

export default class Map extends Entity {
    constructor({removeBullet, getOverlappingBullet,}) {
        super({ tag: 'div' , className: "tiles"});
        this.map = { NY: 20, NX: 14, tiles: [] };
        this.removeBullet = removeBullet;
        this.getOverlappingBullet = getOverlappingBullet;
        for (let i = 0; i < this.map.NX * this.map.NY; i++) {
            this.map.tiles.push(0);
        }

        this.map.tiles[142] = 1
        this.map.tiles[143] = 1
        this.map.tiles[149] = 1
        this.map.tiles[150] = 1
        this.map.tiles[156] = 1
        this.map.tiles[157] = 1
        this.el.style.gridTemplateColumns = `repeat(${this.map.NY}, 1fr)`;
        this.el.style.gridTemplateRows = `repeat(${this.map.NX}, 1fr)`;
        this.render()
        

    }

    render() {
        this.el.innerHTML = '';
        this.map.tiles.forEach(nbr => {
            let tile = document.createElement('div');
           
            if (nbr == 0) {
            tile.style.background = ''
            } else {
                tile.className  = "break";
                tile.style.backgroundImage = "url(images/tile.png)";
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
        if (bullet) {
            this.removeBullet(bullet);  
        }
    });
}
}