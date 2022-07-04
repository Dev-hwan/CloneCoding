let canvas = document.getElementById('canvas');
var ctx  = canvas.getContext('2d');
let img1 = new Image();
let img2 = new Image();
img1.src = 'cactus.jpg';
img1.width = 50;
img1.height = 50;
img2.src = 'dino.png';
img2.width = 50;
img2.height = 50;

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let dino = {
    x: 10,
    y: 200,
    width: 50,
    height: 50,
    draw() {
        ctx.drawImage(img2, this.x, this.y, this.width, this.height);
    }
}


class Cactus {
    constructor() {
        this.x = 500,
        this.y = 200,
        this.width = 50,
        this.height = 50
    };
    draw() {
        ctx.drawImage(img1, this.x, this.y, this.width, this.height);
    }
}

let arrCactus = [];
let timer = 0;
let jumpTimer = 0;
let jump = false;
let animation;
function executeGame() {
    animation = requestAnimationFrame(executeGame);
    timer++;
    
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    if( timer % 180 === 0) {
        let cactus = new Cactus();
        arrCactus.push(cactus);
    }

    arrCactus.forEach((cactus, i, o) => {
        cactus.x < 0 ? arrCactus.splice(i, 1) : cactus.x-=2;
        cactus.draw();
        crash(dino, cactus);
    })
    
    if (jump) {
        dino.y-=2;
        jumpTimer++;
    } else {
        if( dino.y < 200 ) {
            dino.y+=2;
        }
    }

    if( jumpTimer > 50 ) {
        jump = false;
        jumpTimer = 0;
    }

 
    dino.draw();

}

function crash(dino, cactus) {

    let xGap = cactus.x - (dino.x + dino.width);
    let yGap = cactus.y - (dino.y + dino.height);

    if( xGap < 0 && yGap < 0) {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        cancelAnimationFrame(animation);
        alert("충돌!!");
        if (window.confirm("다시하쉴?")) {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            arrCactus = [];
            requestAnimationFrame(executeGame);
        }
    }
}

document.addEventListener('keydown', e => {
    if( e.code === "Space") {
        jump = true;
    }
})

executeGame();