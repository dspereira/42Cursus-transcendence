import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `
.players {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.player {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
}

.profile-photo {
	width: 120px;
	height: auto;
	clip-path:circle();
}

.default-photo {
	width: 120px;
	height: auto;
	background-color: #7D8ABC;
	border: 5px solid #7D8ABC;
	border-radius: 50%;
	clip-path:circle();
}

.buttons {
	display: flex;
	justify-content: center;
	gap: 30px;
	margin-top: 50px;
}

.btn-success, .btn-cancel {
	width: 120px;
}

.border-separation {
	width: 60%;
	margin: 0 auto;
	margin-top: 50px;
	margin-bottom: 50px;
	border-bottom: 3px solid #EEEDEB;
}
`;

const getHtml = function(data) {
	const html = `
		<div class="players">
			<div class="player empty">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div class="username">waiting...</div>
				<div class="player-id"></div>
			</div>
			<div class="player empty">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div class="username">waiting...</div>
				<div class="player-id"></div>
			</div>
			<div class="player empty">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div class="username">waiting...</div>
				<div class="player-id"></div>
			</div>
			<div class="player empty">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div class="username">waiting...</div>
				<div class="player-id"></div>
			</div>
		</div>
		<div class="buttons">
			<button type="button" class="btn btn-success btn-success">Start</button>
			<button type="button" class="btn btn-danger btn-cancel">Cancel</button>
		</div>
		<div class="border-separation"></div>

		<tourney-inviter
			tournament-id="${data.tournamentId}"
		></tourney-inviter>
	`;
	return html;
}

export default class TourneyLobby extends HTMLElement {
	static observedAttributes = ["tournament-id", "owner-id"];

	constructor() {
		super()
		this.data = {};
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
		else if (name == "owner-id")
			name = "ownerId";
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
		this.#joinedPlayersCall();
		this.#joinedPlayersPolling();
		this.#setCancelTournamentEvent();
	}

	#isFriendExistsInList(list, playerId) {
		list.forEach((elm) => {
			if (elm.id == playerId)
				return true;
		});
		return false;
	}

	#isFriendExistsInNodeList(list, playerId) {
		list.forEach((elm) => {
			if (elm.querySelector(".player-id").innerHTML == playerId)
				return true;
		});
		return false;
	}

	#setDefaultPhoto(elmHtml) {
		let img = elmHtml.querySelector("img");
		img.setAttribute("src", "../img/default_profile.png");
		img.classList.remove("profile-photo");
		img.classList.add("default-photo");
		elmHtml.querySelector(".username").innerHTML = "waiting...";
		elmHtml.querySelector(".player-id").innerHTML = "";

	}

	#setProfilePhoto(elmHtml, playerData) {
		let img = elmHtml.querySelector("img");
		img.setAttribute("src", playerData.image);
		img.classList.remove("default-photo");
		img.classList.add("profile-photo");
		elmHtml.querySelector(".username").innerHTML = playerData.username;
		elmHtml.querySelector(".player-id").innerHTML = `${playerData.id}`;
	}

	#updatePlayers(players) {
		const playersNodeList = this.html.querySelectorAll(".player");
		if (!playersNodeList)
			return ;
		let playerId = null;
		// if player left the tournament remove from the list
		playersNodeList.forEach((elmHtml) => {
			playerId = elmHtml.querySelector(".player-id").innerHTML;
			if (playerId && !this.#isFriendExistsInList(players, playerId)) {
				this.#setDefaultPhoto(elmHtml);
			}
		});

		// if player join to tournament add to list
		players.forEach((elm) => {
			if (!this.#isFriendExistsInNodeList(playersNodeList, elm.id)) {
				for (let i = 0; i < playersNodeList.length; i++) {
					const playerId = playersNodeList[i].querySelector(".player-id").innerHTML;
					if (!playerId) {
						this.#setProfilePhoto(playersNodeList[i], elm);
						break ;
					}
				}
			}
		});
	}

	#joinedPlayersCall() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/players?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok) {
				if (data.players)
					this.#updatePlayers(data.players);
			}
		});
	}

	#joinedPlayersPolling() {
		this.intervalID = setInterval(() => {
			this.#joinedPlayersCall();
		}, 5000);
	}

	#setCancelTournamentEvent() {
		const btn = this.html.querySelector(".btn-cancel");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {

			console.log("cancel btn");

			callAPI("DELETE", `http://127.0.0.1:8000/api/tournament/?id=${this.data.tournamentId}`, null, (res, data) => {
				if (res.ok) {

					console.log("cancel pedido");
					stateManager.setState("tournamentAborted", true);
				}
			});			
		});
	}
}

customElements.define("tourney-lobby", TourneyLobby);
