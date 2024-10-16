import { callAPI } from "../utils/callApiUtils.js";
import gameWebSocket from "../js/GameWebSocket.js";
import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";
import { colors } from "../js/globalStyles.js";
import { pfpStyle } from "../utils/stylingFunctions.js";
import checkUserLoginState from "../utils/checkUserLoginState.js";
import updateLoggedInStatus from "../utils/updateLoggedInUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
	.lobby {
		display: flex;
		justify-content: center;
		text-align: center;
	}

	.text-color {
		color: ${colors.primary_text};
	}

	.host {
		width: 50%;
	}

	.guest {
		width: 50%;
	}

	.btn-section {
		text-align: center;
		margin-top: 50px;
	}

	.ready-btn {
		display: inline-block;
	}

	${pfpStyle(".profile-photo","145px","auto")}

	${pfpStyle(".default-photo","145px","auto")}

	.default-photo {
		margin-bottom: 20px;
	}

	.ready-btn {
		border-style: hidden;
		border-radius: 5px;
		background-color: ${colors.btn_default};
		color: ${colors.primary_text};
	}

	.ready-btn:hover {
		background-color: ${colors.btn_hover};
		color: ${colors.second_text};
	}

`;

const getHtml = function(data) {
	const html = `
		<div class="lobby">
			<div class="host">
				<!--<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri1" class="profile-photo" alt="avatar">-->
			</div>
			<div class="guest">
				<!--<img src="https://api.dicebear.com/8.x/bottts/svg?seed=dsilveri2" class="profile-photo" alt="avatar">-->
			</div>
		</div>

		<div class="btn-section">
			<button type="button" class="btn btn-primary ready-btn">ready</button>
		</div>
	`;
	return html;
}

export default class AppLobby extends HTMLElement {
	static observedAttributes = ["lobby-id", "is-tournament"];

	constructor() {
		super()
		this.data = {};
		this.intervalID = null;
		this.startGame = false;
	}

	connectedCallback() {
		this.#initComponent();
		this.#scripts();
	}

	disconnectedCallback() {
		if (this.intervalID)
			clearInterval(this.intervalID);
		if (!this.startGame) {
			gameWebSocket.close();
		}
		stateManager.cleanStateEvents("hasRefreshToken");
		stateManager.cleanStateEvents("gameSocket"); 
		stateManager.cleanStateEvents("lobbyStatus"); 
		stateManager.cleanStateEvents("hasLobbyEnded");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "lobby-id")
			name = "lobbyId";
		else if (name == "is-tournament")
			name = "isTournament";
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(), styles);

		this.readyBtn = this.html.querySelector(".ready-btn");
		this.lobbyStatus = null;
	}

	#scripts() {
		this.#openSocket();
		this.#setLobbyStatusEvent();
		this.#setReadyBtnEvent();
		if (!this.data.isTournament) {
			this.#setActiveInviteCheckEvent();
			this.#setLobbyEndedEvent();
		}
		this.#onRefreshTokenEvent();
		this.#onSocketCloseEvent();
	}

	#openSocket() {
		gameWebSocket.open(this.data.lobbyId);
	}

	#setLobbyStatusEvent() {
		stateManager.addEvent("lobbyStatus", (value) => {
			this.lobbyStatus = value;
			if (value.host)
				this.#updatePlayer(value.host, "host");
			if (value.guest)
				this.#updatePlayer(value.guest, "guest");
			if (!value.host)
				this.#removePlayer("host");
			if (!value.guest)
				this.#removePlayer("guest");
			if (value.host && value.guest) {
				if (value.host.is_ready && value.guest.is_ready) {
					if (this.data.isTournament)
						this.#startTournamentGame();
					else
						this.#startGame();
				}
			}
		});
	}

	#updatePlayer(playerInfo, playerType) {
		const playerImage = this.html.querySelector(`.${playerType}`);
		if (!playerImage)
			return ;
		playerImage.innerHTML = `
			<img src="${playerInfo.image}" class="profile-photo" alt="avatar">
			<div class=text-color>${playerInfo.username}</div>
			<div class=text-color>${playerInfo.is_ready ? "ready" : "not ready"}</div>
		`;

		if (playerInfo.id == stateManager.getState("userId"))
			this.readyBtn.innerHTML = `${playerInfo.is_ready ? "not ready" : "ready"}`;
	}

	#removePlayer(playerType) {
		const playerImage = this.html.querySelector(`.${playerType}`);
		if (!playerImage)
			return ;
		playerImage.innerHTML = `
			<img src="../img/default_profile.png" class="default-photo" alt="avatar">
			<div class="text-color">waiting...</div>
			`;
	}

	#setReadyBtnEvent() {
		this.readyBtn.addEventListener("click", () => {
			this.readyBtn.disabled = true;
			checkUserLoginState((state) => {
				if (state)
					gameWebSocket.updateReadyStatus();
				this.readyBtn.disabled = false;
			});
		});
	}

	#startGame() {
		const playersData = stateManager.getState("lobbyStatus");
		const contentElm = document.querySelector(".content");
		const lobbyId = this.data.lobbyId;
		this.startGame = true;
		this.remove();
		contentElm.innerHTML = `
		<app-play
			host-username="${playersData.host.username}"
			host-image="${playersData.host.image}"
			guest-username="${playersData.guest.username}"
			guest-image="${playersData.guest.image}"
			lobby-id="${lobbyId}"
			is-tournament="${this.data.isTournament}"
		></app-play>
		`;
	}

	#startTournamentGame() {
		const playersData = stateManager.getState("lobbyStatus");
		const contentElm = document.querySelector(".tourney-section");
		const lobbyId = this.data.lobbyId;
		this.startGame = true;
		this.remove();
		contentElm.innerHTML = `
		<app-play
			host-username="${playersData.host.username}"
			host-image="${playersData.host.image}"
			guest-username="${playersData.guest.username}"
			guest-image="${playersData.guest.image}"
			lobby-id="${lobbyId}"
			is-tournament="${this.data.isTournament}"
		></app-play>
		`;
	}

	#setLobbyEndedEvent() {
		stateManager.addEvent("hasLobbyEnded", (value) => {
			if (value) {
				stateManager.setState("hasLobbyEnded", false);
				redirect("/play");
				setTimeout( () => {
					stateManager.setState("errorMsg", "The lobby has ended");
				}, 100);
			}
		});
	}

	#setActiveInviteCheckEvent() {
		if (this.data.lobbyId == stateManager.getState("userId")) {
			this.intervalID = setInterval(() => {
				if (!stateManager.getState("isOnline"))
					return ;
				if (this.lobbyStatus && this.lobbyStatus.guest)
					return ;
				callAPI("GET", `/game/has-pending-game-requests/`, null, (res, data) => {
					if (res.ok) {
						if (!data.has_pending_game_requests) {
							clearInterval(this.intervalID);
							redirect("/play");
							setTimeout( () => {
								stateManager.setState("errorMsg", "All players have declined your invite");
							}, 100);
						}
					}
				});
			}, 5000);
		}
	}

	#onRefreshTokenEvent() {
		stateManager.addEvent("hasRefreshToken", (state) => {
			if (state) {
				gameWebSocket.refreshToken();
				gameWebSocket.close();
			}
		});
	}

	#onSocketCloseEvent() {
		stateManager.addEvent("gameSocket", (state) => {
			checkUserLoginState((state) => {
				if (state && !this.isGameFinished)
					this.#openSocket();
				updateLoggedInStatus(state);
			});
		});
	}
}

customElements.define("app-lobby", AppLobby);


/*
select * from game_games;
select * from tournament_tournamentrequests;
select * from tournament_tournamentplayers;
select * from tournament_tournament;


delete from game_games;
delete from tournament_tournamentrequests;
delete from tournament_tournamentplayers;
delete from tournament_tournament;

*/