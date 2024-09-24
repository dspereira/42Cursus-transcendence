import { callAPI } from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { colors } from "../js/globalStyles.js";
import { charLimiter } from "../utils/characterLimit.js";
import charLimit from "../utils/characterLimit.js";

const styles = `

.send-invite-section {
	min-width: 460px;
}

.search-icon {
	position: absolute;
	margin-top: 6px;
	margin-left: 15px;
	font-size: 16px;
	color: ${colors.second_text};
}

.search-bar input, .search-bar input:hover, .search-bar input:focus {
	padding-left: 40px;
	color:  ${colors.second_text};
}

.search-bar {
	margin-bottom: 25px;
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

.friend-list {
	display: flex;
	flex-wrap: wrap;
	gap: 30px;
	justify-content: center;
	overflow-y: auto;
}

.send-invite-section {
	display: flex;
	gap: 30px;
}

.friend-section {
	display: flex;
	flex-direction: column;
	width: 80%;
	padding: 20px;
	border-radius: 5px;
	height: 90vh;
	background-color:  ${colors.second_card};
}

.selected-list-section {
	width: 100%;
	padding: 0px 20px 0px 20px;
	margin-bottom: 70px;
	overflow-y: auto;
}

.selected-list-section::-webkit-scrollbar {
	width: 15px;
}
	
.selected-list-section::-webkit-scrollbar-track {
	width: 15px;
	background: ${colors.second_card};
}

.selected-list-section::-webkit-scrollbar-thumb {
	background: ${colors.main_card};
	border-radius: 10px;
	border-style: hidden;
	border: 3px solid transparent;
	background-clip: content-box;
}

.friend-right-list {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	background-color: ${colors.third_card};
	padding: 0px 10px 0px 10px;
	border-radius: 5px;
	border-style: hidden;
	color: ${colors.primary_text};
}

.friend-right-list span {
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

.btn-primary:not(disabled) {
	background-color: ${colors.btn_default};
	color: ${colors.primary_text};
}

.btn-primary:not(:disabled):hover {
	background-color: ${colors.btn_hover};
	color: ${colors.second_text};
}

.btn-primary:disabled {
	background-color: ${colors.main_card};
	cursor: not-allowed;
	border-style: hidden;
}

.btn-invite {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	border-style: hidden;
	border-radius: 5px;
	bottom: 20px;
	width: 100px;
	height: 40px;
	left: 50%;
	transform: translateX(-50%);
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
	margin: 20px 0px 20px 0px;
	background-color: ${colors.main_card};
}

.selected-list-container {
	display: flex;
	width: 30%;
	flex-direction: column;
	position: relative;
	align-items: center;
	width: 20%;
	min-width: 200px;
	height: 90vh;
	border-radius: 5px;
	background-color: ${colors.second_card};
}

.friend-list::-webkit-scrollbar-track {
	background: ${colors.second_card};
}

.friend-list::-webkit-scrollbar-thumb {
	background: ${colors.main_card};
	border-radius: 10px;
	border-style: hidden;
	border: 3px solid transparent;
	background-clip: content-box;
}

.alert-div {
	display: flex;
	width: 100%;
	animation: disappear linear 10s forwards;
	background-color: ${colors.alert};
}

.alert-bar {
	width: 100%;
	height: 5px;
	border-style: hidden;
	border-radius: 2px;
	background-color: ${colors.alert_bar};
	position: absolute;
	bottom: 2px;
	animation: expire linear 10s forwards;
}

@keyframes expire {
	from {
		width: 100%;
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
`;

const getHtml = function(data) {
	const html = `
	<!--<h3>Invite a Friend For a Challenge!</h3>-->

	<div class="send-invite-section">
		<div class="friend-section">
			<div class="search-bar">
				<div class="form-group">
					<i class="search-icon bi bi-search"></i>
					<input type="text" class="form-control form-control-md" id="search" placeholder="Search friends..." maxlength="50">
				</div>
			</div>
			<div class="friend-list"></div>
		</div>
		<div class="selected-list-container">
			<div class=players-invited>players invited</div>
			<div class=separator></div>
			<div class="selected-list-section"></div>
			<button type="button" class="btn-primary btn-invite" id="submit-invite">Invite</button>
		<div>
	</div>
	`;
	return html;
}

export default class GameInviteSend extends HTMLElement {
	static observedAttributes = ["username", "profile-photo"];

	constructor() {
		super()
		this.data = {};
		this.selectedElm = [];
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "profile-photo")
			name = "profilePhoto";
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
		this.rightFriendListElm = this.html.querySelector(".selected-list-section");
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
		this.#getFriendsCallApi();
		this.#setFriendsSearchEvent();
		this.#setInviteSubmitEvent();
		const inviteButton = document.querySelector(".btn-primary");
		inviteButton.disabled = this.selectedElm == 0;
		this.#errorMsgEvents();
	}

	#setFriendsSearchEvent() {
		const searchBar = this.html.querySelector("#search");
		if (searchBar)
			searchBar.addEventListener("input", event => this.#getFriendsCallApi(searchBar.value));
	}

	#getFriendsCallApi(key) {
		let queryParam = "";
		if (key)
			queryParam = `?key=${key}`;

		callAPI("GET", `http://127.0.0.1:8000/api/friends/friendships/${queryParam}`, null, (res, data) => {
			if (res.ok) {
				this.#createFriendsList(data.friends);
				this.#selectFriendEvent();
			}
		});
	}

	#createFriendsList(friends) {
		const friendList = this.html.querySelector(".friend-list");
		friendList.innerHTML = "";
		let friendCard;
		if (!friendList || !friends)
			return ;
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

	#selectFriendEvent() {
		let friendList = this.html.querySelectorAll("game-invite-card1");
		if (!friendList)
			return ;

		friendList.forEach(elm => {
			elm.addEventListener("click", () => {
				if (elm.getAttribute("selected") == "true")
					this.#unselectFriend(elm.id);
				else
					this.#selectFriend(elm);
			});
		});
	}

	#selectFriend(friendCard) {
		const rightListFriendHtml = this.#getFriendHtmlForRightList(friendCard.id);
		const listLength = this.rightFriendListElm.length;
		const inviteButton = document.querySelector(".btn-primary");
		if (!listLength)
			this.rightFriendListElm.appendChild(rightListFriendHtml);
		else
		this.rightFriendListElm.insertBefore(this.rightFriendListElm[listLength - 1], rightListFriendHtml);
	
		this.selectedElm.push(friendCard.id);
		inviteButton.disabled = this.selectedElm == 0;
		friendCard.setAttribute("selected", "true");
	}

	#unselectFriend(elmId) {
		const friendCard = this.html.querySelector(`#${elmId}`);
		const friendRightList = this.rightFriendListElm.querySelector(`.${elmId}`);
		const inviteButton = document.querySelector(".btn-primary");
		if (!friendCard && !friendRightList)
			return ;
		friendCard.setAttribute("selected", "false");
		this.rightFriendListElm.removeChild(friendRightList);
		const index = this.selectedElm.indexOf(elmId);
		if (index > -1)
			this.selectedElm.splice(index, 1);
		inviteButton.disabled = this.selectedElm == 0;
	}

	#getFriendHtmlForRightList(elmId) {
		const elm = document.createElement("div");

		const friendElm = this.html.querySelector(`#${elmId}`);
		if (!friendElm)
			return ;
		const name = friendElm.getAttribute("username");

		elm.classList.add("friend-right-list");
		elm.classList.add(`${elmId}`);
		elm.innerHTML = `
			<div><span>${charLimiter(name, charLimit)}</span></div>
			<div class="cross-icon ${elmId}" ><i class="bi bi-x-lg"></i></div>
		`;
		this.#addCrossIconEvent(elm.querySelector(".cross-icon"))
		return elm;
	}

	#addCrossIconEvent(elmHtml) {
		if (!elmHtml)
			return ;
		elmHtml.addEventListener("click", () => this.#unselectFriend(elmHtml.classList[1]));
	}

	#setInviteSubmitEvent() {
		const btn = this.html.querySelector("#submit-invite");
		if (!btn)
			return ;
		btn.addEventListener("click", () => {
			const data = {
				invites_list: []
			};
			this.selectedElm.forEach((elm) => {
				data.invites_list.push(elm.substring(3));
			});
			callAPI("POST", "http://127.0.0.1:8000/api/game/request/", data, (res, data) => {
				if (res.ok) {
					const contentElm = document.querySelector(".content");
					contentElm.innerHTML = `
					<app-lobby 
						lobby-id="${stateManager.getState("userId")}"
					></app-lobby>
					`;
				}
				else
					stateManager.setState("errorMsg", "Couldn't send invite");
			});
		});
	}

	#errorMsgEvents() {
		stateManager.addEvent("errorMsg", (msg) => {
			if (msg) {
				console.log(msg);
				stateManager.setState("errorMsg", null);
				const alertBefore  = this.html.querySelector(".alert");
				if (alertBefore)
					alertBefore.remove();
				const insertElement = this.html.querySelector(".send-invite-section");
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
}

customElements.define("game-invite-send", GameInviteSend);
