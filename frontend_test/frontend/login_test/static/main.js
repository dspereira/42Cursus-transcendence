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
			keys: keys
		})
	})
	.then(response => response.json())
	.then ((data) => {
		leftPaddle_y = data["left_coords"];
		rightPaddle_y = data["right_coords"];
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
	draw(context)
	{
		context.fillStyle = "black";
		context.fillRect(0,0, this.width, this.height);
		context.fillStyle = "white";

		for (let y = 5; y < this.height; y += 25) {
			context.fillRect(this.width / 2 - 1, y, 2, 12.5); // by this order: (center of the screen, I = position(y), 2 = width, 12.5 = height)
		}

		this.ball.draw(context);
		this.leftPaddle.draw(context);
		this.rightPaddle.draw(context);
		
		this.scoreBoard(context);
	}

	scoreBoard(context)
	{
		const scoreMargin = 60; // Margin between scoreboard and top edge of the player's field
		const scoreSpacing_x = 20; // Spacing between the score text and the vertical line

		const player1ScoreText = Number(player1_Score).toString();
		const player1ScoreX = this.width / 4 - context.measureText(player1ScoreText).width / 2 - scoreSpacing_x;
		context.font = '30px Consolas'
		context.fillText(player1ScoreText, player1ScoreX, scoreMargin);

		const player2ScoreText = Number(player2_Score).toString();
		const player2ScoreX = (this.width * 3 / 4) - context.measureText(player2ScoreText).width / 2 + scoreSpacing_x;
		context.fillText(player2ScoreText, player2ScoreX, scoreMargin);

	}

	async checkKeyInputs() {
		if (this.rightInput.keys.length > 0 )
			sendKeys(this.rightInput.keys, this.rightInput.id);
		if (this.leftInput.keys.length > 0)
			sendKeys(this.leftInput.keys, this.leftInput.id);
		sendKeys(null, -1);
		this.leftPaddle.y = leftPaddle_y;
		this.rightPaddle.y = rightPaddle_y;
		this.ball.x = ball_x;
		this.ball.y = ball_y;
	}
}


window.addEventListener('load', function(){
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
