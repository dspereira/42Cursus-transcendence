import Game from "../game/Game.js";
import { GameLogic } from "../game/GameLogic.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT} from "../game/const_vars.js" ;
import { redirect } from "../js/router.js";
import stateManager from "../js/StateManager.js";

const styles = `
	.general-div {
		display: flex;
		flex-direction: column;
	}

	.board {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 80vh;
	}
	
	.board-2 {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.game-div {
		position: relative;
		display: flex;
		justify-content: center;
		margin-top: 50px;
	}

	.btn-full-screen {
		all: unset;
		position: absolute;
		bottom: 20px; 
		right: 20px;
		color: white;
		cursor: pointer;
	}

	.buttons-div {
		display: flex;
		justify-content: center;
		margin-top: 50px;
		gap: 15px;
	}

	.hide {
		display: none;
	}
`;

const getHtml = function(data) {
	const html = `
		<div class="general-div">
			<div class="board">
				<div class="board-2">
					<div class="game-div">
						<button type="button" class="btn-full-screen"><i class="bi bi-fullscreen icon-full-screen"></i></button>
						<canvas id="canvas"></canvas>
					</div>
					<div class="buttons-div">
						<button type="button" class="btn btn-primary start-game">Start Game</button>
						<button type="button" class="btn btn-primary hide" id="play-again">Play Again</button>
						<button type="button" class="btn btn-secondary" id="initial-page">Initial Page</button>
					</div>
				</div>
			</div>
		</div>
			`;
	return html;
}

export default class LocalGame extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.data = {};
		this.gameLoopId = null;
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	disconnectedCallback() {
		this.game.stop();
		this.game = null;
		if (this.gameLoopId)
			clearInterval(this.gameLoopId);
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
		this.canvas.width = SCREEN_WIDTH;
		this.canvas.height = SCREEN_HEIGHT;
		this.game = new Game(this.ctx, SCREEN_WIDTH, SCREEN_HEIGHT);
		this.gameLogic = new GameLogic();
		this.keyDownP1Status = "released";
		this.keyUpP1Status = "released";
		this.keyDownP2Status = "released";
		this.keyUpP2Status = "released";

		this.board = this.html.querySelector(".board");
		this.board2 = this.html.querySelector(".board-2");
		this.containerCanvas = this.html.querySelector(".game-div");
		this.btnFullScreen = this.html.querySelector(".btn-full-screen");
		this.iconFullScreen = this.html.querySelector(".icon-full-screen");
		this.btnStart = this.html.querySelector(".start-game");
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
		this.#GameFontLoadEvent();
		this.#initialPageButton();
		this.#resizeGameBoard();
		this.#keyEvents();
		this.#windowResizingEvent();
		this.#FullScreenEvent();
		this.#btnFullScreenHover();
		this.#startGameBtnEvent();
		this.#initGameBoard();
	}

	#keyEvents() {
		document.addEventListener('keydown', (event) => {
			console.log(event.code);

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
			console.log(event.code);
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

	#getGameColorPallet() {
		this.game.setColorPallet({"ground": "#000000", "paddle": "#FFFFFF", "ball": "#FFD700", "score": "rgba(26, 26, 26, 0.8)", "middleLine": "#FFFFFF"});
	}

	#initGameBoard() {
		this.#getGameColorPallet();
		this.game.setPlayers("player1", "player2");
		this.game.setAlwaysShowPlayerNames(true);
		this.game.updateState(this.#getGameState());
		this.game.draw();
	}

	#getGameState() {
		return {
			ball: this.gameLogic.getBallPositions(),
			paddle_left_pos: this.gameLogic.getPaddleLeft(),
			paddle_right_pos: this.gameLogic.getPaddleRight(),
			player_1_score: this.gameLogic.getScoreValues().player1Score,
			player_2_score: this.gameLogic.getScoreValues().player2Score,
		}
	}

	#startGameBtnEvent() {
		this.btnStart.addEventListener('click', (event) => {
			this.#startGame();
		});
	}

	#startGame() {
		this.gameLogic.reset();
		this.game.updateState(this.#getGameState());
		this.game.start();
		this.#gameLoop();
	}

	#gameLoop() {
		const intervalMiliSeconds = 10;
		this.gameLoopId = setInterval(() => {
			this.gameLogic.update();
			this.game.updateState(this.#getGameState());
			if (this.gameLogic.isEndGame()) {
				this.game.updateState(this.#getGameState());
				this.#finishGame();
			}
		}, intervalMiliSeconds);
	}

	#readyToPlayBtnEvent() {
		
		btnStart.addEventListener('click', (event) => {
			const gameLoop = () => {
				btnStart.disabled = true;
				this.gameLogic.update();
				
				this.game.updateState(this.#getGameState());
	
				if (!this.gameLogic.isEndGame())
					setTimeout(gameLoop, 10);
				else 
				{
					btnStart.classList.add("hide");
					this.#finishGame();
				}
			};
			gameLoop();
		});
	}

	#finishGame() {
		if (this.gameLogic.getScoreValues().player1Score == 7)
			this.game.updateWinner({winner_username: "player1"})
		else
			this.game.updateWinner({winner_username: "player2"})
		if (this.gameLoopId)
			clearInterval(this.gameLoopId);
		this.gameLoopId = null;


		// btnAgain.classList.remove("hide");

		// btnAgain.addEventListener('click', (event) => {
		// 	console.log("novo evento");
		// 	this.game = new Game(this.ctx, this.canvas.width, this.canvas.height);
		// 	this.gameLogic = new GameLogic();
		// 	this.#initGame()

		// 	const gameLoop = () => {
		// 		btnAgain.disabled = true;
		// 		this.gameLogic.update();
				
		// 		this.game.updateState(this.#getGameState());
	
		// 		if (!this.gameLogic.isEndGame())
		// 			setTimeout(gameLoop, 10);
		// 		else
		// 		{
		// 			btnAgain.disabled = false;
		// 			this.#finishGame();
		// 		}
		// 	};
		// 	gameLoop();
		// });
	}

	#initialPageButton() {
		const initialPage = this.html.querySelector("#initial-page");
		if (!initialPage)
			return ;
		initialPage.addEventListener("click", () => {
			redirect("/");
		});
	}

	#resizeGameBoard() {
		this.#setCanvasDimensions();
		this.#updateFullScreenButton();
		if (this.game)
			this.game.resizeGame(this.canvas.width, this.canvas.height);
	}

	#setCanvasDimensions() {
		if (this.board.offsetHeight < this.board.offsetWidth * 0.75) {
			this.canvas.height = this.board.offsetHeight
			this.canvas.width = this.canvas.height / 0.75;	
		}
		else {
			this.canvas.width = this.board.offsetWidth;
			this.canvas.height = this.canvas.width * 0.75;			
		}
		this.board2.style.width =  `${this.canvas.width}px`;
	}

	#updateFullScreenButton() {
		this.#changeFullScreenIcon();
		this.#changeFullScreenBtnPosition();
	}

	#changeFullScreenIcon() {
		this.iconFullScreen.classList.remove("bi-fullscreen");
		this.iconFullScreen.classList.remove("bi-fullscreen-exit");
		if (this.isFullScreen)
			this.iconFullScreen.classList.add("bi-fullscreen-exit");
		else
			this.iconFullScreen.classList.add("bi-fullscreen");

		this.iconFullScreen.style.fontSize = `${this.canvas.width * 0.025}px`;
	}

	#changeFullScreenBtnPosition() {
		this.btnFullScreen.style.right = `${this.canvas.width * 0.015}px`;
		this.btnFullScreen.style.bottom = `${this.canvas.height * 0.015}px`;
		if (this.isFullScreen) {
			const distBtwCanvasAndRightEdge = window.innerWidth - this.canvas.getBoundingClientRect().right;
			this.btnFullScreen.style.right = `${distBtwCanvasAndRightEdge + this.canvas.width * 0.015}px`;
		}
	}

	#windowResizingEvent() {
		window.addEventListener("resize", () => {
			if (!this.isFullScreen)
				this.#resizeGameBoard();
		});
	}

	#FullScreenEvent() {
		this.btnFullScreen.addEventListener("click", () => {
			if (!this.isFullScreen && this.containerCanvas.requestFullscreen)
				this.containerCanvas.requestFullscreen();
			if (this.isFullScreen && document.exitFullscreen)
				document.exitFullscreen();
		});

		document.addEventListener("fullscreenchange", () => {
			if (document.fullscreenElement)
				this.isFullScreen = true;
			else {
				this.isFullScreen = false;
				this.#resizeGameBoard();
			}
			this.#updateFullScreenButton();
			this.game.setIsFullScreen(this.isFullScreen);
		});
	}

	#btnFullScreenHover() {
		this.btnFullScreen.addEventListener('mouseover', () => {
			this.iconFullScreen.style.fontSize = `${this.canvas.width * 0.028}px`;
		});
		
		this.btnFullScreen.addEventListener('mouseout', () => {
			this.iconFullScreen.style.fontSize = `${this.canvas.width * 0.025}px`;
		});
	}

	#GameFontLoadEvent() {
		document.fonts.load('1rem VT323').then(() => {
			this.#initGameBoard();
		}).catch((error) => {
			console.error('Font Load Error: ', error);
		});		
	}
}

customElements.define("local-game", LocalGame);
