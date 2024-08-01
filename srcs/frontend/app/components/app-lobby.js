import { callAPI } from "../utils/callApiUtils.js";
import gameWebSocket from "../js/GameWebSocket.js";
import stateManager from "../js/StateManager.js";

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
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
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
	}

	#openSocket() {
		gameWebSocket.open(this.data.lobbyId);
	}

	#setLobbyStatusEvent() {
		stateManager.addEvent("lobbyStatus", (value) => {
			console.log(value);

			if (value.host)
				this.#updatePlayer(value.host, "host");
			if (value.guest)
				this.#updatePlayer(value.guest, "guest");
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

	#setReadyBtnEvent() {
		this.readyBtn.addEventListener("click", () => {
			gameWebSocket.updateReadyStatus();
		});
	}
}

customElements.define("app-lobby", AppLobby);
