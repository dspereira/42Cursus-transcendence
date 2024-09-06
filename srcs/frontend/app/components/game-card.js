import {callAPI} from "../utils/callApiUtils.js";

const styles = `
	.game-grid-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		width: 100%;
		padding: 5px 15px 5px 15px;
		margin-bottom: 20px;
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
		gap: 10px;
	}

	.profile-picture {
		width: 50px;
		height: 50px;
		clip-path: circle();
		object-fit: cover;
	}

	.username {
		margin-top: 7px;
		font-size: 16px;
	}

	.score-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}

	.score {
		font-size: 24px;
	}

	.date {
		font-size: 14px;
	}
	
	.left {
		display: flex;
		justify-content: flex-start;
		width: 33.33%;
	}

	.center {
		display: flex;
		justify-content: center;
		width: 33.33%;
	}

	.right {
		display: flex;
		justify-content: flex-end;
		width: 33.33%;
	}
`;

const getHtml = function(data) {
	const html = `
		<div class="game-grid-container ${data.isWinner == "true" ? "game-win" : "game-loss"}">
			<div class="player-container left">
				<img class="profile-picture" src=${data.player1_image}>
				<div class="username">${data.player1}</div>
			</div>
			<div class="score-container center">
				<div class="date">${data.date}</div>
				<div class="score">${data.player1_score} - ${data.player2_score}</div>
			</div>
			<div class="player-container right">
				<div class="username">${data.player2}</div>
				<img class="profile-picture" src=${data.player2_image}>
			</div>
		</div>
	`;

	return html;
}

export default class GameCard extends HTMLElement {
	static observedAttributes = ["player1", "player1_image", "player1_score", "player2", "player2_image", "player2_score", "is-winner", "date"];

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
		if (name == "is-winner")
			name = "isWinner";
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
