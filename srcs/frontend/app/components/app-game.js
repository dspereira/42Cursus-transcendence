import stateManager from "../js/StateManager.js";

const styles = `
	.game-create {
		background-color: black;
		cursor: pointer;
		border-radius: 0px 0px 10px 10px;
		width: 100%;
		height: 10vh;
	}


	.friend-invites {
		width: 100%;
	}
`;

const getHtml = function(data) {
	const html = `

	<div class="game">
		<div class="game-create">
			<button type="button" class="btn btn-success">
				Create Game
			</button>
		</div>

		<div class="friend-invites">
		</div>
	</div>

	`;
	return html;
}

export default class AppGame extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()

	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
		//this.#socket();
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
		this.msgInputscrollHeight = 0;
		this.msgInputscrollHeight1 = 0;
		this.msgInputMaxRows = 4;
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

	}

}
