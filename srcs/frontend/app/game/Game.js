export default class Game {
	constructor(ctx, width, height) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.animation = null;
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
		this.#drawBall(100, 90);
		this.#drawPaddle(10, 100);
		this.#drawPaddle(790, 200);
	}

	#drawField() {
		// estilizar o campo
		this.ctx.fillStyle = '#677D6A';
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.fillRect(100, 100, this.width, 2);

		this.ctx.setLineDash([5, 5]);
		this.ctx.strokeStyle = 'white';
		this.ctx.beginPath();
		this.ctx.moveTo(this.width/2, 20);
		this.ctx.lineTo(this.width/2, this.height - 20);
		this.ctx.stroke();
		this.ctx.setLineDash([0, 0]);

		
	}

	#drawScore(data) {
		// desenha a pontuação
	}

	#drawPaddle(x, y) {
		if (!x && !y)
			return ;
		this.ctx.strokeStyle = 'white';
		this.ctx.fillStyle = 'white';
		this.ctx.beginPath();
		this.ctx.rect(x, y, 3, 50);
		this.ctx.fill();
		this.ctx.stroke();		
	}

	#drawBall(x, y) {
		if (!x && !y)
			return ;

		this.ctx.strokeStyle = 'white';
		this.ctx.fillStyle = 'white';
		this.ctx.beginPath();
		this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
	}
}
