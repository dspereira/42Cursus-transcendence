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

async function sendKeys(keys, id) {
	fetch("http://127.0.0.1:8000/api/game/player-input", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			player_id: id,
			keys: keys
		})
	})
	.then(response => response.json())
	.then (data => {
		// console.log(data["left_coords"] + "<-on main");
		if (id == 0)
		{
			var ret = data["left_coords"];
			console.log(ret + "<-on");
			return ret;
		}	
		if (id == 1)
			return data["right_coords"];
	})
	.catch(error => {
		console.log(error);
	});
}


class Game {
	constructor(input) {
		this.width = input.width;
		this.height = input.height;
		this.ball = new Ball(this);
		this.leftPaddle = new Paddle(this, gData.leftPaddle.x, gData.leftPaddle.y, gData.leftPaddle.width, gData.leftPaddle.height, gData.leftPaddle.speed, gData.leftPaddle.maxSpeed);
		this.rightPaddle = new Paddle(this, gData.rightPaddle.x, gData.rightPaddle.y, gData.rightPaddle.width, gData.rightPaddle.height, gData.rightPaddle.speed, gData.rightPaddle.maxSpeed);
		this.leftInput = new InputHandler("w", "s", "a", "d", 0);
		this.rightInput = new InputHandler("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", 1);
		// his.width = input.width;
		// this.height = input.height;
		// this.ball = new Ball(this, input.ball.x, input.ball.y, input.ball.radius, input.ball.dirX, input.ball.dirY, input.ball.speed, input.ball.maxSpeed);
		// this.leftPaddle = new Paddle(this, input.leftPaddle.x, input.leftPaddle.y, input.leftPaddle.width, input.leftPaddle.height, input.leftPaddle.speed, input.leftPaddle.maxSpeed);
		// this.rightPaddle = new Paddle(this, input.rightPaddle.x, input.rightPaddle.y, input.rightPaddle.width, input.rightPaddle.height, input.rightPaddle.speed, input.rightPaddle.maxSpeed);
		// this.leftInput = new InputHandler("w", "s", "a", "d");
		// this.rightInput = new InputHandler("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
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
	async checkKeyInputs() { // Mark the method as async
		if (this.rightInput.keys.length > 0) {
			const coords = await sendKeys(this.rightInput.keys, this.rightInput.id);
			if (coords != 0){
				this.rightInput.y = coords;
			}
		}
		if (this.leftInput.keys.length > 0) {
			var coords = await sendKeys(this.leftInput.keys, this.leftInput.id);
			console.log(coords + "IN RETURNED")
			if (coords != 0)
				this.leftInput.y = coords;
			// console.log(this.leftPaddle.y + " Y BEFORE DRAW");
		}
	}
}

const gData = {
	width: 800,
	height: 500,
	paddlePadding: 10,
	leftPaddle: {
		x: 10,
		y: 20,
		width: 5,
		height: 20,
		speed: 0,
		maxSpeed: 15
	},
	rightPaddle: {
		x: 785,
		y: 20,
		width: 5,
		height: 20,
		speed: 0,
		maxSpeed: 15
	}
};

window.addEventListener('load', function(){
	console.log("I am here");
	const canvas = document.getElementById('canvas1')
	const ctx = canvas.getContext("2d");

	const game = new Game(canvas.width, canvas.height);
	console.log(game);

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		requestAnimationFrame(animate);
		game.checkKeyInputs(); // Check for key inputs and send them
		// console.log(game.leftPaddle.y + " X BEFORE DRAW");
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
	
