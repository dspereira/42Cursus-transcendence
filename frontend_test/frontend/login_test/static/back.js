import {Paddle} from "./paddle.js"
import {InputHandler} from "./input.js"
import {Ball} from "./ball.js"

window.addEventListener('load', function(){

	async function getGame() {
		const data = await fetch("http://127.0.0.1:8000/game/");
		const result = await data.json()
		console.log(result)
	}

	const canvas = document.getElementById('canvas1')
	const ctx = canvas.getContext("2d");
	class GameBackEnd {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.paddleHeight = 100;
			this.paddleWidth = 20;
			this.paddlePadding = 5;
			this.ballRadius = 10;
			this.ball = new Ball(this, this.width/2, this.height/2, this.ballRadius, 1, 0.75);
			this.leftPaddle = new Paddle(this, this.paddlePadding, canvas.height/2 - this.paddleHeight/2, this.paddleWidth, this.paddleHeight);
			this.rightPaddle = new Paddle(this, canvas.width - this.paddleWidth - this.paddlePadding, canvas.height/2 - this.paddleHeight/2, this.paddleWidth, this.paddleHeight);
		}
		update(lKeys, rKeys){
			this.leftPaddle.update(lKeys);
			this.rightPaddle.update(rKeys);
			this.ball.update(this.leftPaddle, this.rightPaddle);
		}
		compressGame()
		{
			locations = {
				leftPaddleX: this.leftPaddle.x,
				leftPaddleY: this.leftPaddle.y,
				rightPaddleX: this.rightPaddle.x,
				rightPaddleY: this.rightPaddle.y,
				ballX: this.ball.x,
				ballY: this.ball.y
			}
			///need to send the locations of the objects to the frontend
		}
	}
	const gameBackEnd = new GameBack(canvas.width, canvas.height);
	console.log(game);
});