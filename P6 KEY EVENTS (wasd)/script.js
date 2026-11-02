const myBox = document.getElementById("myBox");

const speed = 7;

let x = 0;
let y = 0;

const pressedKeys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener("keydown", e => {
    if (e.key in pressedKeys) {
        e.preventDefault();
        pressedKeys[e.key] = true;
    }
});

document.addEventListener("keyup", e => {
    if (e.key in pressedKeys) {
        pressedKeys[e.key] = false;
    }
});

function playGame() {
    let isMoving = false;

    if(pressedKeys.ArrowDown) {
        y += speed;
        isMoving = true;

    }

    if(pressedKeys.ArrowUp) {
        y -= speed;
        isMoving = true;

    }

    if(pressedKeys.ArrowRight) {
        x += speed;
        isMoving = true;

    }

    if(pressedKeys.ArrowLeft) {
        x -= speed;
        isMoving = true;

    }

    if(isMoving) {
        myBox.style.backgroundColor = "tomato";
        myBox.textContent = "🔴"        
    } else {
        myBox.style.backgroundColor = "lightblue";
        myBox.textContent = "😲" 
    }

    myBox.style.top = `${y}px`;
    myBox.style.left = `${x}px`;

    requestAnimationFrame(playGame)
}
    requestAnimationFrame(playGame)
