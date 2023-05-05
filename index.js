//Initializing variable
let direction = {x: 0, y: 0}                    //Snake is at rest at starting of game
let foodSound = new Audio("food.mp3")
let gameOver = new Audio("gameOver.mp3")
let moveSound = new Audio("move.mp3")
let soundTrack = new Audio("music.mp3")
let speed = 8
let score = 0
let a = 2;
let b = 16;
let hiscoreval = 0
let lastPaintTime =  0
let snakeArray = [
    {x: 13, y: 15}
]
let food = {x: 6, y: 7}       //Food isn't an array


//Game function
function main(currentTime) {
    window.requestAnimationFrame(main);
    if((currentTime - lastPaintTime)/1000 < 1/speed){  //Divided by 1000 as in msec
        return;
    }
    lastPaintTime = currentTime;
    gameEngine();
}


function snakeCrashed(snake) {
    //Case 1: Bumping into yourself
    for (let i = 1; i < snakeArray.length; i++) {
        //Head bumps into any body part, 0 = snakeHead
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    //Case 2: snakeHead Bumps into wall
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){
        return true;
    }  
    return false;
}


function gameEngine(){
    //Part 1: Updating the snake array, which contain body parts of snake & Food
    /*Play gameOver, pause soundTrack, reset direction and display alert when snake collides
    If key pressed, reset snakeArray, play soundTrack and reset score*/
    if(snakeCrashed(snakeArray)){
    gameOver.play();
    soundTrack.pause();
    direction =  {x: 0, y: 0}; 
    score = 0; 
    alert("Game Over. Press any key to play again!");
    snakeArray = [{x: 13, y: 15}];
    soundTrack.play();
    }

    //If snake eats food, increment score and regenerate food
     if(snakeArray[0].y === food.y && snakeArray[0].x ===food.x){
        foodSound.play();
        score += 1;
        if(score > highVal){
            highVal = score;
            localStorage.setItem("highScore", JSON.stringify(highVal));
            highScoreBox.innerHTML = "High Score: " + highVal;
        }
        scoreBox.innerHTML = "Score: " + score;
        //Inserts snakeHead clone at the start of array in direction of snake
        snakeArray.unshift({x: snakeArray[0].x + direction.x, y: snakeArray[0].y + direction.y});
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
        }

    //Moving the snake, for this we iterate the body parts such that each body part comes in place of one before it. snakeArray - 2 = Second last body part. So, at end i = 1 -> i = 0. To move i = 0, and avoid referencing problem, through destructuring, we made snakeArray[i+1] = snakeArray[i]
    for (let i = snakeArray.length - 2; i>=0; i--){ 
        snakeArray[i+1] = {...snakeArray[i]};
        }
    snakeArray[0].x += direction.x;
    snakeArray[0].y += direction.y;

    //Part 2: Render Snake & Food to display
        board.innerHTML = ""; //Grab the board to empty the inner HTML in it
    snakeArray.forEach((e, index)=>{    //Display Snake
        snakeElement = document.createElement('div');
        //Puts snakeElement in specified row and column
        snakeElement.style.gridRowStart = e.y;              //Vertical = row       
        snakeElement.style.gridColumnStart = e.x;           //Horizontal = column
        if(index === 0){
            snakeElement.classList.add('snakeHead');        //Insert head class to snakeElement
        }
        else{
            snakeElement.classList.add('snakeBody');        //Insert body class to snakeElement
        }
        board.appendChild(snakeElement);
    });
         // Display the food
        foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add('food')
        board.appendChild(foodElement);
}

//Main logic
//To get highest score
soundTrack.play();
let highScore = localStorage.getItem("highScore");
if(highScore === null){
    highVal = 0;
    localStorage.setItem("highScore", JSON.stringify(highVal))
}
else{
    highVal = JSON.parse(highScore);
    highScoreBox.innerHTML = "High Score: " + highScore;
}


/*Could use setInterval here instead of requestAnimationFrame, but latter is more useful*/
window.requestAnimationFrame(main) 
window.addEventListener('keydown', e => {              //When key is pressed               
direction = {x: 0, y: 1}                               //Starting game
moveSound.play()                                       //Sound played each time key is pressed
switch (e.key) {
    case 'ArrowUp':
    direction.x = 0       //As moving up, horixontal/x value will be zero
    direction.y = -1      //As +y is downwards, to move snake upwards, we have to subtract 1 from +y
        break;
    case 'ArrowDown':
    direction.x = 0
    direction.y = 1       //To move downwards, add 1 to +y
        break;
    case 'ArrowLeft': 
    direction.x = -1       //As +x is right, to move snake towards left, we have to subtract 1 from +x
    direction.y = 0        //As moving left, vertical/y value will be zero
        break;
    case 'ArrowRight':      
    direction.x = 1        //To move towards right, add 1 to +x
    direction.y = 0
       break;
    default:
        break;
}

})