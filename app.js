const p1 = document.getElementById("player")
const e = document.getElementById("enemy-grid")
const g = document.getElementById("game")

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
}

document.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowLeft") Lp = true
    if (ev.key === "ArrowRight") Lr = true
    if (ev.key === " ") shoot() // Space key for shooting
})

document.addEventListener("keyup", (ev) => {
    if (ev.key === "ArrowLeft") Lp = false
    if (ev.key === "ArrowRight") Lr = false
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

            let countdown = 10;
            const countdownInterval = setInterval(() => {
                rst.textContent = `Press Enter to restart (${countdown})`
                countdown--
                
                if (countdown < 0) {
                    clearInterval(countdownInterval)
                    location.reload()
                }
            }, 1000);

            // Add event listener for Enter key
            document.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    clearInterval(countdownInterval)
                    location.reload()
                }
            })
        }
    })
}

function gameOver() {
    if (g) g.remove()

    const overImg = document.createElement("img")
    overImg.src = "over.jpg"
    overImg.style.display = "block"
    overImg.style.margin = "50px auto"
    overImg.style.width = "400px"

    document.body.appendChild(overImg)
}

function gameLoop() {
    update()
    requestAnimationFrame(gameLoop)
}

createEnms()
gameLoop()
