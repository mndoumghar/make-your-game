export default class Intro {
  constructor(onStart) {
    this.onStart = onStart;

    this.overlay = document.createElement('div');
    Object.assign(this.overlay.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at center, #000 60%, #030018)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: '"Press Start 2P", Arial, sans-serif',
      textAlign: 'center',
      zIndex: 9999,
      transition: 'opacity 0.6s ease',
    });

    this.overlay.innerHTML = `
      <h1 style="
        font-size: 48px;
        color: #00ffcc;
        text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
        margin-bottom: 30px;
        letter-spacing: 2px;
      ">
        SPACE INVADERS
      </h1>

      <div style="font-size: 16px; line-height: 1.8; opacity: 0.9;">
        <p>🎮 Controls:</p>
        <p>Move Left: <span style="color:#00ffcc">A</span></p>
        <p>Move Right: <span style="color:#00ffcc">D</span></p>
        <p>Shoot: <span style="color:#00ffcc">SPACE</span></p>
        <p>Setting: <span style="color:#00ffcc">ESC</span></p>
      </div>
    `;

    // Button styling
    const btn = document.createElement('button');
    btn.textContent = 'START GAME';
    Object.assign(btn.style, {
      fontSize: '20px',
      marginTop: '40px',
      padding: '12px 40px',
      backgroundColor: '#00ffcc',
      border: 'none',
      borderRadius: '8px',
      color: '#000',
      cursor: 'pointer',
      fontWeight: 'bold',
      letterSpacing: '2px',
      boxShadow: '0 0 20px #00ffff',
      transition: 'transform 0.2s ease, background-color 0.3s ease',
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
      btn.style.backgroundColor = '#00ffaa';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.backgroundColor = '#00ffcc';
    });

    this.overlay.appendChild(btn);
    document.getElementById('game-container').appendChild(this.overlay);

    btn.addEventListener('click', () => this.startGame());
  }

  startGame() {
    this.overlay.style.opacity = '0';
    setTimeout(() => this.overlay.remove(), 600);
    this.onStart();
  }
}
