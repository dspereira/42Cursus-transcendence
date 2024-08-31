import Game from "../game/Game.js";
import gameWebSocket from "../js/GameWebSocket.js";
import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";

const styles = `
.profile-photo {
	width: 50px;
}

.players-info {
	display: flex;
	justify-content: space-between;
}

.game-board {
	/*background-color: blue;*/
}

.btn-leave-div {
	display: flex;
	justify-content: center;
	margin-top: 50px;
}

.btn-leave {
	width: 150px;
	height: 50px;
}

.hide {
	display: none;
}

.game-board {
	width: 100%;
	height: 80vh;
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

.container-canvas {
	position: relative;
	display: flex;
	justify-content: center;

}

.btn-full-screan {
	all: unset;
	position: absolute;
	bottom: 20px; 
	right: 20px;
	color: white;
	cursor: pointer;
}

.content-small {
	height: 85vh;
}

.content-large {
	height: 85vh;
}

`;

const getHtml = function(data) {
	const html = `
	<div class="game-board">
		<div class="board">
			<div class="board-2">
				<div class="players-info">
					<div>
						<img src="${data.hostImage}" class="profile-photo" alt="profile photo chat">
						<span>${data.hostUsername}</span>
					</div>
					<div>
						<span>${data.guestUsername}</span>
						<img src="${data.guestImage}" class="profile-photo" alt="profile photo chat">
					</div>
				</div>
				<div class="container-canvas">	
					<button type="button" class="btn-full-screan"><i class="bi bi-fullscreen icon-full-screan"></i></button>
					<canvas id="canvas"></canvas>
				</div>
			</div>
		</div>
		<div class="btn-leave-div">
			<button type="button" class="btn btn-primary btn-leave hide">Leave</button>
		</div>
	</div>
	`;
	return html;
}

export default class AppPlay extends HTMLElement {
	static observedAttributes = ["host-username", "host-image", "guest-username", "guest-image", "lobby-id", "is-tournament"];

	constructor() {
		super()
		this.data = {};
		this.game = null;
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	disconnectedCallback() {
		this.game.stop();
		this.game = null;
		gameWebSocket.close();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (newValue == "undefined")
			newValue = null;
		if(name == "host-username")
			name = "hostUsername";
		else if (name == "host-image")
			name = "hostImage";
		if(name == "guest-username")
			name = "guestUsername";
		else if (name == "guest-image")
			name = "guestImage";
		else if (name == "lobby-id")
			name = "lobbyId";
		else if (name == "is-tournament")
			name = "isTournament"
		this.data[name] = newValue;
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
		this.startTimer = this.html.querySelector(".start-timer");
		this.leave = this.html.querySelector(".btn-leave");
		this.board = this.html.querySelector(".board");
		this.board2 = this.html.querySelector(".board-2");
		this.containerCanvas = this.html.querySelector(".container-canvas");
		this.btnFullScrean = this.html.querySelector(".btn-full-screan");
		this.iconFullScrean = this.html.querySelector(".icon-full-screan");
		this.keyDownStatus = "released";
		this.keyUpStatus = "released";
		this.isGameFinished = false;
		this.isFullScrean = false;
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
		this.game = new Game(this.ctx, this.canvas.width, this.canvas.height);
		this.#resizeGameBoard();
		this.#initGame();
		this.#setWinnerEvent();
		this.#setBtnLeaveEvent();
		this.#onSocketCloseEvent();
		this.#windowResizingEvent();
		this.#FullScreanEvent();
		
	}

    #keyEvents() {
        document.addEventListener('keydown', (event) => {
            if (event.code == "ArrowDown" || event.code == "KeyS")
                this.keyDownStatus = "pressed";
            else if (event.code == "ArrowUp" || event.code == "KeyW")
                this.keyUpStatus = "pressed";
			this.#sendkeyStatus();
        });

        document.addEventListener('keyup', (event) => {
            if (event.code == "ArrowDown" || event.code == "KeyS")
                this.keyDownStatus = "released";
            else if (event.code == "ArrowUp" || event.code == "KeyW")
                this.keyUpStatus = "released";
			this.#sendkeyStatus();
        })
    }

	#sendkeyStatus() {
		gameWebSocket.send("up", this.keyUpStatus);
		gameWebSocket.send("down", this.keyDownStatus);
		gameWebSocket.send("up", this.keyUpStatus);
		gameWebSocket.send("down", this.keyDownStatus);
	}

	#initGame() {
		this.#getGameColorPallet();
		this.#setGameStatusEvent();
		this.game.start();
		this.#keyEvents();
		this.#setGameTimeToStartEvent();
	}

	/*
		Color Pallets IDs
		1: Classic Retro
		2: Modern Neon
		3: Ocean Vibes
		4: Sunset Glow
		5: Forest Retreat
	*/
	#getGameColorPallet() {
		const queryParam = `?id=${2}`;

		callAPI("GET", `http://127.0.0.1:8000/api/game/color_pallet/${queryParam}`, null, (res, data) => {
			if (res.ok) {
				if (data && data.color_pallet)
					this.game.setColorPallet(data.color_pallet);
			}
		});
	}

	#setGameStatusEvent() {
		stateManager.addEvent("gameStatus", (data) => {
			this.game.updateState(data);
		});
	}

	#setGameTimeToStartEvent() {
		stateManager.addEvent("gameTimeToStart", (data) => {
			this.game.updateStartCounter(data);
		});
	}

	#setWinnerEvent() {
		stateManager.addEvent("gameWinner", (value) => {
			this.isGameFinished = true;
			this.game.updateWinner(value);
			this.leave.classList.remove("hide");
			stateManager.cleanStateEvents("gameWinner");
			stateManager.cleanStateEvents("gameTimeToStart"); 
			stateManager.cleanStateEvents("gameStatus");
			gameWebSocket.close();
		});
	}

	#setBtnLeaveEvent() {
		this.leave.addEventListener("click", () => {
			if (this.data.isTournament)
				stateManager.setState("isTournamentChanged", true);
			else
				redirect("/play");
		});
	}

	#openSocket() {
		gameWebSocket.open(this.data.lobbyId);
	}

	#onSocketCloseEvent() {
		stateManager.addEvent("gameSocket", (state) => {
			if (state == "closed") {
				callAPI("GET", "http://127.0.0.1:8000/api/auth/login_status", null, (res, data) => {
					if (res.ok && data && !this.isGameFinished)
						this.#openSocket();
				});
			}
		});
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
	
	#changeFullScreenIcon() {
		this.iconFullScrean.classList.remove("bi-fullscreen");
		this.iconFullScrean.classList.remove("bi-fullscreen-exit");
		if (this.isFullScrean)
			this.iconFullScrean.classList.add("bi-fullscreen-exit");
		else
			this.iconFullScrean.classList.add("bi-fullscreen");

		this.iconFullScrean.style.fontSize = `${this.canvas.width * 0.025}px`;
	}

	#changeFullScreenBtnPosition() {
		this.btnFullScrean.style.right = `${this.canvas.width * 0.015}px`;
		this.btnFullScrean.style.bottom = `${this.canvas.height * 0.015}px`;
		if (this.isFullScrean) {
			const distBtwCanvasAndRightEdge = window.innerWidth - this.canvas.getBoundingClientRect().right;
			this.btnFullScrean.style.right = `${distBtwCanvasAndRightEdge + this.canvas.width * 0.015}px`;
		}
	}	

	#updateFullScreenButton() {
		this.#changeFullScreenIcon();
		this.#changeFullScreenBtnPosition();
	}

	#resizeGameBoard() {
		this.#setCanvasDimensions();
		this.#updateFullScreenButton();
		if (this.game)
			this.game.resizeGame(this.canvas.width, this.canvas.height);
	}

	#windowResizingEvent() {
		window.addEventListener("resize", () => {
			if (!this.isFullScrean)
				this.#resizeGameBoard();
		});
	}

	#FullScreanEvent() {
		this.btnFullScrean.addEventListener("click", () => {
			if (!this.isFullScrean && this.containerCanvas.requestFullscreen)
				this.containerCanvas.requestFullscreen();
			if (this.isFullScrean && document.exitFullscreen)
				document.exitFullscreen();
		});

		document.addEventListener("fullscreenchange", () => {
			if (document.fullscreenElement)
				this.isFullScrean = true;
			else {
				this.isFullScrean = false;
				this.#resizeGameBoard();
			}
			this.#updateFullScreenButton();
		});
	}
	
}

customElements.define("app-play", AppPlay);
