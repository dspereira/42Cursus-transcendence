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
		const gameList = getGamesFakeCall();
		this.#insertGames(gameList);
	}

	#insertGames(gameList) {
		let game = null;
		const gameListHtml = this.html.querySelector(".game-list");
		gameList.forEach(elm => {
			game = document.createElement("div");
			game.innerHTML = 
			`<game-card
				player1=${elm.player1}
				player1_image=${elm.player1_image}
				player1_score=${elm.player1_score}
				player2=${elm.player2}
				player2_image=${elm.player2_image}
				player2_score=${elm.player2_score}
				>
			</game-card>`;
			gameListHtml.appendChild(game);
		});
	}
}

customElements.define("game-history", GameHistory);

// just for debug
const getGamesFakeCall = function ()
{
	const data = `[
		{
			"player1":"pcampos-",
			"player1_image": "https://api.dicebear.com/8.x/bottts/svg?seed=pcampos-",
			"player1_score": 7,
			"player2": "candeia",
			"player2_image": "https://api.dicebear.com/8.x/bottts/svg?seed=candeia",
			"player2_score": 3,
			"winner": "pcampos-"
		},
		{
			"player1":"dsilveri",
			"player1_image": "https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri",
			"player1_score": 7,
			"player2": "pcampos-",
			"player2_image": "https://api.dicebear.com/8.x/bottts/svg?seed=pcampos-",
			"player2_score": 6,
			"winner": "dsilveri"
		}
	]`;

	return JSON.parse(data);
}
