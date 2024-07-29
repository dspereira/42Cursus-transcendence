import {redirect} from "../js/router.js";
import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import {colors} from "../js/globalStyles.js";

const styles = `

	.paddle {
		position: absolute;
		width: 10px;
		height: 100px;
		background-color: white;
	}

	#left .paddle {
		left: 20px;
		top: 50%;
	}


	#right .paddle {
		right: 20px;
		top: 30%
	}

	.ball {
		position: absolute;
		left: 60%;
		top: 30%;
		background-color: white;
	}

	.container-div {
		position: relative;
	}

	canvas {
		position: absolute;
		z-index:1;
	}

`;

const getHtml = function(data) {
	const html = `
		<canvas id="canvas" style="width:100%; height: auto;"></canvas>
	`;
	return html;
}

export default class AppBackground extends HTMLElement {
	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html();
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
		this.canvas = this.html.querySelector("#canvas");
		this.ctx = this.canvas.getContext("2d");
		
		// pode receber tamanho por parametro
		this.canvas.width = "800";
		this.canvas.height = "400";

		this.game = new Game(this.ctx, this.canvas.width, this.canvas.height);
		this.ctx.filter = "blur(5px)";
	}

	#styles() {
		if (styles)
			return `@scope (.${this.elmtId}) {${styles}}`;
		return null;
	}

	#html(data) {
		return getHtml(data);
	}

	#render() {
		if (styles)
			this.appendChild(this.styles);
		this.appendChild(this.html);
	}

	#scripts() {
		this.game.start();
	}

}
customElements.define("app-background", AppBackground);


class Game {
	constructor(ctx, width, height) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.animation = null;
		this.scoreFont = 200;
		this.leftPaddleY = 0;
		this.rightPaddleY = 0;
		this.ballY = 50;
		this.ballX = 50;
		this.dirX = 2;
		this.dirY = 2;
		this.colors = {
			paddle: "white",
			ball: "white",
			ground: colors.page_background,
			middleLine: "white",
			score: "rgba(200, 200, 200, 0.5)",
		}
	}

	movePaddle() {
		if (this.ballY + this.dirY - 5 <= 0 || this.ballY + this.dirY + 5 >= this.height)
			this.dirY = -this.dirY;
		this.ballY  += this.dirY;
		if (this.ballX + this.dirX + 5 <= 14 || this.ballX + this.dirX + 5 >= this.width - 14)
			this.dirX = -this.dirX;
		this.ballX += this.dirX;
		this.rightPaddleY = this.ballY;
		if (this.rightPaddleY < 0)
			this.rightPaddleY = 0;
		this.leftPaddleY = this.ballY;
		if (this.leftPaddleY < 0)
			this.leftPaddleY = 0;
	}

	updateState(data) {
		// update gameData
		// console.log("updateState");
		// console.log(data);
		this.gameData = data;
	}

	setColorPallet(color_pallet) {
		this.colors = color_pallet;
	}

	start() {
		// console.log("First Time Start");
		this.#animate();
	}

	stop() {
		if (this.animation) {
			window.cancelAnimationFrame(this.animation);
			this.animation = null;
		}
	}

	#animate() {
		// console.log("animacao here");
		this.movePaddle();
		this.#drawAll();
		this.animation = window.requestAnimationFrame(this.#animate.bind(this));
	}

	#drawAll() {
		this.#drawField();
		this.#drawBall(this.ballX, this.ballY);
		this.#drawPaddle(this.leftPaddleY, "left");
		this.#drawPaddle(this.rightPaddleY, "rigth");
	}

	#drawField() {
		this.ctx.fillStyle = this.colors.ground;
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

	#drawPaddle(pos, side) {
		if (!pos && !side)
			return ;

		const paddleWidth = 4;
		const paddleHeigth = 50;
		let x = 0;
		if (side == "left")
			x = 10;
		else
			x = this.width - (10 + paddleWidth);

		this.ctx.strokeStyle = this.colors.paddle;
		this.ctx.fillStyle = this.colors.paddle;
		this.ctx.beginPath();
		this.ctx.rect(x, pos - paddleHeigth/2, paddleWidth, paddleHeigth);
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
}