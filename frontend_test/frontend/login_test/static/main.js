import {Paddle} from "./paddle.js"
import {InputHandler} from "./input.js"
import {Ball} from "./ball.js"

const gData = {
	width: 800,
	height: 500,
	paddlePadding: 10,
	leftPaddle: {
		x: 10,
		y: 250,
		width: 10,
		height: 50,
		speed: 0,
		maxSpeed: 15
	},
	rightPaddle: {
		x: 780,
		y: 250,
		width: 10,
		height: 50,
		speed: 0,
		maxSpeed: 15
	}
};

var rightPaddle_y = 0;
var leftPaddle_y = 0;
var ball_x = 0;
var ball_y = 0;
var player1_Score
var player2_Score


function sendKeys(keys, id, time) {
	fetch("http://127.0.0.1:8000/api/game/player-input", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			player_id: id,
			// ball: ball,
			keys: keys
		})
	})
	.then(response => response.json())
	.then ((data) => {
		// if (id == -1)
		// 	console.log("SCORE : " + player1_Score + " | " + player2_Score);

		// console.log("TEST = ", leftPaddle_y);
		leftPaddle_y = data["left_coords"];
		rightPaddle_y = data["right_coords"];
		// console.log(data["right_coords"])
		ball_x = data["ball_x"];
		ball_y = data["ball_y"];
		player1_Score = data["player1_score"];
		player2_Score = data["player2_score"];
	})
	.catch(error => {
		console.log(error);
	});
}


class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.ball = new Ball();
		this.leftPaddle = new Paddle(this, gData.leftPaddle.x, gData.leftPaddle.y, gData.leftPaddle.width, gData.leftPaddle.height);
		this.rightPaddle = new Paddle(this, gData.rightPaddle.x, gData.rightPaddle.y, gData.rightPaddle.width, gData.rightPaddle.height);
		this.leftInput = new InputHandler("w", "s", "a", "d", 0);
		this.rightInput = new InputHandler("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", 1);
	}
	draw(context){
		// console.log("[PRINTING] BALLX = ", this.ball.x);
		this.leftPaddle.y = leftPaddle_y;
		this.rightPaddle.y = rightPaddle_y;
		this.ball.x = ball_x;
		this.ball.y = ball_y;
		this.ball.draw(context);
		this.leftPaddle.draw(context);
		this.rightPaddle.draw(context);
		this.scoreBoard(context);
	}
	scoreBoard(context){
		context.font = "22px Arial"
		context.fillStyle = "rgb(0 0 0 / 75%)"
		context.fillText(Number(player1_Score), this.width/2 - 30, 30)
		context.fillRect(this.width/2 - 5, 22, 5, 4);
		context.fillText(Number(player2_Score), this.width/2 + 10, 30)
		context.fillStyle = "black"
	}
	async checkKeyInputs() {
		if (this.rightInput.keys.length > 0 )
			sendKeys(this.rightInput.keys, this.rightInput.id);
		if (this.leftInput.keys.length > 0)
			sendKeys(this.leftInput.keys, this.leftInput.id);
		sendKeys(null, -1);
	}
}


window.addEventListener('load', function(){
	console.log("I am here");
	const canvas = document.getElementById('canvas1')
	const ctx = canvas.getContext("2d");
	
	const game = new Game(canvas.width, canvas.height);
	console.log(game);
	
	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		requestAnimationFrame(animate);
		game.checkKeyInputs(); 
		// console.log(game.leftPaddle.y + " X BEFORE DRAW");
		game.draw(ctx);
	}
	animate(0);
});
