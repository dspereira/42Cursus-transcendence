import {Paddle} from "./paddle.js"
import {InputHandler} from "./input.js"
import {Ball} from "./ball.js"

// class toFront {
// 	contructor(game)
// 	{
// 		this.ball.x = game.ball.x;
// 		this.ball.y = game.ball.y;
// 		this.ball.radius = game.ball.radius;
// 	}
// }
async function sendKeys(keys) {
	fetch("http://127.0.0.1:8000/api/GameEngine/playerControls", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			player_id: 1,
			keys: keys
		})
	})
	.then(response => response.json())
	.then (data => {
		console.log(data);
	})
	.catch(error => {
		console.log(error);
	});
}

window.addEventListener('load', function(){
	const canvas = document.getElementById('canvas1')
	const ctx = canvas.getContext("2d");

	class Game {
		constructor(input) {
			this.width = input.width;
			this.height = input.height;
			this.ball = new Ball(this, input.ball.x, input.ball.y, input.ball.radius, input.ball.dirX, input.ball.dirY, input.ball.speed, input.ball.maxSpeed);
			this.leftPaddle = new Paddle(this, input.leftPaddle.x, input.leftPaddle.y, input.leftPaddle.width, input.leftPaddle.height, input.leftPaddle.speed, input.leftPaddle.maxSpeed);
			this.rightPaddle = new Paddle(this, input.rightPaddle.x, input.rightPaddle.y, input.rightPaddle.width, input.rightPaddle.height, input.rightPaddle.speed, input.rightPaddle.maxSpeed);
			this.leftInput = new InputHandler("w", "s", "a", "d");
			this.rightInput = new InputHandler("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
		}
		// update(input){
		// // 	//this needs to be pushed to the backend
		// 	this.leftPaddle.update(coords.leftPaddle);
		// 	this.rightPaddle.update(coords.rightPaddle);
		// 	this.ball.update(coords.ball);
		// }
		draw(context){
			this.ball.draw(context);
			this.leftPaddle.draw(context);
			this.rightPaddle.draw(context);
		}
	}

	const game = new Game(canvas.width, canvas.height);
	console.log(game);
	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		requestAnimationFrame(animate);
		sendKeys(game.rightInput.keys);
		//recieve coords and update the game classes with them
		game.draw(ctx);
	}
	animate(0);
	});

	// class Game {
	// 	constructor(width, height) {
	// 		this.width = width;
	// 		this.height = height;
	// 		this.paddleHeight = 100;
	// 		this.paddleWidth = 20;
	// 		this.paddlePadding = 5;
	// 		this.ballRadius = 10;
	// 		this.ball = new Ball(this, this.width/2, this.height/2, this.ballRadius, 1, 0.75, 0, 4);
	// 		this.leftPaddle = new Paddle(this, this.paddlePadding, this.height/2 - this.paddleHeight/2, this.paddleWidth, this.paddleHeight);
	// 		this.rightPaddle = new Paddle(this, this.width - this.paddleWidth - this.paddlePadding, this.height/2 - this.paddleHeight/2, this.paddleWidth, this.paddleHeight);
	// 		this.leftInput = new InputHandler("w", "s", "a", "d");
	// 		this.rightInput = new InputHandler("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
	// 	}
	// 	update(coords){
	// 	// 	//this needs to be pushed to the backend
	// 		this.leftPaddle.update(coords.leftPaddle);
	// 		this.rightPaddle.update(coords.rightPaddle);
	// 		this.ball.update(coords.ball);
	// 	}
	// 	draw(context){
	// 		this.ball.draw(context);
	// 		this.leftPaddle.draw(context);
	// 		this.rightPaddle.draw(context);
	// 	}
	// }
	
	
	// const toFront = {
	// 	ballRadius: game.ball.radius,
	// 	ballX: game.ball.x,
	// 	ballY: game.ball.y
	// }
	// const toBackRight
	// const front = new toFront(game);
	// const frontJSON = JSON.stringify(toFront);
	
	// const keysLeftJSON =
	// const keysRightJSON =
	// console.log("front json file ->", frontJSON);
	
