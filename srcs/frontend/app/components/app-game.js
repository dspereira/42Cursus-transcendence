import Game from "../game/Game.js";

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
		this.game.start();
		this.#keyEvents();
	}

	#keyEvents() {
		document.addEventListener('keydown', (event) => {
			// send data via websocket
			if (event.code == "ArrowDown" || event.code == "KeyS")
				console.log(`key1: ${event.code}`);
			else if (event.code == "ArrowUp" || event.code == "KeyW")
				console.log(`key2: ${event.code}`);
		});		
	}
}

customElements.define("app-game", AppGame);
