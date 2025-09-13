const p1 = document.getElementById("player")
const e = document.getElementById("enemy-grid")
const g = document.getElementById("game")

const g_state = {
    enemies: { x: 0, y: 0, speed: 0.8, dir: 1, nb: 6 }
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

document.addEventListener("click", () => {
    const shot = document.createElement("div")
    shot.className = "shot"

    const shotX = pos + p1.clientWidth / 2 - 2
    const shotY = g.clientHeight - p1.clientHeight - 20

    shot.style.left = `${shotX}px`
    shot.style.top = `${shotY}px`

    g.appendChild(shot)

    const shotInterval = setInterval(() => {
        shot.style.top = `${parseInt(shot.style.top) - 10}px`

        if (parseInt(shot.style.top) < 0) {
            if (g.contains(shot)) g.removeChild(shot)
            clearInterval(shotInterval)
            return
        }

        const enemies = document.querySelectorAll(".enemy")
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
                    enemy.style.visibility = "hidden"
                    enemy.classList.remove("enemy")
                }
                clearInterval(shotInterval)
            }
        })
    }, 30)
})

document.addEventListener("keydown", (ev) => {
    if (ev.key === "a" || ev.key === "A") Lp = true
    if (ev.key === "d" || ev.key === "D") Lr = true
})
document.addEventListener("keyup", (ev) => {
    if (ev.key === "a" || ev.key === "A") Lp = false
    if (ev.key === "d" || ev.key === "D") Lr = false
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
}

function gameLoop() {
    update()
    requestAnimationFrame(gameLoop)
}

createEnms()
gameLoop()
