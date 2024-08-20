import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";

const styles = `
	.graph {
		display: flex;
		justify-content: flex-start;
		background-color: #939185;
		border-radius: 8px;
	}

	.game-size-1 {
		width: 30%
	}

	.game-size-2 {
		width: 40%;
	}

	.padding-35 {
		padding: 35px;
	}

	.game-flex {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
	}

	.game-flex-row {
		flex-direction: row;
	}

	.game-flex-column {
		flex-direction: column;
	}

	.player-1, .player-2 {
		display: flex;
		/*justify-content: center;*/
		align-items: center;
		gap: 10px;
		background-color: #F6F5F5;
		width: 100%;
		height: 60px;
		border-radius: 8px;
	}

	.profile-photo {
		width: 40px;
		margin-left: 10px;
	}
`;

const getHtml = function(data) {
	const html = `
		<div class="graph">
			<div class="game-size-1 padding-35 game-flex game-flex-column game-0">
				<div class="player-1"></div>
				<div class="player-2"></div>
			</div>
			<div class="game-size-2 game-flex game-flex-row game-2">
				<div class="player-1"></div>
				<div class="player-2"></div>
			</div>
			<div class="game-size-1 padding-35 game-flex game-flex-column game-1">
				<div class="player-1"></div>
				<div class="player-2"></div>
			</div>
		</div>
	`;
	return html;
}

export default class TourneyGraph extends HTMLElement {
	static observedAttributes = ["tournament-id"];

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

	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "tournament-id")
			name = "tournamentId";
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
		this.#getTournamentGamesData();
	}

	#getTournamentGamesData() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/games/?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok) {
				console.log(data);
				if (data && data.games && data.games.length)
					this.#updateGames(data.games);
			}
		});
	}

	#updateGames(data) {
		data.forEach((game, idx) => {
			console.log(game);
			this.#updatePlayerData(idx, "1", game.player1);
			this.#updatePlayerData(idx, "2", game.player2);
		});
	}

	#updatePlayerData(gameNum, playerNum, data) {
		const player = this.html.querySelector(`.game-${gameNum} .player-${playerNum}`);
		if (!player || !data)
			return ;
		player.innerHTML = `
		<img src="${data.image}" class="profile-photo" alt="profile photo chat"/>
		<span class="username">${data.username}</span>
	`;	
	}
}

customElements.define("tourney-graph", TourneyGraph);


