const p1 = document.getElementById("player")
const e = document.getElementById("enemy-grid")
const g = document.getElementById("game")

// FPS display
const fpsEl = document.createElement("div")
fpsEl.style.position = "fixed"
fpsEl.style.top = "10px"
fpsEl.style.left = "10px"
fpsEl.style.color = "lime"
fpsEl.style.font = "16px monospace"
fpsEl.style.zIndex = "1000"
document.body.appendChild(fpsEl)

let lastFrameTime = performance.now()
let frames = 0
let fps = 0

let gamePaused = false
let gameOverFlag = false // new flag to stop game

const g_state = {
    enemies: { x: 0, y: 0, speed: 2, dir: 1, nb: 6 }
}
let pos = g.clientWidth / 2 - p1.clientWidth / 2
let Lp = false
let Lr = false

function createEnms() {
    for (let i = 0; i < g_state.enemies.nb; i++) {
        const enmy = document.createElement("div")
        enmy.className = "enemy"
        e.appendChild(enmy)
    }
}

function shoot() {
    const shot = document.createElement("div")
    shot.className = "shot"
    const shotX = pos + p1.clientWidth / 2 - 2
    const shotY = g.clientHeight - p1.clientHeight - 20

    shot.style.left = `${shotX}px`
    shot.style.top = `${shotY}px`

    g.appendChild(shot)
    const shotInterval = setInterval(() => {
        shot.style.top = `${parseInt(shot.style.top) - 10}px`
        const enemies = document.querySelectorAll(".enemy")
        if (enemies.length === 0) {
            gameSuccess()
        }


        enemies.forEach((enemy) => {
            const sRect = shot.getBoundingClientRect()
            const eRect = enemy.getBoundingClientRect()
            if (
                sRect.left < eRect.right &&
                sRect.right > eRect.left &&
                sRect.top < eRect.bottom &&
                sRect.bottom > eRect.top

            ) {
                if (g.contains(shot)) g.removeChild(shot)
                if (e.contains(enemy)) {
                    enemy.classList.remove("enemy")
                }

                clearInterval(shotInterval)

                // Check if this was the last enemy
                if (document.querySelectorAll(".enemy").length === 0) {
                    gameSuccess()
                }
            }
        })
    }, 30)
}

document.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowLeft") Lp = true
    if (ev.key === "ArrowRight") Lr = true
    if (ev.key === " ") shoot()
})

document.addEventListener("keyup", (ev) => {
    if (ev.key === "ArrowLeft") Lp = false
    if (ev.key === "ArrowRight") Lr = false
})

function gameOver() {
    gameOverFlag = true
    const overDiv = document.createElement("div")
    overDiv.style.position = "fixed"
    overDiv.style.top = "50%"
    overDiv.style.left = "50%"
    overDiv.style.transform = "translate(-50%, -50%)"
    overDiv.style.background = "rgba(0,0,0,0.8)"
    overDiv.style.color = "red"
    overDiv.style.fontSize = "36px"
    overDiv.style.padding = "20px"
    overDiv.style.borderRadius = "10px"
    overDiv.style.textAlign = "center"
    overDiv.style.zIndex = "1000"
    overDiv.textContent = "GAME OVER\nPress Enter to Restart"
    document.body.appendChild(overDiv)
    document.addEventListener("keydown", function restartHandler(e){
        if(e.key === "Enter"){
            location.reload()
        }
    })
}

function gameSuccess() {
    gameOverFlag = true
    const successDiv = document.createElement("div")
    successDiv.style.position = "fixed"
    successDiv.style.top = "50%"
    successDiv.style.left = "50%"
    successDiv.style.transform = "translate(-50%, -50%)"
    successDiv.style.background = "rgba(0,0,0,0.8)"
    successDiv.style.color = "lime"
    successDiv.style.fontSize = "36px"
    successDiv.style.padding = "20px"
    successDiv.style.borderRadius = "10px"
    successDiv.style.textAlign = "center"
    successDiv.style.zIndex = "1000"
    successDiv.textContent = "YOU WIN!\nPress Enter to Restart"
    document.body.appendChild(successDiv)
     
}

function update() {
    if(gameOverFlag) return // stop updating

    if (Lp && pos > 0) pos -= 5
    if (Lr && pos < g.clientWidth - p1.clientWidth) pos += 5

    g_state.enemies.x += g_state.enemies.speed * g_state.enemies.dir
    const maxX = g.clientWidth - e.offsetWidth - 20

    if (g_state.enemies.x > maxX || g_state.enemies.x < 0) {
        g_state.enemies.dir *= -1
        g_state.enemies.y += 20
    }

    p1.style.transform = `translateX(${pos}px)`
    e.style.transform = `translate(${g_state.enemies.x}px, ${g_state.enemies.y}px)`

    const playerRect = p1.getBoundingClientRect()
    const enemies = document.querySelectorAll(".enemy")

    enemies.forEach((enemy) => {
        const eRect = enemy.getBoundingClientRect()
        if (
            eRect.bottom >= playerRect.top &&
            eRect.left < playerRect.right &&
            eRect.right > playerRect.left
        ) {
            gameOver()
        }
    })
}

function gameLoop(now) {
    if(!now) now = performance.now()
    if(!gamePaused && !gameOverFlag) update()

    frames++
    const delta = now - lastFrameTime
    if (delta >= 1000) {
        fps = Math.round((frames * 1000) / delta)
        if (fps > 60) fps = 60
        fpsEl.textContent = `FPS: ${fps}`
        frames = 0
        lastFrameTime = now
    }

    if(!gameOverFlag) requestAnimationFrame(gameLoop)
}

createEnms()
requestAnimationFrame(gameLoop)
