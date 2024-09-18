import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { enTourneyGraphDict } from "../lang-dicts/enLangDict.js";
import { ptTourneyGraphDict } from "../lang-dicts/ptLangDict.js";
import { esTourneyGraphDict } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

const styles = `
	.tournament-container {
		background-color: #939185;
	}

	.winner {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 10px;
	}

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
		align-items: center;
		background-color: #F6F5F5;
		width: 100%;
		height: 60px;
		border-radius: 8px;
	}

	.justify-start {
		justify-content: flex-start;
	}

	.justify-end {
		justify-content: flex-end;
	}


	.profile-photo {
		width: 40px;
	}

	.winner {
		padding-top: 20px;
	}

	.winner .profile-photo {
		width: 70px;
	} 

	.winner-border {
		border: 4px solid green;
	}

	.loser-border {
		border: 4px solid red;
	}

	.player-info {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.img-name-info {
		display: flex;
		align-items: center;
		gap: 5px;
		width: 80%;
	}

	.score-info {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20%;
	}

	.score {
		font-size: 20px;
		font-weight: bold;
	}

	.winner-color {
		color: green;
	}

	.loser-color {
		color: red;
	}

	.winner-tourney {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tourney-title {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
	}

	.hide {
		display: none;
	}
`;

const getHtml = function(data) {
	const html = `
	<div class="tourney-title">${data.tournamentName}</div>
		<div class="tournament-container">
			<div class="winner hide">
				<div><img src="" class="profile-photo" alt="profile photo chat"/></div>
				<div>${data.langDict.tournamment_winner}</div>
			</div>
			<div class="graph">
				<div class="game-size-1 padding-35 game-flex game-flex-column game-0">
					<div class="player-1">
						<div class="player-info hide">
							<div class="img-name-info">
								<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo chat"/>
								<span class="username">username</span>
							</div>
							<div class="score-info">
								<span class="score hide">7</span>
							</div>
						</div>
					</div>
					<div class="player-2">
						<div class="player-info hide">
							<div class="img-name-info">
								<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo chat"/>
								<span class="username">username</span>
							</div>
							<div class="score-info">
								<span class="score hide">7</span>
							</div>
						</div>
					</div>
				</div>
				<div class="game-size-2 game-flex game-flex-row game-2">
					<div class="player-1 justify-start">
						<div class="player-info hide">
							<div class="img-name-info">
								<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo chat"/>
								<span class="username">username</span>
							</div>
							<div class="score-info">
								<span class="score hide">7</span>
							</div>
						</div>
					</div>
					<div class="player-2">
						<div class="player-info hide">
							<div class="score-info">
								<span class="score hide">7</span>
							</div>
							<div class="img-name-info justify-end">
								<span class="username">username</span>
								<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo chat"/>
							</div>
						</div>
					</div>
				</div>
				<div class="game-size-1 padding-35 game-flex game-flex-column game-1">
					<div class="player-1">
						<div class="player-info hide">
							<div class="score-info">
								<span class="score hide">7</span>
							</div>
							<div class="img-name-info justify-end">
								<span class="username">username</span>
								<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo chat"/>
							</div>
						</div>
					</div>
					<div class="player-2">
						<div class="player-info hide">
							<div class="score-info">
								<span class="score hide">7</span>
							</div>
							<div class="img-name-info justify-end">
								<span class="username">username</span>
								<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri" class="profile-photo" alt="profile photo chat"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<br></br>
		<button type="button" class="btn btn-success btn-start hide">${data.langDict.start_game_button}</button>
	`;
	return html;
}

export default class TourneyGraph extends HTMLElement {
	static observedAttributes = ["tournament-id", "tournament-name", "language"];

	constructor() {
		super()
		this.data = {};
		this.lobbyIdNextGame = null;
		this.intervalID = null;
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	disconnectedCallback() {
		if (this.intervalID)
			clearInterval(this.intervalID);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "tournament-id")
			name = "tournamentId";
		if (name == "tournament-name")
			name = "tournamentName";
		if (name == "language")
			this.data.langDict = getLanguageDict(newValue, enTourneyGraphDict, ptTourneyGraphDict, esTourneyGraphDict);
		this.data[name] = newValue;
	}

	#getLanguage(language) {
		switch (language) {
			case "en":
				return enTourneyGraphDict;
			case "pt":
				return ptTourneyGraphDict;
			case "es":
				return esTourneyGraphDict;
			default:
				return enTourneyGraphDict;
		}
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
		this.startGameBtn = this.html.querySelector(".btn-start");
		this.winnerSection = this.html.querySelector(".winner");
		this.winnerImage = this.winnerSection.querySelector(".profile-photo");

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
		this.#setStartGameEvent();
		this.#getNextGame();
		this.#updateGamesPolling();
	}

	#getTournamentGamesData() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/games/?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok) {
				if (data && data.games && data.games.length)
					this.#updateGames(data.games);
			}
		});
	}

	#updateGames(data) {
		data.forEach((game, idx) => {
			if (game.player1)
				this.#updatePlayerData(idx, "1", game.player1, game.player1_score, game.winner);
			if (game.player2)
				this.#updatePlayerData(idx, "2", game.player2, game.player2_score, game.winner);
		});
	}

	#updatePlayerData(gameNum, playerNum, playerInfo, playerScore, playerWinner) {
		const player = this.html.querySelector(`.game-${gameNum} .player-${playerNum}`);
		if (!player)
			return ;
		const playerHide = player.querySelector(`.player-info`);
		const img = player.querySelector(`.profile-photo`);
		const username = player.querySelector(`.username`);
		const score = player.querySelector(`.score`);
		if (!img || !username || !score || !playerHide)
			return ;
		playerHide.classList.remove("hide");
		img.setAttribute("src", playerInfo.image);
		username.innerHTML = playerInfo.username;
		score.innerHTML = `${playerScore}`;

		if (playerWinner) {
			score.classList.remove("hide");
			if (playerWinner.id == playerInfo.id) {
				if (gameNum == 2) {
					this.winnerSection.classList.remove("hide");
					this.winnerImage.setAttribute("src", playerInfo.image);
				}
				player.classList.add("winner-border");
				score.classList.add("winner-color");
			}
			else {
				player.classList.add("loser-border");
				score.classList.add("loser-color");
			}
		}
	}

	#setStartGameEvent() {
		const btn = this.html.querySelector(".btn-start");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			callAPI("GET", `http://127.0.0.1:8000/api/tournament/next-game/?id=${this.data.tournamentId}`, null, (res, data) => {
				if (res.ok) {
					if (data && data.lobby_id)
						stateManager.setState("tournamentGameLobby", data.lobby_id);
				}
			});
			
		});
	}

	#getNextGame() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/has-game/?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok) {
				if (data && data.has_game)
					this.startGameBtn.classList.remove("hide");
				else
					this.startGameBtn.classList.add("hide");
			}
		});
	}

	#checkTournamentFinished() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/is-finished/?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok && data && data.is_finished) {
				const btn = document.querySelector(".exit-tourney");
				if (!btn)
					return ;
				btn.classList.remove("hide");
			}
		});
	}

	#updateGamesPolling() {
		this.intervalID = setInterval(() => {
			this.#getTournamentGamesData();
			this.#getNextGame();
			this.#checkTournamentFinished();

		}, 5000);
	}
}

customElements.define("tourney-graph", TourneyGraph);
