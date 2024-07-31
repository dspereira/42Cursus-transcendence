import Game from "../game/Game.js";
import gameWebSocket from "../js/GameWebSocket.js";
import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `
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
`;

const getHtml = function(data) {
	const html = `
		<canvas id="canvas"></canvas>
		<button id="start-game">
			<span>
				<i class="icon bi bi-play-circle"></i>
				<span class="icon-text">Start Game</span>
			</span>
		</button>
	`;
	return html;
}

export default class AppPlay extends HTMLElement {
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
		this.canvas.width = "800";
		this.canvas.height = "400";

		this.game = new Game(this.ctx, this.canvas.width, this.canvas.height);

		this.game_id = 27;

		this.keyDownStatus = "released";
		this.keyUpStatus = "released";
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

	/*async #initGame() {
		await this.#getGameColorPallet();
		this.game.start();
		this.#keyEvents();
		gameWebSocket.open();
	}*/

	#initGame() {
		this.#getGameColorPallet();
		this.#setGameStatusEvent();
		this.game.start();
		this.#keyEvents();
		this.#readyToPlayBtnEvent();
		gameWebSocket.open();
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
		const queryParam = `?id=${3}`;

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

	#readyToPlayBtnEvent() {
		const btn = this.html.querySelector("#start-game");
		btn.addEventListener('click', (event) => {
			gameWebSocket.ready();
		});
	}

}

customElements.define("app-play", AppPlay);
