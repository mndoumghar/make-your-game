const p1 = document.getElementById("player")
const g = document.getElementById("game")
let pos = 135
document.addEventListener("keydown" , (e)=> {
    if(e.key === "ArrowLeft" && pos > 0){
        pos -= 5
    } else if(e.key === "ArrowRight" && pos < g.clientWidth - p1.clientWidth){
        pos += 5
    }
    p1.style.left = pos + "px"
})