import {callAPI} from "../utils/callApiUtils.js";


const styles = `

	.game-grid-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		margin-left: 30px;
		margin-right: 30px;
		margin-bottom: 20px;
		height: 80px;
		border-radius: 10px;
	}

	.game-win {
		border: 3px solid blue;
		background-color: #00CCCC;
	}

	.game-loss {
		border: 3px solid red;
		background-color: #FF6666;
	}

	.player-container {
		display: flex;
		align-items: center;
		margin: 20px;
		gap: 25px;
	}

	.profile-picture {
		width: 50px;
		height: 50px;
		clip-path: circle();
	}

	.username {
		margin-top: 7px;
		font-size: 16px;
	}

	.score-container {
		margin-top: 7px;
		position: absolute;
		left: 50%;
	}

	.score {
		font-size: 24px;
	}
`;

const getHtml = function(data) {

	const html = `
		<div class="game-grid-container game-win">
			<div class="player-container">
				<img class="profile-picture" src=${data.player1_image}>
				<h1 class="username">${data.player1}</h1>
			</div>
			<div class="score-container">
				<h1 class="score">${data.player1_score} - ${data.player2_score}</h1>
			</div>
			<div class="player-container">
			<h1 class="username">${data.player2}</h1>
			<img class="profile-picture" src=${data.player2_image}>
			</div>
		</div>
	`;

	return html;
}

export default class GameCard extends HTMLElement {
	static observedAttributes = ["player1", "player1_image", "player1_score", "player2", "player2_image", "player2_score"];

	constructor() {
		super();
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
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

customElements.define("game-card", GameCard);

