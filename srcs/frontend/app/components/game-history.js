import {callAPI} from "../utils/callApiUtils.js";
import parseDate from "../utils/timeDateUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { enGameHistory } from "../lang-dicts/enLangDict.js";
import { ptGameHistory } from "../lang-dicts/ptLangDict.js";
import { esGameHistory } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

const styles = `
	.page-container {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 20px;
	}

	.tab-select {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;
	}

	.btn-solo-games {
		border-radius: 5px 0 0 5px;
		width: 50%;
	}
	
	.btn-tournament-games {
		border-radius: 0 5px 5px 0;
		width: 50%;
	}

	.btn-selected {
		background-color: #0056b3;
		border-color: #004494;
		transition: background-color 0.3s ease, box-shadow 0.3s ease;
	}

	.list-container {
		overflow-y: auto;
	}

	.caption-color {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 33%;
		width: 100%;
	}

	.victory-container, .defeat-container {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.color-victory {
		width: 20px;
		height: 20px;
		border-radius: 50% ;
		background-color: #00CCCC;
	}

	.color-defeat {
		width: 20px;
		height: 20px;
		border-radius: 50% ;
		background-color: #FF6666;
	}
`;

const getHtml = function(data) {
	const html = `
	<div class="page-container">
		<div class="tab-select">
			<button type="button" class="btn btn-primary btn-solo-games btn-selected">${data.langDict.solo_games_button}</button>
			<button type="button" class="btn btn-primary btn-tournament-games">${data.langDict.tournament_games}</button>
		</div>
		<div class="caption-color">
			<div class="victory-container">
				<div class="color-victory"></div>
				<div class="word-victory">${data.langDict.victory_color}</div>
			</div>
			<div class="defeat-container">
				<div class="word-defeat">${data.langDict.defeat_color}</div>
				<div class="color-defeat"></div>
			</div>
		</div>
		<div class="list-container">
			<div class="games-list"></div>
		</div>
	</div>
	`;
	return html;
}

export default class GameHistory extends HTMLElement {
	static observedAttributes = ["username", "language"];

	constructor() {
		super();
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "language")
			this.data.langDict = getLanguageDict(newValue, enGameHistory, ptGameHistory, esGameHistory);
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);

		this.btnTournamentGames = this.html.querySelector(".btn-tournament-games");
		this.btnSoloGames = this.html.querySelector(".btn-solo-games");
		this.gamesListHtml = this.html.querySelector(".games-list");
	}

	#scripts() {
		this.#getGameList();
		this.#soloGamesBtn();
		this.#tournamentsGamesBtn();
	}

	#insertGames(gameList) {
		let game = null;
		let prev_game = null;

		this.gamesListHtml.innerHTML = "";
		if (!gameList || !gameList.length) {
			this.gamesListHtml.innerHTML = `<h1>${this.data.langDict.no_games_played}</h1>`;
			return ;
		}
		gameList.forEach(elm => {
			game = document.createElement("div");
			game.innerHTML = 
			`<game-card
				player1="${elm.user1}"
				player1-image="${elm.user1_image}"
				player1-score="${elm.user1_score}"
				player2="${elm.user2}"
				player2-image="${elm.user2_image}"
				player2-score="${elm.user2_score}"
				is-winner="${elm.winner}"
				date="${parseDate(elm.date)}"
				>
			</game-card>`;
			this.gamesListHtml.insertBefore(game, prev_game);
			prev_game = game;
		});
	}

	#insertTournaments(tournamentList) {
		let tournament = null;
		let prev_tournament = null;

		this.gamesListHtml.innerHTML = "";
		if (!tournamentList || !tournamentList.length) {
			this.gamesListHtml.innerHTML =  `<h1>${this.data.langDict.no_tournaments_played}</h1>`;
			return ;
		}
		tournamentList.forEach(elm => {
			tournament = document.createElement("div");
			tournament.innerHTML = 
			`<tournament-card
				id="${elm.id}"
				name="${elm.name}"
				is-winner="${elm.is_winner}"
				date="${parseDate(elm.creation_date)}";
				lang-dict="${this.data.langDict}"
			></tournament-card>`;
			this.gamesListHtml.insertBefore(tournament, prev_tournament);
			prev_tournament = tournament;
		});
	}

	#getGameList() {
		this.btnSoloGames.disbled = true;
		callAPI("GET", `/game/get-games/?username=${this.data.username}`, null, (res, data) => {
			if (res.ok && data)
				this.#insertGames(data.games_list);
			this.btnSoloGames.disbled = false;
		});
	};

	#getTournamentList() {
		this.btnTournamentGames.disbled = true;
		callAPI("GET", `/tournament/?username=${this.data.username}`, null, (res, data) => {
			if (res.ok && data)
				this.#insertTournaments(data.tournaments_list);
			this.btnTournamentGames.disbled = false;
		});		
	}

	#soloGamesBtn() {
		this.btnSoloGames.addEventListener("click", () => {
			this.#setBtnFocus(this.btnSoloGames);
			this.#getGameList();
		});
	}

	#tournamentsGamesBtn() {
		this.btnTournamentGames.addEventListener("click", () => {
			this.#setBtnFocus(this.btnTournamentGames);
			this.#getTournamentList();
		});
	}

	#setBtnFocus(btnElmHtml) {
		this.btnTournamentGames.classList.remove("btn-selected");
		this.btnSoloGames.classList.remove("btn-selected");
		btnElmHtml.classList.add("btn-selected");
	}
}

customElements.define("game-history", GameHistory);
