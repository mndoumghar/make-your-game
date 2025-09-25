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
            gameSucces()
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
            }
        })
    }, 30)
}

document.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowLeft") Lp = true
    if (ev.key === "ArrowRight") Lr = true
})

document.addEventListener("keyup", (ev) => {
    if (ev.key === "ArrowLeft") Lp = false
    if (ev.key === "ArrowRight") Lr = false
    if (ev.key === " ") shoot() // Space key for shooting
})

function update() {
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
        if (enemy.style.visibility === "hidden") return
        const eRect = enemy.getBoundingClientRect()
        if (
            eRect.bottom >= playerRect.top &&
            eRect.left < playerRect.right &&
            eRect.right > playerRect.left
        ) {
            gameOver()
            const rst = document.createElement("div")
            rst.style.position = "fixed"
            rst.style.top = "20px"
            rst.style.left = "50%"
            rst.style.transform = "translateX(-50%)"
            rst.style.color = "white"
            rst.style.fontSize = "24px"
            rst.style.fontWeight = "bold"
            document.body.appendChild(rst)

            let countdown = 1;
            const countdownInterval = setInterval(() => {
                rst.textContent = `Press Enter to restart (${countdown})`
                countdown--

                if (countdown < 0) {
                    clearInterval(countdownInterval)
                    location.reload()
                }
            }, 1000);

            document.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    clearInterval(countdownInterval)
                    location.reload()
                }
            })
        }
    })
}

function gameLoop(now) {
    if (!gamePaused) update()

    frames++
    const delta = now - lastFrameTime
    if (delta >= 1000) {
        fps = Math.round((frames * 1000) / delta)
        if (fps > 60) fps = 60
        fpsEl.textContent = `FPS: ${fps}`
        frames = 0
        lastFrameTime = now
    }

    requestAnimationFrame(gameLoop)
}


function gameLoop(now) {
    update()
    frames++
    const delta = now - lastFrameTime
    if (delta >= 1000) {
        fps = Math.round((frames * 1000) / delta)
        if (fps > 60) fps = 60
        fpsEl.textContent = `FPS: ${fps}`
        frames = 0
        lastFrameTime = now
    }

    requestAnimationFrame(gameLoop)
}

createEnms()
requestAnimationFrame(gameLoop)
