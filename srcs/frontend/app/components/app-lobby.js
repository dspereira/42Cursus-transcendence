import { callAPI } from "../utils/callApiUtils.js";
import gameWebSocket from "../js/GameWebSocket.js";
import stateManager from "../js/StateManager.js";
import { redirect } from "../js/router.js";

const styles = `
	.lobby {
		display: flex;
		justify-content: center;
		text-align: center;
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

	.profile-photo {
		width: 145px;
		height: auto;
		clip-path:circle();
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
	static observedAttributes = ["lobby-id", "player-type"];

	constructor() {
		super()
		this.data = {};
		this.intervalID = null;
		this.startGame = false;
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
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
		if (name == "player-type")
			name = "playerType"
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
		this.readyBtn = this.html.querySelector(".ready-btn");
		this.lobbyStatus = null;
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
		this.#openSocket();
		this.#setLobbyStatusEvent();
		this.#setReadyBtnEvent();
		this.#setActiveInviteCheckEvent();
		this.#setLobbyEndedEvent();
		this.#onRefreshTokenEvent();
		this.#onSocketCloseEvent();
	}

	#openSocket() {
		gameWebSocket.open(this.data.lobbyId);
	}

	#setLobbyStatusEvent() {
		stateManager.addEvent("lobbyStatus", (value) => {
			console.log(value);

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
				if (value.host.is_ready && value.guest.is_ready)
					this.#startGame();
			}
		});
	}

	#updatePlayer(playerinfo, playerType) {
		const playerImage = this.html.querySelector(`.${playerType}`);
		if (!playerImage)
			return ;
		playerImage.innerHTML = `
			<img src="${playerinfo.image}" class="profile-photo" alt="avatar">
			<div>${playerinfo.username}</div>
			<div>${playerinfo.is_ready ? "ready" : "not ready"}</div>
		`;

		if (playerType == this.data.playerType)
			this.readyBtn.innerHTML = `${playerinfo.is_ready ? "not ready" : "ready"}`;
	}

	#removePlayer(playerType) {
		const playerImage = this.html.querySelector(`.${playerType}`);
		if (!playerImage)
			return ;
		playerImage.innerHTML = "";
	}

	#setReadyBtnEvent() {
		this.readyBtn.addEventListener("click", () => {
			gameWebSocket.updateReadyStatus();
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
		></app-play>
		`;
	}

	#setLobbyEndedEvent() {
		stateManager.addEvent("hasLobbyEnded", (value) => {
			if (value) {
				stateManager.setState("hasLobbyEnded", false);
				redirect("/play");
			}
		});
	}

	#setActiveInviteCheckEvent() {
		if (this.data.playerType == "host") {
			this.intervalID = setInterval(() => {
				if (this.lobbyStatus && this.lobbyStatus.guest)
					return ;
				callAPI("GET", `http://127.0.0.1:8000/api/game/has-pending-game-requests/`, null, (res, data) => {
					console.log(data.has_pending_game_requests);
					if (res.ok) {
						if (!data.has_pending_game_requests) {
							clearInterval(this.intervalID);
							redirect("/play");
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
			if (state == "closed")
				this.#openSocket();
		});
	}
}

customElements.define("app-lobby", AppLobby);
