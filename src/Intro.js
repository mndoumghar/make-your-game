
export default class Intro  {
    constructor(onStart) {
        this.onStart = onStart;
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'absolute';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.background = 'rgba(0,0,0,0.85)';
        this.overlay.style.display = 'flex';
        this.overlay.style.justifyContent = 'center';
        this.overlay.style.alignItems = 'center';
        this.overlay.style.flexDirection = 'column';
        this.overlay.style.color = 'white';
        this.overlay.style.fontFamily = 'Arial, sans-serif';
        this.overlay.style.fontSize = '32px';
        this.overlay.style.zIndex = '9999';
        this.overlay.innerHTML = `<div> 
        <h1>Space invaders</h1>
        <br> 

        <center>Start to Play</center>
        
        </div>`;

        const btn = document.createElement('button');
        btn.textContent = "Start";
        btn.style.fontSize = '24px';
        btn.style.padding = '10px 20px';
        btn.style.marginTop = '20px';
        btn.style.cursor = 'pointer';
        this.overlay.appendChild(btn);

        document.getElementById('game-container').appendChild(this.overlay);

        btn.addEventListener('click', () => this.startGame());
    }

    startGame() {
        this.overlay.remove();  // hide overlay
        this.onStart();         // trigger game start
    }
}
