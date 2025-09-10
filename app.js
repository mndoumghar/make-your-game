const p1 = document.getElementById("player")
const g = document.getElementById("game")
let pos = 135
let Lp = false
let Lr = false

document.addEventListener("keydown", (e) => {
    if(e.key === "ArrowLeft") {
        Lp = true
    } else if(e.key === "ArrowRight") {
        Lr = true
    }
})

document.addEventListener("keyup", (e) => {
    if(e.key === "ArrowLeft") {
        Lp = false
    } else if(e.key === "ArrowRight") {
        Lr = false
    }
})


function update() {
    if(Lp && pos > 0) {
        pos -= 5
    } else if(Lr && pos < g.clientWidth - p1.clientWidth) {
        pos += 5
    }
    
    p1.style.left = pos + "px"
    
    requestAnimationFrame(update)
}
requestAnimationFrame(update)