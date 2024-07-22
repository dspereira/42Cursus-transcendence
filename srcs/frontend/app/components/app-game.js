import Game from "../game/Game.js";
import gameWebSocket from "../js/GameWebSocket.js";
import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `
	canvas {
		background: black;
	}
`;

const getHtml = function(data) {
	const html = `
		<canvas id="canvas"></canvas>
	`;
	return html;
}

export default class AppGame extends HTMLElement {
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
				gameWebSocket.send("down", "pressed");
			else if (event.code == "ArrowUp" || event.code == "KeyW")
				gameWebSocket.send("up", "pressed");
		});

		document.addEventListener('keyup', (event) => {
			if (event.code == "ArrowDown" || event.code == "KeyS")
				gameWebSocket.send("down", "released");
			else if (event.code == "ArrowUp" || event.code == "KeyW")
				gameWebSocket.send("up", "released");

		})
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

}

customElements.define("app-game", AppGame);
