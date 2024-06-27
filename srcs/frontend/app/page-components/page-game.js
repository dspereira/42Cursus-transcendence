import stateManager from "../js/StateManager.js";
import { adjustContent } from "../utils/adjustContent.js";

const styles = `

	.game-page {
		display:flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height 100vh;
	}

	.game-create, .friend-invites {
		background-color: #EEEEEE;
		width: 80vw;
		margin: 0px 0px 20px 0px;
	}

	.game-create {
		display: flex;
		cursor: pointer;
		border-radius: 10px;
		height: 10vh;
		justify-content: center;
		align-items: center;
	}

	.create-button {
		color: white;
		background-color: #E0E0E0;
		border-style: hidden;
		border-radius: 5px;
		width: 30%;
		height: 50%;

	}

	.create-button:hover {
		background-color: #C2C2C2;

	}

	.friend-invites {
		display: flex;
		justify-content: center;
		border-radius: 10px;
		height: 100vh;
	}
`;

const getHtml = function(data) {
	const html = `
		<app-header></app-header>
		<side-panel selected="game"></side-panel>
		<div class="content content-small game-page">
			<div class="game">
				<div class="game-create">
					<button type="button" class="create-button">
						Create Game
					</button>
				</div>
				<div class="friend-invites">
				FRIENDS GO HERE</div>
			</div>
		</div>
	`;
	return html;
}

const title = "BlitzPong - Game";

export default class PageGame extends HTMLElement {
	static #componentName = "page-game";

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	static get componentName() {
		return this.#componentName;
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
		stateManager.setState("pageReady", true);
	}

	#scripts() {
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageGame.componentName, PageGame);
