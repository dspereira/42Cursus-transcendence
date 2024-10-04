import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { colors } from "../js/globalStyles.js";
import { charLimiter } from "../utils/characterLimit.js";
import charLimit from "../utils/characterLimit.js";
import { pfpStyle } from "../utils/stylingFunctions.js";
import { redirect } from "../js/router.js";

const styles = `

.players, .buttons, .border-separation, .tournament-name-update{
	min-width: 460px;
}

.players {
	justify-content: space-between;
	flex-wrap: wrap;
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: row;
	border-radius: 10px;
	border: 2px solid #495057;
}

.player {
	display: flex;
	flex: 1 1 15%;
	max-width: 300px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	color: ${colors.second_text};
	padding: 10px 30px 10px 30px;
}

 .img-container {
	display: flex;
	justify-content: center;
 }

.profile-photo {
	width: 120px;
	width: 50%;
	height: auto;
	clip-path:circle();
}

${pfpStyle(".profile-photo","50%","auto")}

${pfpStyle(".default-photo","50%","auto")}


.default-photo {
	background-color: ${colors.second_card};
	border-radius: 50%;
}

.buttons {
	width: 100%;
	display: flex;
	justify-content: center;
	gap: 30px;
	margin-top: 25px;
}

.btn-start:disabled {
	background-color: ${colors.second_card};
	cursor: not-allowed;
}

.btn-success, .btn-cancel {
	width: 120px;
}

.border-separation {
	width: 60%;
	margin: 0 auto;
	margin-top: 40px;
	margin-bottom: 40px;
	border-bottom: 3px solid ${colors.second_card};
}

.hiden {
	display: none;
}

.input-container {
	width: 100%;
}

.form-control {
	border-radius: 5px;
	border-style: hidden;
	color:  ${colors.second_text};
	background-color: ${colors.input_background};
}

.form-control::placeholder {
	color: ${colors.second_text};
}

.form-control:focus {
	color:  ${colors.second_text};
	background-color: ${colors.input_background};
}

.tournament-name-update {
	display: flex;
	justify-content: space-between;
	width: 100%;
	gap: 20px;
	flex-direction: row;
	margin-bottom: 20px;
}

.btn {
	width: 125px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-style: hidden;
	border-radius: 5px;
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
}

.btn:hover, .btn:active, #button:active {
	background-color: ${colors.btn_hover};
	color: ${colors.hover_text};
}

@media (max-width: 800px) {
	.player {
		flex: 1 1 48%;
	}

	.img-container {
		width: 140px;
	}
}

.lobby-container {
	height: 85vh;
}

.alert-div {
	display: flex;
	width: 100%;
	animation: disappear linear 10s forwards;
	background-color: #FF6B6B;
	color: ${colors.primary_text};
	padding-left: 5%;
	font-weight: bold;
}

.alert-bar {
	width: 90%;
	height: 5px;
	border-style: hidden;
	border-radius: 2px;
	background-color: ${colors.second_card};
	position: absolute;
	bottom: 2px;
	left: 5%;
	animation: expire linear 10s forwards;
}

@keyframes expire {
	from {
		width: 90%;
	}
	to {
		width: 0%;
	}
}

@keyframes disappear {
	0% {
		visibility: visible;
		opacity: 1;
	}
	99% {
		visibility: visible;
		opacity: 1;
	}
	100% {
		visibility: hidden;
		opacity: 0;
		display: none;
	}
}

.clickable {
	cursor: pointer;
}

.hover-popup {
	position: fixed;
	padding: 10px;
	background-color: ${colors.main_card};
	color: ${colors.primary_text};
	opacity: 0.9;
	backdrop-filter: blur(5px);
	border-radius: 5px;
	white-space: nowrap;
	display: none;
	pointer-events: none;
	z-index: 1000;

}
`;

const getHtml = function(data) {
	const tournamentInviterHtml = `<div class="border-separation"></div>
	<tourney-inviter tournament-id="${data.tournamentId}"></tourney-inviter>`;

	const ownerBtns = `<button id="button" type="button" class="btn btn-success btn-start">Start</button>
			<button id="button" type="button" class="btn btn-danger btn-cancel">Cancel</button>`;
	
	const guestBtns = `<button id="button" type="button" class="btn btn-danger btn-leave">Leave</button>`;

	const updateNameForm = `<div class="form-group tournament-name-update">
		<div class="input-container">
			<input type="text" class="form-control form-control-md name-input" value="${data.tournamentName}" placeholder="Tournament Name" maxlength="50">
		</div>
		<div class="button-container">
			<button id="button" type="button" class="btn btn-primary btn-update">Update Name</button>
		</div>
	</div>`;

	const html = `
	${data.isOwner ? updateNameForm : ""}
	<div class=lobby-container>
		<div class="players">
			<div class="player">
				<div class="img-container"><img src="../img/default_profile.png" class="default-photo clickable" alt="avatar"></div>
				<div id="hover-popup" class="hover-popup"></div>
				<div class="username">waiting...</div>
				<div class="player-id hiden">0</div>
			</div>
			<div class="player">
				<div class="img-container"><img src="../img/default_profile.png" class="default-photo clickable" alt="avatar"></div>
				<div id="hover-popup" class="hover-popup"></div>
				<div class="username">waiting...</div>
				<div class="player-id hiden">0</div>
			</div>
			<div class="player">
				<div class="img-container"><img src="../img/default_profile.png" class="default-photo clickable" alt="avatar"></div>
				<div id="hover-popup" class="hover-popup"></div>
				<div class="username">waiting...</div>
				<div class="player-id hiden">0</div>
			</div>
			<div class="player">
				<div class="img-container"><img src="../img/default_profile.png" class="default-photo clickable" alt="avatar"></div>
				<div id="hover-popup" class="hover-popup"></div>
				<div class="username">waiting...</div>
				<div class="player-id hiden">0</div>
			</div>
		</div>
		<div class="buttons">
			${data.isOwner ? ownerBtns : guestBtns}
		</div>
		${data.isOwner ? tournamentInviterHtml : ""}
	</div>
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
		this.joinedPlayersNbr = null;
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
		this.#setLeaveTournamentEvent();
		this.#setStartTournamentEvent();
		this.#updateTournamentNameBtn();
		this.#errorMsgEvents();
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
		elmHtml.querySelector(".username").innerHTML = charLimiter(playerData.username, charLimit);
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
						this.#addProfileRedirect(elmHtml, elm);
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
					this.joinedPlayersNbr = data.players.length;
				}
			}
		});
	}

	#getTournamentStatusCall() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/active-tournament/`, null, (res, data) => {
			if (res.ok) {
				if (data) {
					if (!data.tournament || data.tournament.status == "active")
						stateManager.setState("isTournamentChanged", true);
				}
			}
		});
	}

	#joinedPlayersPolling() {
		this.intervalID = setInterval(() => {
			this.#joinedPlayersCall();
			if (!this.data.isOwner)
				this.#getTournamentStatusCall();
			else {
				const btn = this.html.querySelector(".btn-start");
				if (btn)
					btn.disabled = !(this.joinedPlayersNbr == 4);
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
				else
					stateManager.setState("errorMsg", "Couldn't cancel tournament");
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
				else
					stateManager.setState("errorMsg", "Couldn't leave tournament");
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
				else
					stateManager.setState("errorMsg", "Tournament couldn't be started");
			});
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
			callAPI("PATCH", `http://127.0.0.1:8000/api/tournament/`, {id: this.data.tournamentId, new_name: name}, (res, data) => {
				console.log(res);
				console.log(data);
				
				if (res.status == 409)
				{
					nameInput.value = data.tournament_name;
					stateManager.setState("errorMsg", "Couldn't change tournament name");
				}
				btn.disabled = false;
			});
		});
	}

	#toggleStartButton(disabledValue) {
		const btn = this.html.querySelector(".btn-start");
		if (!btn)
			return ;
		btn.disabled = disabledValue;
	}

	#errorMsgEvents() {
		stateManager.addEvent("errorMsg", (msg) => {
			if (msg) {
				console.log(msg);
				stateManager.setState("errorMsg", null);
				const alertBefore  = this.html.querySelector(".alert");
				if (alertBefore)
					alertBefore.remove();
				const insertElement = this.html.querySelector(".tournament-name-update");
				var alertCard = document.createElement("div");
				alertCard.className = "alert alert-danger hide from alert-div";
				alertCard.role = "alert";
				alertCard.innerHTML = `
						${msg}
						<div class=alert-bar></div>
					`;
				this.html.insertBefore(alertCard, insertElement);
			}
		});
	}

	#addProfileRedirect(elmHtml, playerData) {
		const movePopup = (event) => {
			popup.style.left = event.clientX + 'px';
			popup.style.top = event.clientY + 'px';
		};
		const profilePhoto = elmHtml.querySelector(".profile-photo");
		const popup = elmHtml.querySelector('.hover-popup');
		popup.innerHTML = `${playerData.username}'s profile`;
		profilePhoto.addEventListener("click", () => {
			redirect(`profile/${playerData.username}`)
		});
		profilePhoto.addEventListener('mouseenter', () => {
			popup.style.display = 'block'
			profilePhoto.addEventListener('mousemove', movePopup);
		});
		profilePhoto.addEventListener('mouseleave', () => {
			popup.style.display = 'none'
			profilePhoto.removeEventListener('mousemove', movePopup);
		});
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
