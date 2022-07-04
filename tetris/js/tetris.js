import BLOCKS from "./blocks.js";

// DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const nextBlockArea = document.querySelector(".nextblockArea > ul");

// Setting
const GAME_ROWS = 20;
const GAME_COL = 10;

// variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;
let isStartedGame = false;
let prevNum = Math.floor(Math.random() * Object.entries(BLOCKS).length);

// constraints
const blockArr = Object.entries(BLOCKS);
const movingItem = {
    type: "",
    direction: 0,
    top: 0,
    left: 3,
}

init();

// functions
function init() {
    tempMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    }

    for (let i = 0; i < 5; i++) {
        prependNewLineAtNextArea();
    }

    if(confirm("게임하실?")) {
        isStartedGame = true;
        // renderBlocks();
        generateNewBlock();
    }
}
function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for ( let j = 0; j < 10; j++ ) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}
function prependNewLineAtNextArea() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for ( let j = 0; j < 6; j++ ) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    nextBlockArea.prepend(li);
}
function renderBlocks(moveType="") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");

    movingBlocks.forEach(item => {
        item.classList.remove(type, "moving");
    });

    
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if(isAvailable) {
            target.classList.add(type, "moving");
        } else {
            tempMovingItem = { ...movingItem };
            if(moveType == "retry") {                
                clearInterval(downInterval);
                showGameOverText();
            }
            setTimeout(() => {
                renderBlocks("retry");
                if(moveType === "top") {
                    seizeBlock();
                }
            }, 0);
            return true;
        }
    });  
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function showGameOverText() {
    gameText.style.display = "flex";
}
function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(item => {
        item.classList.remove("moving");
        item.classList.add("seized");
    });
    checkMatch();
}
function checkMatch() {
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if( !li.classList.contains("seized")) {
                matched = false;
            }
        });
        if( matched ) {
            score += 1;
            document.getElementById("score").innerText = score;
            child.remove();
            prependNewLine();
        }
    })
    generateNewBlock();
}
function generateNewBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, duration);
    movingItem.type = blockArr[prevNum][0];
    BLOCKS[blockArr[prevNum][0]][0].map(block => {
        let nextArea = nextBlockArea.childNodes[block[1] + 1].childNodes[0].childNodes[block[0] + 1];
        nextArea.classList.remove("tree", "square", "zee", "elLeft", "elRight", "bar");
    });
    prevNum = Math.floor(Math.random() * blockArr.length);
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    BLOCKS[blockArr[prevNum][0]][0].map(block => {
        const nextArea = nextBlockArea.childNodes[block[1] + 1].childNodes[0].childNodes[block[0] + 1];
        nextArea.classList.add(blockArr[prevNum][0]);
    });

}
function checkEmpty(target) {
    if(!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}
function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}
function rotateBlock() {
    tempMovingItem["direction"] !== 3 ?
        moveBlock("direction", 1) : tempMovingItem["direction"] = 0;
    renderBlocks();
}
function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1)
    }, 10);
}

// event handling
document.addEventListener('keydown', e => {
    console.log(e);
    switch(e.code) {
        case "ArrowLeft":
            moveBlock("left", -1);
            break
        case "ArrowUp":
            rotateBlock();
            break
        case "ArrowRight":
            moveBlock("left", 1);
            break
        case "ArrowDown":
            moveBlock("top", 1);
            break
        case "Space":
            dropBlock();
        default:
            break
    }
});

document.getElementById("btnReStart").addEventListener("click", () => {
    playground.innerHTML = "";
    nextBlockArea.innerHTML = "";
    gameText.style.display = "none";
    init();
})