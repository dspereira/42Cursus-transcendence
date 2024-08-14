import Game from "../game/Game.js";
import { GameLogic } from "../game/GameLogic.js";
import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `

	.game-div{
		display: flex;
		justify-content: center;
		margin-top: 50px;
	}

	canvas {
		background: black;
	}

	button {
		display: block;
		background : transparent;
		border: 0;
		padding: 0;
		font-family: innherit;
		text-align: left;
		width: 160px;
	}

	button:hover {
		background-color: #dbd9d7;
		border-radius: 6px;
		width: 160px;
	}

	.icon {
		display: inline-block;
		font-size: 22px;
		padding: 8px 14px 8px 14px;
		text-align: center;
	}

	.icon:hover {
		background-color: #dbd9d7;
		clip-path:circle();
	}

	.icon-text {
		font-size: 14px;
	}

	.hide {
		display: none;
	}
`;

const getHtml = function(data) {
	const html = `
		<div class="game-div">
			<canvas id="canvas"></canvas>
			<button id="start-game">
				<span>
					<i class="icon bi bi-play-circle"></i>
					<span class="icon-text">Start Game</span>
				</span>
			</button>
			<button class="hide" id="play-again">
				<span>
					<i class="icon bi bi-play-circle"></i>
					<span class="icon-text">Play Again</span>
				</span>
			</button>
		</div>
	`;
	return html;
}

export default class LocalGame extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	disconnectedCallback() {
		this.game.stop();
		this.game = null;
	}

	attributeChangedCallback(name, oldValue, newValue) {

	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html(this.data);
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
		this.canvas = this.html.querySelector("#canvas");
		this.ctx = this.canvas.getContext("2d");
		
		// pode receber tamanho por parametro
		this.canvas.width = "1200";
		this.canvas.height = "600";

		this.game = new Game(this.ctx, this.canvas.width, this.canvas.height);
		this.gameLogic = new GameLogic();

		this.keyDownP1Status = "released";
		this.keyUpP1Status = "released";
		this.keyDownP2Status = "released";
		this.keyUpP2Status = "released";
	}

	#styles() {
			if (styles)
				return `@scope (.${this.elmtId}) {${styles}}`;
			return null;
	}

	#html(data){
		return getHtml(data);
	}

	#render() {
		if (styles)
			this.appendChild(this.styles);
		this.appendChild(this.html);
	}

	#scripts() {
		this.#initGame();
	}

	#keyEvents() {
		document.addEventListener('keydown', (event) => {
			if (event.code == "KeyS")
				this.keyDownP1Status = "pressed";
			else if (event.code == "KeyW")
				this.keyUpP1Status = "pressed";

			if (event.code == "ArrowDown")
				this.keyDownP2Status = "pressed";
			else if (event.code == "ArrowUp")
				this.keyUpP2Status = "pressed";

			this.#sendkeyStatus();
		});

		document.addEventListener('keyup', (event) => {
			if (event.code == "KeyS")
				this.keyDownP1Status = "released";
			else if (event.code == "KeyW")
				this.keyUpP1Status = "released";

			if (event.code == "ArrowDown")
				this.keyDownP2Status = "released";
			else if (event.code == "ArrowUp")
				this.keyUpP2Status = "released";
			this.#sendkeyStatus();
		})
	}

	#sendkeyStatus() {
		this.gameLogic.updatePaddle("up", this.keyUpP1Status, "P1");
		this.gameLogic.updatePaddle("down", this.keyDownP1Status, "P1");
		this.gameLogic.updatePaddle("up", this.keyUpP2Status, "P2");
		this.gameLogic.updatePaddle("down", this.keyDownP2Status, "P2");
	}

	#initGame() {
		this.#getGameColorPallet();
		this.#setGameStatusEvent();
		this.game.updateState({
			ball: this.gameLogic.getBallPositions(),
			paddle_left_pos: this.gameLogic.getPaddleLeft(),
			paddle_right_pos: this.gameLogic.getPaddleRight(),
			player_1_score: this.gameLogic.getScoreValues().player1Score,
			player_2_score: this.gameLogic.getScoreValues().player2Score,
		})
		this.game.start();
		this.#keyEvents();
		this.#readyToPlayBtnEvent();
	}

	#getGameColorPallet() {
		this.game.setColorPallet({"ground": "#000000", "paddle": "#FFFFFF", "ball": "#FFD700", "score": "rgba(26, 26, 26, 0.8)", "middleLine": "#FFFFFF"});
	}

	#setGameStatusEvent() {
		stateManager.addEvent("gameStatus", (data) => {
			this.game.updateState(data);
		});
	}

	#readyToPlayBtnEvent() {
		const btnStart = this.html.querySelector("#start-game");
		btnStart.addEventListener('click', (event) => {
			const gameLoop = () => {
				this.gameLogic.update();
				
				this.game.updateState({
					ball: this.gameLogic.getBallPositions(),
					paddle_left_pos: this.gameLogic.getPaddleLeft(),
					paddle_right_pos: this.gameLogic.getPaddleRight(),
					player_1_score: this.gameLogic.getScoreValues().player1Score,
					player_2_score: this.gameLogic.getScoreValues().player2Score,
				})
	
				if (!this.gameLogic.isEndGame())
					setTimeout(gameLoop, 10);
				else
					this.#finishGame(btnStart);
			};
			gameLoop();
		});
	}

	#finishGame(btnStart) {
		const btnAgain = this.html.querySelector("#play-again");

		if (this.gameLogic.getScoreValues().player1Score === 7)
			this.game.updateWinner({winner_username: "player1"})
		else
			this.game.updateWinner({winner_username: "player2"})

		btnAgain.classList.remove("hide");
		btnStart.classList.add("hide");

		btnAgain.addEventListener('click', (event) => {
			this.game = new Game(this.ctx, this.canvas.width, this.canvas.height);
			this.gameLogic = new GameLogic();
			this.#initGame()

			const gameLoop = () => {
				this.gameLogic.update();
				
				this.game.updateState({
					ball: this.gameLogic.getBallPositions(),
					paddle_left_pos: this.gameLogic.getPaddleLeft(),
					paddle_right_pos: this.gameLogic.getPaddleRight(),
					player_1_score: this.gameLogic.getScoreValues().player1Score,
					player_2_score: this.gameLogic.getScoreValues().player2Score,
				})
	
				if (!this.gameLogic.isEndGame())
					setTimeout(gameLoop, 10);
				else
					this.#finishGame(btnStart);
			};
			gameLoop();
		});
	}
}


customElements.define("local-game", LocalGame);
