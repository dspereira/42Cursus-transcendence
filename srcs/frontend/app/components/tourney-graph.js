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

	.winner-border {
		border: 4px solid green;
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

	.hide {
		display: none;
	}
`;

const getHtml = function(data) {
	const html = `
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
		<br></br>
		<button type="button" class="btn btn-success btn-start hide">Start Game</button>
	`;
	return html;
}

export default class TourneyGraph extends HTMLElement {
	static observedAttributes = ["tournament-id"];

	constructor() {
		super()
		this.data = {};
		this.lobbyIdNextGame = null;
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
		this.startGameBtn = this.html.querySelector(".btn-start");
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
			if (game.player1)
				this.#updatePlayerData(idx, "1", game.player1, game.player1_score, game.winner);
			if (game.player2)
				this.#updatePlayerData(idx, "2", game.player2, game.player2_score, game.winner);
		});
	}

	#updatePlayerData(gameNum, playerNum, playerInfo, playerScore, playerWinner) {

		console.log("------------------------------");
		console.log("game num: ", gameNum);

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
			if (playerWinner.id == playerInfo.id)
				player.classList.add("winner-border");
		}

	}

	#setStartGameEvent() {
		const btn = this.html.querySelector(".btn-start");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			stateManager.setState("tournamentGameLobby", this.lobbyIdNextGame);
		});
	}

	#getNextGame() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/next-game/?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok) {
				if (data && data.lobby_id) {
					this.lobbyIdNextGame = data.lobby_id;
					this.startGameBtn.classList.remove("hide");
				}
				else
					this.startGameBtn.classList.add("hide");
			}
		});	
	}
}

customElements.define("tourney-graph", TourneyGraph);


