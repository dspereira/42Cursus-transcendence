import {callAPI} from "../utils/callApiUtils.js";


const styles = `

`;

const getHtml = function(data) {

	const html = `
		<div class="game-list"></div>
	`;

	return html;
}

export default class GameHistory extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super();
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
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
		this.#getGameList();
	}

	#insertGames(gameList) {
		let game = null;
		const gameListHtml = this.html.querySelector(".game-list");
		gameList.forEach(elm => {
			game = document.createElement("div");
			game.innerHTML = 
			`<game-card
				player1=${elm.user1}
				player1_image=${elm.user1_image}
				player1_score=${elm.user1_score}
				player2=${elm.user2}
				player2_image=${elm.user2_image}
				player2_score=${elm.user2_score}
				win=${elm.winner}
				>
			</game-card>`;
			gameListHtml.appendChild(game);
		});
	}

	#getGameList() {
		callAPI("GET", "http://127.0.0.1:8000/api/game/get-games/", null, (res, data) => {
			this.#insertGames(data.games_list);
		});
	};
}

customElements.define("game-history", GameHistory);