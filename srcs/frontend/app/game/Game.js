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
		this.#drawAll();
		// Controi novo frame com os dados do gameData
		console.log("animacao here");
		this.animation = window.requestAnimationFrame(this.start.bind(this));
	}


	

	stop() {
		if (this.animation) {
			window.cancelAnimationFrame(this.animation);
			this.animation = null;
		}
	}

	#drawAll() {
		this.#drawBall(100, 90);
		this.#drawPaddle(10, 100);
		this.#drawPaddle(490, 200);
	}

	#drawField() {
		// estilizar o campo
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
