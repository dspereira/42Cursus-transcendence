import { callAPI } from "../utils/callApiUtils.js";
import { getCsrfToken } from "../utils/csrfTokenUtils.js";
import componentSetup from "../utils/componentSetupUtils.js";
import stateManager from "../js/StateManager.js";
import { enTourneyInviterDict } from "../lang-dicts/enLangDict.js";
import { ptTourneyInviterDict } from "../lang-dicts/ptLangDict.js";
import { esTourneyInviterDict } from "../lang-dicts/esLangDict.js";
import getLanguageDict from "../utils/languageUtils.js";

const styles = `
.invites-section {
	display: flex;
	width: 100%;
	height: 50vh;
	gap: 10px;
}

.friend-list {
	width: 70%;
	background-color: #D3D3D3;	
	border-radius: 5px;
	padding: 20px;
}

.invites-send {
	width: 30%;
	background-color: #D3D3D3;
	border-radius: 5px;
	padding: 20px;
}
.search-bar-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-bottom: 20px;
}

.search-icon {
	position: absolute;
	margin-top: 6px;
	margin-left: 15px;
	font-size: 16px;
}

.refresh-icon {
	font-size: 22px;
	cursor: pointer;
}

.search-bar input {
	padding-left: 40px;
}

.search-bar {
	width: 93%;
}

.friends {
	display: flex;
	flex-wrap: wrap;
	gap: 30px;
	justify-content: center;

}

.player-invite-send {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.player-invite-send span {
	font-size: 20px;
	font-weight: bold;
}

.cross-icon {
	color: red;
	font-size: 24px;
	cursor: pointer;
}

.cross-icon:hover {
	color: blue; /* outra cor igual mas mais carregada */
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
							<input type="text" class="form-control form-control-md" id="search" placeholder="${data.langDict.search_bar_placeholder_search}" maxlength="15">
						</div>
					</div>
					<button class="refresh-btn"><i class="bi bi-arrow-clockwise refresh-icon"></i></button>
				</div>
				<div class="friends"></div>
			</div>
			<div class="invites-send"></div>
		</div>
		<button type="button" class="btn btn-primary btn-invite">${data.langDict.invite_button}</button>
	`;
	return html;
}

export default class TourneyInviter extends HTMLElement {
	static observedAttributes = ["tournament-id", "language"];

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
		if (name == "language")
			this.data.langDict = getLanguageDict(newValue, enTourneyInviterDict, ptTourneyInviterDict, esTourneyInviterDict);
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
		if (!friendList || !friends)
			return ;
		friends.forEach(elm => {
			friendCard = document.createElement("game-invite-card1");
			friendCard.setAttribute("username", elm.username);
			friendCard.setAttribute("profile-photo", elm.image);
			friendCard.id = `id-${elm.id}`;
			if(this.selectedElm.find(e => e == friendCard.id))
				friendCard.setAttribute("selected", "true");
			friendList.appendChild(friendCard);
		});
	}

	#removeFriendFromList(friendId) {
		const elm = this.html.querySelector(`game-invite-card1[id="id-${friendId}"]`);
		console.log()
		if (elm)
			elm.remove();
	} 

	#selectFriend(friendCard) {
		friendCard.setAttribute("selected", "true");
		this.selectedElm.push(friendCard.id);
	}

	#unselectFriend(friendCard) {
		friendCard.setAttribute("selected", "false");
		const index = this.selectedElm.indexOf(friendCard.id);
		if (index > -1)
			this.selectedElm.splice(index, 1);
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
		listHtml.innerHTML = "";
		if (!list || !list.length)
			return ;

		let elm = null;
		list.forEach((invite) => {
			elm = document.createElement("div");
			if (!elm)
				return ;
			elm.classList.add("player-invite-send");
			elm.classList.add(`id-${invite.req_id}`);
			elm.innerHTML = `
				<div><span>${invite.username}</span></div>
				<div class="cross-icon btn-cancel-invite" id="id-${invite.req_id}"><i class="bi bi-x-lg"></i></div>
			`;
			listHtml.appendChild(elm);
			this.#setCancelInviteEvent(elm);
		});
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