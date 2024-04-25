import {Paddle} from "./paddle.js"
import {InputHandler} from "./input.js"
import {Ball} from "./ball.js"

var rightPaddle_y = 0;
var leftPaddle_y = 0;
var ball_x = 0;
var ball_y = 0;

function getBall() {
	fetch("http://127.0.0.1:8000/api/game/player-input", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			player_id: -1,
			ball: 1
		})
	})
	.then(response => response.json())
	.then ((data) => {
			var ret = data["ball_y"];
			console.log(data["ball_x"] + "<-on [BALL]");
			ball_x = data["ball_x"];
			ball_y = data["ball_y"];
			return ret;
	})
	.catch(error => {
		console.log(error);
	});
}

function sendKeys(keys, id, ball) {
	fetch("http://127.0.0.1:8000/api/game/player-input", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			player_id: id,
			ball: 0,
			keys: keys
		})
	})
	.then(response => response.json())
	.then ((data) => {
		// console.log(data["left_coords"] + "<-on main");
		// if (id == 0)
		// {
			
			var ret = data["left_coords"];
			console.log(ret + "<-on");
			leftPaddle_y = ret;
			console.log("TEST = ", leftPaddle_y);
			leftPaddle_y = data["left_coords"];
			rightPaddle_y = data["right_coords"];
			console.log(data["right_coords"])
			ball_x = data["ball_x"];
			ball_y = data["ball_y"];
			return ret;
		// }	
		// if (id == 1)
		// 	return data["right_coords"];
	})
	.catch(error => {
		console.log(error);
	});
}


class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.ball = new Ball(this);
		this.leftPaddle = new Paddle(this, gData.leftPaddle.x, gData.leftPaddle.y, gData.leftPaddle.width, gData.leftPaddle.height);
		this.rightPaddle = new Paddle(this, gData.rightPaddle.x, gData.rightPaddle.y, gData.rightPaddle.width, gData.rightPaddle.height);
		this.leftInput = new InputHandler("w", "s", "a", "d", 0);
		this.rightInput = new InputHandler("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", 1);
	}
	draw(context){
		console.log("[PRINTING] BALLX = ", this.ball.x);
		this.ball.draw(context);
		this.leftPaddle.draw(context);
		this.rightPaddle.draw(context);
	}
	async checkKeyInputs() { // Mark the method as async


		if (this.rightInput.keys.length > 0) {
			const coords = sendKeys(this.rightInput.keys, this.rightInput.id);
				this.rightInput.y = coords;
				this.leftPaddle.y = leftPaddle_y;
				this.rightPaddle.y = rightPaddle_y;
		}
		if (this.leftInput.keys.length > 0) {
			var coords = sendKeys(this.leftInput.keys, this.leftInput.id);
			console.log(coords + " IN RETURNED")
			console.log(leftPaddle_y + " TEST IN RETURNED")
			this.leftPaddle.y = leftPaddle_y;
			this.rightPaddle.y = rightPaddle_y;
			console.log(this.leftPaddle.y + " Y BEFORE DRAW");
		}
		getBall();
		this.ball.x = ball_x;
		this.ball.y = ball_y;
	}
}

const gData = {
	width: 800,
	height: 500,
	paddlePadding: 10,
	leftPaddle: {
		x: 20,
		y: 20,
		width: 10,
		height: 50,
		speed: 0,
		maxSpeed: 15
	},
	rightPaddle: {
		x: 780,
		y: 20,
		width: 10,
		height: 50,
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
