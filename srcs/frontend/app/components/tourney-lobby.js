import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { getCsrfToken } from "../utils/csrfTokenUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";

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
	<tourney-inviter tournament-id="${data.tournamentId}"></tourney-inviter>`;

	const ownerBtns = `<button type="button" class="btn btn-success btn-start">Start</button>
			<button type="button" class="btn btn-danger btn-cancel">Cancel</button>`;
	
	const guestBtns = `<button type="button" class="btn btn-danger btn-leave">Leave</button>`;

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
	static observedAttributes = ["tournament-id", "owner-id", "tournament-name"];

	constructor() {
		super()
		this.data = {};
		this.intervalID = null;
		this.isOwner = false;
	}

	connectedCallback() {
		this.#initComponent();
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
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		this.#toggleStartButton(true);
		this.#joinedPlayersCall();
		this.#joinedPlayersPolling();
		this.#setCancelTournamentEvent();
		this.#setLeaveTournamentEvent();
		this.#setStartTournamentEvent();
		this.#updateTournamentNameBtn();
		this.#inputNameEvent();
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
		callAPI("GET", `/tournament/players/?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok) {
				if (data.players) {
					if (data.players.length == 4)
						this.#toggleStartButton(false);
					else
						this.#toggleStartButton(true);
					this.#updatePlayers(data.players);
				}
			}
		});
	}

	#getTournamentStatusCall() {
		callAPI("GET", `/tournament/active-tournament/`, null, (res, data) => {
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
			if (!stateManager.getState("isOnline"))
				return ;
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
			btn.disabled = true;
			callAPI("DELETE", `/tournament/?id=${this.data.tournamentId}`, null, (res, data) => {
				if (res.ok)
					stateManager.setState("isTournamentChanged", true);
				btn.disabled = false;
			}, null, getCsrfToken());			
		});
	}

	#setLeaveTournamentEvent() {
		if (this.data.isOwner)
			return ;
		const btn = this.html.querySelector(".btn-leave");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			btn.disabled = true;
			callAPI("DELETE", `/tournament/players/?id=${this.data.tournamentId}`, null, (res, data) => {
				if (res.ok) {
					stateManager.setState("tournamentId", null);
					stateManager.setState("isTournamentChanged", true);
				}
				btn.disabled = false;
			}, null, getCsrfToken());	
		});
	}

	#setStartTournamentEvent() {
		if (!this.data.isOwner)
			return ;
		const btn = this.html.querySelector(".btn-start");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			this.#toggleStartButton(true);
			callAPI("POST", `/tournament/start/`, {id: this.data.tournamentId}, (res, data) => {
				if (res.ok)
					stateManager.setState("isTournamentChanged", true);
				else
					this.#toggleStartButton(false);
			}, null, getCsrfToken());
		});
	}

	#updateTournamentNameBtn() {
		const btn = this.html.querySelector(".btn-update");
		const nameInput = this.html.querySelector(".name-input");
		if(!btn || !nameInput)
			return ;

		btn.addEventListener("click", () => {
			btn.disabled = true;
			const name = nameInput.value.trim();
			callAPI("PATCH", `/tournament/`, {id: this.data.tournamentId, new_name: name}, (res, data) => {
				if (res.status == 409)
					nameInput.value = data.tournament_name;
				btn.disabled = false;
			}, null, getCsrfToken());
		});
	}

	#toggleStartButton(disabledValue) {
		const btn = this.html.querySelector(".btn-start");
		if (!btn)
			return ;
		btn.disabled = disabledValue;
	}


	#inputNameEvent() {
		const inp = this.html.querySelector(".name-input");
		const btn = this.html.querySelector(".btn-update");
		
		if (!inp || !btn)
			return ;
		inp.addEventListener("input", () => {
			if (inp.value)
				btn.disabled = false;
			else
				btn.disabled = true;
		});
	}
}

customElements.define("tourney-lobby", TourneyLobby);
