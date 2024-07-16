export default class Game {
	constructor(ctx, width, height) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.animation = null;
		this.scoreFont = 200;
		this.scoreLeftPos = this.#calculateScorePosition("left");
		this.scoreRigthPos = this.#calculateScorePosition("rigth");
		this.colors = {
            paddle: "black",
            ball: "#f9e50c",
            graund: "#807ffb",
            middleLine: "white",
			score: "rgba(200, 200, 200, 0.5)",
        }
		this.gameData = {};
	}

	updateState() {
		// update gameData
	}

	start() {
		console.log("animacao here");
		this.#drawAll();
		this.animation = window.requestAnimationFrame(this.start.bind(this));
	}

	stop() {
		if (this.animation) {
			window.cancelAnimationFrame(this.animation);
			this.animation = null;
		}
	}

	#drawAll() {
		this.#drawField();
		this.#drawBall(150, 350);
		this.#drawPaddle(100, "left");
		this.#drawPaddle(200, "rigth");
		this.#drawScore(2, "left");
		this.#drawScore(7, "rigth");
	}

	#drawField() {
		this.ctx.fillStyle = this.colors.graund;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.fillRect(100, 100, this.width, 2);

		this.ctx.setLineDash([5, 5]);
		this.ctx.strokeStyle = this.colors.middleLine;
		this.ctx.beginPath();
		this.ctx.moveTo(this.width/2, 20);
		this.ctx.lineTo(this.width/2, this.height - 20);
		this.ctx.stroke();
		this.ctx.setLineDash([0, 0]);
	}

	#drawScore(score, side) {
		if (!score && !side)
        	return ;

		this.ctx.font = `${this.scoreFont}px VT323`;
		this.ctx.fillStyle = this.colors.score;
		if (side == "left")
			this.ctx.fillText(score, this.scoreLeftPos.x, this.scoreLeftPos.y);
		else
			this.ctx.fillText(score, this.scoreRigthPos.x, this.scoreRigthPos.y);
	}

	#drawPaddle(pos, side) {
		if (!pos && !side)
			return ;

		const paddleWidth = 3;
		const paddleHeigth = 50;
		let x = 0;
		if (side == "left")
			x = 10;
		else
			x = this.width - (10 + paddleWidth);

		this.ctx.strokeStyle = this.colors.paddle;
		this.ctx.fillStyle = this.colors.paddle;
		this.ctx.beginPath();
		this.ctx.rect(x, pos, paddleWidth, paddleHeigth);
		this.ctx.fill();
		this.ctx.stroke();		
	}

	#drawBall(x, y) {
		if (!x && !y)
			return ;

		this.ctx.strokeStyle = this.colors.ball;
		this.ctx.fillStyle = this.colors.ball;
		this.ctx.beginPath();
		this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
	}

	#calculateScorePosition(side) {
		this.ctx.font = `${this.scoreFont}px VT323`;
		const metrics = this.ctx.measureText("5");
		const halfTextHeight   = metrics.actualBoundingBoxAscent / 2;
		const halfTextWidth  = metrics.width / 2;
		let y = (this.height / 2) + halfTextHeight;
		let x = 0;

		if (side == "left")
			x = (this.width / 4) - halfTextWidth;
		else
			x = (this.width / 4) * 3 - halfTextWidth;

		return {
			x: x,
			y: y
		}
	}
}
