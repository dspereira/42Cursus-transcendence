import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { colors } from "../js/globalStyles.js";
import { charLimiter } from "../utils/characterLimit.js";
import charLimit from "../utils/characterLimit.js";
import { pfpStyle } from "../utils/stylingFunctions.js";
import { redirect } from "../js/router.js";
import friendProfileRedirectionEvent from "../utils/profileRedirectionUtils.js";
import { getCsrfToken } from "../utils/csrfTokenUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";
import { enTourneyLobbyDict } from "../lang-dicts/enLangDict.js";
import { ptTourneyLobbyDict } from "../lang-dicts/ptLangDict.js";
import { esTourneyLobbyDict } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

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
	width: 100%;
	display: flex;
	justify-content: center;
 }

${pfpStyle(".profile-photo","50%")}

${pfpStyle(".default-photo","50%")}

.profile-photo, .default-photo {
	min-width: 75px;
	min-height: 75px;
}

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
	margin: 30px auto;
	width: 80%;
	animation: disappear linear 5s forwards;
	background-color: ${colors.alert};
	z-index: 1001;
}

.alert-bar {
	width: 95%;
	height: 5px;
	border-style: hidden;
	border-radius: 2px;
	background-color: ${colors.alert_bar};
	position: absolute;
	bottom: 2px;
	animation: expire linear 5s forwards;
}

@keyframes expire {
	from {
		width: 95%;
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
	<tourney-inviter tournament-id="${data.tournamentId}" language="${data.language}"></tourney-inviter>`;

	const ownerBtns = `<button id="button" type="button" class="btn btn-success btn-start">${data.langDict.start_button}</button>
			<button id="button" type="button" class="btn btn-danger btn-cancel">${data.langDict.cancel_button}</button>`;
	
	const guestBtns = `<button id="button" type="button" class="btn btn-danger btn-leave">${data.langDict.leave_button}</button>`;

	const updateNameForm = `<div class="form-group tournament-name-update">
		<div class="input-container">
			<input type="text" class="form-control form-control-md name-input" value="${data.tournamentName}" placeholder="Tournament Name" maxlength="50">
		</div>
		<div class="button-container">
			<button id="button" type="button" class="btn btn-primary btn-update">${data.langDict.update_name_button}</button>
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
	static observedAttributes = ["tournament-id", "owner-id", "tournament-name", "language"];

	constructor() {
		super()
		this.data = {};
		this.intervalID = null;
		this.isOwner = false;
		this.joinedPlayersNbr = null;
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
		else if (name == "language") {
			this.data.langDict = getLanguageDict(newValue, enTourneyLobbyDict, ptTourneyLobbyDict, esTourneyLobbyDict);
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
		elmHtml.querySelector(".username").innerHTML = `${this.data.langDict.player_username_placeholder}`;
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
		callAPI("GET", `/tournament/players/?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok) {
				if (data.players) {
					this.#updatePlayers(data.players);
					this.joinedPlayersNbr = data.players.length;
				}
			}
		});
	}

	#getTournamentStatusCall() {
		callAPI("GET", `/tournament/active-tournament/`, null, (res, data) => {
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
			if (!stateManager.getState("isOnline"))
				return ;
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
			btn.disabled = true;
			callAPI("DELETE", `/tournament/?id=${this.data.tournamentId}`, null, (res, data) => {
				if (res.ok)
					stateManager.setState("isTournamentChanged", true);
				else
					stateManager.setState("errorMsg", `${data.langDict.error_msg1}`);
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
				else
					stateManager.setState("errorMsg", `${data.langDict.error_msg2}`);
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
				{
					stateManager.setState("errorMsg", `${data.langDict.error_msg3}`);
					this.#toggleStartButton(false);
				}
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
				{
					nameInput.value = data.tournament_name;
					stateManager.setState("errorMsg", `${data.langDict.error_msg4}`);
				}
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

	#errorMsgEvents() {
		stateManager.addEvent("errorMsg", (msg) => {
			if (msg) {
				stateManager.setState("errorMsg", null);
				const alertBefore  = this.html.querySelector(".alert");
				if (alertBefore)
					alertBefore.remove();
				const insertElement = this.html.querySelector(".tournament-name-update");
				if (!insertElement)
					return ;
				let alertCard = document.createElement("div");
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
		if (!profilePhoto || !popup)
			return ;
		friendProfileRedirectionEvent(elmHtml, ".profile-photo", playerData.id);
		// profilePhoto.addEventListener("click", () => {
		// 	redirect(`profile/${playerData.username}`)
		// });
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
