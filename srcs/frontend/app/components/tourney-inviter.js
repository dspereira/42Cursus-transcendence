import { callAPI } from "../utils/callApiUtils.js";
import { colors } from "../js/globalStyles.js";
import { charLimiter } from "../utils/characterLimit.js";
import charLimit from "../utils/characterLimit.js";
import { getCsrfToken } from "../utils/csrfTokenUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `

game-invite-card1 {
	max-height: 150px;
}

.invites-section {
	max-height: calc(100vh - 500px);
	height: calc(100vh - 500px);
	min-height: 240px;
	display: flex;
	width: 100%;
	gap: 10px;
	margin-bottom: 20px;
}

.friend-list {
	display: flex;
	flex-direction: column;
	width: 80%;
	min-width: 250px;
	background-color: ${colors.second_card};
	border-radius: 5px;
	padding-bottom: 20px;
}

.invites-send-container {
	min-width: 200px;
	max-width: 300px;
	display: flex;
	flex-direction: column;
	position: relative;
	align-items: center;
	width: 30%;
	background-color: ${colors.second_card};
	border-radius: 5px;
}

.invites-send {
	align-items: center;
	width: 100%;
	padding: 0px 20px 20px 20px;
	overflow-y: auto;
	margin-bottom: 70px;
	border-radius: 5px;
}

.friends {
	padding: 0px 20px 0px 20px;
	display: flex;
	flex-wrap: wrap;
	gap: 30px;
	justify-content: center;
	overflow-y: auto;
	align-items: center;
}

@media (max-width: 800px) {
	.invites-section {
		max-height: calc(100vh - 550px);
	}
}

.friends::-webkit-scrollbar-track, .invites-send::-webkit-scrollbar-track {
	background: ${colors.second_card};
}

.friends::-webkit-scrollbar-thumb, .invites-send::-webkit-scrollbar-thumb {
	background: ${colors.main_card};
	border-radius: 10px;
	border-style: hidden;
	border: 3px solid transparent;
	background-clip: content-box;
}

.players-invited {
	margin-top: 20px;
	color: ${colors.second_text};
}

.separator {
	display: flex;
	width: 80%;
	height: 5px;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
	margin: 10px 0px 10px 0px;
	background-color: ${colors.main_card};
}

.search-bar-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
	margin: 20px;
}

.refresh-icon {
	font-size: 22px;
	cursor: pointer;
	color: ${colors.second_text};
}

.search-bar input {
	padding-left: 40px;
}

.search-bar {
	width: 83%;
}

.search-icon {
	position: absolute;
	margin-top: 6px;
	margin-left: 15px;
	font-size: 16px;
	color: ${colors.second_text};
}

.search-bar input, .search-bar input:hover, .search-bar input:focus{
	padding-left: 40px;
	color:  ${colors.second_text};
}

.form-control {
	border-radius: 5px;
	border-style: hidden;
	background-color: ${colors.input_background};
}

.form-control::placeholder {
	color: ${colors.second_text};
}

.form-control:focus {
	background-color: ${colors.input_background};
}

.player-invite-send {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	background-color: ${colors.third_card};
	padding: 0px 10px 0px 0px;
	border-radius: 5px;
	border-style: hidden;
	color: ${colors.second_text};
}

.invite-sep {
	display: flex;
	width: 100%;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 0px 10px 0px 10px;
}

.player-invite-send span {
	font-size: 20px;
	font-weight: bold;
}

.cross-icon {
	color: ${colors.btn_alert};
	font-size: 24px;
	cursor: pointer;
}

.cross-icon:hover {
	color: ${colors.btn_alert_hvr};
}

.btn-danger:hover {
	color: ${colors.second_text};
}

.invite-btn.btn-primary:not(disabled) {
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
}

.invite-btn.btn-primary:not(:disabled):hover {
	background-color: ${colors.btn_hover};
	color: ${colors.second_text};
}

.invite-btn.btn-primary:disabled {
	background-color: ${colors.main_card};
	cursor: not-allowed;
	border-style: hidden;
}

.btn-invite {
	display: flex;
	justify-content: center;
	position: absolute;
	bottom: 20px;
	width: 80%;
	height: 40px;
	align-items: center;
	left: 50%;
	transform: translateX(-50%);
	border-style: hidden;
	border-radius: 5px;
}

.btn-invite:hover {
	color: ${colors.second_text};
}

.no-friends-text {
	color: ${colors.second_text};
}

.refresh-btn {
    all: unset;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
}

`;

const getHtml = function(data) {
	const html = `
		<div class="invites-section">
			<div class="friend-list">
				<div class="search-bar-section">
					<div class="search-bar">
						<div class="form-group">
							<i class="search-icon bi bi-search"></i>
							<input type="text" class="form-control form-control-md" id="search" placeholder="Search friends..." maxlength="50">
						</div>
					</div>
					<button class="refresh-btn"><i class="bi bi-arrow-clockwise refresh-icon"></i></button>
				</div>
				<div class="friends"></div>
			</div>
			<div class="invites-send-container">
				<div class=players-invited>players invited</div>
				<div class=separator></div>
				<div class="invites-send"></div>
				<button type="button" class="btn-primary btn-invite invite-btn">Invite</button>
			</div>
		</div>
	`;
	return html;
}

export default class TourneyInviter extends HTMLElement {
	static observedAttributes = ["tournament-id"];

	constructor() {
		super()
		this.data = {};
		this.selectedElm = [];
		this.intervalID = null;
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
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);

		this.inviteBtn = this.html.querySelector(".btn-invite");
		this.refreshBtn = this.html.querySelector(".refresh-btn");
	}

	#scripts() {
		this.#setFriendsSearchEvent();
		this.#getFriendsCallApi();
		this.#setBtnInviteEvent();
		this.#getListPendingInvites();
		this.#setRefreshFriendsListEvent();
		this.#checkInvitesPolling();
	}

	#setFriendsSearchEvent() {
		const searchBar = this.html.querySelector("#search");
		if (searchBar)
			searchBar.addEventListener("input", event => this.#getFriendsCallApi(searchBar.value));
	}

	#createFriendsList(friends) {
		const friendList = this.html.querySelector(".friends");
		friendList.innerHTML = "";
		let friendCard;
		if (!friendList || !friends || !friends.length) {
			if (friendList) {
				const noFriendsMsg = document.createElement("div");
				noFriendsMsg.classList.add("no-friends-text");
				noFriendsMsg.innerHTML = `
					No friends to be selected
				`;
				friendList.appendChild(noFriendsMsg);
			}
			return ;
		}
		friends.forEach(elm => {
			friendCard = document.createElement("game-invite-card1");
			friendCard.setAttribute("username", elm.username);
			friendCard.setAttribute("profile-photo", elm.image);
			friendCard.setAttribute("online", elm.online);
			friendCard.setAttribute("user-id", elm.id);
			friendCard.id = `id-${elm.id}`;
			if(this.selectedElm.find(e => e == friendCard.id))
				friendCard.setAttribute("selected", "true");
			friendList.appendChild(friendCard);
		});
	}

	#removeFriendFromList(friendId) {
		const elm = this.html.querySelector(`game-invite-card1[id="id-${friendId}"]`);
		if (elm)
			elm.remove();
	} 

	#selectFriend(friendCard) {
		friendCard.setAttribute("selected", "true");
		this.selectedElm.push(friendCard.id);
		const inviteButton = document.querySelector(".invite-btn");
		if (inviteButton)
			inviteButton.disabled = this.selectedElm == 0;
	}

	#unselectFriend(friendCard) {
		friendCard.setAttribute("selected", "false");
		const index = this.selectedElm.indexOf(friendCard.id);
		if (index > -1)
			this.selectedElm.splice(index, 1);
		const inviteButton = document.querySelector(".invite-btn");
		if (inviteButton)
			inviteButton.disabled = this.selectedElm == 0;
	}

	#selectFriendEvent() {
		let friendList = this.html.querySelectorAll("game-invite-card1");
		if (!friendList)
			return ;

		friendList.forEach(elm => {
			elm.addEventListener("click", () => {
				if (elm.getAttribute("selected") == "true")
					this.#unselectFriend(elm);
				else
					this.#selectFriend(elm);
			});
		});
	}

	#createInvitesSendList(list) {
		const listHtml = this.html.querySelector(".invites-send");
		if (!listHtml)
			return ;
		listHtml.innerHTML = "";
		if (!(!list || !list.length))
		{
			let elm = null;
			list.forEach((invite) => {
				elm = document.createElement("div");
				if (!elm)
					return ;
				elm.classList.add("player-invite-send");
				elm.classList.add(`id-${invite.req_id}`);
				elm.innerHTML = `
				<div class=invite-sep>
					<span>${charLimiter(invite.username, charLimit)}</span>
					<div>${invite.exp}</div>
					</div>
					<div class="cross-icon btn-cancel-invite" id="id-${invite.req_id}">x</div>
				`;
				listHtml.appendChild(elm);
				this.#setCancelInviteEvent(elm);
			});
		}
		// var button = document.createElement("button");
		// button.setAttribute("type", "button");
		// button.className = "btn-primary btn-invite invite-btn";
		// button.textContent = "Invite";
		// listHtml.appendChild(button);
		// this.#setBtnInviteEvent();
		const inviteButton = document.querySelector(".invite-btn");
		if (inviteButton)
			inviteButton.disabled = this.selectedElm == 0;
	}

	#removeInvitesSendFromList(inviteId) {
		 const inviteRequest = this.html.querySelector(`.player-invite-send.id-${inviteId}`);
		 if (inviteRequest)
			inviteRequest.remove();
	}

	#getFriendsCallApi(key) {
		let queryParam = "";
		if (key)
			queryParam = `?key=${key}`;

		callAPI("GET", `/tournament/friend-list/${queryParam}`, null, (res, data) => {
			if (res.ok) {
				this.#createFriendsList(data.friends);
				this.#selectFriendEvent();
			}
			this.refreshBtn.disabled = false;
		});
	}

	#getListPendingInvites() {
		callAPI("GET", `/tournament/invited-friends/`, null, (res, data) => {
			if (res.ok && data)
				this.#createInvitesSendList(data.invited_users);
		});
	}	

	#setBtnInviteEvent() {
		this.inviteBtn.addEventListener("click", () => {
			if (!this.selectedElm.length)
				return ;
			const data = {
				id: this.data.tournamentId,
				invites_list: []
			};
			this.selectedElm.forEach((elm) => {
				data.invites_list.push(elm.substring(3));
			});

			this.inviteBtn.disabled = true;
			callAPI("POST", `/tournament/invite/`, data, (res, data) => {
				if (res.ok) {
					this.#getListPendingInvites();
					this.selectedElm.forEach((elm) => {
						this.#removeFriendFromList(elm.substring(3));
					});
					this.selectedElm.length = 0; // clear array
					this.inviteBtn.disabled = false;
				}
			}, null, getCsrfToken());
		});
	}

	#setCancelInviteEvent(elmHtml) {
		if (!elmHtml)
			return ;
		const btn = elmHtml.querySelector(".btn-cancel-invite");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			const inviteId = btn.id.substring(3);
			btn.disabled = true;
			callAPI("DELETE", `/tournament/invite/?id=${inviteId}`, null, (res, data) => {
				if (res.ok)
					this.#removeInvitesSendFromList(inviteId);
				btn.disabled = false;
			}, null , getCsrfToken());
		});
	}

	#setRefreshFriendsListEvent() {
		this.refreshBtn.addEventListener("click", () => {
			this.refreshBtn.disabled = true;
			this.#getFriendsCallApi();
		});
	}

	#checkInvitesPolling() {
		this.intervalID = setInterval(() => {
			if (!stateManager.getState("isOnline"))
				return ;
			this.#getListPendingInvites();
		}, 5000);
	}
}

customElements.define("tourney-inviter", TourneyInviter);