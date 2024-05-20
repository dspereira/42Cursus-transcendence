console.log("main.js is %cActive", 'color: #90EE90')
import {Paddle} from "./game_utils/paddle.js"
import {InputHandler} from "./game_utils/input.js"
import {Ball} from "./game_utils/ball.js"

const gData = {
	width: 800,
	height: 500,
	paddlePadding: 10,
	leftPaddle: {
		x: 10,
		y: 70,
		width: 10,
		height: 50,
		speed: 0,
		maxSpeed: 15
	},
	rightPaddle: {
		x: 780,
		y: 70,
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
var player1_Score = 0;
var player2_Score = 0;
var match_id = -1;

const	point_limit = 3;


function pause_game(pause_status){
	fetch("http://127.0.0.1:8000/api/game/pause-game", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			game_id: match_id
		})
	})
	.catch(error => {
		console.log(error);
	});
}



function sendKeys(keys, id) {
	fetch("http://127.0.0.1:8000/api/game/player-input", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			keys: keys,
			game_id: match_id,
			id: id
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

function get_state() {
	fetch("http://127.0.0.1:8000/api/game/update-game", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			game_id: match_id
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

		for (let y = 5; y < this.height; y += 7) {
			context.fillRect(this.width / 2 - 1, y, 2, 12.5); // by this order: (center of the screen, I = position(y), 2 = width, 12.5 = height)
		}

		this.ball.draw(context);
		this.leftPaddle.draw(context);
		this.rightPaddle.draw(context);
		
		this.scoreBoard(context);
		if (player1_Score >= 7 || player2_Score >= 7)
			return true
		return false
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
			sendKeys(this.rightInput.keys, 0);
		if (this.leftInput.keys.length > 0)
			sendKeys(this.leftInput.keys, 0);
		sendKeys(null, -1);
		// setTimeout(sendKeys(null, -1), 1000);
		this.leftPaddle.y = leftPaddle_y;
		this.rightPaddle.y = rightPaddle_y;
		this.ball.x = ball_x;
		this.ball.y = ball_y;
	}
}

document.addEventListener("DOMContentLoaded", function() {

	const canvas = document.getElementById('canvas1')
	const ctx = canvas.getContext("2d");
	
	const game = new Game(canvas.width, canvas.height);
		
	document.getElementById("pause_button").addEventListener('click', () =>{
		pause_game();
	})

	match_id = localStorage.getItem('game_id');
	if (match_id) {
		console.log('Game ID:', match_id);
		localStorage.clear();
		animate(0)
	}
	else {
		window.location.assign('http://127.0.0.1:8080/game/')
		console.log('No game ID found');
	}

	
	function animate() {

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (player1_Score >= point_limit || player2_Score >= point_limit){
			window.location.assign('http://127.0.0.1:8080/game/')
		}
		requestAnimationFrame(animate);
			
		game.draw(ctx);
		game.checkKeyInputs();
	}


});