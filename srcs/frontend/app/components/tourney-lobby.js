import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { enTourneyLobbyDict } from "../lang-dicts/enLangDict.js";
import { ptTourneyLobbyDict } from "../lang-dicts/ptLangDict.js";
import { esTourneyLobbyDict } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

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

.tournament-name-update {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
	width: 100%;
	margin-bottom: 50px;
}

.input-container {
	width: 80%;
}

.button-container {
	width: 20%;
}

.btn-update {
	width: 100%;
}

.hiden {
	display: none;
}
`;

const getHtml = function(data) {
	const tournamentInviterHtml = `<div class="border-separation"></div>
	<tourney-inviter tournament-id="${data.tournamentId}" language="${data.language}"></tourney-inviter>`;

	const ownerBtns = `<button type="button" class="btn btn-success btn-start">${data.langDict.start_button}</button>
			<button type="button" class="btn btn-danger btn-cancel">${data.langDict.cancel_button}</button>`;
	
	const guestBtns = `<button type="button" class="btn btn-danger btn-leave">${data.langDict.leave_button}</button>`;

	const updateNameForm = `<div class="form-group tournament-name-update">
		<div class="input-container">
			<input type="text" class="form-control form-control-md name-input" value="${data.tournamentName}" placeholder="Tournament Name" maxlength="50">
		</div>
		<div class="button-container">
			<button type="button" class="btn btn-primary btn-update">Update Name</button>
		</div>
	</div>`;

	const html = `
	${data.isOwner ? updateNameForm : ""}
	<div class="players">
		<div class="player">
			<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
			<div class="username">waiting...</div>
			<div class="player-id hiden">0</div>
		</div>
		<div class="player">
			<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
			<div class="username">waiting...</div>
			<div class="player-id hiden">0</div>
		</div>
		<div class="player">
			<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
			<div class="username">waiting...</div>
			<div class="player-id hiden">0</div>
		</div>
		<div class="player">
			<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
			<div class="username">waiting...</div>
			<div class="player-id hiden">0</div>
		</div>
	</div>
	<div class="buttons">
		${data.isOwner ? ownerBtns : guestBtns}
	</div>
	${data.isOwner ? tournamentInviterHtml : ""}
	`;
	return html;
}

export default class TourneyLobby extends HTMLElement {
	static observedAttributes = ["tournament-id", "owner-id", "tournament-name", "language"];

	constructor() {
		super()
		this.data = {};
		this.intervalID = null;
		this.isOwner = false;
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
		else if (name == "tournament-name")
			name = "tournamentName";
		else if (name == "owner-id") {
			name = "ownerId";
			this.data.isOwner = stateManager.getState("userId") == newValue;
		}
		else if (name == "language") {
			this.data.langDict = getLanguageDict(newValue, enTourneyLobbyDict, ptTourneyLobbyDict, esTourneyLobbyDict);
		}
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
		console.log("arroz doce:", this.data);
		this.#joinedPlayersCall();
		this.#joinedPlayersPolling();
		this.#setCancelTournamentEvent();
		this.#setLeaveTournamentEvent();
		this.#setStartTournamentEvent();
		this.#updateTournamentNameBtn();
	}

	#isFriendExistsInList(list, playerId) {
		let stop = false;
		let exists = false;
		list.forEach((elm) => {
			if (stop)
				return ;
			if (elm.id == playerId) {
				exists = true;
				stop = true;
			}
		});
		return exists;
	}

	#isFriendExistsInNodeList(list, playerId) {
		let stop = false;
		let exists = false;
		list.forEach((elm) => {
			if (stop)
				return ;
			if (elm.querySelector(".player-id").innerHTML == playerId) {
				exists = true;
				stop = true;
			}
		});
		return exists;
	}

	#setDefaultPhoto(elmHtml) {
		let img = elmHtml.querySelector("img");
		img.setAttribute("src", "../img/default_profile.png");
		img.classList.remove("profile-photo");
		img.classList.add("default-photo");
		elmHtml.querySelector(".username").innerHTML = `${this.data.langDict.player_username_placeholder}`;
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
			if (playerId && !this.#isFriendExistsInList(players, playerId))
				this.#setDefaultPhoto(elmHtml);
		});

		// if player join to tournament add to list
		players.forEach((elm) => {
			if (!this.#isFriendExistsInNodeList(playersNodeList, elm.id)) {
				let stop = false;
				playersNodeList.forEach((elmHtml) => {
					if (stop)
						return ;
					const playerId = elmHtml.querySelector(".player-id").innerHTML;
					if (!playerId) {
						this.#setProfilePhoto(elmHtml, elm);
						stop = true;
					}
				});
			}
		});
	}

	#joinedPlayersCall() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/players/?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok) {
				if (data.players) {
					this.#updatePlayers(data.players);
				}
			}
		});
	}

	#getTournamentStatusCall() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/active-tournament/`, null, (res, data) => {
			if (res.ok) {
				if (data) {
					if (!data.tournament)
						stateManager.setState("isTournamentChanged", true);
					else if (data.tournament.status == "active")
						stateManager.setState("isTournamentChanged", true);
				}
			}
		});
	}

	#joinedPlayersPolling() {
		this.intervalID = setInterval(() => {
			this.#joinedPlayersCall();
			if (!this.data.isOwner) {
				this.#getTournamentStatusCall();
			}
		}, 5000);
	}

	#setCancelTournamentEvent() {
		const btn = this.html.querySelector(".btn-cancel");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			callAPI("DELETE", `http://127.0.0.1:8000/api/tournament/?id=${this.data.tournamentId}`, null, (res, data) => {
				if (res.ok)
					stateManager.setState("isTournamentChanged", true);
			});			
		});
	}

	#setLeaveTournamentEvent() {
		if (this.data.isOwner)
			return ;
		const btn = this.html.querySelector(".btn-leave");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			callAPI("DELETE", `http://127.0.0.1:8000/api/tournament/players/?id=${this.data.tournamentId}`, null, (res, data) => {
				if (res.ok)
					stateManager.setState("isTournamentChanged", true);
			});	
		});
	}

	#setStartTournamentEvent() {
		if (!this.data.isOwner)
			return ;
		const btn = this.html.querySelector(".btn-start");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			callAPI("POST", `http://127.0.0.1:8000/api/tournament/start/`, {id: this.data.tournamentId}, (res, data) => {
				if (res.ok)
					stateManager.setState("isTournamentChanged", true);	
			});
		});
	}

	#updateTournamentNameBtn() {
		const btn = this.html.querySelector(".btn-update");
		const nameInput = this.html.querySelector(".name-input");
		if(!btn || !nameInput)
			return ;

		btn.addEventListener("click", () => {
			const name = nameInput.value.trim();
			callAPI("PATCH", `http://127.0.0.1:8000/api/tournament/`, {id: this.data.tournamentId, new_name: name}, (res, data) => {
				console.log(res);
				console.log(data);
				
				if (res.status == 409)
					nameInput.value = data.tournament_name;	
			});
		});
	}
}

customElements.define("tourney-lobby", TourneyLobby);
